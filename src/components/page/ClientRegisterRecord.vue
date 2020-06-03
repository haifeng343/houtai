<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="账户名:">
          <el-input v-model="searchAccountName" placeholder="请输入账户名"></el-input>
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
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="list" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" label="账户名"></el-table-column>
        <el-table-column prop="DeviceUA" align="center" label="设备信息"></el-table-column>
        <el-table-column prop="Ip" align="center" label="IP"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="注册时间" width="150px"></el-table-column>
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
import { GetClientAccountRegisterList } from "api/clientaccount.js";
export default {
  name: "ClientRegisterRecord",
  data() {
    return {
      searchAccountName: "",
      searchTime: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      list: [] //列表;
    };
  },
  created() {
    this._getClientAccountRegisterList();
  },
  methods: {
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getClientAccountRegisterList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getClientAccountRegisterList();
    },
    //获取用户注册记录
    _getClientAccountRegisterList() {
      var par = {
        AccountName: this.searchAccountName,
        StartTime: this.searchTime == null ? "" : this.searchTime[0],
        EndTime: this.searchTime == null ? "" : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetClientAccountRegisterList(par,51).then(res => {
        this.list = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
