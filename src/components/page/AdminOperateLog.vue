<template>
  <div class="table">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item>日志管理</el-breadcrumb-item>
      <el-breadcrumb-item>操作日志</el-breadcrumb-item>-->
    </el-breadcrumb>
    <div class="container">
      <div class="handle-box">
        <label for>用户名:</label>
        <el-input v-model="username" placeholder="请输入用户名" class="handle-input mr10"></el-input>
        <label for>登录ID:</label>
        <el-input v-model="loginlogid" placeholder="请输入所属登录ID" class="handle-input mr10"></el-input>
        <label for>从:</label>
        <el-date-picker
          v-model="time"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getTime"
        ></el-date-picker>
        <el-button type="primary" @click="search">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="table" ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID"></el-table-column>
        <el-table-column prop="LoginLogId" align="center" label="所属登录ID"></el-table-column>
        <el-table-column prop="UserName" align="center" label="用户名"></el-table-column>
        <el-table-column prop="FunctionName" align="center" label="描述"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="操作时间">
          <template slot-scope="scope">{{ scope.row.CreateTime | normalTime(scope.row.CreateTime)}}</template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="[10, 20, 30, 40, 50]"
          :page-size="30"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageCount"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getOperationLog } from "api/admin.js";
export default {
  name: "operationlog",
  data() {
    return {
      tableData: [],
      cur_page: 1,
      loginlogid: "",
      username: "",
      functionname: "", //描述
      time: [],
      starttime: "",
      endtime: "",
      pageCount: 0,
      pagesize: 30
    };
  },
  created() {
    this.getData();
  },
  computed: {},
  methods: {
    //分页导航尺寸更改
    handleSizeChange(val) {
      this.pagesize = val;
      this.getData();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
    // 获取表格数据
    getData() {
      const params = {
        PageIndex: this.cur_page,
        PageCount: this.pagesize,
        UserName: this.username,
        LoginLogId: this.loginlogid,
        StartTime: this.starttime,
        EndTime: this.endtime
      };
      return getOperationLog(params,45).then(res => {
        this.tableData = res.List;
        this.pageCount = res.TotalCount;
      });
    },
    search() {
      this.cur_page = 1;
      this.getData();
    },
    getTime() {
      if (this.time != null && this.time.length > 0) {
        this.starttime = this.time[0];
        this.endtime = this.time[1];
      } else {
        this.starttime = "";
        this.endtime = "";
      }
    }
  }
};
</script>

<style scoped>
.handle-box {
  margin-bottom: 20px;
}
.handle-select {
  width: 120px;
}

.handle-input {
  width: 230px;
  display: inline-block;
}
.del-dialog-cnt {
  font-size: 16px;
  text-align: center;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: #ff0000;
}
</style>