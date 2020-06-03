<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="充值订单号:">
          <el-input v-model="searchAccountName" placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchType" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充值时间:">
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
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="RechargeType" align="center" label="充值类型">
           <template slot-scope="scope">{{scope.row.RechargeType==1?"充值到门店":"充值到商家"}}</template>
        </el-table-column>
        <el-table-column prop="StoreName" align="center" label="门店/商家名称"></el-table-column>
        <el-table-column prop="RechargeSn" align="center" label="充值订单号"></el-table-column>
        <el-table-column prop="RechargeAmount" align="center" label="充值金额(元)"></el-table-column>
        <el-table-column align="center" label="支付方式">
          <template slot-scope="scope">
            <span>微信</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{scope.row.Status | status}}
          </template>
        </el-table-column>
        <el-table-column prop="PayTime" align="center" label="充值时间" width="150px"></el-table-column>
      </el-table>
    </div>

    <!-- 退款失败 -->
    <el-dialog title="tup" :visible.sync="eorVisible" width="700px">
      <el-input type="textarea" rows="5" v-model="desc"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eorVisible = false">取 消</el-button>
        <el-button type="primary" @click="eorVisible">确 定</el-button>
      </span>
    </el-dialog>

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
import { GetRechargeRecordList } from "api/finance.js";
export default {
  name: "SellerRechargeRecord",
  data() {
    return {
      typeList: [
        { id: 0, name: "全部" },
        { id: 1, name: "待支付" },
        { id: 2, name: "已支付" },
        { id: 3, name: "支付失败" },
      ],
      searchTime: "",//时间选择器
      searchAccountName: "", //账户名搜索
      searchType: 0, //类型搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      cashbackList: [] ,//列表;
      tup:'退款失败',//弹窗title
      eorVisible:false,//退款失败弹窗
      desc:'',//退款失败说明
    };
  },
  created() {
    this._getCashBackRecordList();
  },
  filters: {
    Status(status) {
      switch(status) {
        case 1:
          return '待支付';
        case 2:
          return '已支付';
        case 3:
          return '支付失败';
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
        RechargeSn: this.searchAccountName,
        Status: this.searchType,
        StartTime:this.searchTime == null ? "" : this.searchTime[0],
        EndTime:this.searchTime == null ? "" : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetRechargeRecordList(par,255).then(res => {
        this.cashbackList = res.List;
        this.pageTotalCount = res.TotalCount;
        res.List.forEach(item => {
          item.RechargeAmount = Number(item.RechargeAmount/100).toFixed(2)
        });
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
