<template>
  <div>
    <div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="通知类型:">
          <el-select v-model="searchStatus" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="noticeSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          class="addNoticeTime"
          @click="add()"
          v-if="common.haveRight('AddNoticeSubscribe')"
        >创建通知</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="noticeList" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">{{scope.row.NoticeTypeDes}}</template>
        </el-table-column>
        <el-table-column prop="NoticeTime" align="center" label="时段(分钟)"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="red"
              @click="deleteData(scope.row)"
              v-if="common.haveRight('DeleteNoticeSubscribe')"
            >删除</el-button>
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
    <el-dialog title="创建通知" :visible.sync="addVisible" width="500px">
      <el-form :model="addForm" label-width="80px">
        <el-form-item label="通知类型:">
          <el-select v-model="addForm.status" placeholder="请选择">
            <el-option
              v-for="item in optionsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="在:">
          <el-input style="width:215px;margin-right:15px" v-model="addForm.day"></el-input>分钟后通知
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSure('addForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  wechatnoticeSubscribeList,
  wechatnoticeSubscribeAdd,
  wechatnoticeSubscribeDelete
} from "api/wechatnotice.js";
export default {
  name: "NoticeTime",
  data() {
    return {
      searchStatus: 0,
      pageTotalCount: 0,
      pageIndex: 1,
      pageSize: 30,
      form: {
        seachName: "",
        searchStatus: "",
        seachTime: []
      },
      addVisible: false,
      addForm: {
        //详情列表
        status: "",
        day: ""
      },
      options: [
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
      optionsList: [
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
      value: "",
      statusList: [], //通知类型
      noticeList: [] //列表数据
    };
  },
  created() {
    this._wechatnoticeSubscribeList();
  },
  methods: {
    add() {
      this.addVisible = true;
    },
    noticeSearch() {
      this.pageIndex = 1;
      this._wechatnoticeSubscribeList();
    },
    //列表分页变化
    noticeCurrentChange(val) {
      this.pageIndex = val;
      this._wechatnoticeSubscribeList();
    },
    addSure() {
      this._wechatnoticeSubscribeAdd().then(res => {
        this._wechatnoticeSubscribeList();
        this.addVisible = false;
      });
    },
    //删除
    deleteData(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._delete(item.Id).then(val => {
            this._wechatnoticeSubscribeList();
          });
        })
        .catch(() => {});
    },

    _wechatnoticeSubscribeAdd() {
      var par = {
        NoticeType: this.addForm.status,
        NoticeTime: this.addForm.day
      };
      return wechatnoticeSubscribeAdd(par, 310);
    },
    //获取列表数据
    _wechatnoticeSubscribeList() {
      var par = {
        NoticeType: this.searchStatus,
        PageCount: this.pageSize,
        PageIndex: this.pageIndex
      };
      return wechatnoticeSubscribeList(par, 309).then(res => {
        this.noticeList = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //删除
    _delete(id) {
      var par = {
        Id: id
      };
      return wechatnoticeSubscribeDelete(par, 311);
    }
  }
};
</script>

<style scoped lang='less'>
.addNoticeTime {
  float: right;
  margin-bottom: 20px;
}
</style>
