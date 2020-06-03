<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="课程名称:">
          <el-input v-model="searchItemName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="ItemName" align="center" label="课程名称"></el-table-column>
        <el-table-column label="开启预约" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.IsAppointment"
              active-text="是"
              inactive-text="否"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="jumpToAppointmentOthercontent(scope.row)">额外信息</el-button>
              <el-button type="text" @click="jumpToAppointment(scope.row)">预约表</el-button>
            </div>
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
  </div>
</template>

<script>
import {
  GetStoreItemAppointment,
  ModifyStoreItemAppointmentStatus
} from "api/seller.js";
export default {
  name: "ItemAppointment",
  data() {
    return {
      storeId: "", //门店Id
      searchItemName: "", //课程名称搜索条件
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [] //商家列表
    };
  },
  created() {
    this.storeId = this.$route.params.id;
    this._getStoreItemAppointment();
  },
  methods: {
    jumpToAppointmentOthercontent(item) {
      this.$router.push({
         path: '/AppointmentOthercontent/'+item.Id,
        query: {
          name: item.ItemName
        }
      });
    },
    jumpToAppointment(item) {
      this.$router.push({
        path: '/Appointment/'+item.Id+'/'+item.StoreId+'/'+item.ItemId,
        query: {
          name: item.ItemName
        }
      });
    },
    //商户列表搜索
    listSearch() {
      this.pageIndex = 1;
      this._getStoreItemAppointment();
    },
    //商户列表页面变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getStoreItemAppointment();
    },
    changeStatus(status, item) {
      this._modifyStoreItemAppointmentStatus(item.Id, status);
    },
    //获取门店课程预约信息
    _getStoreItemAppointment() {
      var par = {
        StoreId: this.storeId,
        ItemName: this.searchItemName,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetStoreItemAppointment(par).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //开启/关闭门店课程预约
    _modifyStoreItemAppointmentStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyStoreItemAppointmentStatus(par);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
