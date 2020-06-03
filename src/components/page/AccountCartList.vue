<!--  -->
<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="添加时间:">
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
        <el-table-column prop="CartId" align="center" label="ID" fixed></el-table-column>
        <el-table-column align="center" label="团单类型">
          <template
            slot-scope="scope"
          >{{scope.row.SheetModel==1?"团单模式":"商圈模式"}}({{scope.row.SheetName}})</template>
        </el-table-column>
        <el-table-column align="center" label="课程数量">
          <template slot-scope="scope">
            <el-button type="text" @click="showItemDialog(scope.row)">{{scope.row.ItemCount}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="添加时间" width="150px"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300px">
          <template slot-scope="scope">
            <el-button v-if="common.haveRight('DeleteClientAccountCart')" type="text" class="red" @click="deleteCart(scope.row)">删除</el-button>
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
        @current-change="listCurrentChange"
      ></el-pagination>
    </div>
    <!-- 课程弹窗 -->
    <el-dialog :title="`课程明细-${itemForm.sheetName}`" :visible.sync="itemVisible" width="533px">
      <el-form ref="itemForm" :model="itemForm" label-width="120px">
        <el-table :data="itemForm.itemList" border ref="multipleTable">
          <el-table-column prop="ItemName" align="center" label="课程名称" fixed></el-table-column>
          <el-table-column prop="StoreName" align="center" label="所属门店" fixed></el-table-column>
          <el-table-column prop="SellerName" align="center" label="所属商家" fixed></el-table-column>
        </el-table>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="itemVisible = false" size="medium">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetClientAccountCartList,
  DeleteClientAccountCart,
  GetClientAccountCartItemList
} from "api/clientaccount.js";
export default {
  name: "AccountCartList",
  data() {
    return {
      accountId: "",
      searchTime: "", //添加时间搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      list: [], //列表;
      itemVisible: false,
      itemForm: {
        sheetName: "",
        itemList: []
      }
    };
  },
  created() {
    this.accountId = this.$route.params.id;
    this._getClientAccountCartList();
  },
  methods: {
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getClientAccountCartList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getClientAccountCartList();
    },
    deleteCart(item) {
      this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteClientAccountCart(item.CartId).then(val => {
            this._getClientAccountCartList();
          });
        })
        .catch(() => {});
    },
    showItemDialog(item){
        this._getClientAccountCartItemList(item.CartId).then(val=>{
            this.itemVisible=true;
            this.itemForm.sheetName=item.SheetName;
        });
    },
    //获取用户购物车数据
    _getClientAccountCartList() {
      var par = {
        AccountId: this.accountId,
        StartTime: this.searchTime == null ? "" : this.searchTime[0],
        EndTime: this.searchTime == null ? "" : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetClientAccountCartList(par,236).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.list = res.List;
      });
    },
    //删除用户购物车数据
    _deleteClientAccountCart(id) {
      var par = {
        Id: id
      };
      return DeleteClientAccountCart(par,237);
    },
    //获取用户购物车课程数据
    _getClientAccountCartItemList(id) {
      var par = {
        Id: id
      };
      return GetClientAccountCartItemList(par,236).then(res => {
        this.itemForm.itemList = res;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
