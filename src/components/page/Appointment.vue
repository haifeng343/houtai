<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="日期:">
          <el-date-picker
            v-model="dateSearch"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showclearDialog()"
          style="float:right;margin-bottom:10px;"
        >清空预约表</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Date" align="center" label="日期"></el-table-column>
        <el-table-column prop="ClassCount" align="center" label="课程节数">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jumpToAppointmentClass(scope.row)"
            >{{scope.row.ClassCount}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="RemainCount" align="center" label="剩余名额"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteData(scope.row)" style="color:red">删除</el-button>
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
    <!-- 清空弹窗 -->
    <el-dialog title="清空预约表" :visible.sync="clearVisible" width="533px">
      <el-form ref="clearForm" :model="clearForm" label-width="100px">
        <el-checkbox-group v-model="checkedBatchList" @change="checkedBatchListClick">
          <el-checkbox v-for="item in batchList" :label="item.BatchName" :key="item.BatchName">
            <div style="margin-bottom:20px;">
              <div>{{item.BatchName==''?'其他':item.BatchName}}</div>
              <div style="color:grey" v-if="item.BatchName">添加日期：{{item.CreateTime}}</div>
              <div
                style="color:grey"
                v-if="item.BatchName"
              >预约表有效期：{{item.BatchStartTime}}~{{item.BatchEndTime}}</div>
            </div>
          </el-checkbox>
        </el-checkbox-group>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-checkbox
          v-model="checkedAll"
          @change="checkedAllClick"
          style="float:left;margin-left:20px;"
        >清空全部</el-checkbox>
        <el-button @click="clearVisible = false" size="medium">取 消</el-button>
        <el-button @click="clearOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetStoreItemAppointmenttableList,
  DeleteStoreItemAppointmenttable,
  GetStoreItemScheduleBatchList,
  DeleteStoreItemScheduleBatch
} from "api/seller.js";
export default {
  name: "Appointment",
  data() {
    return {
      relId: "",
      storeId: "",
      itemId: "",
      dateSearch: null, //日期查询条件
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //商家列表
      batchList: [], //批量添加列表
      checkedBatchList: [], //选中的批量列表
      checkedAll: false,
      clearVisible: false,
      clearForm: {}
    };
  },
  created() {
    this.relId = this.$route.params.id;
    this.storeId = this.$route.params.storeid;
    this.itemId = this.$route.params.itemid;
    this._getStoreItemAppointmenttableList();
  },
  methods: {
    jumpToAppointmentClass(item) {
      this.$router.push({
        path:
          "/AppointmentClass/" +
          item.StoreId +
          "/" +
          item.ItemId +
          "/" +
          item.Date,
        query: {
          name: item.Date
        }
      });
    },
    //商户列表搜索
    listSearch() {
      this.pageIndex = 1;
      this._getStoreItemAppointmenttableList();
    },
    //商户列表页面变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getStoreItemAppointmenttableList();
    },
    deleteData(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteStoreItemAppointmenttable(
            item.StoreId,
            item.ItemId,
            item.Date
          ).then(val => {
            this._getStoreItemAppointmenttableList();
          });
        })
        .catch(() => {});
    },
    showclearDialog() {
      this._getStoreItemScheduleBatchList();
      this.checkedBatchList = false;
      this.checkedBatchList = [];
      this.clearVisible = true;
    },
    checkedBatchListClick(e) {
      if (this.checkedBatchList.length >= this.batchList.length) {
        this.checkedAll = true;
      } else {
        this.checkedAll = false;
      }
    },
    checkedAllClick(e) {
      if (e == true) {
        this.checkedBatchList = this.batchList.map(item => {
          return item.BatchName;
        });
      } else {
        this.checkedBatchList = [];
      }
    },
    clearOk() {
      this._deleteStoreItemScheduleBatch().then(val => {
        this._getStoreItemAppointmenttableList();
        this.clearVisible = false;
      });
    },
    //获取门店课程预约表信息
    _getStoreItemAppointmenttableList() {
      var par = {
        RelId: this.relId,
        StartTime: this.dateSearch == null ? "" : this.dateSearch[0],
        EndTime: this.dateSearch == null ? "" : this.dateSearch[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetStoreItemAppointmenttableList(par).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //删除门店课程预约表统计信息
    _deleteStoreItemAppointmenttable(storeid, itemid, date) {
      var par = {
        StoreId: storeid,
        ItemId: itemid,
        Date: date
      };
      return DeleteStoreItemAppointmenttable(par);
    },
    //获取门店课程批量排课列表
    _getStoreItemScheduleBatchList() {
      var par = {
        StoreId: this.storeId,
        ItemId: this.itemId
      };
      return GetStoreItemScheduleBatchList(par).then(res => {
        res.unshift({
          BatchName: "",
          BatchStartTime: null,
          BatchEndTime: null,
          CreateTime: null
        });
        this.batchList = res;
      });
    },
    //批量清空课程排课
    _deleteStoreItemScheduleBatch() {
      var par = {
        StoreId: this.storeId,
        ItemId: this.itemId,
        BatchNameList: this.checkedAll == true ? null : this.checkedBatchList
      };
      return DeleteStoreItemScheduleBatch(par);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
