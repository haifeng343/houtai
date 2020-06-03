<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="活动组名称">
        <el-input v-model="name" placeholder="请输入活动组名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-button
        type="primary"
        class="add"
        @click="add"
        v-if="common.haveRight('AddActivityGroup')"
      >添加活动组</el-button>
    </el-form>
    <el-table :data="tableData" center style="width: 100%">
      <el-table-column label="ID" align="ceter" prop="ActivityGroupId"></el-table-column>
      <el-table-column label="活动组名称" align="ceter" prop="ActivityGroupName"></el-table-column>
      <el-table-column label="所属商圈" align="ceter" prop="TradingareaName"></el-table-column>
      <el-table-column label="活动简介" align="ceter" prop="Descption"></el-table-column>
      <el-table-column label="是否有效" align="ceter">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.Status"
            :active-value="1"
            :inactive-value="2"
            @change="modifyStatus(scope.row)"
            style="display: block"
            active-color="#61A4FE"
            inactive-color="#CDCCCA"
            active-text="有效"
            inactive-text="无效"
            :disabled="!common.haveRight('ModifyActivityGroupStatus')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
      <el-table-column label="最后更新时间" prop="LastModified"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="store(scope.row)"
            v-if="common.haveRight('GetActivityGroupStoreList')"
          >参与门店</el-button>
          <el-button
            type="text"
            @click="edit(scope.row)"
            v-if="common.haveRight('ModifyActivityGroup')"
          >编辑</el-button>
          <el-button
            type="text"
            class="red"
            @click="deleteData(scope.row.ActivityGroupId)"
            v-if="common.haveRight('DeleteActivityGroup')"
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

    <!--增加-->
    <el-dialog :title="titsup" :visible.sync="addVisible" width="600px">
      <el-form
        :label-position="labelPosition"
        :rules="addrules"
        ref="addForm"
        label-width="100px"
        :model="addForm"
      >
        <el-form-item label="活动组名称" prop="ActivityGroupName">
          <el-input v-model="addForm.ActivityGroupName"></el-input>
        </el-form-item>
        <el-form-item label="所属商圈" prop="TradingareaId">
          <el-select v-model="addForm.TradingareaId" style="width:420px" filterable>
            <el-option
              v-for="item in options"
              :key="item.TradingAreaId"
              :label="item.TradingAreaName"
              :value="item.TradingAreaId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动简介" prop="Descption">
          <el-input type="textarea" v-model="addForm.Descption"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubmit('addForm')">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog :title="titsup" :visible.sync="editVisible" width="600px">
      <el-form
        :label-position="labelPosition"
        :rules="editrules"
        ref="editForm"
        label-width="100px"
        :model="editForm"
      >
        <el-form-item label="活动组名称" prop="ActivityGroupName">
          <el-input v-model="editForm.ActivityGroupName"></el-input>
        </el-form-item>
        <el-form-item label="所属商圈" prop="TradingareaId">
          <el-select v-model="editForm.TradingareaId" style="width:420px" filterable>
            <el-option
              v-for="item in options"
              :key="item.TradingAreaId"
              :label="item.TradingAreaName"
              :value="item.TradingAreaId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动简介" prop="Descption">
          <el-input type="textarea" v-model="editForm.Descption"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit('editForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  activitygroupList,
  activitygroupAdd,
  tradingareaList,
  activitygroupStatusModify,
  activitygroupModify,
  activitygroupDeleted
} from "api/sheet.js";

export default {
  name: "ActivityList",
  data() {
    return {
      name: "", //活动组名称搜索
      tableData: [],
      TotalCount: 0,
      pageSize: 20,
      currentPage: 1,
      addVisible: false,
      editVisible: false,
      titsup: "添加活动组",
      labelPosition: "right",
      options: [],
      addForm: {
        ActivityGroupName: "",
        TradingareaId: "",
        Descption: ""
      },
      addrules: {
        ActivityGroupName: [
          { required: true, message: "请输入活动组名称", trigger: "blur" }
        ],
        TradingareaId: [
          { required: true, message: "请选择所属商圈", trigger: "change" }
        ],
        Descption: [
          { required: true, message: "请输入活动简介", trigger: "blur" }
        ]
      },
      editForm: {
        ActivityGroupId: "",
        ActivityGroupName: "",
        TradingareaId: "",
        Descption: ""
      },
      editrules: {
        ActivityGroupName: [
          { required: true, message: "请输入活动组名称", trigger: "blur" }
        ],
        TradingareaId: [
          { required: true, message: "请选择所属商圈", trigger: "change" }
        ],
        Descption: [
          { required: true, message: "请输入活动简介", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    _activitygroupList() {
      //列表数据
      const params = {
        Name: this.name,
        Status: 0,
        PageCount: this.pageSize,
        PageIndex: this.currentPage
      };
      activitygroupList(params, 133).then(res => {
        this.tableData = res.List;
        this.TotalCount = res.TotalCount;
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this._activitygroupList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this._activitygroupList();
    },
    search() {
      this.currentPage = 1;
      this._activitygroupList();
    },
    _activitygroupAdd() {
      //增加
      const params = {
        ActivityGroupName: this.addForm.ActivityGroupName,
        ActivityGroupDescription: this.addForm.Descption,
        TradingareaId: this.addForm.TradingareaId
      };
      return activitygroupAdd(params, 134);
    },
    _tradingareaList() {
      //商圈列表
      const params = {
        TradingAreaName: "",
        Status: 1,
        PageCount: 1000,
        PageIndex: 1
      };
      tradingareaList(params, 133).then(res => {
        this.options = res.List;
      });
    },
    add() {
      this.addForm.ActivityGroupName = "";
      this.addForm.TradingareaId = "";
      this.addForm.Descption = "";
      this.addVisible = true;
      this.titsup = "添加活动组";
    },
    //修改商圈状态
    modifyStatus(item) {
      const params = {
        Id: item.ActivityGroupId,
        Status: item.Status
      };
      activitygroupStatusModify(params, 136).then(res => {
        this.$message({
          message: "修改成功",
          showClose: true,
          type: "success"
        });
      });
    },
    //编辑活动组
    _activitygroupModify() {
      const params = {
        TradingareaId: this.editForm.TradingareaId,
        ActivityGroupId: this.editForm.ActivityGroupId,
        ActivityGroupName: this.editForm.ActivityGroupName,
        ActivityGroupDescription: this.editForm.Descption
      };
      return activitygroupModify(params, 135);
    },
    //添加提交
    addSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._activitygroupAdd().then(val => {
            this._activitygroupList();
            this.addVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    //编辑提交
    editSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._activitygroupModify().then(val => {
            this.editVisible = false;
            this._activitygroupList();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    store(item) {
      this.$router.push({
        path: `/Store/${item.ActivityGroupId}`,
        query: {
          // Id: item.ActivityGroupId,
          TradingAreaId: item.TradingareaId
        }
      });
    },
    edit(item) {
      this.editForm.ActivityGroupId = item.ActivityGroupId;
      this.editForm.ActivityGroupName = item.ActivityGroupName;
      this.editForm.TradingareaId = item.TradingareaId;
      this.editForm.Descption = item.Descption;
      this.titsup = "编辑活动组";
      this.editVisible = true;
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
          activitygroupDeleted(params, 137)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this._activitygroupList();
            })
            .catch(error => {
              console.log("error");
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this._activitygroupList();
    this._tradingareaList();
  }
};
</script>

<style scoped lang="less">
.add {
  float: right;
}
</style>
