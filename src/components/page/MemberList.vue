<template>
  <div>
    <div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="会员账户:">
          <el-input v-model="form.seachName" placeholder="请输入会员账户"></el-input>
        </el-form-item>
        <el-form-item label="会员等级:">
          <el-select v-model="form.searchStatus" placeholder="请选择会员等级">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="创建时间:">
          <el-date-picker
            v-model="form.searchTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="noticeSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <div class="countNumber">
        <p>会员总数:21545</p>
        <!-- <p>最近一个月:21545</p>
        <p>最近一周:21545</p>-->
      </div>
      <el-table :data="memberList" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" label="会员账户"></el-table-column>
        <el-table-column align="center" label="当前等级">
          <template slot-scope="scope">
            <!-- <el-button type="text" @click="detail(scope.row)">基本会员</el-button> -->
            <span>{{scope.row.GradeName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ViewTime" align="center" label="当前有效期至">
          <template slot-scope="scope">{{scope.row.EndTime==null?"/":scope.row.EndTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="是否有效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <!-- <el-table-column prop="CreateTime" width="200px" align="center" label="最后充值时间"></el-table-column> -->
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="periodShow(scope.row)">有效期列表</el-button>
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
        @current-change="noticeCurrentChange"
      ></el-pagination>
    </div>
    <!-- 会员等级 -->
    <el-dialog :title="`会员等级-${vipName}`" :visible.sync="detailVisible" width="500px">
      <div class="countNumber">
        <p>会员权益:sdads58a4da65s4ds</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailVisible = false" type="primary">关 闭</el-button>
      </span>
    </el-dialog>

    <!-- 有效期列表 -->
    <el-dialog :title="`有效期列表-${vipName}`" :visible.sync="periodVisible" width="800px">
      <el-table :data="periodList" border ref="periodList">
        <el-table-column prop="Id" align="center" label="会员名称" width="160px" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" width="120px" label="会员等级"></el-table-column>
        <el-table-column prop="AccountName" align="center" width="120px" label="充值金额(元)"></el-table-column>
        <el-table-column prop="AccountName" align="center" label="有效期"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="periodVisible = false" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { memberAccountList, memberAccountRecordList,memberAccountStatusModify } from "api/member.js";
export default {
  name: "MemberList",
  data() {
    return {
      vipName: "", //会员名称
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
        dec: ""
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
      memberList: [], //列表数据
      periodList: [], //有效期列表
      periodVisible: false //有效期列表弹窗
    };
  },
  created() {
    this._memberAccountList();
  },
  methods: {
    noticeSearch() {
      this.pageIndex = 1;
      this._memberAccountList();
    },
    //列表分页变化
    noticeCurrentChange(val) {
      this.pageIndex = val;
      this._memberAccountList();
    },
    // 会员等级
    detail(item) {
      this.vipName = item.AccountName;
      this.detailVisible = true;
    },
    //修改是否有效
    changeStatus(status, item) {
      this._memberAccountStatusModify(item.Id, status);
    },
    // 有效期列表
    periodShow(item) {
      this.vipName = item.AccountName;
      this.periodVisible = true;
      this._memberAccountRecordList(item.AccountId);
    },

    //列表
    _memberAccountList() {
      var par = {
        AccountName: this.form.seachName,
        GradeId: 0,
        // StartTime: this.form.searchTime != null ? this.form.searchTime[0] : "",
        // EndTime: this.form.searchTime != null ? this.form.searchTime[1] : "",
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return memberAccountList(par).then(res => {
        this.memberList = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //
    _memberAccountRecordList(Id) {
      var apr = {
        Id: Id,
        PageCount: 1000,
        PageIndex: 1
      };
      return memberAccountRecordList(par).then(res => {
        this.periodList = res.data;
      });
    },
    _memberAccountStatusModify(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return memberAccountStatusModify(par);
    },
  }
};
</script>

<style scoped lang='less'>
.countNumber {
  display: flex;
  justify-content: flex-start;
  font-size: 15px;
  color: #4c4c4c;
  margin-bottom: 20px;
}
.countNumber p {
  margin-left: 20px;
}
.countNumber p:first-child {
  margin-left: 0;
}
</style>
