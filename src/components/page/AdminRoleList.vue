<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="角色名称:">
          <el-input v-model="searchRoleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button v-if="common.haveRight('AddRole')" type="primary" style="float:right;" @click="showAddForm()">添加角色</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="RoleId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="RoleName" align="center" label="角色名称"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyRoleStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button v-if="common.haveRight('ModifyRole')" type="text" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button v-if="common.haveRight('DeleteRole')" type="text" @click="deleteRole(scope.row)" class="red">删除</el-button>
            <el-button v-if="common.haveRight('SetRoleRight')" type="text" @click="jumpToAdminRight(scope.row)">权限列表</el-button>
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
    <el-dialog title="添加角色" :visible.sync="addVisible" width="663px">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入角色名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" class="dialog-certain" @click="addVisible=false">取 消</el-button>
        <el-button type="primary" size="medium" class="dialog-certain" @click="addRoleOk()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑弹出框 -->
    <el-dialog title="编辑角色" :visible.sync="editVisible" width="663px">
      <el-form ref="editForm" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName" placeholder="请输入角色名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" class="dialog-certain" @click="editVisible=false">取 消</el-button>
        <el-button type="primary" size="medium" class="dialog-certain" @click="editRoleOk()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetRoleList,
  AddRole,
  ModifyRole,
  ModifyRoleStatus,
  DeleteRole
} from "api/admin.js";
export default {
  name: "AdminRoleList",
  data() {
    return {
      searchRoleName: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //列表
      rules: {
        roleName: [{ required: true, message: "请输入角色名", trigger: "blur" }]
      },
      addVisible: false,
      addForm: {
        roleName: ""
      },
      editVisible: false,
      editForm: {
        roleId: "",
        roleName: ""
      }
    };
  },
  created() {
    this._getRoleList();
  },
  methods: {
    jumpToAdminRight(item) {
      this.$router.push({
        path: `/AdminRight/${item.RoleId}`,
        query: {
          name: item.RoleName
        }
      });
    },
    showAddForm() {
      this.addForm.roleName = "";
      this.addVisible = true;
    },
    addRoleOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addRole().then(val => {
            this._getRoleList();
            this.addVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    showEditDialog(item) {
      this.editForm.roleId = item.RoleId;
      this.editForm.roleName = item.RoleName;
      this.editVisible = true;
    },
    editRoleOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyRole().then(val => {
            this._getRoleList();
            this.editVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    changeStatus(status, item) {
      this._modifyRoleStatus(item.RoleId, status);
    },
    deleteRole(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteRole(item.RoleId).then(val => {
            this._getRoleList();
          });
        })
        .catch(() => {});
    },
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getRoleList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getRoleList();
    },
    //获取角色列表
    _getRoleList() {
      var par = {
        RoleName: this.searchRoleName,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetRoleList(par,37).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //新增角色
    _addRole() {
      var par = {
        RoleName: this.addForm.roleName
      };
      return AddRole(par,38);
    },
    //编辑角色
    _modifyRole() {
      var par = {
        RoleId: this.editForm.roleId,
        RoleName: this.editForm.roleName
      };
      return ModifyRole(par,39);
    },
    //设置角色状态
    _modifyRoleStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyRoleStatus(par,40);
    },
    //删除角色
    _deleteRole(id) {
      var par = {
        Id: id
      };
      return DeleteRole(par,41);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
