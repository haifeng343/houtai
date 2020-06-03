<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="规则名称:">
          <el-input v-model="receiveName" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item class="ml30" label="创建时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          class="Popadd"
          type="primary"
          @click="add()"
          v-if="common.haveRight('AddPopTask')"
        >创建领取规则</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="Name" align="center" width="120" label="规则名称"></el-table-column>
        <el-table-column align="center" prop="ReceiveToken" label="规则标识"></el-table-column>
        <el-table-column align="center" prop="CheckType" label="设备标识">
          <template
            slot-scope="scope"
          >{{scope.row.CheckType==0?"每设备每账号":scope.row.CheckType==1?"每设备":"每账号"}}</template>
        </el-table-column>
        <el-table-column align="center" prop="CircleType" label="日期类型">
          <template slot-scope="scope">{{scope.row.CircleType==1?"天":"月"}}</template>
        </el-table-column>
        <el-table-column align="center" prop="CircleCount" label="单期次数"></el-table-column>
        <el-table-column align="center" prop="TotalCount" label="总次数"></el-table-column>
        <el-table-column align="center" label="领取类型">
          <template slot-scope="scope">{{scope.row.ReceiveType==1?"手动领取":"自动领取"}}</template>
        </el-table-column>
        <el-table-column align="center" prop="Amount" label="规则有效期">
          <template slot-scope="scope">{{scope.row.StartTime+"~"+scope.row.EndTime}}</template>
        </el-table-column>
        <el-table-column align="center" prop="Amount" label="任务有效期">
          <template
            slot-scope="scope"
          >{{scope.row.ExecuteType==1?scope.row.ExecuteStartTime+"~"+scope.row.ExecuteEndTime:"有效期"+scope.row.ExecuteSecond+"秒"}}</template>
        </el-table-column>
        <el-table-column align="center" width="140" label="是否有效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyPopTaskStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" width="140" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" width="160" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jumpToTaskTemplateList(scope.row)"
              v-if="common.haveRight('GetPopTaskTemplateBindList')"
            >任务列表</el-button>
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="common.haveRight('ModifyPopTask')"
            >编辑</el-button>
            <el-button
              type="text"
              class="red"
              @click="taskDelete(scope.row)"
              v-if="common.haveRight('DeletePopTask')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建弹窗 -->
    <el-dialog title="创建领取规则" :visible.sync="addTaskVisible" width="800px">
      <el-form ref="addTaskForm" :model="addTaskForm" label-width="135px" :rules="taskRules">
        <el-form-item label="规则名称:" prop="name">
          <el-input v-model="addTaskForm.name" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="规则标识:" prop="Identification">
          <el-input v-model="addTaskForm.Identification" placeholder="请输入规则标识" disabled class="w80"></el-input>
          <el-button size="medium" class="ml15" @click="createGuid(1)">生成标识</el-button>
        </el-form-item>
        <el-form-item label="限制类型:" prop="CheckType">
          <el-select v-model="addTaskForm.CheckType" placeholder="请选择限制类型" class="w585">
            <el-option
              v-for="item in CheckTypeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期类型:" prop="CircleType">
          <el-select v-model="addTaskForm.CircleType" placeholder="请选择日期类型" class="w585">
            <el-option label="天" value="1" key="1"></el-option>
            <el-option label="月" value="2" key="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单期次数:" prop="CycleCount">
          <el-input v-model="addTaskForm.CycleCount" placeholder="-1表示不限周期"></el-input>
        </el-form-item>
        <el-form-item label="总次数:" prop="TotalCount">
          <el-input v-model="addTaskForm.TotalCount" placeholder="-1表示不限次数"></el-input>
        </el-form-item>
        <el-form-item label="领取类型:">
          <el-select v-model="addTaskForm.ReceiveType" placeholder="请选择">
            <el-option
              v-for="item in ReceiveTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="addTaskForm.BindApiId"
            placeholder="请选择"
            v-if="addTaskForm.ReceiveType==2"
            filterable
          >
            <el-option
              v-for="item in allUrlList"
              :key="item.Id"
              :label="item.Description"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取有效时间:">
          <div class="flex-start">
            <div>开始时间：</div>
            <el-date-picker
              v-model="addTaskForm.begin"
              class="w160"
              type="datetime"
              placeholder="选择开始时间"
            ></el-date-picker>
            <div class="ml30">结束时间：</div>
            <el-date-picker
              v-model="addTaskForm.end"
              class="w160"
              type="datetime"
              placeholder="选择结束时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="任务有效时间:">
          <el-radio v-model="addTaskForm.ExecuteType" :label="1">绝对时间</el-radio>
          <el-radio v-model="addTaskForm.ExecuteType" :label="2">相对时间</el-radio>
          <div v-if="addTaskForm.ExecuteType==2">
            有效期限(秒)：
            <el-input v-model="addTaskForm.ExecuteSecond" style="width:200px;"></el-input>
          </div>
          <div class="flex-start" v-if="addTaskForm.ExecuteType==1">
            <div>开始时间：</div>
            <el-date-picker
              v-model="addTaskForm.ExecuteStartTime"
              class="w160"
              type="datetime"
              placeholder="选择开始时间"
            ></el-date-picker>
            <div class="ml30">结束时间：</div>
            <el-date-picker
              v-model="addTaskForm.ExecuteEndTime"
              class="w160"
              type="datetime"
              placeholder="选择结束时间"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <el-checkbox v-model="addTaskForm.TaskFinish" style="margin-left:64px;">任务完成后继续</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTaskVisible = false" size="medium">取 消</el-button>
        <el-button @click="addTaskOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑任务弹窗 -->
    <el-dialog title="编辑领取规则" :visible.sync="editTaskVisible" width="800px">
      <el-form ref="editTaskForm" :model="editTaskForm" label-width="135px" :rules="taskRules">
        <el-form-item label="规则名称:" prop="name">
          <el-input v-model="editTaskForm.name" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="规则标识:" prop="device">
          <el-input
            v-model="editTaskForm.Identification"
            placeholder="请输入规则标识"
            disabled
            class="w80"
          ></el-input>
          <el-button size="medium" class="ml15" @click="createGuid(2)">生成标识</el-button>
        </el-form-item>
        <el-form-item label="限制类型:" prop="CheckType">
          <el-select v-model="editTaskForm.CheckType" placeholder="请选择限制类型" class="w585">
            <el-option
              v-for="item in CheckTypeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期类型:" prop="CircleType">
          <el-select v-model="editTaskForm.CircleType" placeholder="请选择日期类型" class="w585">
            <el-option label="天" value="1"></el-option>
            <el-option label="月" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单期次数:" prop="CycleCount">
          <el-input v-model="editTaskForm.CycleCount" placeholder="-1表示不限周期"></el-input>
        </el-form-item>
        <el-form-item label="总次数:" prop="TotalCount">
          <el-input v-model="editTaskForm.TotalCount" placeholder="-1表示不限次数"></el-input>
        </el-form-item>
        <el-form-item label="领取类型:">
          <el-select v-model="editTaskForm.ReceiveType" placeholder="请选择">
            <el-option
              v-for="item in ReceiveTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-select
            v-model="editTaskForm.BindApiId"
            placeholder="请选择"
            v-if="editTaskForm.ReceiveType==2"
            filterable
          >
            <el-option
              v-for="item in allUrlList"
              :key="item.Id"
              :label="item.Description"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取有效时间:">
          <div class="flex-start">
            <div>开始时间：</div>
            <el-date-picker
              v-model="editTaskForm.begin"
              class="w160"
              type="datetime"
              placeholder="选择开始时间"
            ></el-date-picker>
            <div class="ml30">结束时间：</div>
            <el-date-picker
              v-model="editTaskForm.end"
              class="w160"
              type="datetime"
              placeholder="选择结束时间"
            ></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="任务有效时间:">
          <el-radio v-model="editTaskForm.ExecuteType" :label="1">绝对时间</el-radio>
          <el-radio v-model="editTaskForm.ExecuteType" :label="2">相对时间</el-radio>
          <div v-if="editTaskForm.ExecuteType==2">
            有效期限(秒)：
            <el-input v-model="editTaskForm.ExecuteSecond" style="width:200px;"></el-input>
          </div>
          <div class="flex-start" v-if="editTaskForm.ExecuteType==1">
            <div>开始时间：</div>
            <el-date-picker
              v-model="editTaskForm.ExecuteStartTime"
              class="w160"
              type="datetime"
              placeholder="选择开始时间"
            ></el-date-picker>
            <div class="ml30">结束时间：</div>
            <el-date-picker
              v-model="editTaskForm.ExecuteEndTime"
              class="w160"
              type="datetime"
              placeholder="选择结束时间"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <el-checkbox v-model="editTaskForm.TaskFinish" style="margin-left:64px;">任务完成后继续</el-checkbox>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTaskVisible = false" size="medium">取 消</el-button>
        <el-button @click="editTask('editTaskForm')" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

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
  popTaskList,
  AddPopTask,
  ModifyPopTask,
  DeletePopTask,
  ModifyPopTaskStatus,
  popTaskTemplateApiList
} from "api/pop.js";
export default {
  name: "PaymentLog",
  data() {
    return {
      allUrlList: [],
      ReceiveTypeList: [
        { id: 1, name: "手动领取" },
        { id: 2, name: "自动领取" }
      ],
      receiveName: "", //业务名称
      searchTime: "", //创建时间
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //列表

      CheckTypeList: [
        { id: 0, name: "每设备每账户" },
        { id: 1, name: "每设备" },
        { id: 2, name: "每账户" }
      ],

      addTaskVisible: false, //创建弹窗
      taskRules: {
        name: [{ required: true, message: "请输入业务名称", trigger: "blur" }],
        Identification: [
          { required: true, message: "请输入业务标识", trigger: "blur" }
        ],
        CycleCount: [
          { required: true, message: "请输入单期次数", trigger: "blur" }
        ],
        TotalCount: [
          { required: true, message: "请输入总次数", trigger: "blur" }
        ]
      },
      addTaskForm: {
        //弹窗form
        name: "",
        Identification: "",
        CheckType: 0,
        CircleType: "1",
        CycleCount: "",
        TotalCount: "",
        begin: "",
        end: "",
        TaskFinish: "",
        ExecuteType: 1,
        ExecuteSecond: "",
        ExecuteStartTime: "",
        ExecuteEndTime: "",
        ReceiveType: 1,
        BindApiId: ""
      },

      editTaskVisible: false, //编辑任务
      editTaskRules: {},
      editTaskForm: {
        id: "",
        name: "",
        Identification: "",
        CheckType: 0,
        CircleType: "1",
        CycleCount: "",
        TotalCount: "",
        begin: "",
        end: "",
        TaskFinish: "",
        ExecuteType: 1,
        ExecuteSecond: "",
        ExecuteStartTime: "",
        ExecuteEndTime: "",
        ReceiveType: 1,
        BindApiId: ""
      }
    };
  },
  created() {
    this._getPopTaskList();
  },
  methods: {
    jumpToTaskTemplateList(item) {
      this.$router.push({
        path: `/PopTaskTemplateList/${item.Id}`,
        query: {
          name: item.Name
        }
      });
    },
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getPopTaskList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getPopTaskList();
    },
    //创建任务
    add() {
      this._getPopTaskTemplateApiList(259);
      this.addTaskForm.name = "";
      this.addTaskForm.Identification = "";
      this.addTaskForm.CheckType = 0;
      this.addTaskForm.CircleType = "1";
      this.addTaskForm.CycleCount = "";
      this.addTaskForm.TotalCount = "";
      this.addTaskForm.begin = "";
      this.addTaskForm.end = "";
      this.addTaskForm.TaskFinish = "";
      this.addTaskForm.ExecuteType = 1;
      this.addTaskForm.ExecuteSecond = "";
      this.addTaskForm.ExecuteStartTime = "";
      this.addTaskForm.ExecuteEndTime = "";
      this.addTaskForm.ReceiveType = 1;
      this.addTaskForm.BindApiId = "";
      this.addTaskVisible = true;
    },

    //确定添加
    addTaskOk(formName) {
      this.$refs["addTaskForm"].validate(valid => {
        if (valid) {
          this._addPopTask().then(val => {
            this.pageIndex = 1;
            this._getPopTaskList();
            this.addTaskVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //编辑任务
    edit(item) {
      this._getPopTaskTemplateApiList(260);
      this.editTaskForm.id = item.Id;
      this.editTaskForm.name = item.Name;
      this.editTaskForm.Identification = item.ReceiveToken;
      this.editTaskForm.CheckType = item.CheckType;
      this.editTaskForm.CircleType = item.CircleType;
      this.editTaskForm.CycleCount = item.CircleCount;
      this.editTaskForm.TotalCount = item.TotalCount;
      this.editTaskForm.begin = item.StartTime;
      this.editTaskForm.end = item.EndTime;
      this.editTaskForm.TaskFinish = item.TaskFinish;
      this.editTaskForm.ExecuteType = item.ExecuteType;
      this.editTaskForm.ExecuteSecond = item.ExecuteSecond;
      this.editTaskForm.ExecuteStartTime = item.ExecuteStartTime;
      this.editTaskForm.ExecuteEndTime = item.ExecuteEndTime;
      this.editTaskForm.ReceiveType = item.ReceiveType;
      this.editTaskForm.BindApiId = item.BindApiId == 0 ? "" : item.BindApiId;
      this.editTaskVisible = true;
    },
    //确定修改
    editTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._modifyPopTask().then(val => {
            this._getPopTaskList();
            this.editTaskVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    taskDelete(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deletePopTask(item.Id).then(val => {
            this._getPopTaskList();
          });
        })
        .catch(() => {});
    },

    //修改是否有效
    changeStatus(status, item) {
      this._modifyPopTaskStatus(item.Id, status);
    },
    //生成唯一guid
    createGuid(type) {
      let guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );

      if (type == 1) {
        this.addTaskForm.Identification = guid;
      } else {
        this.editTaskForm.Identification = guid;
      }
    },
    //获取任务列表
    _getPopTaskList() {
      var par = {
        TaskName: this.receiveName,
        StartTime: this.searchTime == null ? "" : this.searchTime[0],
        EndTime: this.searchTime == null ? "" : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return popTaskList(par, 258).then(res => {
        console.log(res);
        this.pageTotalCount = res.TotalCount;
        this.listTable = res.List;
      });
    },
    //创建任务
    _addPopTask() {
      var par = {
        Name: this.addTaskForm.name,
        ReceiveToken: this.addTaskForm.Identification,
        CheckType: this.addTaskForm.CheckType,
        CircleType: this.addTaskForm.CircleType,
        CircleCount: this.addTaskForm.CycleCount,
        TotalCount: this.addTaskForm.TotalCount,
        ReceiveType: this.addTaskForm.ReceiveType,
        BindApiId:
          this.addTaskForm.ReceiveType == 1 ? 0 : this.addTaskForm.BindApiId,
        TaskFinish: this.addTaskForm.TaskFinish,
        StartTime: this.addTaskForm.begin,
        EndTime: this.addTaskForm.end,
        ExecuteType: this.addTaskForm.ExecuteType,
        ExecuteSecond:
          this.addTaskForm.ExecuteType == 2
            ? this.addTaskForm.ExecuteSecond
            : 0,
        ExecuteStartTime:
          this.addTaskForm.ExecuteType == 1
            ? this.addTaskForm.ExecuteStartTime
            : null,
        ExecuteEndTime:
          this.addTaskForm.ExecuteType == 1
            ? this.addTaskForm.ExecuteEndTime
            : null
      };
      return AddPopTask(par, 259);
    },
    //编辑任务
    _modifyPopTask() {
      var par = {
        Id: this.editTaskForm.id,
        Name: this.editTaskForm.name,
        ReceiveToken: this.editTaskForm.Identification,
        CheckType: this.editTaskForm.CheckType,
        CircleType: this.editTaskForm.CircleType,
        CircleCount: this.editTaskForm.CycleCount,
        TotalCount: this.editTaskForm.TotalCount,
        ReceiveType: this.editTaskForm.ReceiveType,
        BindApiId:
          this.editTaskForm.ReceiveType == 1 ? 0 : this.editTaskForm.BindApiId,
        TaskFinish: this.editTaskForm.TaskFinish,
        StartTime: this.editTaskForm.begin,
        EndTime: this.editTaskForm.end,
        ExecuteType: this.editTaskForm.ExecuteType,
        ExecuteSecond:
          this.editTaskForm.ExecuteType == 2
            ? this.editTaskForm.ExecuteSecond
            : 0,
        ExecuteStartTime:
          this.editTaskForm.ExecuteType == 1
            ? this.editTaskForm.ExecuteStartTime
            : null,
        ExecuteEndTime:
          this.editTaskForm.ExecuteType == 1
            ? this.editTaskForm.ExecuteEndTime
            : null
      };
      return ModifyPopTask(par, 260);
    },
    //删除任务
    _deletePopTask(id) {
      var par = {
        Id: id
      };
      return DeletePopTask(par, 261);
    },
    //修改任务状态
    _modifyPopTaskStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyPopTaskStatus(par, 262);
    },
    //获取所有支持的api
    _getPopTaskTemplateApiList(rightId) {
      var par = {
        PageIndex: 1,
        PageCount: 500
      };
      return popTaskTemplateApiList(par, rightId).then(res => {
        this.allUrlList = res.List;
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
.addBorder {
  display: flex;
  justify-content: flex-start;
}
.addClose {
  margin: 0 20px 0 30px;
}
.w80 {
  width: 80%;
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
.ml15 {
  margin-left: 15px;
}
.ml30 {
  margin-left: 53px;
}
</style>
