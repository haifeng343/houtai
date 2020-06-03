<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="门店名称">
        <el-input v-model="name" placeholder="请输入门店名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-button
        type="primary"
        class="add"
        @click="add"
        v-if="common.haveRight('AddActivityGroupStore')"
      >添加参与门店</el-button>
    </el-form>
    <el-table :data="tableData" center style="width: 100%">
      <el-table-column label="ID" align="ceter" prop="Id"></el-table-column>
      <el-table-column label="门店名称" align="ceter" prop="StoreName"></el-table-column>
      <el-table-column label="课程名称" align="ceter" prop="ItemName"></el-table-column>
      <el-table-column label="原价（元）" align="ceter">
        <template slot-scope="scope">{{ scope.row.Price *1.0/100 }}</template>
      </el-table-column>
      <el-table-column label="课程数量" align="ceter" prop="CoursesNumber"></el-table-column>
      <el-table-column label="单节课时" align="ceter" prop="SingleTime"></el-table-column>
      <!-- <el-table-column label="最低招收人数" align="ceter" prop="MinNumber"></el-table-column>
      <el-table-column label="最大招收人数" align="ceter" prop="MaxNumber"></el-table-column>-->
      <el-table-column label="每人最大购买数量" align="ceter" prop="MaxBuyCount"></el-table-column>
      <el-table-column label="剩余招生人数" align="ceter" prop="RemainBuyCount">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="setRemainCount(scope.row)"
            :disabled="!common.haveRight('SetActivityGroupStoreRemainCount')"
          >{{scope.row.RemainBuyCount}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="到店扣费(元)" align="ceter" prop="RemainBuyCount">
        <template slot-scope="scope">{{scope.row.ArrivalAmount*1.0/100}}</template>
      </el-table-column>
      <el-table-column label="最后更新时间" prop="LastModified"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit(scope.row)"
            v-if="common.haveRight('ModifyActivityGroupStore')"
          >编辑</el-button>
          <el-button
            type="text"
            class="red"
            @click="deleteData(scope.row.Id)"
            v-if="common.haveRight('DeleteActivityGroupStore')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页-->
    <div class="pagination">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager-count="11"
        layout="prev, pager, next"
        :total="TotalCount"
      ></el-pagination>
    </div>
    <!-- 修改剩余人数弹窗 -->
    <el-dialog title="修改剩余人数" :visible.sync="remainVisible" width="633px">
      <el-form ref="remainForm" :model="remainForm">
        <el-form-item label="剩余人数:" label-width="100px">
          <el-input v-model="remainForm.remainCount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="remainVisible = false" size="medium">取 消</el-button>
        <el-button @click="setRemainCountOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  activitygroupStoreList,
  tradingareaList,
  DeleteActivityGroupStore,
  SetActivityGroupStoreRemainCount
} from "api/sheet.js";

export default {
  name: "store",
  data() {
    return {
      name: "",
      tableData: [],
      TotalCount: 0,
      pageSize: 20,
      currentPage: 1,
      Id: "", //活动组Id
      TradingAreaId: "", //商圈Id
      addVisible: false,
      labelPosition: "right",
      options: [],
      remainVisible: false,
      remainForm: {
        id: "",
        remainCount: ""
      }
    };
  },
  methods: {
    _activitygroupStoreList() {
      //列表数据
      const params = {
        ActivityGroupId: this.Id,
        StoreName: this.name,
        PageCount: this.pageSize,
        PageIndex: this.currentPage
      };
      activitygroupStoreList(params, 138).then(res => {
        this.tableData = res.List;
        this.TotalCount = res.TotalCount;
      });
    },
    _tradingareaList() {
      //商圈列表
      const params = {
        TradingAreaName: "",
        Status: 1,
        PageCount: 1000,
        PageIndex: 1
      };
      tradingareaList(params, 138).then(res => {
        this.options = res.List;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this._activitygroupStoreList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this._activitygroupStoreList();
    },
    search() {
      this.currentPage = 1;
      this._activitygroupStoreList();
    },
    add() {
      this.$router.push({
        path: `/addStore/${this.Id}`, //活动组Id
        query: {
          // Id: this.Id,
          TradingAreaId: this.TradingAreaId
        }
      });
    },
    edit(item) {
      this.$router.push({
        path: "/editStore",
        query: {
          RelId: item.Id, //关系Id
          Id: this.Id, //活动组Id
          TradingAreaId: this.TradingAreaId,
          StoreId: item.StoreId
        }
      });
    },
    // 删除
    deleteData(Id) {
      this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            Id: Id
          };
          DeleteActivityGroupStore(params, 141)
            .then(res => {
              this._activitygroupStoreList();
            })
            .catch(error => {
              console.log("error");
            });
        })
        .catch(() => {});
    },
    setRemainCount(item) {
      this.remainForm.id = item.Id;
      this.remainForm.remainCount = item.RemainBuyCount;
      this.remainVisible = true;
    },
    setRemainCountOk() {
      this._setActivityGroupStoreRemainCount().then(val => {
        this._activitygroupStoreList();
        this.remainVisible = false;
      });
    },
    //设置剩余招生人数
    _setActivityGroupStoreRemainCount() {
      var par = {
        RelId: this.remainForm.id,
        RemainCount: this.remainForm.remainCount
      };
      return SetActivityGroupStoreRemainCount(par, 142);
    }
  },
  mounted() {
    this.Id = this.$route.params.id;
    this.TradingAreaId = this.$route.query.TradingAreaId;
    this._activitygroupStoreList();
    this._tradingareaList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.Id = this.$route.params.id;
      this.TradingAreaId = this.$route.query.TradingAreaId;
      this._activitygroupStoreList();
      this._tradingareaList();
    }
  }
};
</script>

<style scoped lang="less">
.add {
  float: right;
}
</style>
