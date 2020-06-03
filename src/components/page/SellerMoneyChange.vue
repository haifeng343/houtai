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
          <template slot-scope="scope">{{scope.row.PreAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="变更后">
          <template slot-scope="scope">{{scope.row.CurAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="变更">
          <template
            slot-scope="scope"
          >{{scope.row.ChangeAmount*1.0/100}}</template>
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
import { GetSellerMoneyChangeList } from "api/seller.js";
export default {
  name: "SellerMoneyChange",
  data() {
    return {
      sellerId: 0,
      searchTime: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      list: [] //列表;
    };
  },
  created() {
    this.sellerId = this.$route.params.id;
    this._getSellerMoneyChangeList();
  },
  methods: {
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getSellerMoneyChangeList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerMoneyChangeList();
    },
    //获取商家钱包变更记录
    _getSellerMoneyChangeList() {
      var par = {
        SellerId: this.sellerId,
        StartTime: this.searchTime == null ? "" : this.searchTime[0],
        EndTime: this.searchTime == null ? "" : this.searchTime[1],
        PageIndex:this.pageIndex,
        PageCount:this.pageSize
      };
      return GetSellerMoneyChangeList(par,150).then(res=>{
          this.list=res.List;
          this.pageTotalCount=res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
