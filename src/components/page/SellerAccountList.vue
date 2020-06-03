<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名:">
          <el-input v-model="searchAccountName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="searchAccountMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="注册时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="AccountListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddAccountDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('GetSellerAccountList')"
        >添加账户</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="accountListTable" border ref="multipleTable">
        <el-table-column prop="AccountId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="UserName" align="center" label="账号"></el-table-column>
        <el-table-column prop="Mobile" align="center" label="手机号"></el-table-column>
        <el-table-column prop="Email" align="center" label="邮箱"></el-table-column>
        <el-table-column prop="HeaderAccessUrl" align="center" label="头像">
          <template slot-scope="scope">
            <el-button type="text" @click="showHeader(scope.row)">预览图片</el-button>
          </template>
        </el-table-column>
        <el-table-column label="账户权限">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showPowerDialog(scope.row)"
              :disabled="!common.haveRight('ModifySellerAccountIsAdministrator')"
            >{{scope.row.AdminPower==2?"超级管理员":scope.row.AdminPower==1?"普通管理员":"普通账户"}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Status" label="账户状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySellerAccountStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showEditAccountDialog(scope.row)"
              v-if="common.haveRight('ModifySellerAccount')"
            >编辑</el-button>
            <el-button type="text" @click="jumpToStoreListDialog(scope.row)">门店列表</el-button>
            <el-button
              type="text"
              @click="shouModifyPassworsDialog(scope.row)"
              v-if="common.haveRight('ModifySellerAccountPassword')"
            >修改密码</el-button>
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
        @current-change="AccountListCurrentChange"
      ></el-pagination>
    </div>
    <!--修改账户权限弹窗 -->
    <el-dialog title="修改账户权限" :visible.sync="powerVisible" width="433px">
      <el-form ref="powerForm" :model="powerForm" label-width="80px">
        <el-form-item label="账户权限:" prop="adminPower">
          <el-select v-model="powerForm.adminPower" placeholder="请选择">
            <el-option
              v-for="item in adminPowerList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="powerVisible = false" size="medium">取 消</el-button>
        <el-button @click="powerOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 头像图片预览弹窗 -->
    <el-dialog :title="`头像预览-${clickItem.UserName}`" :visible.sync="headerVisible" width="633px">
      <img :src="clickItem.HeaderAccessUrl" class="header-img" />
    </el-dialog>
    <!-- 添加账户弹窗 -->
    <el-dialog title="添加账户" :visible.sync="addAccountVisible" width="633px">
      <el-form ref="addAccountForm" :model="addAccountForm" label-width="80px" :rules="rules">
        <el-form-item label="账户名:" prop="accountName">
          <el-input v-model="addAccountForm.accountName" placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="accountMobile">
          <el-input v-model="addAccountForm.accountMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="addAccountForm.accountMail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="头像:">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Admin.Header"
            :on-success="handlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addAccountForm.HeadShowUrl" :src="addAccountForm.HeadShowUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input
            type="password"
            v-model="addAccountForm.password"
            placeholder="请输入密码"
            auto-complete="new-password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addAccountVisible = false" size="medium">取 消</el-button>
        <el-button @click="addAccountOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑账户弹窗 -->
    <el-dialog
      :title="`编辑账户-${clickItem.UserName}`"
      :visible.sync="editAccountVisible"
      width="633px"
    >
      <el-form ref="editAccountForm" :model="editAccountForm" label-width="80px" :rules="rules">
        <el-form-item label="账户名:" prop="accountName">
          <el-input v-model="editAccountForm.accountName" placeholder="请输入账户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号:" prop="accountMobile">
          <el-input v-model="editAccountForm.accountMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:">
          <el-input v-model="editAccountForm.accountMail" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="头像:">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Admin.Header"
            :on-success="editAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="editAccountForm.HeadShowUrl"
              :src="editAccountForm.HeadShowUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editAccountVisible = false" size="medium">取 消</el-button>
        <el-button @click="editAccountOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码弹窗 -->
    <el-dialog
      :title="`修改密码-${clickItem.UserName}`"
      :visible.sync="modifyPasswordVisible"
      width="633px"
    >
      <el-form
        ref="modifyPasswordForm"
        :model="modifyPasswordForm"
        label-width="85px"
        :rules="modifyPasswordRules"
      >
        <el-form-item label="密码:" prop="newPassword">
          <el-input
            v-model="modifyPasswordForm.newPassword"
            placeholder="请输入密码"
            type="password"
            auto-complete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码:" prop="newPasswordAgain">
          <el-input
            v-model="modifyPasswordForm.newPasswordAgain"
            placeholder="请再次输入密码"
            type="password"
            auto-complete="new-password"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="modifyPasswordVisible = false" size="medium">取 消</el-button>
        <el-button @click="modifyPasswordOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  AddSellerAccount,
  GetSellerAccountList,
  ModifySellerAccountStatus,
  ModifySellerAccountIsAdministrator,
  ModifySellerAccount,
  ModifySellerAccountPassword
} from "api/seller.js";
export default {
  name: "SellerAccountList",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.modifyPasswordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      sellerId: 0, //商家Id
      searchAccountName: "", //账户名搜索
      searchAccountMobile: "", //手机号搜索
      searchTime: [], //注册时间搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      accountListTable: [], //账户列表
      clickItem: {}, //点击某一行数据
      addAccountVisible: false, //添加账户弹窗是否可见
      addAccountForm: {
        accountName: "",
        accountMobile: "",
        accountMail: "",
        HeadShowUrl: "",
        HeadUrl: "",
        password: ""
      },
      editAccountVisible: false, //编辑账户弹窗是否可见
      editAccountForm: {
        accountName: "",
        accountMobile: "",
        accountMail: "",
        HeadShowUrl: "",
        HeadUrl: ""
      },
      headerVisible: false, //头像预览弹窗是否显示
      rules: {
        accountName: [
          { required: true, message: "请输入账户名", trigger: "blur" }
        ],
        accountMobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/,
            message: "请填写正确的手机号码",
            trigger: "blur"
          }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
      modifyPasswordVisible: false, //修改密码弹窗是否可见
      modifyPasswordForm: {
        newPassword: "",
        newPasswordAgain: ""
      },
      modifyPasswordRules: {
        newPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 30,
            message: "密码必须在6-30个字符",
            trigger: "blur"
          },
          {
            pattern: /^(\w){6,30}$/,
            message: "只能输入6-30个字母、数字、下划线",
            trigger: "blur"
          }
        ],
        newPasswordAgain: [
          { required: true, validator: validatePass, trigger: "blur" }
        ]
      },
      adminPowerList: [
        { id: 0, name: "普通账户" },
        { id: 1, name: "普通管理员" },
        { id: 2, name: "超级管理员" }
      ],
      powerVisible: false,
      powerForm: {
        id: "",
        adminPower: ""
      }
    };
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
  created() {
    this.sellerId = this.$route.params.id;
    this._getSellerAccountList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.sellerId = this.$route.params.id;
      this._getSellerAccountList();
    }
  },
  methods: {
    showPowerDialog(item) {
      this.powerForm.id = item.AccountId;
      this.powerForm.adminPower = item.AdminPower;
      this.powerVisible = true;
    },
    powerOk() {
      this._modifySellerAccountIsAdministrator().then(val => {
        this._getSellerAccountList();
        this.powerVisible = false;
      });
    },
    //跳转到门店列表
    jumpToStoreListDialog(item) {
      this.$router.push({
        path: `/StoreListDialog/${item.AccountId}`,
        query: {
          name: item.UserName,
          type: 2
        }
      });
    },
    //搜索
    AccountListSearch() {
      this.pageIndex = 1;
      this._getSellerAccountList();
    },
    //项目列表分页变化
    AccountListCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerAccountList();
    },
    //显示头像预览弹窗
    showHeader(item) {
      this.clickItem = item;
      this.headerVisible = true;
    },
    //显示添加账户弹窗
    showAddAccountDialog() {
      this.addAccountVisible = true;
      this.addAccountForm.accountName = "";
      this.addAccountForm.accountMobile = "";
      this.addAccountForm.accountMail = "";
      this.addAccountForm.HeadShowUrl = "";
      this.addAccountForm.HeadUrl = "";
      this.addAccountForm.password = "";
    },
    //添加账户确认
    addAccountOk() {
      this.$refs["addAccountForm"].validate(valid => {
        if (valid) {
          this._addSellerAccount().then(val => {
            this.addAccountVisible = false;
            this._getSellerAccountList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑账户弹窗
    showEditAccountDialog(item) {
      this.clickItem = item;
      this.editAccountVisible = true;
      this.editAccountForm.accountName = item.UserName;
      this.editAccountForm.accountMobile = item.Mobile;
      this.editAccountForm.accountMail = item.Email;
      this.editAccountForm.HeadShowUrl = item.HeaderAccessUrl;
      this.editAccountForm.HeadUrl = item.HeaderUrl;
    },
    //编辑确认
    editAccountOk() {
      this._modifySellerAccount().then(val => {
        this.editAccountVisible = false;
        this._getSellerAccountList();
      });
    },
    //添加头像上传成功
    handlerAvatarSuccess(res, file) {
      this.addAccountForm.HeadShowUrl = res.Data.ImgUrl;
      this.addAccountForm.HeadUrl = res.Data.ImgPath;
    },
    //编辑头像上传成功
    editAvatarSuccess(res, file) {
      this.editAccountForm.HeadShowUrl = res.Data.ImgUrl;
      this.editAccountForm.HeadUrl = res.Data.ImgPath;
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
    //修改账户状态
    changeStatus(status, item) {
      this._modifySellerAccountStatus(item.AccountId, status);
    },
    //显示修改密码弹窗
    shouModifyPassworsDialog(item) {
      this.clickItem = item;
      this.modifyPasswordVisible = true;
      this.modifyPasswordForm.newPassword = "";
      this.modifyPasswordForm.newPasswordAgain = "";
    },
    //修改密码确认
    modifyPasswordOk() {
      this.$refs["modifyPasswordForm"].validate(valid => {
        if (valid) {
          this._modifySellerAccountPassword().then(val => {
            this.modifyPasswordVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    //获取账户列表信息
    _getSellerAccountList() {
      var par = {
        SellerId: this.sellerId,
        AccountName: this.searchAccountName,
        Mobile: this.searchAccountMobile,
        StartTime:
          this.searchTime == null || this.searchTime.length != 2
            ? ""
            : this.searchTime[0],
        EndTime:
          this.searchTime == null || this.searchTime.length != 2
            ? ""
            : this.searchTime[1],
        Status: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetSellerAccountList(par, 190).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.accountListTable = res.List;
      });
    },
    //添加账户信息
    _addSellerAccount() {
      var par = {
        SellerId: this.sellerId,
        UserName: this.addAccountForm.accountName,
        Mobile: this.addAccountForm.accountMobile,
        Email: this.addAccountForm.accountMail,
        HeaderUrl: this.addAccountForm.HeadUrl,
        Password: this.$md5(this.addAccountForm.password)
      };
      return AddSellerAccount(par, 191);
    },
    //修改账户状态
    _modifySellerAccountStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySellerAccountStatus(par, 193);
    },
    //修改账户是否管理员状态
    _modifySellerAccountIsAdministrator() {
      var par = {
        Id: this.powerForm.id,
        Status: this.powerForm.adminPower
      };
      return ModifySellerAccountIsAdministrator(par, 194);
    },
    //编辑账户信息
    _modifySellerAccount() {
      var par = {
        AccountId: this.clickItem.AccountId,
        AccountName: this.editAccountForm.accountName,
        Mobile: this.editAccountForm.accountMobile,
        Email: this.editAccountForm.accountMail,
        HeaderUrl: this.editAccountForm.HeadUrl
      };
      return ModifySellerAccount(par, 192);
    },
    //修改账户密码
    _modifySellerAccountPassword() {
      var par = {
        AccountId: this.clickItem.AccountId,
        NewPassword: this.$md5(this.modifyPasswordForm.newPassword)
      };
      return ModifySellerAccountPassword(par, 195);
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
.header-img {
  width: 100%;
  height: auto;
}
</style>
