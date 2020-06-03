<template>
  <div>
    <el-button
      type="primary"
      @click="showAddPriceDialog()"
      style="float:right;margin-bottom:10px;"
      v-if="common.haveRight('AddSheetPrizeRulesDetailsNormal')"
    >添加价格</el-button>
    <el-table :data="priceListTable" border ref="multipleTable">
      <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
      <el-table-column prop="Count" align="center" label="课程数量/门"></el-table-column>
      <el-table-column prop="Amount" align="center" label="奖励金额(元)">
        <template slot-scope="scope">{{scope.row.Amount*1.0/100}}</template>
      </el-table-column>
      <el-table-column prop="RecommendAmount" align="center" label="推荐奖励金额(元)">
        <template slot-scope="scope">{{scope.row.RecommendAmount*1.0/100}}</template>
      </el-table-column>
      <el-table-column prop="Status" label="状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.Status"
            active-text="有效"
            inactive-text="无效"
            :active-value="1"
            :inactive-value="2"
            @change="changeStatus($event, scope.row)"
            :disabled="!common.haveRight('ModifySheetPrizeRulesDetailsNormalStatus')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="common.haveRight('ModifySheetPrizeRulesDetailsNormal')" type="text" @click="showEditPriceDialog(scope.row)">编辑</el-button>
          <el-button v-if="common.haveRight('DeleteSheetPrizeRulesDetailsNormal')" type="text" @click="deletePrice(scope.row)" class="red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加价格弹窗 -->
    <el-dialog title=" 添加价格" :visible.sync="addPriceVisible" width="633px">
      <el-form ref="addPriceForm" :model="addPriceForm" label-width="135px" :rules="rules">
        <el-form-item label="课程数量/门:" prop="count">
          <el-input v-model="addPriceForm.count" placeholder="请输入课程数量"></el-input>
        </el-form-item>
        <el-form-item label="奖励金额（分）:" prop="amount">
          <el-input v-model="addPriceForm.amount" placeholder="请输入奖励金额"></el-input>
        </el-form-item>
        <el-form-item label="推荐奖励金额(分):" prop="recommendAmount">
          <el-input v-model="addPriceForm.recommendAmount" placeholder="请输入推荐奖励金额"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPriceVisible = false" size="medium">取 消</el-button>
        <el-button @click="addPriceOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑价格弹窗 -->
    <el-dialog title=" 编辑价格" :visible.sync="editPriceVisible" width="633px">
      <el-form ref="editPriceForm" :model="editPriceForm" label-width="135px" :rules="rules">
        <el-form-item label="课程数量/门:" prop="count">
          <el-input v-model="editPriceForm.count" placeholder="请输入课程数量" disabled></el-input>
        </el-form-item>
        <el-form-item label="奖励金额（分）:" prop="amount">
          <el-input v-model="editPriceForm.amount" placeholder="请输入奖励金额"></el-input>
        </el-form-item>
        <el-form-item label="推荐奖励金额(分):" prop="recommendAmount">
          <el-input v-model="editPriceForm.recommendAmount" placeholder="请输入推荐奖励金额"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPriceVisible = false" size="medium">取 消</el-button>
        <el-button @click="editPriceOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetSheetPrizeRulesDetailsNormalList,
  AddSheetPrizeRulesDetailsNormal,
  ModifySheetPrizeRulesDetailsNormalStatus,
  ModifySheetPrizeRulesDetailsNormal,
  DeleteSheetPrizeRulesDetailsNormal
} from "api/sheet.js";
export default {
  name: "RefundRulesBasePrice",
  data() {
    return {
      id: 0,
      priceListTable: [],
      rules: {
        count: [{ required: true, message: "请输入课程数量", trigger: "blur" }],
        amount: [
          { required: true, message: "请输入奖励金额", trigger: "blur" }
        ],
        recommendAmount: [
          { required: true, message: "请输入推荐奖励金额", trigger: "blur" }
        ]
      },
      addPriceVisible: false,
      addPriceForm: {
        count: "",
        amount: "",
        recommendAmount: ""
      },
      editPriceVisible: false,
      editPriceForm: {
        id: 0,
        count: "",
        amount: "",
        recommendAmount: ""
      }
    };
  },
  created() {
    this.id = this.$route.params.id;
    this._getSheetPrizeRulesDetailsNormalList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.id = this.$route.params.id;
      this._getSheetPrizeRulesDetailsNormalList();
    }
  },
  methods: {
    showAddPriceDialog() {
      this.addPriceForm.count = "";
      this.addPriceForm.amount = "";
      this.addPriceForm.recommendAmount = "";
      this.addPriceVisible = true;
    },
    addPriceOk() {
      this.$refs["addPriceForm"].validate(valid => {
        if (valid) {
          this._addSheetPrizeRulesDetailsNormal().then(val => {
            this.addPriceVisible = false;
            this._getSheetPrizeRulesDetailsNormalList();
          });
        } else {
          return false;
        }
      });
    },
    changeStatus(status, item) {
      this._modifySheetPrizeRulesDetailsNormalStatus(item.Id, status);
    },
    showEditPriceDialog(item) {
      this.editPriceForm.id = item.Id;
      this.editPriceForm.count = item.Count;
      this.editPriceForm.amount = item.Amount;
      this.editPriceForm.recommendAmount = item.RecommendAmount;
      this.editPriceVisible = true;
    },
    editPriceOk() {
      this.$refs["editPriceForm"].validate(valid => {
        if (valid) {
          this._modifySheetPrizeRulesDetailsNormal().then(val => {
            this.editPriceVisible = false;
            this._getSheetPrizeRulesDetailsNormalList();
          });
        } else {
          return false;
        }
      });
    },
    deletePrice(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSheetPrizeRulesDetailsNormal(item.Id).then(val => {
            this._getSheetPrizeRulesDetailsNormalList();
          });
        })
        .catch(() => {});
    },
    //获取团单退款规则详情—普通列表
    _getSheetPrizeRulesDetailsNormalList() {
      var par = {
        Id: this.id
      };
      return GetSheetPrizeRulesDetailsNormalList(par,279).then(res => {
        this.priceListTable = res;
      });
    },
    //添加团单退款规则详情—普通
    _addSheetPrizeRulesDetailsNormal() {
      var par = {
        RulesId: this.id,
        Count: this.addPriceForm.count,
        Amount: this.addPriceForm.amount,
        RecommendAmount: this.addPriceForm.recommendAmount
      };
      return AddSheetPrizeRulesDetailsNormal(par,123);
    },
    //修改团单退款规则详情—普通状态
    _modifySheetPrizeRulesDetailsNormalStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySheetPrizeRulesDetailsNormalStatus(par,126);
    },
    //编辑团单退款规则详情—普通
    _modifySheetPrizeRulesDetailsNormal() {
      var par = {
        Id: this.editPriceForm.id,
        Amount: this.editPriceForm.amount,
        RecommendAmount: this.editPriceForm.recommendAmount
      };
      return ModifySheetPrizeRulesDetailsNormal(par,124);
    },
    //删除团单退款规则详情—普通
    _deleteSheetPrizeRulesDetailsNormal(id) {
      var par = {
        Id: id
      };
      return DeleteSheetPrizeRulesDetailsNormal(par,127);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
