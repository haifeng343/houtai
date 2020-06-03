<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="任务名称:">
          <el-input v-model="templateName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item class="ml30" label="任务类型:">
          <el-select v-model="taskType" placeholder="请选择任务类型">
            <el-option
              v-for="item in TaskTypeForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
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
          v-if="common.haveRight('AddPopTaskTemplate')"
        >创建任务</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="paymentListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" width="60" label="ID" fixed></el-table-column>
        <el-table-column prop="Name" align="center" width="120" label="任务名称"></el-table-column>
        <el-table-column align="center" width="120" label="任务图标">
          <template slot-scope="scope">
            <img :src="scope.row.IconShow" alt class="popIcon" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="Description" label="任务简介"></el-table-column>
        <el-table-column align="center" label="任务类型">
          <template slot-scope="scope">
            <span>{{scope.row.Type==1?'现金奖励':'其他'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="跳转类型">
          <template slot-scope="scope">
            <span>{{scope.row.ActionType | ActionTypeStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ActionParams" label="跳转参数"></el-table-column>
        <el-table-column align="center" prop="ActionBtnText" label="任务按钮文本"></el-table-column>
        <el-table-column align="center" prop="Amount" label="即刻奖励">
          <template slot-scope="scope">
            <span>{{scope.row.PrizeAmountNow*1.0/100}}元/{{scope.row.PrizeScoreNow}}积分</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="执行奖励">
          <template slot-scope="scope">
            <span>{{scope.row.PrizeAmountFinish*1.0/100}}元/{{scope.row.PrizeScoreFinish}}积分</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="执行卡券奖励">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jumpToTaskTicket(scope.row)"
              :disabled="!common.haveRight('GetTicketTemplateList')"
            >{{scope.row.CardCount}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="临时补贴点数奖励">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showPrizeTempSubsidyRateDialog(scope.row)"
            >{{scope.row.PrizeTempSubsidyRate}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="Description" label="API"></el-table-column>
        <el-table-column align="center" width="140" label="是否有效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyPopTaskTemplateStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" width="140" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="common.haveRight('ModifyPopTaskTemplate')"
            >编辑</el-button>
            <el-button
              type="text"
              class="red"
              @click="deleteTask(scope.row)"
              v-if="common.haveRight('DeletePopTaskTemplate')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建模板 -->
    <el-dialog title="创建任务" :visible.sync="addTaskVisible" width="800px">
      <el-form ref="addTaskForm" :model="addTaskForm" label-width="135px" :rules="addTaskRules">
        <el-form-item label="任务名称:" prop="Name">
          <el-input v-model="addTaskForm.Name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务图标:" prop="IconShow">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :headers="headers"
            name="Pop.Img"
            :show-file-list="false"
            :on-success="handleAvatarSuccess1"
            :before-upload="beforeAvatarUpload1"
          >
            <img v-if="addTaskForm.IconShow" :src="addTaskForm.IconShow" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="任务简介:" prop="Description">
          <el-input
            type="textarea"
            rows="5"
            v-model="addTaskForm.Description"
            placeholder="请输入任务简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务类型:" prop="Type">
          <el-select v-model="addTaskForm.Type" placeholder="请选择任务类型" class="w585">
            <el-option v-for="item in typeForm" :label="item.name" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转类型:" prop="ActionType">
          <el-select v-model="addTaskForm.ActionType" placeholder="请选择点击行为" class="w585">
            <el-option
              v-for="item in ActionTypeForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转参数:">
          <el-input v-model="addTaskForm.ActionParams" placeholder="请输入跳转参数"></el-input>
        </el-form-item>
        <el-form-item label="任务按钮文本:" prop="ActionBtnText">
          <el-input v-model="addTaskForm.ActionBtnText" placeholder="请输入任务按钮文本"></el-input>
        </el-form-item>

        <el-form-item label="即刻奖励:">
          <div class="flex-start">
            <div>奖励</div>
            <el-input class="w160 btwo" v-model="addTaskForm.PrizeAmountNow"></el-input>分
            <el-input class="w160 btwo ml30" v-model="addTaskForm.PrizeScoreNow"></el-input>积分
            <div class="ml30"></div>
          </div>
        </el-form-item>
        <el-form-item label="执行奖励:">
          <div class="flex-start">
            <div>奖励</div>
            <el-input class="w160 btwo" v-model="addTaskForm.PrizeAmountFinish"></el-input>分
            <el-input class="w160 btwo ml30" v-model="addTaskForm.PrizeScoreFinish"></el-input>积分
            <div class="ml30"></div>
          </div>
        </el-form-item>
        <el-form-item label="API:">
          <div class="flex-start">
            <el-select
              v-model="addTaskForm.ExecuteApiId"
              filterable
              default-first-option
              placeholder="请选择Api"
              class="w160"
            >
              <el-option
                v-for="item in popTaskApiList"
                :key="item.Id"
                :label="item.Description"
                :value="item.Id"
              ></el-option>
            </el-select>
            <div class="ml30 flex-start">逻辑代码：</div>
            <el-select v-model="addTaskForm.ExecuteType" placeholder class="w160">
              <el-option
                v-for="item in ExecuteTypeForm"
                :label="item.name"
                :key="item.Id"
                :value="item.Id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTaskVisible = false" size="medium">取 消</el-button>
        <el-button @click="addTask('addTaskForm')" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑任务 -->
    <el-dialog title="编辑任务" :visible.sync="editTaskVisible" width="800px">
      <el-form ref="editTaskForm" :model="editTaskForm" label-width="135px" :rules="editTaskRules">
        <el-form-item label="任务名称:" prop="Name">
          <el-input v-model="editTaskForm.Name" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="任务图标:" prop="IconShow">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :headers="headers"
            name="Pop.Img"
            :show-file-list="false"
            :on-success="handleAvatarSuccess2"
            :before-upload="beforeAvatarUpload1"
          >
            <img v-if="editTaskForm.IconShow" :src="editTaskForm.IconShow" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="任务简介:" prop="Description">
          <el-input
            type="textarea"
            rows="5"
            v-model="editTaskForm.Description"
            placeholder="请输入任务简介"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务类型:" prop="Type">
          <el-select v-model="editTaskForm.Type" placeholder="请选择任务类型" class="w585">
            <el-option v-for="item in typeForm" :label="item.name" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转类型:" prop="ActionType">
          <el-select v-model="editTaskForm.ActionType" placeholder="请选择点击行为" class="w585">
            <el-option
              v-for="item in ActionTypeForm"
              :label="item.name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转参数:">
          <el-input v-model="editTaskForm.ActionParams" placeholder="请输入跳转参数"></el-input>
        </el-form-item>
        <el-form-item label="任务按钮文本:" prop="ActionBtnText">
          <el-input v-model="editTaskForm.ActionBtnText" placeholder="请输入任务按钮文本"></el-input>
        </el-form-item>

        <el-form-item label="即刻奖励:">
          <div class="flex-start">
            <div>奖励</div>
            <el-input class="w160 btwo" v-model="editTaskForm.PrizeAmountNow"></el-input>分
            <el-input class="w160 btwo ml30" v-model="editTaskForm.PrizeScoreNow"></el-input>积分
            <div class="ml30"></div>
          </div>
        </el-form-item>
        <el-form-item label="执行奖励:">
          <div class="flex-start">
            <div>奖励</div>
            <el-input class="w160 btwo" v-model="editTaskForm.PrizeAmountFinish"></el-input>分
            <el-input class="w160 btwo ml30" v-model="editTaskForm.PrizeScoreFinish"></el-input>积分
            <div class="ml30"></div>
          </div>
        </el-form-item>
        <el-form-item label="API:">
          <div class="flex-start">
            <el-select
              v-model="editTaskForm.ExecuteApiId"
              filterable
              default-first-option
              placeholder="请选择Api"
              class="w160"
            >
              <el-option
                v-for="item in popTaskApiList"
                :key="item.Id"
                :label="item.Description"
                :value="item.Id"
              ></el-option>
            </el-select>
            <div class="ml30 flex-start">逻辑代码：</div>
            <el-select v-model="editTaskForm.ExecuteType" placeholder class="w160">
              <el-option
                v-for="item in ExecuteTypeForm"
                :label="item.name"
                :key="item.Id"
                :value="item.Id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTaskVisible = false" size="medium">取 消</el-button>
        <el-button @click="editTask('editTaskForm')" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑临时补贴点数 -->
    <el-dialog title="编辑临时补贴点数" :visible.sync="prizeTempSubsidyRateVisible" width="530px">
      <el-form ref="prizeTempSubsidyRateForm" :model="prizeTempSubsidyRateForm" label-width="135px">
        <el-form-item label="临时补贴点数奖励(1/万):" prop="rate">
          <el-input v-model="prizeTempSubsidyRateForm.rate" placeholder="请输入临时补贴点数奖励"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="prizeTempSubsidyRateVisible = false" size="medium">取 消</el-button>
        <el-button @click="prizeTempSubsidyRateOk()" type="primary" size="medium">确 定</el-button>
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
  popTaskTemplateList,
  popTaskTemplateApiList,
  popTaskTemplateStatusModify,
  popTaskTemplateAdd,
  popTaskTemplateDelete,
  popTaskTemplateModify,
  ModifyPopTaskTemplateTempRate
} from "api/pop.js";
export default {
  name: "PaymentLog",
  data() {
    return {
      Id: "",
      templateName: "", //模板名称
      popTaskApiList: [], //api列表
      searchTime: "", //创建时间
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      paymentListTable: [], //列表
      taskType: 0, //0全部 1现金奖励券
      TaskTypeForm: [
        {
          Id: 0,
          name: "全部"
        },
        {
          Id: 1,
          name: "现金奖励"
        }
      ],
      typeForm: [
        {
          Id: 1,
          name: "现金奖励券"
        }
      ],
      ActionTypeForm: [
        //点击行为
        {
          Id: 0,
          name: "无行为"
        },
        {
          Id: 1,
          name: "本地跳转"
        },
        {
          Id: 2,
          name: "url跳转"
        },
        {
          Id: 3,
          name: "执行本地代码"
        },
        {
          Id: 4,
          name: "客服跳转"
        }
      ],
      ExecuteTypeForm: [
        //执行类型1.全部执行 2.执行最先的一条
        {
          Id: 1,
          name: "并发执行"
        },
        {
          Id: 2,
          name: "排队执行（时间优先）"
        }
      ],
      addTaskVisible: false, //创建弹窗
      addTaskRules: {
        Name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        ActionParams: [
          { required: true, message: "请输入跳转参数", trigger: "blur" }
        ],
        Description: [
          { required: true, message: "请输入简介", trigger: "blur" }
        ],
        ActionBtnText: [
          { required: true, message: "请输入按钮文本", trigger: "blur" }
        ],
        IconShow: [
          { required: true, message: "请选择图片", trigger: "change" }
        ],
        Type: [
          { required: true, message: "请选择任务类型", trigger: "change" }
        ],
        ActionType: [
          { required: true, message: "请选择跳转类型", trigger: "change" }
        ]
      },
      addTaskForm: {
        //弹窗form
        Name: "",
        IconShow: "",
        ImgPath: "",
        Description: "",
        Type: "",
        ActionType: "",
        ActionParams: "",
        ActionBtnText: "",
        PrizeAmountNow: "",
        PrizeScoreNow: "",
        PrizeAmountFinish: "",
        PrizeScoreFinish: "",
        ExecuteApiId: "",
        ExecuteType: ""
      },

      editTaskVisible: false, //编辑任务
      editTaskRules: {
        Name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        ActionParams: [
          { required: true, message: "请输入跳转参数", trigger: "blur" }
        ],
        Description: [
          { required: true, message: "请输入简介", trigger: "blur" }
        ],
        ActionBtnText: [
          { required: true, message: "请输入按钮文本", trigger: "blur" }
        ],
        IconShow: [
          { required: true, message: "请选择图片", trigger: "change" }
        ],
        Type: [
          { required: true, message: "请选择任务类型", trigger: "change" }
        ],
        ActionType: [
          { required: true, message: "请选择跳转类型", trigger: "change" }
        ]
      },
      editTaskForm: {
        Name: "",
        Icon: "",
        ImgPath: "",
        Description: "",
        Type: "",
        ActionType: "",
        ActionParams: "",
        ActionBtnText: "",
        PrizeAmountNow: "",
        PrizeScoreNow: "",
        PrizeAmountFinish: "",
        PrizeScoreFinish: "",
        ExecuteApiId: "",
        ExecuteType: ""
      },
      prizeTempSubsidyRateVisible: false,
      prizeTempSubsidyRateForm: {
        id: "",
        rate: ""
      }
    };
  },
  created() {
    this._popTaskTemplateList();
  },
  computed: {
    headers() {
      let token = localStorage.getItem("userToken");
      let obj = {
        userToken: token
      };
      return obj;
    }
  },
  filters: {
    ActionTypeStatus(param) {
      switch (param) {
        case 0:
          return "无行为";
        case 1:
          return "本地跳转";
        case 2:
          return "url跳转";
        case 3:
          return "执行本地代码";
        case 4:
          return "客服跳转";
      }
    }
  },
  methods: {
    //跳转到执行卡券奖励界面
    jumpToTaskTicket(item) {
      this.$router.push({
        path: `/TaskTicket/${item.Id}`,
        query: {
          name: item.Name
        }
      });
    },
    //获取API列表
    _popTaskTemplateApiList(rightId) {
      var par = {
        StartTime: "",
        EndTime: "",
        PageIndex: 1,
        PageCount: 100,
        Status: 1
      };
      return popTaskTemplateApiList(par, rightId).then(res => {
        this.popTaskApiList = res.List;
      });
    },
    showApi() {
      this._popTaskTemplateApiList();
    },
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._popTaskTemplateList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._popTaskTemplateList();
    },
    //创建任务
    add() {
      this.addTaskVisible = true;
      this._popTaskTemplateApiList(268);
      this.addTaskForm = {
        Name: "",
        IconShow: "",
        Icon: "",
        Description: "",
        Type: "",
        ActionType: "",
        ActionParams: "",
        ActionBtnText: "",
        PrizeAmountNow: "",
        PrizeScoreNow: "",
        PrizeAmountFinish: "",
        PrizeScoreFinish: "",
        ExecuteApiId: "",
        ExecuteType: ""
      };
    },

    //确定添加
    addTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popTaskTemplateAdd();
          this.$refs[formName].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    _popTaskTemplateAdd() {
      var par = {
        Name: this.addTaskForm.Name,
        Description: this.addTaskForm.Description,
        Icon: this.addTaskForm.Icon,
        Type: this.addTaskForm.Type,
        ActionType: this.addTaskForm.ActionType,
        ActionParams: this.addTaskForm.ActionParams,
        ActionBtnText: this.addTaskForm.ActionBtnText,
        PrizeAmountNow: this.addTaskForm.PrizeAmountNow,
        PrizeScoreNow: this.addTaskForm.PrizeScoreNow,
        PrizeAmountFinish: this.addTaskForm.PrizeAmountFinish,
        PrizeScoreFinish: this.addTaskForm.PrizeScoreFinish,
        ExecuteApiId: this.addTaskForm.ExecuteApiId,
        ExecuteType: this.addTaskForm.ExecuteType
      };
      popTaskTemplateAdd(par, 268).then(res => {
        this._popTaskTemplateList();
        this.addTaskVisible = false;
      });
    },
    //上传图片
    handleAvatarSuccess1(res, file) {
      this.addTaskForm.IconShow = res.Data.ImgUrl;
      this.addTaskForm.Icon = res.Data.ImgPath;
    },
    handleAvatarSuccess2(res, file) {
      this.editTaskForm.IconShow = res.Data.ImgUrl;
      this.editTaskForm.Icon = res.Data.ImgPath;
    },
    beforeAvatarUpload1(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //编辑任务
    edit(item) {
      this.Id = item.Id;
      this.editTaskVisible = true;
      this._popTaskTemplateApiList(269);
      this.editTaskForm = Object.assign(item);
      console.log(item);
    },
    //确定修改
    editTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popTaskTemplateModify();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    _popTaskTemplateModify() {
      var par = {
        Id: this.Id,
        Name: this.editTaskForm.Name,
        Description: this.editTaskForm.Description,
        Icon: this.editTaskForm.Icon,
        Type: this.editTaskForm.Type,
        ActionType: this.editTaskForm.ActionType,
        ActionParams: this.editTaskForm.ActionParams,
        ActionBtnText: this.editTaskForm.ActionBtnText,
        PrizeAmountNow: this.editTaskForm.PrizeAmountNow,
        PrizeScoreNow: this.editTaskForm.PrizeScoreNow,
        PrizeAmountFinish: this.editTaskForm.PrizeAmountFinish,
        PrizeScoreFinish: this.editTaskForm.PrizeScoreFinish,
        ExecuteApiId: this.editTaskForm.ExecuteApiId,
        ExecuteType: this.editTaskForm.ExecuteType
      };
      popTaskTemplateModify(par, 269).then(res => {
        this._popTaskTemplateList();
        this.editTaskVisible = false;
      });
    },
    //修改是否有效
    changeStatus(status, item) {
      this._popTaskTemplateStatusModify(item.Id, status);
    },
    _popTaskTemplateStatusModify(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return popTaskTemplateStatusModify(par, 271);
    },
    //上传图片
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //获取列表
    _popTaskTemplateList() {
      var par = {
        TemplateName: this.templateName,
        TaskType: this.taskType,
        Status: 0,
        StartTime: this.searchTime != null ? this.searchTime[0] : "",
        EndTime: this.searchTime != null ? this.searchTime[1] : "",
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return popTaskTemplateList(par, 266).then(res => {
        this.paymentListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //删除
    deleteTask(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._delete(item.Id).then(val => {
            this._popTaskTemplateList();
          });
        })
        .catch(() => {});
    },
    //删除
    _delete(id) {
      var par = {
        Id: id
      };
      return popTaskTemplateDelete(par, 270);
    },
    showPrizeTempSubsidyRateDialog(item) {
      this.prizeTempSubsidyRateForm.id = item.Id;
      this.prizeTempSubsidyRateForm.rate = item.PrizeTempSubsidyRate;
      this.prizeTempSubsidyRateVisible = true;
    },
    prizeTempSubsidyRateOk() {
      this._modifyPopTaskTemplateTempRate().then(val => {
        this._popTaskTemplateList();
        this.prizeTempSubsidyRateVisible = false;
      });
    },

    //编辑任务临时补贴点数奖励
    _modifyPopTaskTemplateTempRate() {
      var par = {
        Id: this.prizeTempSubsidyRateForm.id,
        PrizeTempSubsidyRate: this.prizeTempSubsidyRateForm.rate
      };
      return ModifyPopTaskTemplateTempRate(par);
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
.btwo {
  margin: 0 10px;
}
.addClose {
  margin: 0 20px 0 30px;
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
.avatar {
  width: 178px;
  height: 178px;
}
.popIcon {
  width: 34px;
  height: 34px;
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
