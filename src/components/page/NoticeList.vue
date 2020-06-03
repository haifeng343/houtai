<template>
  <div>
    <div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="目标账户:">
          <el-input v-model="form.seachName" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="通知类型:">
          <el-select v-model="form.searchStatus" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间:">
          <el-date-picker
            v-model="form.searchTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="noticeSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="noticeList" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" width="160px" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" width="140px" label="目标账户"></el-table-column>
        <el-table-column width="160px" align="center" label="通知类型">
          <template slot-scope="scope">{{scope.row.NoticeTypeDes}}</template>
        </el-table-column>
        <el-table-column align="center" label="通知详情">
          <template slot-scope="scope" >
              <el-button type="text" @click="detail(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="160px">
          <template slot-scope="scope">{{scope.row.ViewStatus==0?'未查看':'已查看'}}</template>
        </el-table-column>
        <el-table-column prop="ViewTime" align="center" width="200px" label="查看时间">
            <template slot-scope="scope">{{scope.row.ViewTime==null?"/":scope.row.ViewTime}}</template>
        </el-table-column>
        <el-table-column prop="CreateTime" width="200px" align="center" label="创建时间"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="noticeCurrentChange"
      ></el-pagination>
    </div>
    <el-dialog title="查看详情" :visible.sync="detailVisible" width="500px">
      <el-form :model="detailForm" label-width="80px">
        <el-form-item label="通知时间:">
          <el-input disabled v-model="detailForm.time"></el-input>
        </el-form-item>
        <el-form-item label="通知详情:">
          <el-input disabled type="textarea" rows="5" v-model="detailForm.dec"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false" type="primary" >关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { wechatnoticeList } from "api/wechatnotice.js";
export default {
  name: "NoticeList",
  data() {
    return {
      pageTotalCount: 0,
      form: {
        seachName: "",
        searchStatus: 0,
        searchTime: []
      },
      pageIndex: 1,
      pageSize: 30,
      detailVisible: false,
      detailForm: {
        //详情列表
        time: "",
        dec:"",
      },
      statusList: [
        //通知类型
        {
          id: 0,
          name: "全部"
        },
        {
          id: 1,
          name: "订单即将过期提醒"
        },
        {
          id: 2,
          name: "任务接受通知"
        },
        {
          id: 3,
          name: "账户余额提醒"
        },
        {
          id: 4,
          name: "提现失败通知"
        },
        {
          id: 5,
          name: "提现到账通知"
        }
      ],
      noticeList: [] //列表数据
    };
  },
  created() {
    this._wechatnoticeList();
  },
  methods: {
    noticeSearch() {
      this.pageIndex = 1;
      this._wechatnoticeList();
    },
    //列表分页变化
    noticeCurrentChange(val) {
      this.pageIndex = val;
      this._wechatnoticeList();
    },

    detail(item){
        this.detailForm.time = item.NoticeTime;
        this.detailForm.dec = item.Data;
        this.detailVisible = true;
    },








    //列表
    _wechatnoticeList() {
      var par = {
        AccountName: this.form.seachName,
        NoticeType: this.form.searchStatus,
        StartTime: this.form.searchTime != null ? this.form.searchTime[0] : "",
        EndTime: this.form.searchTime != null ? this.form.searchTime[1] : "",
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return wechatnoticeList(par,308).then(res => {
        this.noticeList = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
