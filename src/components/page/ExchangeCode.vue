<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="兑换码:">
          <el-input v-model="codeNumberSearch" placeholder="请输入兑换码"></el-input>
        </el-form-item>
        <el-form-item label="领取标识/名称:">
          <el-input v-model="reviceTokenSearch" placeholder="请输入领取标识/名称"></el-input>
        </el-form-item>
        <el-form-item label="领取状态:">
          <el-select v-model="reviceStatusSearch" placeholder="请选择">
            <el-option
              v-for="item in reviceStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态:">
          <el-select v-model="useStatusSearch" placeholder="请选择">
            <el-option
              v-for="item in useStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddDialog()"
          style="float:right;margin-bottom:10px;"
        >创建兑换码</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="CodeNumber" align="center" label="兑换码"></el-table-column>
        <el-table-column prop="CodeDes" align="center" label="描述"></el-table-column>
        <el-table-column align="center" label="领取标识">
          <template slot-scope="scope">
            <span>{{scope.row.ReviceToken}}({{scope.row.ReviceName}})</span>
          </template>
        </el-table-column>
        <el-table-column label="领取状态" align="center" width="172px">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.ReviceStatus"
              active-text="已领取"
              inactive-text="未领取"
              :active-value="2"
              :inactive-value="1"
              @change="changeReviceStatus($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="使用状态">
          <template slot-scope="scope">
            <span>{{scope.row.UseStatus==1?'未使用':'已使用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="AccountName" align="center" label="使用账户"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="数据创建时间"></el-table-column>
        <el-table-column prop="UseTime" align="center" label="兑换时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jumpTOExchangeList(scope.row)"
              v-if="scope.row.UseStatus==2"
            >兑换列表</el-button>
            <el-button type="text" @click="showEditDialog(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteData(scope.row)" style="color:red">删除</el-button>
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
    <!-- 添加 -->
    <el-dialog title="添加信息" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="领取标识:" prop="reviceToken">
          <el-select v-model="addForm.reviceToken" placeholder="请选择">
            <el-option
              v-for="item in reviceList"
              :label="item.Name"
              :key="item.ReceiveToken"
              :value="item.ReceiveToken"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:" prop="codeDes">
          <el-input type="text" v-model="addForm.codeDes"></el-input>
        </el-form-item>
        <el-form-item label="兑换码数量:" prop="codeCount">
          <el-input type="text" v-model="addForm.codeCount"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑信息" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="rules">
        <el-form-item label="兑换码:" prop="codeNumber">
          <el-input type="text" v-model="editForm.codeNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="codeDes">
          <el-input type="text" v-model="editForm.codeDes"></el-input>
        </el-form-item>
        <el-form-item label="领取标识:" prop="reviceToken">
          <el-select v-model="editForm.reviceToken" placeholder="请选择">
            <el-option
              v-for="item in reviceList"
              :label="item.Name"
              :key="item.ReceiveToken"
              :value="item.ReceiveToken"
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
  GetExchangeCodeList,
  AddExchangeCode,
  ModifyExchangeCode,
  DeleteExchangeCode,
  ModifyExchangeCodeStatus,
  ModifyExchangeCodeReviceStatus,
  popTaskList
} from "api/pop.js";
export default {
  name: "ExchangeCode",
  data() {
    return {
      reviceStatusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "未领取" },
        { id: 2, name: "已领取" }
      ], //领取状态列表
      useStatusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "未使用" },
        { id: 2, name: "已使用" }
      ], //使用状态列表
      reviceList: [], //领取标识列表
      codeNumberSearch: "", //兑换码搜索条件
      reviceTokenSearch: "", //领取标识搜索条件
      reviceStatusSearch: 0, //领取状态搜索条件
      useStatusSearch: 0, //使用状态搜索条件
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //商家列表
      rules: {
        reviceToken: [
          { required: true, message: "请选择领取标识", trigger: "blur" }
        ],
        codeDes: [{ required: true, message: "请输入描述", trigger: "blur" }],
        codeCount: [{ required: true, message: "请输入数量", trigger: "blur" }]
      },
      addVisible: false,
      addForm: {
        reviceToken: "",
        codeDes: "",
        codeCount: ""
      },
      editVisible: false,
      editForm: {
        id: "",
        codeNumber: "",
        reviceToken: "",
        codeDes: ""
      }
    };
  },
  created() {
    this._getExchangeCodeList();
  },
  methods: {
    //商户列表搜索
    listSearch() {
      this.pageIndex = 1;
      this._getExchangeCodeList();
    },
    //商户列表页面变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getExchangeCodeList();
    },
    showAddDialog() {
      this._popTaskList();
      this.addForm.reviceToken = "";
      this.addForm.codeDes = "";
      this.addForm.codeCount = "";
      this.addVisible = true;
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addExchangeCode().then(val => {
            this._getExchangeCodeList();
            this.addVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    showEditDialog(item) {
      this._popTaskList();
      this.editForm.id = item.Id;
      this.editForm.codeNumber = item.CodeNumber;
      this.editForm.codeDes = item.CodeDes;
      this.editForm.reviceToken = item.ReviceToken;
      this.editVisible = true;
    },
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyExchangeCode().then(val => {
            this._getExchangeCodeList();
            this.editVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    deleteData(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteExchangeCode(item.Id).then(val => {
            this._getExchangeCodeList();
          });
        })
        .catch(() => {});
    },
    changeStatus(status, item) {
      this._modifyExchangeCodeStatus(item.Id, status);
    },
    changeReviceStatus(status, item) {
      this._modifyExchangeCodeReviceStatus(item.Id, status);
    },
    jumpTOExchangeList(item) {
      this.$router.push({
        path: "/ExchangeList/" + item.CodeNumber,
        query: {
          name: item.CodeNumber
        }
      });
    },
    //获取领取标识列表
    _popTaskList() {
      var par = {
        TaskName: "",
        StartTime: "",
        EndTime: "",
        PageCount: 100,
        PageIndex: 1,
        Status: 1
      };
      popTaskList(par).then(res => {
        this.reviceList = res.List;
      });
    },
    //获取兑换码列表
    _getExchangeCodeList() {
      var par = {
        CodeNumber: this.codeNumberSearch,
        ReviceToken: this.reviceTokenSearch,
        ReviceStatus: this.reviceStatusSearch,
        UseStatus: this.useStatusSearch,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetExchangeCodeList(par).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.listTable = res.List;
      });
    },
    //添加兑换码
    _addExchangeCode() {
      var par = {
        ReviceToken: this.addForm.reviceToken,
        CodeDes: this.addForm.codeDes,
        CodeCount: this.addForm.codeCount
      };
      return AddExchangeCode(par);
    },
    //编辑兑换码
    _modifyExchangeCode() {
      var par = {
        Id: this.editForm.id,
        CodeDes: this.editForm.codeDes,
        ReviceToken: this.editForm.reviceToken
      };
      return ModifyExchangeCode(par);
    },
    //删除兑换码
    _deleteExchangeCode(id) {
      var par = {
        Id: id
      };
      return DeleteExchangeCode(par);
    },
    //修改兑换码领取状态
    _modifyExchangeCodeReviceStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyExchangeCodeReviceStatus(par);
    },
    //修改兑换码状态
    _modifyExchangeCodeStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyExchangeCodeStatus(par);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
