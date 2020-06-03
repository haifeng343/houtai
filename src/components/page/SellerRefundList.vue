<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="退款单号:">
          <el-input v-model="searchAccountName" placeholder="请输入退款单号"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchType" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
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
          <el-button type="primary" @click="cashbackListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="cashbackList" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed width="80px"></el-table-column>
        <el-table-column prop="RefundSn" align="center" width="160px" label="退款单号"></el-table-column>
        <el-table-column prop="AccountName" align="center" label="账户名"></el-table-column>
        <el-table-column align="center" label="退款金额(元)">
          <template slot-scope="scope">{{scope.row.RefundAmount==0?0:scope.row.RefundAmount}}</template>
        </el-table-column>
        <el-table-column align="center" label="已退金额(元)">
          <template slot-scope="scope">{{scope.row.RefundedAmount==0?0:scope.row.RefundedAmount}}</template>
        </el-table-column>
        <el-table-column align="center" label="退款状态">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="changeStatus(scope.row)">{{scope.row.Status | status}}</el-button>
            <el-button
              type="text"
              class="red"
              @click="changeStatus(scope.row)"
              v-if="scope.row.Status==3"
            >
              {{scope.row.Status | status}}
              <text class="red" @click="bindEor(scope.row)" v-if="scope.row.RefundReason!=''">?</text>
            </el-button>-->
            <span v-if="scope.row.Status!=3">{{scope.row.Status | status}}</span>
            <p v-if="scope.row.Status==3" class="red">{{scope.row.Status | status}}<span v-if="scope.row.StatusDes!=''" class="red" @click="bindEor(scope.row)"><i class="el-icon-question
"></i></span>
            </p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="退款类型" width="150px">
          <template slot-scope="scope">{{scope.row.RechargeType==1?'门店退款':'商家退款'}}</template>
        </el-table-column>
        <el-table-column prop="RefundTypeDes" align="center" label="退款描述" width="150px"></el-table-column>
        <el-table-column align="center" label="操作人">
          <template slot-scope="scope">{{scope.row.RefundType==1?'系统退款':scope.row.Operator}}</template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间" width="150px"></el-table-column>
        <el-table-column align="center" label="退款时间">
          <template slot-scope="scope">{{scope.row.RefundTime==null?'/':scope.row.RefundTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200px">
          <template slot-scope="scope">
            <el-button
              type="primary"
              v-if="scope.row.Status==1 && common.haveRight('OperateStoreRechargeRefund')"
              @click="refundPrice(scope.row)"
            >同意退款</el-button>
            <el-button
              type="primary"
              v-if="scope.row.Status==1 && common.haveRight('OperateStoreRechargeRefund')"
              @click="rejectPrice(scope.row)"
            >拒绝退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <!-- 退款原因弹窗 -->
    <el-dialog title="退款原因" :visible.sync="EorVisible" width="700px">
      <span>{{eorDesc}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="EorVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 退款确认 -->
    <el-dialog title="确认退款" :visible.sync="refundVisible" width="700px">
      <span>是否同意退款?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="refundVisible = false">取 消</el-button>
        <el-button type="primary" @click="refundSure">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 拒绝退款 -->
    <el-dialog title="拒绝退款" :visible.sync="rejectVisible" width="700px">
      <el-form>
        <el-form-item label="拒绝原因:">
          <el-input type="textarea" rows="4" v-model="rejectDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rejectVisible = false">取 消</el-button>
        <el-button type="primary" @click="rejectSure">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 更改状态 -->
    <!-- <el-dialog title="状态-退款单号" :visible.sync="statusVisible" width="700px">
      <table class="refundTable">
        <tr>
          <td align="right">状态：</td>
          <td>
            <el-select v-model="searchType1" placeholder="请选择" style="width:533px">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td align="right">状态描述：</td>
          <td>
            <el-input type="textarea" rows="5" v-model="desc"></el-input>
          </td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="statusVisible = false">取 消</el-button>
        <el-button type="primary" @click="changeStatusSure">确 定</el-button>
      </span>
    </el-dialog> -->

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="cashbackListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { GetRefundRecordList, RefundAgree, RefundReject } from "api/finance.js";
export default {
  name: "SellerRefundList",
  data() {
    return {
      typeList: [
        { id: 0, name: "全部" },
        { id: 1, name: "退款申请中" },
        { id: 2, name: "退款处理中" },
        { id: 3, name: "退款失败" },
        { id: 4, name: "退款成功" },
        { id: 5, name: "取消退款" }
      ],
      refundVisible: false, //退款弹窗
      rejectVisible: false, //拒绝弹窗
      rejectDesc: "", //拒绝原因
      statusVisible: false, //更改状态弹窗
      desc: "", //状态描述
      searchTime: "",
      searchAccountName: "", //账户名搜索
      searchType: 0, //类型搜索
      searchType1: 0, //状态值
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      cashbackList: [], //列表;
      Id:'',//当前Id
      EorVisible:false,//拒绝原因
      eorDesc:'',//拒绝内容
    };
  },
  created() {
    this._getCashBackRecordList();
  },
  filters: {
    Status(status) {
      switch (status) {
        case 1:
          return "退款申请中";
        case 2:
          return "退款处理中";
        case 3:
          return "退款失败";
        case 4:
          return "退款成功";
        case 5:
          return "取消退款";
      }
    }
  },
  methods: {
    //搜索
    cashbackListSearch() {
      this.pageIndex = 1;
      this._getCashBackRecordList();
    },
    //列表分页变化
    cashbackListCurrentChange(val) {
      this.pageIndex = val;
      this._getCashBackRecordList();
    },
    //获取返现记录列表
    _getCashBackRecordList() {
      var par = {
        RefundSn: this.searchAccountName,
        Status: this.searchType,
        StartTime: this.searchTime == null ? "" : this.searchTime[0],
        EndTime: this.searchTime == null ? "" : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetRefundRecordList(par,256).then(res => {
        this.cashbackList = res.List;
        this.pageTotalCount = res.TotalCount;
        res.List.forEach(item => {
          item.RefundAmount = Number(item.RefundAmount / 100).toFixed(2);
          item.RefundedAmount = Number(item.RefundedAmount / 100).toFixed(2);
        });
      });
    },
    //同意退款
    _GetRefundAgree() {
      var par = {
        Id: this.Id
      };
      return RefundAgree(par,257).then(res => {
        this.$message({
          showClose: true,
          message: "同意退款操作成功",
          type: "success"
        });
        this._getCashBackRecordList();
      });
    },
    //同意退款弹窗出现
    refundPrice(item){
      this.Id = item.Id
      this.refundVisible = true;
    },
    //确认退款
    refundSure() {
      this._GetRefundAgree();
      this.refundVisible = false;
    },
    //拒绝退款
    _GetRefundReject(item) {
      var par = {
        Id: this.Id,
        Reason: this.rejectDesc
      };
      return RefundReject(par,257).then(res => {
        this.$message({
          showClose: true,
          message: "拒绝退款操作成功",
          type: "success"
        });
        this._getCashBackRecordList();
      });
    },
    //拒绝退款弹窗出现
    rejectPrice(item){
      this.Id = item.Id
      this.rejectVisible = true;
    },
    //确认拒绝退款
    rejectSure() {
      this._GetRefundReject();
      this.rejectVisible = false;
    },
    //拒绝原因弹窗
    bindEor(item) {
      this.EorVisible = true;
      this.eorDesc = item.StatusDes;
    },
  }
};
</script>

<style scoped lang='less'>
.refundTable {
  width: 100%;
  height: auto;
}
.refundTable tr {
  width: 100%;
  line-height: 50px;
}
.refundTable tr td:first-child {
  width: 80px;
}
</style>
