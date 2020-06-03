<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="充值账户:">
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
        <el-table-column prop="AccountName" align="center" label="充值账户" fixed></el-table-column>
        <el-table-column prop="OrderSn" align="center" label="充值订单号" fixed></el-table-column>   
        <el-table-column prop="RechargeAmount" align="center" label="充值金额(元)">
            <template slot-scope="scope">
            <span>{{scope.row.PayAmount*1.0/100}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="支付方式">
          <template slot-scope="scope">
            <span>微信</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
              <div :class="scope.row.Status==3?'red':''">
                  {{scope.row.Status | status}}<i v-if="scope.row.Status==3" @click="showEor(scope.row)" class="el-icon-question red"></i>
              </div>
              </template>
        </el-table-column>
        <el-table-column prop="GradeName" align="center" label="会员名称" width="150px"></el-table-column>
        <el-table-column prop="PayTime" align="center" label="原价(元)" width="150px">
            <template slot-scope="scope">
                <span>{{scope.row.Price*1.0/100}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="RechargeSuccessTime" align="center" label="充值时间" width="150px"></el-table-column>
      </el-table>
    </div>

    <!-- 支付失败 -->
    <el-dialog title="支付失败" :visible.sync="eorVisible" width="700px">
      <div>{{desc}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="eorVisible = false">确 定</el-button>
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
import { memberRechargeRecordList } from "api/member.js";
export default {
  name: "MemberRechargeRecord",
  data() {
    return {
      typeList: [
        { id: 0, name: "全部" },
        { id: 1, name: "等待支付" },
        { id: 2, name: "正在支付" },
        { id: 3, name: "支付失败" },
        { id: 4, name: "支付成功" },
        { id: 5, name: "充值成功" },
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
    this._memberRechargeRecordList();
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
        case 4:
          return '支付成功';
        case 5:
          return '充值成功';
      }
    }
  },
  methods: {
    //搜索
    cashbackListSearch() {
      this.pageIndex = 1;
      this._memberRechargeRecordList();
    },
    //列表分页变化
    cashbackListCurrentChange(val) {
      this.pageIndex = val;
      this._memberRechargeRecordList();
    },
    //  支付失败弹窗
    showEor(item){
        this.desc=item.StatusDes;
        this.eorVisible = true;
    },



    //获取会员充值记录列表
    _memberRechargeRecordList() {
      var par = {
        AccountName: this.searchAccountName,
        Status:this.searchType,
        StartTime:this.searchTime == null ? "" : this.searchTime[0],
        EndTime:this.searchTime == null ? "" : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return memberRechargeRecordList(par).then(res => {
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
