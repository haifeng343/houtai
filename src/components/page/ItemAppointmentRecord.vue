<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="手机号:">
          <el-input v-model="searchMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="预约课程:">
          <el-input v-model="searchItem" placeholder="请输入预约课程"></el-input>
        </el-form-item>
        <el-form-item label="预约状态:">
          <el-select v-model="searchStatus" placeholder="请选择">
            <el-option
              v-for="item in searchStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" label="预约账户"></el-table-column>
        <el-table-column prop="AppointmentMobile" align="center" label="手机号"></el-table-column>
        <el-table-column align="center" label="孩子信息">
          <template slot-scope="scope">{{scope.row.ChildName}}({{scope.row.ChildAge}}岁)</template>
        </el-table-column>
        <el-table-column prop="ItemName" align="center" label="预约课程"></el-table-column>
        <el-table-column prop="AppointmentType" align="center" label="预约类型">
          <template slot-scope="scope">
            <span
              v-if="scope.row.AppointmentStatus!=2"
            >{{scope.row.AppointmentType==1?"与老师协商":(scope.row.ScheduleName+'('+scope.row.ClassDate+')')}}</span>
            <span
              v-else
            >{{scope.row.ClassDate+' '+scope.row.ClassTime}}({{scope.row.AppointmentType==1?"自定义事件":scope.row.ScheduleName}})</span>
          </template>
        </el-table-column>
        <el-table-column prop="AppointmentStatus" align="center" label="预约状态">
          <template
            slot-scope="scope"
          >{{scope.row.AppointmentStatus==1?"未处理":scope.row.AppointmentStatus==2?"已预约":scope.row.AppointmentStatus==3?"被动取消":scope.row.AppointmentStatus==4?"主动取消":"已过期"}}</template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showConfirmDialog(scope.row)"
              v-if="scope.row.AppointmentStatus==1"
            >确认预约</el-button>
            <el-button
              type="text"
              @click="showConfirmDialog(scope.row)"
              v-if="scope.row.AppointmentStatus==2"
            >修改预约</el-button>
            <el-button
              type="text"
              @click="showCancelDialog(scope.row)"
              v-if="scope.row.AppointmentStatus==1 || scope.row.AppointmentStatus==2"
            >取消预约</el-button>
            <el-button
              type="text"
              @click="showDetailsDialog(scope.row)"
              v-if="scope.row.AppointmentStatus==3"
            >取消详情</el-button>
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
    <!-- 确认预约弹窗 -->
    <el-dialog title="确认预约" :visible.sync="confirmVisible" width="503px">
      <el-form ref="confirmForm" :model="confirmForm" label-width="100px">
        <rili
          v-on:choseDate="choseDate"
          v-on:nextMonth="nextMonth"
          v-on:preMonth="preMonth"
          :specialDate="confirmForm.specialDateList"
          :year="confirmForm.year"
          :month="confirmForm.month"
          :date="confirmForm.date"
        ></rili>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="confirmVisible = false" size="medium">取 消</el-button>
        <el-button @click="confirmOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 取消预约 -->
    <el-dialog title="取消预约" :visible.sync="cancelVisible" width="633px">
      <el-form ref="cancelForm" :model="cancelForm" label-width="100px">
        <el-form-item label="取消原因:" prop="Reason">
          <el-input type="textarea" :rows="5" v-model="cancelForm.Reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelVisible = false" size="medium">取 消</el-button>
        <el-button @click="cancelOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 取消详情 -->
    <el-dialog title="取消详情" :visible.sync="detailsVisible" width="633px">
      <el-form ref="detailsForm" :model="detailsForm" label-width="100px">
        <el-form-item label="取消原因:" prop="Reason">
          <el-input type="textarea" :rows="5" v-model="detailsForm.Reason" disabled></el-input>
        </el-form-item>
        <el-form-item label="取消时间:" prop="CancelTime">
          <el-input type="text" v-model="detailsForm.CancelTime" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailsVisible = false" size="medium" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetStoreItemAppointmentRecordList,
  CancelAppointment
} from "api/seller.js";
import rili from "components/common/Rili.vue";
export default {
  name: "ItemAppointmentRecord",
  components: {
    rili
  },
  data() {
    return {
      stroeId: "",
      searchMobile: "", //手机号搜索条件
      searchItem: "", //课程名称搜索条件
      searchStatus: 0, //预约状态搜索条件
      searchStatusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "未处理" },
        { id: 2, name: "已预约" },
        { id: 3, name: "被动取消" },
        { id: 4, name: "主动取消" },
        { id: 5, name: "已过期" }
      ],
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //商家列表
      confirmVisible: false,
      confirmForm: {
        AppointmentId: "",
        IsShift: false,
        specialDateList: [1, 2, 4, 20, 24],
        year: "2020",
        month: "1",
        date: "24"
      },
      cancelVisible: false,
      cancelForm: {
        RecordId: "",
        Reason: ""
      },
      detailsVisible: false,
      detailsForm: {
        CancelTime: "",
        Reason: ""
      }
    };
  },
  created() {
    this.stroeId = this.$route.params.id;
    this._getStoreItemAppointmentRecordList();
  },
  methods: {
    choseDate(e) {
      console.log(e);
    },
    nextMonth(e) {
      console.log(e);
    },
    preMonth(e) {
      console.log(e);
    },
    //商户列表搜索
    listSearch() {
      this.pageIndex = 1;
      this._getStoreItemAppointmentRecordList();
    },
    //商户列表页面变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getStoreItemAppointmentRecordList();
    },
    showConfirmDialog(item) {
      this.confirmVisible = true;
    },
    showCancelDialog(item) {
      this.cancelForm.RecordId = item.Id;
      this.cancelForm.Reason = item.AppointmentStatusDes;
      this.cancelVisible = true;
    },
    cancelOk() {
      this._cancelAppointment().then(val => {
        this._getStoreItemAppointmentRecordList();
        this.cancelVisible = false;
      });
    },
    showDetailsDialog(item) {
      this.detailsForm.Reason = item.AppointmentStatusDes;
      this.detailsForm.CancelTime = item.CancelTime;
      this.detailsVisible = true;
    },
    //获取门店课程预约记录
    _getStoreItemAppointmentRecordList() {
      var par = {
        Mobile: this.searchMobile,
        ItemName: this.searchItem,
        AppointmentStatus: this.searchStatus,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize,
        StoreId: this.stroeId
      };
      return GetStoreItemAppointmentRecordList(par).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //取消预约
    _cancelAppointment() {
      var par = {
        RecordId: this.cancelForm.RecordId,
        Reason: this.cancelForm.Reason
      };
      return CancelAppointment(par);
    }
  }
};
</script>

<style>
.rili-item {
  width: 60px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 16px;
}
.light {
  color: red;
  cursor: pointer;
}
</style>
