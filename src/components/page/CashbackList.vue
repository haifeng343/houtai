<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="账户名:">
          <el-input v-model="searchAccountName" placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="返现类型:">
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
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" label="账户名"></el-table-column>
        <el-table-column align="center" label="返现金额（元）">
          <template slot-scope="scope">{{scope.row.Amount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="返现类型">
          <template slot-scope="scope">{{scope.row.Type==1?"验券返现":"验券推荐返现"}}</template>
        </el-table-column>
        <el-table-column prop="Description" align="center" label="描述"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间" width="150px"></el-table-column>
      </el-table>
    </div>
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
import { GetCashBackRecordList } from "api/finance.js";
export default {
  name: "CashbackList",
  data() {
    return {
      typeList: [
        { id: 0, name: "全部" },
        { id: 1, name: "验券返现" },
        { id: 2, name: "验券推荐返现" }
      ],
      searchTime:'',
      searchAccountName: "", //账户名搜索
      searchType: 0, //类型搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      cashbackList: [] //列表;
    };
  },
  created() {
    this._getCashBackRecordList();
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
        AccountName: this.searchAccountName,
        Type: this.searchType,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetCashBackRecordList(par,7).then(res => {
        this.cashbackList = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
