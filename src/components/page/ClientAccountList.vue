<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="昵称:">
          <el-input v-model="searchName" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="searchMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="分享码:">
          <el-input v-model="searchRecommandCode" placeholder="请输入分享码"></el-input>
        </el-form-item>
        <el-form-item label="推荐人昵称:">
          <el-input v-model="searchReferName" placeholder="请输入推荐人昵称  "></el-input>
        </el-form-item>
        <el-form-item label="推荐人分享码:">
          <el-input v-model="searchReferRecommandCode" placeholder="请输入推荐人分享码"></el-input>
        </el-form-item>
        <el-form-item label="注册时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="accountListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="accountList" border ref="multipleTable">
        <el-table-column prop="AccountId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="Mobile" align="center" label="手机号"></el-table-column>
        <el-table-column prop="AccountName" align="center" label="昵称"></el-table-column>
        <el-table-column align="center" label="性别">
          <template slot-scope="scope">{{scope.row.Sex==1?"男":"女"}}</template>
        </el-table-column>
        <el-table-column align="center" label="推荐人" width="150px">
          <template
            slot-scope="scope"
          >{{scope.row.ReferRecommandCode==''?'':(scope.row.RecommandAccountName+'('+scope.row.ReferRecommandCode+')')}}</template>
        </el-table-column>
        <el-table-column prop="MyRecommandCode" align="center" label="分享码" width="130px"></el-table-column>
        <el-table-column prop="Score" align="center" label="积分数量"></el-table-column>
        <el-table-column align="center" label="余额（元）">
          <template slot-scope="scope">{{scope.row.Amount*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="Description" label="状态" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="statusChange($event,scope.row)"
              :disabled="!common.haveRight('ModifyClientAccountStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="Description" label="体验课验券奖励" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.IsPrize"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="2"
              @change="statusChange2($event,scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="Description" label="体验课推荐人奖励" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.IsReferPrize"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="2"
              @change="statusChange3($event,scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="Description" label="体验课商家奖励" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.IsSellerPrize"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="2"
              @change="statusChange4($event,scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="Description" label="业务查询权限">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.IsSalesman"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="2"
              @change="salesmanStatusChange($event,scope.row)"
              :disabled="!common.haveRight('ModifyClientAccountSalesmanStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="注册时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300px">
          <template slot-scope="scope">
            <el-button
              v-if="common.haveRight('GetClientAccountCartList')"
              type="text"
              @click="jumpToAccountCartList(scope.row)"
            >购物车</el-button>
            <el-button
              v-if="common.haveRight('GetClientAccountScoreChangeList')"
              type="text"
              @click="jumpToWalletChange(scope.row,1)"
            >积分变更日志</el-button>
            <el-button
              v-if="common.haveRight('GetClientAccountMoneyChangeList')"
              type="text"
              @click="jumpToWalletChange(scope.row,2)"
            >余额变更日志</el-button>
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
        @current-change="accountListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  GetClientAccountList,
  ModifyClientAccountStatus,
  ModifyClientAccountSalesmanStatus,
  ModifyClientAccountPrizeStatus,
  ModifyClientAccountReferPrizeStatus,
  ModifyClientAccountSellerPrizeStatus
} from "api/clientaccount.js";
export default {
  name: "ClientAccountList",
  data() {
    return {
      searchMobile: "",
      searchName: "",
      searchRecommandCode: "",
      searchReferName: "",
      searchReferRecommandCode: "",
      searchTime: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      accountList: [] //列表;
    };
  },
  created() {
    this._getClientAccountList();
  },
  methods: {
    //跳转到购物车
    jumpToAccountCartList(item) {
      this.$router.push({
        path: `/AccountCartList/${item.AccountId}`,
        query: {
          name: item.AccountName
        }
      });
    },
    //跳转到钱包变更记录
    jumpToWalletChange(item, type) {
      this.$router.push({
        path: `/WalletChange/${item.AccountId}`,
        query: {
          name: (type == 1 ? "积分-" : "余额-") + item.AccountName,
          type: type
        }
      });
    },
    //搜索
    accountListSearch() {
      this.pageIndex = 1;
      this._getClientAccountList();
    },
    //列表分页变化
    accountListCurrentChange(val) {
      this.pageIndex = val;
      this._getClientAccountList();
    },
    statusChange(status, item) {
      this._modifyClientAccountStatus(item.AccountId, status);
    },
    statusChange2(status, item) {
      this._modifyClientAccountPrizeStatus(item.AccountId, status);
    },
    statusChange3(status, item) {
      this._modifyClientAccountReferPrizeStatus(item.AccountId, status);
    },
    statusChange4(status, item) {
      this._modifyClientAccountSellerPrizeStatus(item.AccountId, status);
    },
    salesmanStatusChange(status, item) {
      this._modifyClientAccountSalesmanStatus(item.AccountId, status);
    },
    //获取前端用户列表
    _getClientAccountList() {
      var par = {
        Mobile: this.searchMobile,
        StartTime: this.searchTime == null ? "" : this.searchTime[0],
        EndTime: this.searchTime == null ? "" : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize,
        Name: this.searchName,
        RecommandCode: this.searchRecommandCode,
        ReferName: this.searchReferName,
        ReferRecommandCode: this.searchReferRecommandCode
      };
      return GetClientAccountList(par, 46).then(res => {
        this.accountList = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //修改前端用户状态
    _modifyClientAccountStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyClientAccountStatus(par, 47);
    },
    //修改前端用户是否支持验券奖励状态
    _modifyClientAccountPrizeStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyClientAccountPrizeStatus(par);
    },
    //修改前端用户是否支持推荐验券奖励状态
    _modifyClientAccountReferPrizeStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyClientAccountReferPrizeStatus(par);
    },
    //修改前端用户是否支持商家端用户验券奖励状态
    _modifyClientAccountSellerPrizeStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyClientAccountSellerPrizeStatus(par);
    },
    //修改前端用户是否有显示数据统计菜单权限
    _modifyClientAccountSalesmanStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyClientAccountSalesmanStatus(par, 48);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
