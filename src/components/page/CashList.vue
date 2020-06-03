<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="账户名:">
          <el-input v-model="searchAccountName" placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchStatus" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="cashListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="cashListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" label="账户名"></el-table-column>
        <el-table-column align="center" label="账户类型">
          <template slot-scope="scope">{{scope.row.AccountType==1?"前端账户":""}}</template>
        </el-table-column>
        <el-table-column align="center" label="提现金额（元）">
          <template slot-scope="scope">{{scope.row.ApplyAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="服务费（元）">
          <template slot-scope="scope">{{scope.row.ServiceFee*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="RealName" align="center" label="提现账户"></el-table-column>
        <el-table-column align="center" label="银行卡类型" width="214px">
          <template slot-scope="scope">{{scope.row.BankName}}({{scope.row.CardBreed}})</template>
        </el-table-column>
        <el-table-column prop="CardNumber" align="center" label="提现账户" width="163px"></el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showStatusFormDialog(scope.row)"
              :disabled="scope.row.Status==4||scope.row.Status==3 || !common.haveRight('ModifyCashStatus')"
            >{{parseStatus(scope.row.Status)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="StatusDes" align="center" label="状态描述"></el-table-column>
        <el-table-column prop="AdminAccountName" align="center" label="操作人"></el-table-column>
        <el-table-column align="center" label="提现时间" width="150px">
          <template slot-scope="scope">{{scope.row.Status==4?scope.row.LastModified:"/"}}</template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间" width="150px"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showPaymentDialog(scope.row)"
              v-if="scope.row.Status==2 && common.haveRight('CashPayment')"
            >打款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="cashListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 修改状态弹窗 -->
    <el-dialog :title="`状态修改-${statusForm.id}`" :visible.sync="statusVisible" width="633px">
      <el-form ref="statusForm" :model="statusForm">
        <el-form-item label="状态:" label-width="100px">
          <el-select v-model="statusForm.status" placeholder="请选择状态">
            <el-option
              v-for="item in statusForm.statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态描述:" label-width="100px">
          <el-input type="textarea" :rows="6" v-model="statusForm.statusDes"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusVisible = false" size="medium">取 消</el-button>
        <el-button @click="modifyStatusOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 打款弹窗 -->
    <el-dialog :title="`打款确认-${paymentForm.id}`" :visible.sync="paymentVisible" width="533px">
      <el-form ref="paymentForm" :model="paymentForm" label-width="120px">
        <el-form-item label="转入账户:">{{paymentForm.realName}}</el-form-item>
        <el-form-item label="打款银行:">{{paymentForm.bankName}}({{paymentForm.cardBreed}})</el-form-item>
        <el-form-item label="银行卡号:">{{paymentForm.cardNumber}}</el-form-item>
        <el-form-item label="打款金额:">￥{{paymentForm.amount*1.0/100}}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paymentVisible = false" size="medium">取 消</el-button>
        <el-button @click="paymentOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetCashRecordList,
  ModifyCashStatus,
  CashPayment
} from "api/finance.js";
export default {
  name: "CashList",
  data() {
    return {
      statusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "申请中" },
        { id: 2, name: "处理中" },
        { id: 3, name: "提现失败" },
        { id: 4, name: "提现成功" }
      ],
      searchAccountName: "", //账户名搜索
      searchStatus: 0, //状态搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      cashListTable: [], //列表
      clickItem: {}, //点击某一行数据
      statusVisible: false,
      statusForm: {
        statusList: [
          { id: 1, name: "申请中" },
          { id: 2, name: "处理中" },
          { id: 3, name: "提现失败" }
        ],
        status: "",
        statusDes: "",
        id: ""
      },
      paymentVisible: false,
      paymentForm: {
        id: "",
        realName: "",
        bankName: "",
        cardBreed: "",
        cardNumber: "",
        amount: ""
      }
    };
  },
  created() {
    this._getCashRecordList();
  },
  methods: {
    //搜索
    cashListSearch() {
      this.pageIndex = 1;
      this._getCashRecordList();
    },
    //列表分页变化
    cashListCurrentChange(val) {
      this.pageIndex = val;
      this._getCashRecordList();
    },
    parseStatus(status) {
      switch (status) {
        case 1:
          return "申请中";
        case 2:
          return "处理中";
        case 3:
          return "提现失败";
        case 4:
          return "提现成功";
        default:
          return "未知";
      }
    },
    //显示修改状态弹窗
    showStatusFormDialog(item) {
      this.statusForm.id = item.Id;
      this.statusForm.status = item.Status;
      this.statusForm.statusDes = item.StatusDes;
      this.statusVisible = true;
    },
    //确认修改状态
    modifyStatusOk() {
      this._modifyCashStatus().then(val => {
        this.statusVisible = false;
        this._getCashRecordList();
      });
    },
    //显示打款弹窗
    showPaymentDialog(item) {
      this.paymentForm.id = item.Id;
      this.paymentForm.realName = item.RealName;
      this.paymentForm.bankName = item.BankName;
      this.paymentForm.cardBreed = item.CardBreed;
      this.paymentForm.cardNumber = item.CardNumber;
      this.paymentForm.amount = item.Amount;
      this.paymentVisible = true;
    },
    //打款确认
    paymentOk() {
      this._cashPayment().then(val => {
        this.paymentVisible = false;
        this._getCashRecordList();
      });
    },
    //获取提现列表
    _getCashRecordList() {
      var par = {
        AccountName: this.searchAccountName,
        Status: this.searchStatus,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetCashRecordList(par,1).then(res => {
        this.cashListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //修改提现状态
    _modifyCashStatus(id) {
      var par = {
        Id: this.statusForm.id,
        Status: this.statusForm.status,
        StatusDes: this.statusForm.statusDes
      };
      return ModifyCashStatus(par,3);
    },
    //提现确认打款
    _cashPayment() {
      var par = {
        Id: this.paymentForm.id
      };
      return CashPayment(par,4);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
