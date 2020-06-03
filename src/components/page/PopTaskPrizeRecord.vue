<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="任务名称:">
          <el-input v-model="taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item class="ml15" label="任务类型:">
          <el-select v-model="taskType" placeholder="请选择任务类型">
            <el-option
              v-for="item in TaskTypeForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="ml15" label="奖励时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="paymentListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="paymentListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" width="180" label="ID" fixed></el-table-column>
        <el-table-column prop="TaskName" align="center" label="任务名称"></el-table-column>
        <el-table-column prop="Amount" align="center" label="任务类型">
          <template slot-scope="scope">
            <span>{{scope.row.TaskType==1?'现金奖励券':scope.row.TaskType}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="AccountName" align="center" label="账号名"></el-table-column>
        <el-table-column align="center" label="即刻奖励金额">
          <template slot-scope="scope">
            <span>{{scope.row.PrizeAmountNow*1.0/100}}元/{{scope.row.PrizeAmountNowStatus | status}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="即刻奖励积分">
          <template slot-scope="scope">
            <span>{{scope.row.PrizeScoreNow}}积分/{{scope.row.PrizeScoreNowGot==true?"已领取":"未领取"}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="执行奖励">
          <template slot-scope="scope">
            <span>{{scope.row.PrizeAmountFinish*1.0/100}}元/{{scope.row.PrizeScoreFinish}}积分</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否已执行">
          <template slot-scope="scope">
            <span>{{scope.row.TaskFinishiStatus==0?"否":"是"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" width="180" align="center" label="奖励时间"></el-table-column>
      </el-table>
    </div>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="paymentListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { popTaskAccountRelList } from "api/pop.js";
export default {
  name: "PopTaskPrizeRecord",
  data() {
    return {
      taskName: "", //任务名称
      taskType: "", //任务类型
      searchTime: "", //创建时间
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      paymentListTable: [], //列表

      TaskTypeForm: [
        {
          Id: 0,
          name: "全部"
        },
        {
          Id: 1,
          name: "现金奖励券"
        }
      ]
    };
  },
  created() {
    this._popTaskAccountRelList();
  },
  filters: {
    status(param) {
      switch (param) {
        case 1:
          return "未领取";
        case 2:
          return "领取中";
        case 3:
          return "已领取";
        case 4:
          return "领取失败";
      }
    }
  },
  methods: {
    //搜索
    paymentListSearch() {
      this.pageIndex = 1;
      this._popTaskAccountRelList();
    },
    //列表分页变化
    paymentListCurrentChange(val) {
      this.pageIndex = val;
      this._popTaskAccountRelList();
    },

    //获取奖励记录列表
    _popTaskAccountRelList() {
      var par = {
        TaskName: this.taskName,
        TaskType: this.taskType,
        StartTime: this.searchTime == null ? "" : this.searchTime[0],
        EndTime: this.searchTime == null ? "" : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      popTaskAccountRelList(par,278).then(res=>{
        this.paymentListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
.Popadd {
  position: absolute;
  right: 40px;
}
.w80 {
  width: 80%;
}
.w78 {
  width: 78%;
}
.addBorder {
  display: flex;
  justify-content: flex-start;
}
.addClose {
  margin: 0 20px 0 30px;
}
.ml15 {
  margin-left: 15px;
}
.w160 {
  width: 160px;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
}
.posiLeft {
  position: absolute;
  left: -30px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px solid #ccc;
}
.mtop20 {
  margin-top: 20px;
}
.w585 {
  width: 585px;
}
.ml30 {
  margin-left: 53px;
}
</style>
