<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="成交账户:">
          <el-input v-model="searchAccountName" placeholder="请输入成交账户"></el-input>
        </el-form-item>
        <el-form-item label="课程名称:">
          <el-input v-model="searchItemName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchStatus" placeholder="请选择">
            <el-option
              v-for="item in searchStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="RecordId" align="center" label="ID" fixed></el-table-column>
        <el-table-column align="center" label="成交账户">
          <template slot-scope="scope">
            <span>{{scope.row.AccountName}}({{scope.row.AccountMobile}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="ItemName" align="center" label="课程名称"></el-table-column>
        <el-table-column align="center" label="价格（元）">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showModifyAmountDIalog(scope.row)"
            >{{scope.row.Price*1.0/100}}/{{scope.row.PayAmount*1.0/100}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="补贴率">
          <template slot-scope="scope">
            <sapn>{{scope.row.BaseSubsidyRate*1.0/100}}%</sapn>
          </template>
        </el-table-column>
        <el-table-column align="center" label="补贴金额（元）">
          <template slot-scope="scope">
            <sapn>{{scope.row.BaseSubsidyAmount*1.0/100}}</sapn>
          </template>
        </el-table-column>
        <el-table-column prop="TicketName" align="center" label="使用补贴券"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showModifyStatusDIalog(scope.row)"
            >{{scope.row.Status==1?'等待家长确认':scope.row.Status==2?'信息有误':scope.row.Status==3?'等待支付':'完成补贴'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="申请时间"></el-table-column>
        <el-table-column prop="FinishTime" align="center" label="支付时间"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="listCurrentChange"
      ></el-pagination>
    </div>
    <!-- 编辑价格弹窗 -->
    <el-dialog title="编辑价格" :visible.sync="editPriceVisible" width="503px">
      <el-form ref="editPriceForm" :model="editPriceForm" label-width="100px">
        <el-form-item label="原价(分):" prop="Price">
          <el-input v-model="editPriceForm.Price" disabled></el-input>
        </el-form-item>
        <el-form-item label="实付(分):" prop="PayAmount">
          <el-input v-model="editPriceForm.PayAmount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPriceVisible = false" size="medium">取 消</el-button>
        <el-button @click="editPriceOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑状态弹窗 -->
    <el-dialog title="编辑状态" :visible.sync="editStatusVisible" width="503px">
      <el-form ref="editStatusForm" :model="editStatusForm" label-width="100px">
        <el-form-item label="状态:" prop="Status">
          <el-select v-model="editStatusForm.Status" placeholder="请选择">
            <el-option
              v-for="item in editStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editStatusVisible = false" size="medium">取 消</el-button>
        <el-button @click="editStatusOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetStoreDealRecordList,
  ModifyStoreDealRecordPayAmount,
  ModifyStoreDealRecordStatus
} from "api/seller.js";
export default {
  name: "SubsidyRecord",
  data() {
    return {
      storeId: "",
      searchStatusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "等待家长确认" },
        { id: 2, name: "信息有误" },
        { id: 3, name: "等待支付" },
        { id: 4, name: "完成补贴" },
        { id: 5, name: "已删除" }
      ],
      editStatusList: [
        { id: 1, name: "等待家长确认" },
        { id: 2, name: "信息有误" },
        { id: 3, name: "等待支付" },
        { id: 4, name: "完成补贴" }
      ],
      searchAccountName: "",
      searchItemName: "",
      searchStatus: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //商家列表
      editPriceVisible: false,
      editPriceForm: {
        Id: "",
        Price: "",
        PayAmount: ""
      },
      editStatusVisible: false,
      editStatusForm: {
        Id: "",
        Status: ""
      }
    };
  },
  created() {
    this.storeId = this.$route.params.id;
    this._getStoreDealRecordList();
  },
  methods: {
    //商户列表搜索
    listSearch() {
      this.pageIndex = 1;
      this._getStoreDealRecordList();
    },
    //商户列表页面变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getStoreDealRecordList();
    },
    showModifyAmountDIalog(item) {
      this.editPriceForm.Price = item.Price;
      this.editPriceForm.PayAmount = item.PayAmount;
      this.editPriceForm.Id = item.RecordId;
      this.editPriceVisible = true;
    },
    editPriceOk() {
      this._modifyStoreDealRecordPayAmount().then(val => {
        this._getStoreDealRecordList();
        this.editPriceVisible = false;
      });
    },
    showModifyStatusDIalog(item) {
      this.editStatusForm.Status = item.Status;
      this.editStatusForm.Id = item.RecordId;
      this.editStatusVisible = true;
    },
    editStatusOk() {
      this._modifyStoreDealRecordStatus().then(val => {
        this._getStoreDealRecordList();
        this.editStatusVisible = false;
      });
    },
    //获取门店成交记录
    _getStoreDealRecordList() {
      var par = {
        StoreId: this.storeId,
        AccountName: this.searchAccountName,
        ItemName: this.searchItemName,
        Status: this.searchStatus,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetStoreDealRecordList(par).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TOtalCount;
      });
    },
    //修改成交记录实付价格
    _modifyStoreDealRecordPayAmount() {
      var par = {
        Id: this.editPriceForm.Id,
        PayAmount: this.editPriceForm.PayAmount
      };
      return ModifyStoreDealRecordPayAmount(par);
    },
    //修改成交记录状态
    _modifyStoreDealRecordStatus() {
      var par = {
        Id: this.editStatusForm.Id,
        Status: this.editStatusForm.Status
      };
      return ModifyStoreDealRecordStatus(par);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
