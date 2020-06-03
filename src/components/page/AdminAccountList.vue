<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="用户名:">
          <el-input v-model="searchAccountName" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="searchMobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button v-if="common.haveRight('AddAdminAccount')" type="primary" style="float:right;" @click="showAddForm">添加用户</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="AccountId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="UserName" align="center" label="用户名"></el-table-column>
        <el-table-column prop="AccountMobile" align="center" label="手机号"></el-table-column>
        <el-table-column prop="RealName" align="center" label="真实姓名"></el-table-column>
        <el-table-column prop="Sex" align="center" label="性别"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyAdminAccountStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间" width="150px"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="common.haveRight('ModifyAdminAccount')" type="text" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button v-if="common.haveRight('ModifyAdminAccountPassword')" type="text" @click="showPasswordDialog(scope.row)">修改密码</el-button>
            <el-button v-if="common.haveRight('SetAdminAccountRole')" type="text" @click="showRoleDialog(scope.row)">角色列表</el-button>
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
    <!-- 新增弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addVisible" width="663px">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="addForm.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            type="password"
            v-model="addForm.password"
            placeholder="请输入密码"
            auto-complete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input type="password" v-model="addForm.repassword" auto-complete="new-password"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="addForm.sex" placeholder="请选择">
            <el-option v-for="item in sexList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" class="dialog-certain" @click="addVisible=false">取 消</el-button>
        <el-button type="primary" size="medium" class="dialog-certain" @click="addAccountOk()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="editVisible" width="663px">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="editForm.realName" placeholder="请输入真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-select v-model="editForm.sex" placeholder="请选择">
            <el-option v-for="item in sexList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" class="dialog-certain" @click="editVisible=false">取 消</el-button>
        <el-button type="primary" size="medium" class="dialog-certain" @click="editAccountOk()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码弹出框 -->
    <el-dialog title="编辑用户" :visible.sync="passwordVisible" width="663px">
      <el-form ref="passwordForm" :model="passwordForm" :rules="passwordRules" label-width="100px">
        <el-form-item label="新密码" prop="password">
          <el-input
            type="password"
            auto-complete="new-password"
            v-model="passwordForm.password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="repassword">
          <el-input
            type="password"
            auto-complete="new-password"
            v-model="passwordForm.repassword"
            placeholder="请再次确认密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" class="dialog-certain" @click="passwordVisible=false">取 消</el-button>
        <el-button type="primary" size="medium" class="dialog-certain" @click="passwordOk()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置用户角色弹出框 -->
    <el-dialog title="设置用户角色" :visible.sync="roleVisible" width="663px">
      <el-checkbox-group v-model="checkedRole">
        <el-checkbox
          v-for="role in roleList"
          :label="role.RoleId"
          :key="role.RoleId"
        >{{role.RoleName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" class="dialog-certain" @click="roleVisible=false">取 消</el-button>
        <el-button type="primary" size="medium" class="dialog-certain" @click="roleOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetAccountList,
  AddAccount,
  ModifyAccount,
  ModifyAccountStatus,
  ModifyAccountAdminStatus,
  ModifyAccountPassword,
  GetRoleList,
  SetAccountRole
} from "api/admin.js";
export default {
  name: "AdminAccountList",
  data() {
    var NRrepassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次确认密码"));
      } else if (value !== this.addForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var NRrepassword_password = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次确认密码"));
      } else if (value !== this.passwordForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      searchAccountName: "", //账户名搜索
      searchMobile: "", //手机号搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //列表
      sexList: [{ id: 1, name: "男" }, { id: 2, name: "女" }],
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        repassword: [
          { required: true, message: "请再次确认密码", trigger: "blur" },
          { validator: NRrepassword, trigger: "blur" }
        ],
        sex: [{ required: true, message: "请选择性别", trigger: "blur" }]
      },
      addVisible: false,
      addForm: {
        username: "",
        mobile: "",
        realName: "",
        password: "",
        repassword: "",
        sex: ""
      },
      editVisible: false,
      editForm: {
        accountId: "",
        username: "",
        mobile: "",
        realName: "",
        sex: ""
      },
      passwordRules: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        repassword: [
          { required: true, message: "请再次确认密码", trigger: "blur" },
          { validator: NRrepassword_password, trigger: "blur" }
        ]
      },
      passwordVisible: false,
      passwordForm: {
        accountId: "",
        password: "",
        repassword: ""
      },
      roleVisible: false,
      roleList: [],
      checkedAccountId: "",
      checkedRole: []
    };
  },
  created() {
    this._getAccountList();
  },
  methods: {
    //显示添加用户弹窗
    showAddForm() {
      this.addForm.username = "";
      this.addForm.mobile = "";
      this.addForm.realName = "";
      this.addForm.password = "";
      this.addForm.repassword = "";
      this.addForm.sex = "";
      this.addVisible = true;
    },
    //确认添加用户
    addAccountOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addAccount().then(val => {
            this._getAccountList();
            this.addVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    showEditDialog(item) {
      this.editForm.accountId = item.AccountId;
      this.editForm.username = item.UserName;
      this.editForm.mobile = item.AccountMobile;
      this.editForm.realName = item.RealName;
      this.editForm.sex = item.Sex;
      this.editVisible = true;
    },
    editAccountOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyAccount().then(val => {
            this._getAccountList();
            this.editVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    showPasswordDialog(item) {
      this.passwordForm.accountId = item.AccountId;
      this.passwordForm.password = "";
      this.passwordForm.repassword = "";
      this.passwordVisible = true;
    },
    passwordOk() {
      this.$refs["passwordForm"].validate(valid => {
        if (valid) {
          this._modifyAccountPassword().then(val => {
            this.passwordVisible = false;
            this.$message({
              type: "success",
              message: "密码修改成功",
              showClose: "true"
            });
          });
        } else {
          return false;
        }
      });
    },
    changeStatus(status, item) {
      this._modifyAccountStatus(item.AccountId, status);
    },
    showRoleDialog(item) {
      this._getRoleList().then(val => {
        this.checkedRole = item.RoleList;
        this.checkedAccountId = item.AccountId;
        this.roleVisible = true;
      });
    },
    roleOk() {
      this._setAccountRole().then(val=>{
        this._getAccountList();
        this.roleVisible=false;
      });
    },
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getAccountList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getAccountList();
    },
    //获取用户列表
    _getAccountList() {
      var par = {
        AccountName: this.searchAccountName,
        AccountMobile: this.searchMobile,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetAccountList(par,31).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //新增用户
    _addAccount() {
      var par = {
        UserName: this.addForm.username,
        Password: this.$md5(this.addForm.password),
        AccountMobile: this.addForm.mobile,
        RealName: this.addForm.realName,
        Sex: this.addForm.sex
      };
      return AddAccount(par,32);
    },
    //编辑用户
    _modifyAccount() {
      var par = {
        AccountId: this.editForm.accountId,
        UserName: this.editForm.username,
        AccountMobile: this.editForm.mobile,
        RealName: this.editForm.realName,
        Sex: this.editForm.sex
      };
      return ModifyAccount(par,33);
    },
    //设置用户状态
    _modifyAccountStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyAccountStatus(par,34);
    },
    //设置用户管理员状态
    _modifyAccountAdminStatus() {
      var par = {
        Id: "",
        Status: ""
      };
      return ModifyAccountAdminStatus(par);
    },
    //修改用户密码
    _modifyAccountPassword() {
      var par = {
        AccountId: this.passwordForm.accountId,
        Password: this.$md5(this.passwordForm.password)
      };
      return ModifyAccountPassword(par,35);
    },
    //获取角色列表
    _getRoleList() {
      var par = {
        PageIndex: 1,
        PageCount: 100
      };
      return GetRoleList(par,36).then(res => {
        this.roleList = res.List;
      });
    },
    //设置用户角色
    _setAccountRole() {
      var par = {
        AccountId: this.checkedAccountId,
        RoleIdList: this.checkedRole
      };
      return SetAccountRole(par,36);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
