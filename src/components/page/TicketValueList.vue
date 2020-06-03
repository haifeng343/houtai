<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="卡券名称:">
          <el-input v-model="ticketName" placeholder="请输入卡券名称"></el-input>
        </el-form-item>
        <el-form-item label="卡券类型:">
          <el-select v-model="ticketType" placeholder="请选择卡券类型">
            <el-option
              v-for="item in ticketTypeList"
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
          v-if="common.haveRight('AddTicketValue')"
        >创建参数</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TicketName" align="center" label="卡券名称"></el-table-column>
        <el-table-column prop="TicketIdentification" align="center" label="卡券标识"></el-table-column>
        <el-table-column prop="TicketIcon" align="center" label="卡券图标">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showIcon(scope.row)"
              v-if="scope.row.TicketIconShowUrl"
            >预览图片</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="卡券类型">
          <template
            slot-scope="scope"
          >{{scope.row.TicketType==2?"积分":scope.row.TicketType==3?"代金券":"其他"}}</template>
        </el-table-column>
        <el-table-column align="center" label="生成规则">
          <template
            slot-scope="scope"
          >{{scope.row.CreateRules==1?"固定商家":scope.row.CreateRules==2?"固定门店":"不限"}}</template>
        </el-table-column>
        <el-table-column prop="ContextName" align="center" label="主体标识"></el-table-column>
        <el-table-column align="center" label="固定面额（元）">
          <template slot-scope="scope">{{scope.row.Amount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="最低面额（元）">
          <template slot-scope="scope">{{scope.row.MinAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="最高面额（元）">
          <template slot-scope="scope">{{scope.row.MaxAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="UseParams" align="center" label="使用参数"></el-table-column>
        <el-table-column prop="UseDescription" align="center" label="使用规则"></el-table-column>
        <el-table-column prop="TotalCount" align="center" label="卡券总数量"></el-table-column>
        <el-table-column prop="SellerCount" align="center" label="每个商家生成限制数量"></el-table-column>
        <el-table-column prop="StoreCount" align="center" label="每个门店生成限制数量"></el-table-column>
        <el-table-column prop="AccountCount" align="center" label="每个用户生成限制数量"></el-table-column>
        <el-table-column align="center" label="是否有效" width="140px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyTicketValueStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="120px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="common.haveRight('ModifyTicketValue')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleted(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteTicketValue')"
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

    <!-- 图片预览弹窗 -->
    <el-dialog title="图标预览" :visible.sync="iconVisible" width="333px">
      <img :src="clickItem.TicketIconShowUrl" />
    </el-dialog>
    <!-- 创建模板 -->
    <el-dialog title="创建参数" :visible.sync="addVisible" width="800px">
      <el-form ref="addForm" :model="addForm" label-width="140px" :rules="rules">
        <el-form-item label="卡券名称:" prop="TicketName">
          <el-input v-model="addForm.TicketName" placeholder="请输入卡券名称"></el-input>
        </el-form-item>
        <el-form-item label="卡券图标:">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Ticket.Img"
            :on-success="handlerAvatarSuccessAdd"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.TicketIconShowUrl" :src="addForm.TicketIconShowUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="卡券标识:" prop="TicketIdentification">
          <el-input v-model="addForm.TicketIdentification" placeholder="请输入卡券标识"></el-input>
        </el-form-item>
        <el-form-item label="卡券类型:" prop="TicketType">
          <el-select v-model="addForm.TicketType" class="w580" placeholder="请选择卡券类型">
            <el-option
              v-for="item in ticketTypeNoAllList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成规则:" prop="CreateRules">
          <el-select
            v-model="addForm.CreateRules"
            class="w580"
            placeholder="请选择生成规则"
            @change="useRangeChange($event,1)"
          >
            <el-option
              v-for="item in useRangeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主体标识:" prop="ContextId">
          <el-select
            v-model="addForm.ContextId"
            filterable
            class="w580"
            placeholder="请选择主体标识"
            :disabled="addForm.CreateRules!=1 &&addForm.CreateRules!=2"
          >
            <el-option
              v-for="item in contextList"
              :label="item.Name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定面值(分):" prop="Amount">
          <el-input v-model="addForm.Amount" placeholder="请输入固定面值"></el-input>
        </el-form-item>
        <el-form-item label="最低面额(分):" prop="MinAmount">
          <el-input v-model="addForm.MinAmount" placeholder="请输入最低面额"></el-input>
        </el-form-item>
        <el-form-item label="最高面额(分):" prop="MaxAmount">
          <el-input v-model="addForm.MaxAmount" placeholder="请输入最高面额"></el-input>
        </el-form-item>
        <el-form-item label="使用参数:" prop="UseParams">
          <el-input v-model="addForm.UseParams" placeholder="请输入使用参数"></el-input>
        </el-form-item>
        <el-form-item label="使用规则:" prop="UseDescription">
          <el-input type="textarea" :rows="5" v-model="addForm.UseDescription" placeholder="请输入使用规则"></el-input>
        </el-form-item>
        <el-form-item label="总数量:" prop="TotalCount">
          <el-input v-model="addForm.TotalCount" placeholder="请输入总数量（-1表示不限制）"></el-input>
        </el-form-item>
        <el-form-item label="商家生成限制数量:" prop="SellerCount">
          <el-input v-model="addForm.SellerCount" placeholder="请输入商家生成限制数量"></el-input>
        </el-form-item>
        <el-form-item label="门店生成限制数量:" prop="StoreCount">
          <el-input v-model="addForm.StoreCount" placeholder="请输入门店生成限制数量"></el-input>
        </el-form-item>
        <el-form-item label="用户生成限制数量:" prop="AccountCount">
          <el-input v-model="addForm.AccountCount" placeholder="请输入用户生成限制数量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑模板 -->
    <el-dialog title="编辑模板" :visible.sync="editVisible" width="800px">
      <el-form ref="editForm" :model="editForm" label-width="140px" :rules="rules">
        <el-form-item label="卡券名称:" prop="TicketName">
          <el-input v-model="editForm.TicketName" placeholder="请输入卡券名称"></el-input>
        </el-form-item>
        <el-form-item label="卡券图标:">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Ticket.Img"
            :on-success="handlerAvatarSuccessEdit"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.TicketIconShowUrl" :src="editForm.TicketIconShowUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="卡券标识:" prop="TicketIdentification">
          <el-input v-model="editForm.TicketIdentification" placeholder="请输入卡券标识"></el-input>
        </el-form-item>
        <el-form-item label="卡券类型:" prop="TicketType">
          <el-select v-model="editForm.TicketType" class="w580" placeholder="请选择卡券类型">
            <el-option
              v-for="item in ticketTypeNoAllList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生成规则:" prop="CreateRules">
          <el-select
            v-model="editForm.CreateRules"
            class="w580"
            placeholder="请选择生成规则"
            @change="useRangeChange($event,2)"
          >
            <el-option
              v-for="item in useRangeList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主体标识:" prop="ContextId">
          <el-select
            v-model="editForm.ContextId"
            filterable
            class="w580"
            placeholder="请选择主体标识"
            :disabled="editForm.CreateRules!=1 && editForm.CreateRules!=2"
          >
            <el-option
              v-for="item in contextList"
              :label="item.Name"
              :key="item.Id"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="固定面值(分):" prop="Amount">
          <el-input v-model="editForm.Amount" placeholder="请输入固定面值"></el-input>
        </el-form-item>
        <el-form-item label="最低面额(分):" prop="MinAmount">
          <el-input v-model="editForm.MinAmount" placeholder="请输入最低面额"></el-input>
        </el-form-item>
        <el-form-item label="最高面额(分):" prop="MaxAmount">
          <el-input v-model="editForm.MaxAmount" placeholder="请输入最高面额"></el-input>
        </el-form-item>
        <el-form-item label="使用参数:" prop="UseParams">
          <el-input v-model="editForm.UseParams" placeholder="请输入使用参数"></el-input>
        </el-form-item>
        <el-form-item label="使用规则:" prop="UseDescription">
          <el-input type="textarea" :rows="5" v-model="editForm.UseDescription" placeholder="请输入使用规则"></el-input>
        </el-form-item>
        <el-form-item label="总数量:" prop="TotalCount">
          <el-input v-model="editForm.TotalCount" placeholder="请输入总数量（-1表示不限制）"></el-input>
        </el-form-item>
        <el-form-item label="商家生成限制数量:" prop="SellerCount">
          <el-input v-model="editForm.SellerCount" placeholder="请输入商家生成限制数量"></el-input>
        </el-form-item>
        <el-form-item label="门店生成限制数量:" prop="StoreCount">
          <el-input v-model="editForm.StoreCount" placeholder="请输入门店生成限制数量"></el-input>
        </el-form-item>
        <el-form-item label="用户生成限制数量:" prop="AccountCount">
          <el-input v-model="editForm.AccountCount" placeholder="请输入用户生成限制数量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" size="medium">取 消</el-button>
        <el-button @click="modifyOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetTicketValueList,
  AddTicketValue,
  ModifyTicketValue,
  ModifyTicketValueStatus,
  DeleteTicketValue,
  GetTicketTypeList
} from "api/ticket.js";
import { GetSellerStoreList, GetSellerList } from "api/seller.js";
export default {
  name: "TicketValueList",
  data() {
    return {
      iconVisible: false, //预览弹窗是否可见
      ticketName: "", //卡券名称搜索
      ticketType: 0, //卡券类型搜索
      ticketTypeList: [],
      ticketTypeNoAllList: [],
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //列表
      clickItem: {},
      useRangeList: [
        { id: 1, name: "商家" },
        { id: 2, name: "门店" },
        { id: 3, name: "全场通用" }
      ],
      ExpireList: [
        // 1绝对时间 2相对时间
        { id: 1, name: "绝对时间" },
        { id: 2, name: "相对时间" }
      ],
      contextList: [], //主体标识
      rules: {
        TicketName: [
          { required: true, message: "请输入卡券名称", trigger: "blur" }
        ],
        TicketIdentification: [
          { required: true, message: "请输入卡券标识", trigger: "blur" }
        ],
        TicketType: [
          { required: true, message: "请选择卡券类型", trigger: "blur" }
        ],
        CreateRules: [
          { required: true, message: "请选择生成规则", trigger: "blur" }
        ],
        Amount: [
          { required: true, message: "请输入固定面值", trigger: "blur" }
        ],
        MinAmount: [
          { required: true, message: "请输入最低面值", trigger: "blur" }
        ],
        MaxAmount: [
          { required: true, message: "请输入最高面值", trigger: "blur" }
        ],
        UseRange: [
          { required: true, message: "请选择使用范围", trigger: "blur" }
        ],
        UseDescription: [
          { required: true, message: "请输入使用规则", trigger: "blur" }
        ],
        TotalCount: [
          { required: true, message: "请输入总数量", trigger: "blur" }
        ],
        SellerCount: [
          { required: true, message: "请输入商家生成限制数量", trigger: "blur" }
        ],
        StoreCount: [
          { required: true, message: "请输入门店生成限制数量", trigger: "blur" }
        ],
        AccountCount: [
          { required: true, message: "请输入用户生成限制数量", trigger: "blur" }
        ]
      },
      addVisible: false,
      addForm: {
        TicketName: "",
        TicketIcon: "",
        TicketIconShowUrl: "",
        TicketIdentification: "",
        TicketType: "",
        CreateRules: "",
        ContextId: "",
        Amount: "",
        MinAmount: "",
        MaxAmount: "",
        UseParams: "",
        UseDescription: "",
        TotalCount: "",
        SellerCount: "",
        StoreCount: "",
        AccountCount: ""
      },
      editVisible: false,
      editForm: {
        Id: "",
        TicketName: "",
        TicketIcon: "",
        TicketIconShowUrl: "",
        TicketIdentification: "",
        TicketType: "",
        CreateRules: "",
        ContextId: "",
        Amount: "",
        MinAmount: "",
        MaxAmount: "",
        UseParams: "",
        UseDescription: "",
        TotalCount: "",
        SellerCount: "",
        StoreCount: "",
        AccountCount: ""
      }
    };
  },
  created() {
    this._getTicketValueList();
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
      this._getTicketValueList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getTicketValueList();
    },
    add() {
      this.addVisible = true;
      if (this.$refs["addForm"]) {
        this.$refs["addForm"].resetFields();
      }
    },
    edit(item) {
      this.editForm.Id = item.Id;
      this.editForm.TicketName = item.TicketName;
      this.editForm.TicketIcon = item.TicketIcon;
      this.editForm.TicketIconShowUrl = item.TicketIconShowUrl;
      this.editForm.TicketIdentification = item.TicketIdentification;
      this.editForm.TicketType = item.TicketType;
      this.editForm.CreateRules = item.CreateRules;
      this.editForm.ContextId = item.ContextId;
      this.editForm.Amount = item.Amount;
      this.editForm.MinAmount = item.MinAmount;
      this.editForm.MaxAmount = item.MaxAmount;
      this.editForm.UseDescription = item.UseDescription;
      this.editForm.UseParams = item.UseParams;
      this.editForm.TotalCount = item.TotalCount;
      this.editForm.SellerCount = item.SellerCount;
      this.editForm.StoreCount = item.StoreCount;
      this.editForm.AccountCount = item.AccountCount;
      this.editVisible = true;
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addTicketValue().then(val => {
            this._getTicketValueList();
            this.addVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    modifyOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyTicketValue().then(val => {
            this._getTicketValueList();
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
        this._getSellerList(type == 1 ? 301 : 303);
      } else if (e == 2) {
        this._getSellerStoreList(type == 1 ? 301 : 303);
        //门店
      }
      this.addForm.ContextId = "";
      this.editForm.ContextId = "";
    },
    //添加头像上传成功
    handlerAvatarSuccessAdd(res, file) {
      this.addForm.TicketIconShowUrl = res.Data.ImgUrl;
      this.addForm.TicketIcon = res.Data.ImgPath;
    },
    //添加头像上传成功
    handlerAvatarSuccessEdit(res, file) {
      this.editForm.TicketIconShowUrl = res.Data.ImgUrl;
      this.editForm.TicketIcon = res.Data.ImgPath;
    },
    //项目主图上传前
    beforeAvatarUpload(file) {
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPEG && !isJPG && !isPNG) {
        this.$message.error("上传图片类型只能是jpeg,jpg和png!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //显示预览弹窗
    showIcon(item) {
      this.clickItem = item;
      this.iconVisible = true;
    },
    //获取卡券面值列表
    _getTicketValueList() {
      var par = {
        TicketName: this.ticketName,
        TicketType: this.ticketType,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetTicketValueList(par, 300).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.listTable = res.List;
      });
    },
    //新增卡券模板
    _addTicketValue() {
      var par = {
        TicketName: this.addForm.TicketName,
        TicketIdentification: this.addForm.TicketIdentification,
        TicketIcon: this.addForm.TicketIcon,
        TicketType: this.addForm.TicketType,
        CreateRules: this.addForm.CreateRules,
        ContextId: this.addForm.ContextId,
        Amount: this.addForm.Amount,
        MinAmount: this.addForm.MinAmount,
        MaxAmount: this.addForm.MaxAmount,
        UseParams: this.addForm.UseParams,
        UseDescription: this.addForm.UseDescription,
        TotalCount: this.addForm.TotalCount,
        SellerCount: this.addForm.SellerCount,
        StoreCount: this.addForm.StoreCount,
        AccountCount: this.addForm.AccountCount
      };
      return AddTicketValue(par, 301);
    },
    //编辑卡券模板
    _modifyTicketValue() {
      var par = {
        Id: this.editForm.Id,
        TicketName: this.editForm.TicketName,
        TicketIdentification: this.editForm.TicketIdentification,
        TicketIcon: this.editForm.TicketIcon,
        TicketType: this.editForm.TicketType,
        CreateRules: this.editForm.CreateRules,
        ContextId: this.editForm.ContextId,
        Amount: this.editForm.Amount,
        MinAmount: this.editForm.MinAmount,
        MaxAmount: this.editForm.MaxAmount,
        UseParams: this.editForm.UseParams,
        UseDescription: this.editForm.UseDescription,
        TotalCount: this.editForm.TotalCount,
        SellerCount: this.editForm.SellerCount,
        StoreCount: this.editForm.StoreCount,
        AccountCount: this.editForm.AccountCount
      };
      return ModifyTicketValue(par, 303);
    },
    //修改是否有效
    changeStatus(status, item) {
      this._modifyTicketValueStatus(item.Id, status);
    },
    _modifyTicketValueStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyTicketValueStatus(par, 304);
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
            this._getTicketValueList();
          });
        })
        .catch(() => {});
    },
    //删除
    _delete(id) {
      var par = {
        Id: id
      };
      return DeleteTicketValue(par, 305);
    },
    //获取卡券类型列表
    _getTicketTypeList() {
      var par = {
        Status: 1,
        PageIndex: 1,
        PageCount: 100
      };
      return GetTicketTypeList(par, 300).then(res => {
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
.w580 {
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
