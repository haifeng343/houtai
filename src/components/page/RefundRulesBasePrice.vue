<template>
  <div>
    <el-button
      type="primary"
      @click="showAddPriceDialog()"
      style="float:right;margin-bottom:10px;"
      v-if="common.haveRight('AddSheetRefundRulesDetailsNormal')"
    >添加价格</el-button>
    <el-table :data="priceListTable" border ref="multipleTable">
      <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
      <el-table-column prop="Count" align="center" label="课程数量/门"></el-table-column>
      <el-table-column prop="Rate" align="center" label="退款占比">
        <template slot-scope="scope">{{scope.row.Rate*1.0/100}}%</template>
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
            :disabled="!common.haveRight('ModifySheetRefundRulesDetailsNormalStatus')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="common.haveRight('ModifySheetRefundRulesDetailsNormal')" type="text" @click="showEditPriceDialog(scope.row)">编辑</el-button>
          <el-button v-if="common.haveRight('DeleteSheetRefundRulesDetailsNormal')" type="text" @click="deletePrice(scope.row)" class="red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加价格弹窗 -->
    <el-dialog title=" 添加价格" :visible.sync="addPriceVisible" width="633px">
      <el-form ref="addPriceForm" :model="addPriceForm" label-width="120px" :rules="rules">
        <el-form-item label="课程数量/门:" prop="count">
          <el-input v-model="addPriceForm.count" placeholder="请输入课程数量"></el-input>
        </el-form-item>
        <el-form-item label="退款占比(1/万):" prop="rate">
          <el-input v-model="addPriceForm.rate" placeholder="请输入退款占比"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addPriceVisible = false" size="medium">取 消</el-button>
        <el-button @click="addPriceOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑价格弹窗 -->
    <el-dialog title=" 编辑价格" :visible.sync="editPriceVisible" width="633px">
      <el-form ref="editPriceForm" :model="editPriceForm" label-width="120px" :rules="rules">
        <el-form-item label="课程数量/门:" prop="count">
          <el-input v-model="editPriceForm.count" placeholder="请输入课程数量" disabled></el-input>
        </el-form-item>
        <el-form-item label="退款占比(1/万):" prop="rate">
          <el-input v-model="editPriceForm.rate" placeholder="请输入退款占比"></el-input>
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
  GetSheetRefundRulesDetailsNormalList,
  AddSheetRefundRulesDetailsNormal,
  ModifySheetRefundRulesDetailsNormalStatus,
  ModifySheetRefundRulesDetailsNormal,
  DeleteSheetRefundRulesDetailsNormal
} from "api/sheet.js";
export default {
  name: "RefundRulesBasePrice",
  data() {
    return {
      id: 0,
      priceListTable: [],
      rules: {
        count: [{ required: true, message: "请输入课程数量", trigger: "blur" }],
        rate: [{ required: true, message: "请输入退款占比", trigger: "blur" }]
      },
      addPriceVisible: false,
      addPriceForm: {
        count: "",
        rate: ""
      },
      editPriceVisible: false,
      editPriceForm: {
        id: 0,
        count: "",
        rate: ""
      }
    };
  },
  created() {
    this.id = this.$route.params.id;
    this._getSheetRefundRulesDetailsNormalList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.id = this.$route.params.id;
      this._getSheetRefundRulesDetailsNormalList();
    }
  },
  methods: {
    showAddPriceDialog() {
      this.addPriceForm.count = "";
      this.addPriceForm.rate = "";
      this.addPriceVisible = true;
    },
    addPriceOk() {
      this.$refs["addPriceForm"].validate(valid => {
        if (valid) {
          this._addSheetRefundRulesDetailsNormal().then(val => {
            this.addPriceVisible = false;
            this._getSheetRefundRulesDetailsNormalList();
          });
        } else {
          return false;
        }
      });
    },
    changeStatus(status, item) {
      this._modifySheetRefundRulesDetailsNormalStatus(item.Id, status);
    },
    showEditPriceDialog(item) {
      this.editPriceForm.id = item.Id;
      this.editPriceForm.count = item.Count;
      this.editPriceForm.rate = item.Rate;
      this.editPriceVisible = true;
    },
    editPriceOk() {
      this.$refs["editPriceForm"].validate(valid => {
        if (valid) {
          this._modifySheetRefundRulesDetailsNormal().then(val => {
            this.editPriceVisible = false;
            this._getSheetRefundRulesDetailsNormalList();
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
          this._deleteSheetRefundRulesDetailsNormal(item.Id).then(val => {
            this._getSheetRefundRulesDetailsNormalList();
          });
        })
        .catch(() => {});
    },
    //获取团单退款规则详情—普通列表
    _getSheetRefundRulesDetailsNormalList() {
      var par = {
        Id: this.id
      };
      return GetSheetRefundRulesDetailsNormalList(par,279).then(res => {
        this.priceListTable = res;
      });
    },
    //添加团单退款规则详情—普通
    _addSheetRefundRulesDetailsNormal() {
      var par = {
        RulesId: this.id,
        Count: this.addPriceForm.count,
        Rate: this.addPriceForm.rate
      };
      return AddSheetRefundRulesDetailsNormal(par,106);
    },
    //修改团单退款规则详情—普通状态
    _modifySheetRefundRulesDetailsNormalStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySheetRefundRulesDetailsNormalStatus(par,108);
    },
    //编辑团单退款规则详情—普通
    _modifySheetRefundRulesDetailsNormal() {
      var par = {
        Id: this.editPriceForm.id,
        Rate: this.editPriceForm.rate
      };
      return ModifySheetRefundRulesDetailsNormal(par,107);
    },
    //删除团单退款规则详情—普通
    _deleteSheetRefundRulesDetailsNormal(id) {
      var par = {
        Id: id
      };
      return DeleteSheetRefundRulesDetailsNormal(par,109);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
