<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="变更时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="list" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column align="center" label="变更前">
          <template slot-scope="scope">{{type==1?scope.row.PreAmount:scope.row.PreAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="变更后">
          <template slot-scope="scope">{{type==1?scope.row.CurrAmount:scope.row.CurrAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="变更">
          <template
            slot-scope="scope"
          >{{type==1?scope.row.ChangeAmount:scope.row.ChangeAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="Description" align="center" label="描述"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="变更时间" width="150px"></el-table-column>
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
  </div>
</template>

<script>
import { GetClientAccountWalletChangeList } from "api/clientaccount.js";
export default {
  name: "WalletChange",
  data() {
    return {
      accountId: "", //用户Id
      type: "", //类型1积分 2余额
      searchTime: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      list: [] //列表;
    };
  },
  created() {
    this.accountId = this.$route.params.id;
    this.type = this.$route.query.type;
    this._getClientAccountWalletChangeList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.accountId = this.$route.params.id;
      this.type = this.$route.query.type;
      this._getClientAccountWalletChangeList();
    }
  },
  methods: {
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getClientAccountWalletChangeList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getClientAccountWalletChangeList();
    },
    //获取用户钱包变更记录
    _getClientAccountWalletChangeList() {
      var par = {
        StartTime: this.searchTime == null ? "" : this.searchTime[0],
        EndTime: this.searchTime == null ? "" : this.searchTime[1],
        Type: this.type,
        AccountId: this.accountId,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetClientAccountWalletChangeList(par,this.type==1?49:50).then(res => {
        this.list = res.List;
        this.pageTotalCount = res.TOtalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
