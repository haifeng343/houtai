<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="卡券名称:">
          <el-input v-model="ticketName" placeholder="请输入卡券名称"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="ticketType" placeholder="请选择类型">
            <el-option
              v-for="item in ticketTypeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属账户:">
          <el-input v-model="accountName" placeholder="请输入所属账户"></el-input>
        </el-form-item>
        <el-form-item label="使用状态:">
          <el-select v-model="status" placeholder="请选择使用状态">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          style="float:right;margin-bottom:10px;"
          type="primary"
          @click="add()"
          v-if="common.haveRight('AddAccountTicket')"
        >创建卡券</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TicketName" align="center" label="卡券名称"></el-table-column>
        <el-table-column prop="TicketTypeName" align="center" label="卡券类型"></el-table-column>
        <el-table-column align="center" label="面值（元）">
          <template slot-scope="scope">{{scope.row.Amount*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="UseParams" align="center" label="使用条件"></el-table-column>
        <el-table-column align="center" label="使用范围">
          <template
            slot-scope="scope"
          >{{scope.row.UseRange==1?"商家":scope.row.UseRange==2?"门店":"全场通用"}}</template>
        </el-table-column>
        <el-table-column prop="AccountName" align="center" label="所属账户"></el-table-column>
        <el-table-column align="center" label="使用状态">
          <template
            slot-scope="scope"
          >{{scope.row.UseStatus==1?"未使用":scope.row.UseStatus==2?"已使用":"已过期"}}</template>
        </el-table-column>
        <el-table-column prop="ContextName" align="center" label="使用门店"></el-table-column>
        <el-table-column align="center" label="有效期">
          <template slot-scope="scope">{{scope.row.StartTime+"~"+scope.row.EndTime}}</template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="181px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyAccountTicketStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="common.haveRight('ModifyAccountTicket')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleted(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteAccountTicket')"
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
    <!-- 添加用户卡券 -->
    <el-dialog title="添加用户卡券" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="120px" :rules="rules">
        <el-form-item label="卡券名称:" prop="TicketName">
          <el-input v-model="addForm.TicketName" placeholder="请输入卡券名称"></el-input>
        </el-form-item>
        <el-form-item label="卡券类型:" prop="TicketType">
          <el-select v-model="addForm.TicketType" placeholder="请选择卡券类型" style="width:453px;">
            <el-option
              v-for="item in ticketTypeNoAllList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券图标:" prop="IconShow">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :headers="headers"
            name="Ticket.Img"
            :show-file-list="false"
            :on-success="handleAvatarSuccessAdd"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.IconShow" :src="addForm.IconShow" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="面值（分）:" prop="Amount">
          <el-input v-model="addForm.Amount" placeholder="请输入面值"></el-input>
        </el-form-item>
        <el-form-item label="使用条件:" prop="UseParams">
          <el-input v-model="addForm.UseParams" placeholder="请输入使用条件"></el-input>
        </el-form-item>
        <el-form-item label="使用范围:" prop="UseRange">
          <el-select
            v-model="addForm.UseRange"
            placeholder="请选择使用范围"
            @change="UseRangeChange($event,1)"
            style="width:453px;"
          >
            <el-option
              v-for="item in useRangeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属主体:"
          prop="ContextData"
          v-if="addForm.UseRange==1 || addForm.UseRange==2"
        >
          <el-select
            v-model="addForm.ContextData"
            placeholder="请选择所属主体"
            filterable
            multiple
            style="width:453px;"
          >
            <el-option
              v-for="item in contextList"
              :label="item.Name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属账户:" prop="AccountId">
          <el-select
            v-model="addForm.AccountId"
            placeholder="请选择使用范围"
            filterable
            style="width:453px;"
          >
            <el-option
              v-for="item in accountList"
              :label="item.AccountName"
              :key="item.AccountId"
              :value="item.AccountId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期:" prop="ExpireTime">
          <el-date-picker
            v-model="addForm.ExpireTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            style="width:453px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用规则描述:" prop="UseDescription">
          <el-input
            type="textarea"
            :rows="5"
            v-model="addForm.UseDescription"
            placeholder="请输入使用规则描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="前端显示类型:" prop="ShowType">
          <el-select v-model="addForm.ShowType" placeholder="请选择前端显示类型">
            <el-option
              v-for="item in ShowTypeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户卡券 -->
    <el-dialog title="编辑用户卡券" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="120px" :rules="rules">
        <el-form-item label="卡券名称:" prop="TicketName">
          <el-input v-model="editForm.TicketName" placeholder="请输入卡券名称"></el-input>
        </el-form-item>
        <el-form-item label="卡券类型:" prop="TicketType">
          <el-select v-model="editForm.TicketType" placeholder="请选择卡券类型">
            <el-option
              v-for="item in ticketTypeNoAllList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡券图标:" prop="IconShow">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :headers="headers"
            name="Ticket.Img"
            :show-file-list="false"
            :on-success="handleAvatarSuccessEdit"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.IconShow" :src="editForm.IconShow" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="面值（分）:" prop="Amount">
          <el-input v-model="editForm.Amount" placeholder="请输入面值"></el-input>
        </el-form-item>
        <el-form-item label="使用条件:" prop="UseParams">
          <el-input v-model="editForm.UseParams" placeholder="请输入使用条件"></el-input>
        </el-form-item>
        <el-form-item label="使用范围:" prop="UseRange">
          <el-select
            v-model="editForm.UseRange"
            placeholder="请选择使用范围"
            @change="UseRangeChange($event,2)"
          >
            <el-option
              v-for="item in useRangeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="所属主体:"
          prop="ContextData"
          v-if="editForm.UseRange==1 || editForm.UseRange==2"
        >
          <el-select
            v-model="editForm.ContextData"
            placeholder="请选择所属主体"
            filterable
            multiple
            style="width:453px;"
          >
            <el-option
              v-for="item in contextList"
              :label="item.Name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期:" prop="ExpireTime">
          <el-date-picker
            v-model="editForm.ExpireTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="使用规则描述:" prop="UseDescription">
          <el-input
            type="textarea"
            :rows="5"
            v-model="editForm.UseDescription"
            placeholder="请输入使用规则描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="前端显示类型:" prop="ShowType">
          <el-select v-model="editForm.ShowType" placeholder="请选择前端显示类型">
            <el-option
              v-for="item in ShowTypeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
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
  GetAccountTicketList,
  AddAccountTicket,
  ModifyAccountTicket,
  ModifyAccountTicketStatus,
  DeleteAccountTicket,
  GetTicketTypeList
} from "api/ticket.js";
import { GetClientAccountList } from "api/clientaccount.js";
import { GetSellerStoreList, GetSellerList } from "api/seller.js";
export default {
  name: "TicketList",
  data() {
    return {
      ShowTypeList: [
        {
          id: 0,
          name: "不显示按钮 "
        },
        {
          id: 1,
          name: "显示二维码"
        },
        {
          id: 2,
          name: "显示立即使用按钮"
        }
      ],
      ticketName: "", //卡券名称搜索
      ticketTypeList: [],
      ticketTypeNoAllList: [],
      ticketType: 0, //卡券类型搜索
      accountName: "", //所属用户名称搜索
      statusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "未使用" },
        { id: 2, name: "已使用" },
        { id: 3, name: "已过期" }
      ],
      status: 0, //状态搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //列表
      useRangeList: [
        { id: 1, name: "商家" },
        { id: 2, name: "门店" },
        { id: 3, name: "全场通用" }
      ],

      contextList: [],
      accountList: [],
      rules: {
        TicketName: [
          { required: true, message: "请输入卡券名称", trigger: "blur" }
        ],
        TicketType: [
          { required: true, message: "请选择卡券类型", trigger: "blur" }
        ],
        Amount: [{ required: true, message: "请输入面值", trigger: "blur" }],
        UseRange: [
          { required: true, message: "请选择使用范围", trigger: "blur" }
        ],
        ContextData: [
          { required: true, message: "请选择所属主体", trigger: "blur" }
        ],
        AccountId: [
          { required: true, message: "请选择所属账户", trigger: "blur" }
        ],
        ExpireTime: [
          { required: true, message: "请输入有效期", trigger: "blur" }
        ],
        ShowType: [
          { required: true, message: "请选择前端显示类型", trigger: "blur" }
        ]
      },
      addVisible: false,
      addForm: {
        TicketName: "",
        TicketType: "",
        Amount: "",
        UseParams: "",
        UseRange: "",
        AccountId: "",
        ExpireTime: "",
        ContextData: [],
        UseDescription: "",
        IconShow: "",
        IconPath: "",
        ShowType: ""
      },
      editVisible: false,
      editForm: {
        Id: "",
        TicketName: "",
        TicketType: "",
        Amount: "",
        UseParams: "",
        UseRange: "",
        AccountId: "",
        ExpireTime: "",
        ContextData: [],
        UseDescription: "",
        IconShow: "",
        IconPath: "",
        ShowType: ""
      }
    };
  },
  created() {
    this._getAccountTicketList();
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
    //使用范围变化
    UseRangeChange(e, type) {
      if (e == 1) {
        //商家
        this._getSellerList(type == 1 ? 287 : 288);
      } else if (e == 2) {
        this._getSellerStoreList(type == 1 ? 287 : 288);
        //门店
      }
      this.addForm.ContextData = [];
      this.editForm.ContextData = [];
    },
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getAccountTicketList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getAccountTicketList();
    },
    add() {
      this.addVisible = true;
      if (this.$refs["addForm"]) {
        this.$refs["addForm"].resetFields();
      }
      this._getClientAccountList(287);
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addAccountTicket().then(val => {
            this._getAccountTicketList();
            this.addVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    edit(item) {
      this._getClientAccountList(288);
      this.UseRangeChange(item.UseRange, 2);
      this.editForm.Id = item.Id;
      this.editForm.TicketName = item.TicketName;
      this.editForm.TicketType = item.TicketType;
      this.editForm.Amount = item.Amount;
      this.editForm.UseParams = item.UseParams;
      this.editForm.UseRange = item.UseRange;
      this.editForm.AccountId = item.AccountId;
      this.editForm.ExpireTime = [item.StartTime, item.EndTime];
      this.editForm.ContextData = item.ContextIdList;
      this.editForm.UseDescription = item.UseDescription;
      this.editForm.IconPath = item.IconPath;
      this.editForm.IconShow = item.IconShow;
      this.editForm.ShowType = item.ShowType;
      this.editVisible = true;
    },
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyAccountTicket().then(val => {
            this._getAccountTicketList();
            this.editVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    changeStatus(status, item) {
      this._modifyAccountTicketStatus(item.Id, status);
    },
    deleted(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteAccountTicket(item.Id).then(val => {
            this._getAccountTicketList();
          });
        })
        .catch(() => {});
    },
    handleAvatarSuccessAdd(res, file) {
      this.addForm.IconShow = res.Data.ImgUrl;
      this.addForm.IconPath = res.Data.ImgPath;
    },
    handleAvatarSuccessEdit(res, file) {
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
    //获取所有账户信息
    _getClientAccountList(rightId) {
      var par = {
        Mobile: "",
        StartTime: "",
        EndTime: "",
        PageIndex: 1,
        PageCount: 5000
      };
      return GetClientAccountList(par, rightId).then(res => {
        this.accountList = res.List;
      });
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
    //获取用户卡券列表
    _getAccountTicketList() {
      var par = {
        TicketName: this.ticketName,
        TicketType: this.ticketType,
        UseStatus: this.status,
        AccountName: this.accountName,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetAccountTicketList(par, 286).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.listTable = res.List;
      });
    },
    //新增用户卡券
    _addAccountTicket() {
      var par = {
        TicketName: this.addForm.TicketName,
        TicketType: this.addForm.TicketType,
        Amount: this.addForm.Amount,
        UseParams: this.addForm.UseParams,
        UseRange: this.addForm.UseRange,
        AccountId: this.addForm.AccountId,
        StartTime: this.addForm.ExpireTime[0],
        EndTime: this.addForm.ExpireTime[1],
        ContextIdList: this.addForm.ContextData,
        UseDescription: this.addForm.UseDescription,
        IconPath: this.addForm.IconPath,
        ShowType: this.addForm.ShowType
      };
      return AddAccountTicket(par, 287);
    },
    //修改用户卡券状态
    _modifyAccountTicketStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyAccountTicketStatus(par, 289);
    },
    //编辑用户卡券
    _modifyAccountTicket() {
      var par = {
        Id: this.editForm.Id,
        TicketName: this.editForm.TicketName,
        TicketType: this.editForm.TicketType,
        Amount: this.editForm.Amount,
        UseParams: this.editForm.UseParams,
        UseRange: this.editForm.UseRange,
        AccountId: this.editForm.AccountId,
        StartTime: this.editForm.ExpireTime[0],
        EndTime: this.editForm.ExpireTime[1],
        ContextIdList: this.editForm.ContextData,
        UseDescription: this.editForm.UseDescription,
        IconPath: this.editForm.IconPath,
        ShowType: this.editForm.ShowType
      };
      return ModifyAccountTicket(par, 288);
    },
    //删除用户卡券
    _deleteAccountTicket(id) {
      var par = {
        Id: id
      };
      return DeleteAccountTicket(par,290);
    },
    //获取卡券类型列表
    _getTicketTypeList() {
      var par = {
        Status: 1,
        PageIndex: 1,
        PageCount: 100
      };
      return GetTicketTypeList(par, 286).then(res => {
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  border: 1px dashed #d9d9d9;
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
</style>
