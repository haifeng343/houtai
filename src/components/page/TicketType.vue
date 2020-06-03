<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="listSearch()">刷新</el-button>
        </el-form-item>
        <el-button
          style="float:right;margin-bottom:10px;"
          type="primary"
          @click="add()"
          v-if="common.haveRight('AddTicketType')"
        >添加卡券类型</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="TypeId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TypeName" align="center" label="类型名称"></el-table-column>
        <el-table-column prop="OrderIndex" align="center" label="排序值"></el-table-column>
        <el-table-column align="center" label="前端显示类型">
          <template
            slot-scope="scope"
          >{{scope.row.ShowType==1?"显示二维码图标":scope.row.ShowType==2?"显示立即使用按钮":"不显示按钮"}}</template>
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
              :disabled="!common.haveRight('ModifyTicketTypeStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="common.haveRight('ModifyTicketType')"
            >编辑</el-button>
            <!-- <el-button type="text" @click="deleted(scope.row)" class="red">删除</el-button> -->
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
    <!-- 添加卡券类型 -->
    <el-dialog title="添加卡券类型" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="120px" :rules="rules">
        <el-form-item label="类型名称:" prop="TypeName">
          <el-input v-model="addForm.TypeName" placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item label="排序值:" prop="OrderIndex">
          <el-input v-model="addForm.OrderIndex" placeholder="请输入排序值"></el-input>
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
    <!-- 编辑卡券类型 -->
    <el-dialog title="编辑卡券类型" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="120px" :rules="rules">
        <el-form-item label="类型名称:" prop="TypeName">
          <el-input v-model="editForm.TypeName" placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item label="排序值:" prop="OrderIndex">
          <el-input v-model="editForm.OrderIndex" placeholder="请输入排序值"></el-input>
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
  GetTicketTypeList,
  AddTicketType,
  ModifyTicketType,
  ModifyTicketTypeStatus,
  DeleteTicketType
} from "api/ticket.js";
export default {
  name: "TicketType",
  data() {
    return {
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //列表
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
      rules: {
        TypeName: [
          { required: true, message: "请输入类型名称", trigger: "blur" }
        ],
        OrderIndex: [
          { required: true, message: "请输入排序值", trigger: "blur" }
        ],
        ShowType: [
          { required: true, message: "请选择前端展示类型", trigger: "blur" }
        ]
      },
      addVisible: false,
      addForm: {
        TypeName: "",
        OrderIndex: "",
        ShowType: ""
      },
      editVisible: false,
      editForm: {
        TypeId: "",
        TypeName: "",
        OrderIndex: "",
        ShowType: ""
      }
    };
  },
  created() {
    this._getTicketTypeList();
  },
  methods: {
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getTicketTypeList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getTicketTypeList();
    },
    add() {
      this.addForm.TypeName = "";
      this.addForm.OrderIndex = "";
      this.addForm.ShowType = "";
      this.addVisible = true;
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addTicketType().then(val => {
            this._getTicketTypeList();
            this.addVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    edit(item) {
      this.editForm.TypeId = item.TypeId;
      this.editForm.TypeName = item.TypeName;
      this.editForm.OrderIndex = item.OrderIndex;
      this.editForm.ShowType = item.ShowType;
      this.editVisible = true;
    },
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyTicketType().then(val => {
            this._getTicketTypeList();
            this.editVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    changeStatus(status, item) {
      this._modifyTicketTypeStatus(item.TypeId, status);
    },
    deleted(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteTicketType(item.TypeId).then(val => {
            this._getTicketTypeList();
          });
        })
        .catch(() => {});
    },
    //获取卡券类型列表
    _getTicketTypeList() {
      var par = {
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetTicketTypeList(par, 291).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.listTable = res.List;
      });
    },
    //新增卡券类型
    _addTicketType() {
      var par = {
        TypeName: this.addForm.TypeName,
        OrderIndex: this.addForm.OrderIndex,
        ShowType: this.addForm.ShowType
      };
      return AddTicketType(par,292);
    },
    //编辑卡券类型
    _modifyTicketType() {
      var par = {
        TypeId: this.editForm.TypeId,
        TypeName: this.editForm.TypeName,
        OrderIndex: this.editForm.OrderIndex,
        ShowType: this.editForm.ShowType
      };
      return ModifyTicketType(par,293);
    },
    //修改卡券类型状态
    _modifyTicketTypeStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyTicketTypeStatus(par,294);
    },
    //删除卡券类型
    _deleteTicketType(id) {
      var par = {
        Id: id
      };
      return DeleteTicketType(par,295);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
