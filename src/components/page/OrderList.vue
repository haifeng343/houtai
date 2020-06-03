<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="订单号:">
          <el-input v-model="searchOrderSn" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="账户名:">
          <el-input v-model="searchAccountName" placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="团单名称:">
          <el-input v-model="searchSheetName" placeholder="请输入团单名称"></el-input>
        </el-form-item>
        <el-form-item label="订单状态:">
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
          <el-button type="primary" @click="orderListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="orderList" border ref="multipleTable">
        <el-table-column prop="OrderId" align="center" label="ID" width="100px" fixed></el-table-column>
        <el-table-column prop="OrderSn" align="center" label="订单号"></el-table-column>
        <el-table-column prop="TicketNumber" align="center" label="券码"></el-table-column>
        <el-table-column prop="AccountName" align="center" label="账户名"></el-table-column>
        <el-table-column prop="SheetName" align="center" label="团单名称"></el-table-column>
        <el-table-column align="center" label="购买类型">
          <template slot-scope="scope">{{scope.row.BuyType==1?'团购':'未知'}}</template>
        </el-table-column>
        <el-table-column prop="PayAmount" align="center" label="支付金额(元)" width="100px">
          <template slot-scope="scope">{{scope.row.PayAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="UseScore" align="center" label="使用积分数量" width="100px"></el-table-column>
        <el-table-column align="center" label="订单状态">
          <template slot-scope="scope">
            <span
              :class="{'red':scope.row.UseStatus==7}"
            >{{scope.row.UseStatus==1?"未使用":scope.row.UseStatus==2?"部分使用":scope.row.UseStatus==3?"已完成":scope.row.UseStatus==4?"已过期":scope.row.UseStatus==5?"申请退款":scope.row.UseStatus==6?"退款中":scope.row.UseStatus==7?"退款失败":scope.row.UseStatus==8?"退款成功":scope.row.UseStatus==9?"取消退款":"未知"}}</span>
            <span
              v-if="scope.row.UseStatus==7&&scope.row.RefundFailReason"
              class="el-icon-question red"
              @click="showRefundFailReasonDialog(scope.row.RefundFailReason)"
            ></span>
          </template>
        </el-table-column>
        <el-table-column prop="PayTime" align="center" label="付款时间"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间" width="150px"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="230px">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="showEditItemDialog(scope.row)">订单详情</el-button> -->
            <el-button v-if="scope.row.UseStatus==8 && common.haveRight('GetOrderRefundDetails')" type="text" @click="showRefundDetailsDialog(scope.row)">退款详情</el-button>
            <el-button v-if="scope.row.UseStatus==5 && common.haveRight('ModifyRefundStatus')" type="text" @click="jumpToRefund(scope.row)">开始退款</el-button>
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
        @current-change="orderListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 退款失败弹窗 -->
    <el-dialog title="退款失败原因" :visible.sync="reasonVisible" width="633px">
      {{refundFailReason}}
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="reasonVisible = false" size="medium">关 闭</el-button>
      </span>
    </el-dialog>
     <!-- 退款详情弹窗 -->
    <el-dialog title="退款详情" :visible.sync="refundDetailsVisible" width="633px">
      <el-form ref="refundDetailsForm" :model="refundDetailsForm" label-width="85px">
        <el-form-item label="已退款(元):" prop="amount">
          <label>{{refundDetailsForm.amount*1.0/100}}</label>
        </el-form-item>
        <el-form-item label="退款账户:" prop="accountName">
          <label>{{refundDetailsForm.accountName}}</label>
        </el-form-item>
        <el-form-item label="退款时间:" prop="refundTime">
          <label>{{refundDetailsForm.refundTime}}</label>
        </el-form-item>
        <el-form-item label="到账时间:" prop="refundArrivalTime">
          <label>{{refundDetailsForm.refundArrivalTime}}</label>
        </el-form-item>
        <el-form-item label="交易编号:" prop="refundWechatId">
          <label>{{refundDetailsForm.refundWechatId}}</label>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="refundDetailsVisible = false" size="medium">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetOrderList } from "api/finance.js";
export default {
  name: "OrderList",
  data() {
    return {
      statusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "未使用" },
        { id: 2, name: "部分使用" },
        { id: 3, name: "已完成" },
        { id: 4, name: "已过期" },
        { id: 5, name: "申请退款" },
        { id: 6, name: "退款中" },
        { id: 7, name: "退款失败" },
        { id: 8, name: "退款成功" },
        { id: 9, name: "取消退款" }
      ],
      searchOrderSn: "",
      searchAccountName: "",
      searchSheetName: "",
      searchStatus: 0,
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      orderList: [], //列表;
      reasonVisible: false, //退款原因弹窗是否显示
      refundFailReason: "",
      refundDetailsVisible:false,
      refundDetailsForm:{
        amount:"",
        accountName:"",
        refundTime:"",
        refundArrivalTime:"",
        refundWechatId:""
      },
    };
  },
  created() {
    this._getOrderList();
  },
  methods: {
    //搜索
    orderListSearch() {
      this.pageIndex = 1;
      this._getOrderList();
    },
    //列表分页变化
    orderListCurrentChange(val) {
      this.pageIndex = val;
      this._getOrderList();
    },
    //展示退款失败弹窗
    showRefundFailReasonDialog(reason) {
      this.refundFailReason = reason;
      this.reasonVisible = true;
    },
    //展示退款详情弹窗
    showRefundDetailsDialog(item){
      this.refundDetailsForm.amount=item.PayAmount;
      this.refundDetailsForm.accountName=item.AccountName;
      this.refundDetailsForm.refundTime=item.RefundTime;
      this.refundDetailsForm.refundArrivalTime=item.RefundArrivalTime;
      this.refundDetailsForm.refundWechatId=item.RefundWechatId;
      this.refundDetailsVisible=true;
    },
    //跳转到退款详情
    jumpToRefund(item){
      this.$router.push({
        path: `/OrderRefundDetails/${item.OrderId}`,
        query: {
          name: item.OrderSn
        }
      });
    },
    //获取订单列表
    _getOrderList() {
      var par = {
        OrderSn: this.searchOrderSn,
        AccountName: this.searchAccountName,
        SheetName: this.searchSheetName,
        Status: this.searchStatus,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetOrderList(par,8).then(res => {
        this.orderList = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
