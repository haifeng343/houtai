<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="创建时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="paymentListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="paymentListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" label="打款金额（元）">
          <template slot-scope="scope">{{scope.row.Amount*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="RealName" align="center" label="收款人"></el-table-column>
        <el-table-column align="center" label="打款银行">
          <template slot-scope="scope">{{scope.row.BankName}}({{scope.row.CardBreed}})</template>
        </el-table-column>
        <el-table-column prop="CardNumber" align="center" label="银行卡号"></el-table-column>
        <el-table-column prop="AdminAccountName" align="center" label="操作人"></el-table-column>
        <el-table-column prop="AccountName" align="center" label="账户名称"></el-table-column>
        <el-table-column align="center" label="打款类型">
           <template slot-scope="scope">{{scope.row.AccountType==1?"前端用户提现打款":""}}</template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间" width="150px"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="paymentListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { GetPaymentRecordList } from "api/finance.js";
export default {
  name: "PaymentLog",
  data() {
    return {
      searchTime: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      paymentListTable: [] //列表
    };
  },
  created() {
    this._getPaymentRecordList();
  },
  methods: {
    //搜索
    paymentListSearch() {
      this.pageIndex = 1;
      this._getPaymentRecordList();
    },
    //列表分页变化
    paymentListCurrentChange(val) {
      this.pageIndex = val;
      this._getPaymentRecordList();
    },
    //获取打款记录列表
    _getPaymentRecordList() {
      var par = {
        StartTime: this.searchTime!=null ? this.searchTime[0] : "",
        EndTime: this.searchTime!=null ? this.searchTime[1] : "",
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetPaymentRecordList(par,6).then(res => {
        this.paymentListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
