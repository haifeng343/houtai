<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="标题:">
          <el-input v-model="searchTitle" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddDialog()"
          style="float:right;margin-bottom:10px;"
        >添加信息</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="Title" align="center" label="标题"></el-table-column>
        <el-table-column prop="Content" align="center" label="内容"></el-table-column>
        <el-table-column prop="OrderIndex" align="center" label="排序值"></el-table-column>
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
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteData(scope.row)" style="color:red">删除</el-button>
            </div>
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
        <el-form-item label="标题:" prop="Title">
          <el-input type="text" v-model="addForm.Title"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="Content">
          <el-input type="textarea" :rows="5" v-model="addForm.Content"></el-input>
        </el-form-item>
        <el-form-item label="排序值:" prop="OrderIndex">
          <el-input type="text" v-model="addForm.OrderIndex"></el-input>
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
        <el-form-item label="标题:" prop="Title">
          <el-input type="text" v-model="editForm.Title"></el-input>
        </el-form-item>
        <el-form-item label="内容:" prop="Content">
          <el-input type="textarea" :rows="5" v-model="editForm.Content"></el-input>
        </el-form-item>
        <el-form-item label="排序值:" prop="OrderIndex">
          <el-input type="text" v-model="editForm.OrderIndex"></el-input>
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
  GetStoreItemOthercontentList,
  AddStoreItemOthercontent,
  ModifyStoreItemOthercontent,
  ModifyStoreItemOthercontentStatus,
  DeleteStoreItemOthercontent
} from "api/seller.js";
export default {
  name:"AppointmentOthercontent",
  data() {
    return {
      relId: "", //关系Id
      searchTitle: "", //标题搜索条件
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //商家列表

      rules: {
        Title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        Content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        OrderIndex: [
          { required: true, message: "请输入排序值", trigger: "blur" }
        ]
      },
      addVisible: false,
      addForm: {
        Title: "",
        Content: "",
        OrderIndex: ""
      },
      editVisible: false,
      editForm: {
        Id: "",
        Title: "",
        Content: "",
        OrderIndex: ""
      }
    };
  },
  created() {
    this.relId = this.$route.params.id;
    this._getStoreItemOthercontentList();
  },
  methods: {
    //商户列表搜索
    listSearch() {
      this.pageIndex = 1;
      this._getStoreItemOthercontentList();
    },
    //商户列表页面变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getStoreItemOthercontentList();
    },
    //显示添加弹窗
    showAddDialog() {
      this.addForm.Title = "";
      this.addForm.Content = "";
      this.addForm.OrderIndex = "";
      this.addVisible = true;
    },
    //确认添加
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addStoreItemOthercontent().then(val => {
            this._getStoreItemOthercontentList();
            this.addVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //显示编辑弹窗
    showEditDialog(item) {
      this.editForm.Id = item.Id;
      this.editForm.Title = item.Title;
      this.editForm.Content = item.Content;
      this.editForm.OrderIndex = item.OrderIndex;
      this.editVisible = true;
    },
    //编辑确认
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyStoreItemOthercontent().then(val => {
            this._getStoreItemOthercontentList();
            this.editVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    changeStatus(status, item) {
      this._modifyStoreItemOthercontentStatus(item.Id, status);
    },
    deleteData(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteStoreItemOthercontent(item.Id).then(val => {
            this._getStoreItemOthercontentList();
          });
        })
        .catch(() => {});
    },
    //获取门店课程额外信息列表
    _getStoreItemOthercontentList() {
      var par = {
        Id: this.relId,
        Title: this.searchTitle,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetStoreItemOthercontentList(par).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //添加门店课程额外信息
    _addStoreItemOthercontent() {
      var par = {
        Id: this.relId,
        Title: this.addForm.Title,
        Content: this.addForm.Content,
        OrderIndex: this.addForm.OrderIndex
      };
      return AddStoreItemOthercontent(par);
    },
    //编辑门店课程额外信息
    _modifyStoreItemOthercontent() {
      var par = {
        Id: this.editForm.Id,
        Title: this.editForm.Title,
        Content: this.editForm.Content,
        OrderIndex: this.editForm.OrderIndex
      };
      return ModifyStoreItemOthercontent(par);
    },
    //修改门店课程额外信息状态
    _modifyStoreItemOthercontentStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyStoreItemOthercontentStatus(par);
    },
    //删除门店课程额外信息
    _deleteStoreItemOthercontent(id) {
      var par = {
        Id: id
      };
      return DeleteStoreItemOthercontent(par);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
