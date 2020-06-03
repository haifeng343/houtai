<template>
  <div>
    <el-button
      type="primary"
      @click="showAddPriceDialog()"
      style="float:right;margin-bottom:10px;"
      v-if="common.haveRight('AddSheetRefundRulesDetailsSpecial')"
    >添加价格</el-button>
    <el-table :data="priceListTable" border ref="multipleTable">
      <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
      <el-table-column prop="ItemName" align="center" label="课程名称"></el-table-column>
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
            :disabled="!common.haveRight('ModifySheetRefundRulesDetailsSpecialStatus')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
      <el-table-column align="center" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="common.haveRight('ModifySheetRefundRulesDetailsSpecial')" type="text" @click="showEditPriceDialog(scope.row)">编辑</el-button>
          <el-button v-if="common.haveRight('DeleteSheetRefundRulesDetailsSpecial')" type="text" @click="deletePrice(scope.row)" class="red">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加价格弹窗 -->
    <el-dialog title=" 添加价格" :visible.sync="addPriceVisible" width="633px">
      <el-form ref="addPriceForm" :model="addPriceForm" label-width="120px" :rules="rules">
        <el-form-item label="课程名称:" prop="itemRelId">
          <el-select v-model="addPriceForm.itemRelId" placeholder="请选择">
            <el-option
              v-for="item in allItemList"
              :key="item.Id"
              :label="item.ItemName"
              :value="item.Id"
            ></el-option>
          </el-select>
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
        <el-form-item label="课程名称:" prop="itemRelId">
          <el-select v-model="editPriceForm.itemRelId" placeholder="请选择" disabled>
            <el-option
              v-for="item in allItemList"
              :key="item.Id"
              :label="item.ItemName"
              :value="item.Id"
            ></el-option>
          </el-select>
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
  GetSheetRefundRulesDetailsSpecialList,
  AddSheetRefundRulesDetailsSpecial,
  ModifySheetRefundRulesDetailsSpecialStatus,
  ModifySheetRefundRulesDetailsSpecial,
  DeleteSheetRefundRulesDetailsSpecial,
  activitygroupStoreList
} from "api/sheet.js";
export default {
  name: "RefundRulesBasePrice",
  data() {
    return {
      id: 0,
      activityGroupId: 0,
      priceListTable: [],
      allItemList: [],
      rules: {
        itemRelId: [{ required: true, message: "请选择课程", trigger: "blur" }],
        rate: [{ required: true, message: "请输入退款占比", trigger: "blur" }]
      },
      addPriceVisible: false,
      addPriceForm: {
        itemRelId: "",
        rate: ""
      },
      editPriceVisible: false,
      editPriceForm: {
        id: 0,
        itemRelId: "",
        rate: ""
      }
    };
  },
  created() {
    this.id = this.$route.params.id;
    this.activityGroupId = this.$route.query.activityGroupId;
    this._getSheetRefundRulesDetailsSpecialList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.id = this.$route.params.id;
      this.activityGroupId = this.$route.query.activityGroupId;
      this._getSheetRefundRulesDetailsSpecialList();
    }
  },
  methods: {
    showAddPriceDialog() {
      this._getActivityGroupStoreList(111);
      this.addPriceForm.count = "";
      this.addPriceForm.rate = "";
      this.addPriceVisible = true;
    },
    addPriceOk() {
      this.$refs["addPriceForm"].validate(valid => {
        if (valid) {
          this._addSheetRefundRulesDetailsSpecial().then(val => {
            this.addPriceVisible = false;
            this._getSheetRefundRulesDetailsSpecialList();
          });
        } else {
          return false;
        }
      });
    },
    changeStatus(status, item) {
      this._modifySheetRefundRulesDetailsSpecialStatus(item.Id, status);
    },
    showEditPriceDialog(item) {
      this._getActivityGroupStoreList(112);
      this.editPriceForm.id = item.Id;
      this.editPriceForm.itemRelId = item.ItemRelId;
      this.editPriceForm.rate = item.Rate;
      this.editPriceVisible = true;
    },
    editPriceOk() {
      this.$refs["editPriceForm"].validate(valid => {
        if (valid) {
          this._modifySheetRefundRulesDetailsSpecial().then(val => {
            this.editPriceVisible = false;
            this._getSheetRefundRulesDetailsSpecialList();
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
          this._deleteSheetRefundRulesDetailsSpecial(item.Id).then(val => {
            this._getSheetRefundRulesDetailsSpecialList();
          });
        })
        .catch(() => {});
    },
    //获取团单退款规则详情—普通列表
    _getSheetRefundRulesDetailsSpecialList() {
      var par = {
        Id: this.id
      };
      return GetSheetRefundRulesDetailsSpecialList(par, 279).then(res => {
        this.priceListTable = res;
      });
    },
    //添加团单退款规则详情—普通
    _addSheetRefundRulesDetailsSpecial() {
      var par = {
        RulesId: this.id,
        RelId: this.addPriceForm.itemRelId,
        Rate: this.addPriceForm.rate
      };
      return AddSheetRefundRulesDetailsSpecial(par,111);
    },
    //修改团单退款规则详情—普通状态
    _modifySheetRefundRulesDetailsSpecialStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySheetRefundRulesDetailsSpecialStatus(par,113);
    },
    //编辑团单退款规则详情—普通
    _modifySheetRefundRulesDetailsSpecial() {
      var par = {
        Id: this.editPriceForm.id,
        Rate: this.editPriceForm.rate
      };
      return ModifySheetRefundRulesDetailsSpecial(par,112);
    },
    //删除团单退款规则详情—普通
    _deleteSheetRefundRulesDetailsSpecial(id) {
      var par = {
        Id: id
      };
      return DeleteSheetRefundRulesDetailsSpecial(par,114);
    },
    //获取活动组参与门店列表
    _getActivityGroupStoreList(rightId) {
      var par = {
        ActivityGroupId: this.activityGroupId,
        StoreName: "",
        PageIndex: 1,
        PageCount: 100
      };
      return activitygroupStoreList(par,rightId).then(res => {
        this.allItemList = res.List;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
