<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号:">
          <el-input v-model="searchOrderSn" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refundRecordListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="refundRecordList" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="Amount" align="center" label="退款金额(元)">
          <template slot-scope="scope">{{scope.row.Amount*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="OrderSn" align="center" label="订单号"></el-table-column>
        <el-table-column align="center" label="退款类型">
          <template slot-scope="scope">{{scope.row.RefundType==1?"订单退款":"验券退款"}}</template>
        </el-table-column>
        <el-table-column prop="ItemName" align="center" label="退款课程名称"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间" width="150px"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="refundRecordListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { GetOrderRefundRecordList } from "api/finance.js";
export default {
  name: "OrderRefundList",
  data() {
    return {
      searchOrderSn: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      refundRecordList: [] //列表;
    };
  },
  created() {
    this._getOrderRefundRecordList();
  },
  methods: {
    //搜索
    refundRecordListSearch() {
      this.pageIndex = 1;
      this._getOrderRefundRecordList();
    },
    //列表分页变化
    refundRecordListCurrentChange(val) {
      this.pageIndex = val;
      this._getOrderRefundRecordList();
    },
    //获取订单退款记录列表
    _getOrderRefundRecordList() {
      var par = {
        OrderSn: this.searchOrderSn,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetOrderRefundRecordList(par,11).then(res => {
        this.refundRecordList = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
