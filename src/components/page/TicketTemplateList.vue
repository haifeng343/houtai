<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="模板名称:">
          <el-input v-model="ticketTemplateName" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          style="float:right;margin-bottom:10px;"
          type="primary"
          @click="add()"
          v-if="common.haveRight('AddTicketTemplate')"
        >创建模板</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TicketTemplateName" align="center" label="模板名称"></el-table-column>
        <el-table-column align="center" label="生成规则">
          <template slot-scope="scope">
            <span>{{scope.row.CreateRules==1?"固定商家":scope.row.CreateRules==2?"固定门店":"不限"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="TicketIdentification" align="center" label="卡券标识"></el-table-column>
        <el-table-column prop="TotalCount" align="center" label="总数量"></el-table-column>
        <el-table-column align="center" label="有效期">
          <template slot-scope="scope">
            <span
              v-if="scope.row.ExpireType==1"
            >{{scope.row.ExpireStartTime}}~{{scope.row.ExpireEndTime}}</span>
            <span v-if="scope.row.ExpireType==2">{{scope.row.ExpireSecond}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="使用范围">
          <template
            slot-scope="scope"
          >{{scope.row.UseRange==1?"商家":scope.row.UseRange==2?"门店":"全场通用"}}</template>
        </el-table-column>
        <el-table-column align="center" label="是否有效" width="140px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyTicketTemplateStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="120px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="common.haveRight('ModifyTicketTemplate')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleted(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteTicketTemplate')"
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
        @current-change="listCurrentChange"
      ></el-pagination>
    </div>
    <!-- 创建模板 -->
    <el-dialog title="创建模板" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="140px" :rules="rules">
        <el-form-item label="模板名称:" prop="TicketTemplateName">
          <el-input v-model="addForm.TicketTemplateName" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="生成规则:" prop="CreateRules">
          <el-select v-model="addForm.CreateRules" placeholder="请选择生成规则" style="width:413px;">
            <el-option
              v-for="item in createRulesList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券标识:" prop="TicketIdentification">
          <el-input v-model="addForm.TicketIdentification" placeholder="请输入卡券标识"></el-input>
        </el-form-item>
        <el-form-item label="总数量:" prop="TotalCount">
          <el-input v-model="addForm.TotalCount" placeholder="-1表示不限数量"></el-input>
        </el-form-item>
        <el-form-item label="使用有效期类型:" prop="ExpireType">
          <el-select v-model="addForm.ExpireType" placeholder="请选择使用有效期类型" style="width:413px;">
            <el-option
              v-for="item in ExpireList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期:" prop="Time" v-if="addForm.ExpireType==1">
          <el-date-picker
            v-model="addForm.Time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="有效期(秒):" prop="ExpireSecond" v-if="addForm.ExpireType==2">
          <el-input v-model="addForm.ExpireSecond" placeholder></el-input>
        </el-form-item>
        <el-form-item label="使用范围:" prop="UseRange">
          <el-select
            v-model="addForm.UseRange"
            placeholder="请选择使用范围"
            @change="useRangeChange($event,1)"
            style="width:413px;"
          >
            <el-option
              v-for="item in useRangeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主体标识:" prop="ContextIdList">
          <el-select
            v-model="addForm.ContextIdList"
            filterable
            multiple
            placeholder="请选择主体标识"
            style="width:413px;"
            :disabled="addForm.UseRange!=1&&addForm.UseRange!=2"
          >
            <el-option
              v-for="item in contextList"
              :label="item.Name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑模板 -->
    <el-dialog title="编辑模板" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="140px" :rules="rules">
        <el-form-item label="模板名称:" prop="TicketTemplateName">
          <el-input v-model="editForm.TicketTemplateName" placeholder="请输入模板名称"></el-input>
        </el-form-item>
        <el-form-item label="生成规则:" prop="CreateRules">
          <el-select v-model="editForm.CreateRules" placeholder="请选择生成规则" style="width:413px;">
            <el-option
              v-for="item in createRulesList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券标识:" prop="TicketIdentification">
          <el-input v-model="editForm.TicketIdentification" placeholder="请输入卡券标识"></el-input>
        </el-form-item>
        <el-form-item label="总数量:" prop="TotalCount">
          <el-input v-model="editForm.TotalCount" placeholder="-1表示不限数量"></el-input>
        </el-form-item>
        <el-form-item label="使用有效期类型:" prop="ExpireType">
          <el-select v-model="editForm.ExpireType" placeholder="请选择使用有效期类型" style="width:413px;">
            <el-option
              v-for="item in ExpireList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期:" prop="Time" v-if="editForm.ExpireType==1">
          <el-date-picker
            v-model="editForm.Time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="有效期(秒):" prop="ExpireSecond" v-if="editForm.ExpireType==2">
          <el-input v-model="editForm.ExpireSecond" placeholder></el-input>
        </el-form-item>
        <el-form-item label="使用范围:" prop="UseRange">
          <el-select
            v-model="editForm.UseRange"
            placeholder="请选择使用范围"
            @change="useRangeChange($event,2)"
            style="width:413px;"
          >
            <el-option
              v-for="item in useRangeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主体标识:" prop="ContextIdList">
          <el-select
            v-model="editForm.ContextIdList"
            filterable
            multiple
            placeholder="请选择主体标识"
            style="width:413px;"
            :disabled="editForm.UseRange!=1&&editForm.UseRange!=2"
          >
            <el-option
              v-for="item in contextList"
              :label="item.Name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" size="medium">取 消</el-button>
        <el-button @click="editOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetTicketTemplateList,
  AddTicketTemplate,
  ModifyTicketTemplate,
  DeleteTicketTemplate,
  ModifyTicketTemplateStatus,
  GetTicketTypeList
} from "api/ticket.js";
import {
  GetSellerStoreList,
  GetSellerList,
  GetSellerItemList
} from "api/seller.js";
export default {
  name: "TicketTemplateList",
  data() {
    return {
      //生成规则列表
      createRulesList: [
        { id: 1, name: "固定商家" },
        { id: 2, name: "固定门店" },
        { id: 3, name: "不限" }
      ],
      //卡券使用有效期类型
      ExpireList: [{ id: 1, name: "绝对时间" }, { id: 2, name: "相对时间" }],
      //使用范围
      useRangeList: [
        { id: 1, name: "商家" },
        { id: 2, name: "门店" },
        { id: 3, name: "全场通用" }
      ],

      ticketTemplateName: "", //卡券模板名称搜索
      ticketTypeList: [],
      ticketTypeNoAllList: [],
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //列表
      contextList: [], //主体标识
      rules: {
        TicketTemplateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ],
        CreateRules: [
          { required: true, message: "请选择生成规则", trigger: "blur" }
        ],
        TicketIdentification: [
          { required: true, message: "请输入卡券标识", trigger: "blur" }
        ],
        TotalCount: [
          { required: true, message: "请输入总数量", trigger: "blur" }
        ],
        ExpireType: [
          { required: true, message: "请输入有效期", trigger: "blur" }
        ],
        UseRange: [
          { required: true, message: "请选择使用范围", trigger: "blur" }
        ]
      },
      addVisible: false,
      addForm: {
        TicketTemplateName: "",
        CreateRules: "",
        TicketIdentification: "",
        TotalCount: "",
        ExpireType: "",
        ExpireSecond: "",
        Time: [],
        UseRange: "",
        ContextIdList: []
      },
      editVisible: false,
      editForm: {
        Id: "",
        TicketTemplateName: "",
        CreateRules: "",
        TicketIdentification: "",
        TotalCount: "",
        ExpireType: "",
        ExpireSecond: "",
        Time: [],
        UseRange: "",
        ContextIdList: []
      }
    };
  },
  created() {
    this._getTicketTemplateList();
    this._getTicketTypeList();
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
  methods: {
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getTicketTemplateList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getTicketTemplateList();
    },
    add() {
      this.addVisible = true;
      if (this.$refs["addForm"]) {
        this.$refs["addForm"].resetFields();
      }
      this.addForm.ExpireType = 1;
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addTicketTemplate().then(val => {
            this._getTicketTemplateList();
            this.addVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    edit(item) {
      this.editForm.Id = item.Id;
      this.editForm.TicketTemplateName = item.TicketTemplateName;
      this.editForm.CreateRules = item.CreateRules;
      this.editForm.TicketIdentification = item.TicketIdentification;
      this.editForm.TotalCount = item.TotalCount;
      this.editForm.ExpireType = item.ExpireType;
      this.editForm.ExpireSecond = item.ExpireSecond;
      this.editForm.Time = [item.ExpireStartTime, item.ExpireEndTime];
      this.editForm.UseRange = item.UseRange;
      this.editForm.ContextIdList = item.ContextIdList;
      if (item.UseRange == 1) {
        //商家
        this._getSellerList(297);
      } else if (item.UseRange == 2) {
        this._getSellerStoreList(297);
        //门店
      }
      this.editVisible = true;
    },

    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyTicketTemplate().then(val => {
            this._getTicketTemplateList();
            this.editVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    //使用范围变化
    useRangeChange(e, type) {
      if (e == 1) {
        //商家
        this._getSellerList(type == 1 ? 296 : 297);
      } else if (e == 2) {
        this._getSellerStoreList(type == 1 ? 296 : 297);
        //门店
      }
      this.addForm.ContextIdList = [];
      this.editForm.ContextIdList = [];
    },
    //获取卡券模板列表
    _getTicketTemplateList() {
      var par = {
        TicketTemplateName: this.ticketTemplateName,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetTicketTemplateList(par, 295).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.listTable = res.List;
      });
    },
    //新增卡券模板
    _addTicketTemplate() {
      var par = {
        TicketTemplateName: this.addForm.TicketTemplateName,
        CreateRules: this.addForm.CreateRules,
        TicketIdentification: this.addForm.TicketIdentification,
        TotalCount: this.addForm.TotalCount,
        ExpireType: this.addForm.ExpireType,
        ExpireStartTime:
          this.addForm.Time.length > 0 ? this.addForm.Time[0] : "",
        ExpireEndTime: this.addForm.Time.length > 0 ? this.addForm.Time[1] : "",
        ExpireSecond: this.addForm.ExpireSecond,
        UseRange: this.addForm.UseRange,
        ContextIdList: this.addForm.ContextIdList
      };
      return AddTicketTemplate(par, 296);
    },
    //编辑卡券模板
    _modifyTicketTemplate() {
      var par = {
        Id: this.editForm.Id,
        TicketTemplateName: this.editForm.TicketTemplateName,
        CreateRules: this.editForm.CreateRules,
        TicketIdentification: this.editForm.TicketIdentification,
        TotalCount: this.editForm.TotalCount,
        ExpireType: this.editForm.ExpireType,
        ExpireStartTime:
          this.editForm.Time.length > 0 ? this.editForm.Time[0] : "",
        ExpireEndTime:
          this.editForm.Time.length > 0 ? this.editForm.Time[1] : "",
        ExpireSecond: this.editForm.ExpireSecond,
        UseRange: this.editForm.UseRange,
        ContextIdList: this.editForm.ContextIdList
      };
      return ModifyTicketTemplate(par, 297);
    },
    //修改是否有效
    changeStatus(status, item) {
      this._modifyTicketTemplateStatus(item.Id, status);
    },
    _modifyTicketTemplateStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyTicketTemplateStatus(par, 298);
    },
    handleAvatarSuccess1(res, file) {
      this.addForm.IconShow = res.Data.ImgUrl;
      this.addForm.IconPath = res.Data.ImgPath;
    },
    handleAvatarSuccess2(res, file) {
      this.editForm.IconShow = res.Data.ImgUrl;
      this.editForm.IconPath = res.Data.ImgPath;
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //删除
    deleted(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._delete(item.Id).then(val => {
            this._getTicketTemplateList();
          });
        })
        .catch(() => {});
    },
    //删除
    _delete(id) {
      var par = {
        Id: id
      };
      return DeleteTicketTemplate(par, 299);
    },

    //获取所有门店数据
    _getSellerStoreList(rightId) {
      var par = {
        Status: 1,
        ExamineStatus: 4,
        PageIndex: 1,
        PageCount: 1000
      };
      return GetSellerStoreList(par, rightId).then(res => {
        let tempArr = [];
        res.List.forEach(item => {
          tempArr.push({
            Id: item.StoreId,
            Name: item.StoreName
          });
        });
        this.contextList = tempArr;
      });
    },
    //获取所有商户数据
    _getSellerList(rightId) {
      var par = {
        PageIndex: 1,
        PageCount: 1000
      };
      return GetSellerList(par, rightId).then(res => {
        let tempArr = [];
        res.List.forEach(item => {
          tempArr.push({
            Id: item.SellerId,
            Name: item.SellerName
          });
        });
        this.contextList = tempArr;
      });
    },
    //获取课程数据
    _getSellerItemList(type, id) {
      var par = {
        SellerId: type == 1 ? id : 0,
        StoreId: type == 2 ? id : 0,
        Status: 1,
        ExamineStatus: 4,
        PageIndex: 1,
        PageCount: 100
      };
      return GetSellerItemList(par);
    },
    //获取卡券类型列表
    _getTicketTypeList() {
      var par = {
        Status: 1,
        PageIndex: 1,
        PageCount: 100
      };
      return GetTicketTypeList(par, 295).then(res => {
        this.ticketTypeList.push({
          id: 0,
          name: "全部"
        });
        res.List.forEach(item => {
          this.ticketTypeNoAllList.push({
            id: item.TypeId,
            name: item.TypeName
          });
          this.ticketTypeList.push({
            id: item.TypeId,
            name: item.TypeName
          });
        });
      });
    }
  }
};
</script>

<style scoped lang='less'>
.showIcon {
  width: 70px;
  height: 70px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.w185 {
  width: 225px;
}
.ml30 {
  margin-left: 30px;
}
.w480 {
  width: 580px;
}
.w300 {
  width: 344px;
  margin-left: 20px;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
}
</style>
<style>
.el-upload {
  border: 1px dashed #ccc;
}
</style>
