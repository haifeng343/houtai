<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="信息名称">
        <el-input v-model="name" placeholder="请输入信息名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-button
        type="primary"
        class="add"
        @click="add"
        v-if="common.haveRight('AddStoreExtra')"
      >添加额外信息</el-button>
    </el-form>
    <el-table :data="tableData" center style="width: 100%">
      <el-table-column label="ID" align="center" prop="Id"></el-table-column>
      <el-table-column label="排序值" align="center" prop="OrderIndex"></el-table-column>
      <el-table-column label="信息名称" align="center" prop="Name"></el-table-column>
      <el-table-column label="信息内容" align="center" width="600px" prop="Content"></el-table-column>
      <el-table-column label="是否有效" align="center">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.Status"
            :active-value="1"
            :inactive-value="2"
            @change="modifyStatus(scope.row)"
            style="display: block"
            active-color="#61A4FE"
            inactive-color="#CDCCCA"
            active-text="有效"
            inactive-text="无效"
            :disabled="!common.haveRight('ModifyStoreExtraStatus')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="最后更新时间" align="center" prop="LastModified"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="edit(scope.row)"
            v-if="common.haveRight('ModifyStoreExtra')"
          >编辑</el-button>
          <el-button
            type="text"
            class="red"
            @click="deleteData(scope.row.Id)"
            v-if="common.haveRight('DeleteStoreExtra')"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--增加-->
    <el-dialog :title="tip" :visible.sync="addVisible" width="1000px">
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="信息名称:" prop="Name">
          <el-input v-model="addForm.Name" placeholder="请输入信息名称"></el-input>
        </el-form-item>
        <el-form-item label="排序值:" prop="OrderIndex">
          <el-input v-model="addForm.OrderIndex" placeholder="请输入排序值"></el-input>
        </el-form-item>
        <el-form-item label="信息内容:" prop="Content">
          <quill-editor v-model="addForm.Content" :options="editorOption"></quill-editor>
          <!-- <el-input type="textarea" :row="25" v-model="addForm.Content" placeholder="请输入团单名称"></el-input> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')">关 闭</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--分页-->
    <div class="pagination">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager-count="11"
        layout="prev, pager, next"
        :total="TotalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import {
  GetStoreExtraList,
  AddStoreExtra,
  ModifyStoreExtra,
  ModifyStoreExtraStatus,
  DeleteStoreExtra
} from "api/seller.js";
export default {
  name: "StoreExtra",
  data() {
    return {
      editorOption: {},
      Id: "", //团单Id
      name: "",
      tableData: [],
      TotalCount: 0,
      pageSize: 20,
      currentPage: 1,
      tip: "添加信息",
      addVisible: false,
      addForm: {
        Name: "",
        Content: "",
        OrderIndex: ""
      },
      addrules: {
        Name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        Content: [{ required: true, message: "请输入内容", trigger: "blur" }],
        OrderIndex: [
          { required: true, message: "请输入排序值", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.Id = this.$route.params.id;
    this._extraList(1);
  },

  watch: {
    $route(newValue, oldValue) {
      this.Id = this.$route.query.Id;
      this._extraList(1);
    }
  },
  methods: {
    //项目列表
    _extraList() {
      const params = {
        StoreId: this.Id,
        Name: this.name,
        PageCount: this.pageSize,
        PageIndex: this.currentPage
      };
      GetStoreExtraList(params, 318).then(res => {
        this.tableData = res.List;
        this.TotalCount = res.TotalCount;
      });
    },
    _extraAdd(F) {
      const params = {
        Name: this.addForm.Name,
        Content: this.addForm.Content,
        OrderIndex: this.addForm.OrderIndex
      };
      let Url = F == 1 ? ModifyStoreExtra : AddStoreExtra;
      if (F == 1) {
        params.Id = this.addForm.Id;
      } else {
        params.StoreId = this.Id;
      }
      Url(params, F == 1 ? 320 : 319).then(res => {
        this.$message({
          message: F == 1 ? "编辑成功" : "添加成功",
          showClose: true,
          type: "success"
        });
        this._extraList();
      });
    },
    submitForm(formName) {
      let F = this.addForm.Id ? 1 : 0;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._extraAdd(F);
          this.addVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addVisible = false;
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this._extraList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this._extraList();
    },
    //修改团单状态
    modifyStatus(item) {
      const params = {
        Id: item.Id,
        Status: item.Status
      };
      ModifyStoreExtraStatus(params, 321).then(res => {
        this.$message({
          message: "修改成功",
          showClose: true,
          type: "success"
        });
      });
    },
    //搜索
    search() {
      this.currentPage = 1;
      this._extraList();
    },
    add() {
      this.addVisible = true;
      this.tip = "添加信息";
      this.addForm = {};
    },
    edit(item) {
      this.addVisible = true;
      this.tip = "编辑信息-" + item.Name;
      this.addForm = Object.assign({}, item);
      console.log(item);
    },
    // 删除
    deleteData(Id) {
      this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            Id: Id
          };
          DeleteStoreExtra(params, 322)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this._extraList();
            })
            .catch(error => {
              console.log("error");
            });
        })
        .catch(() => {});
    }
  }
};
</script>

<style>
.ql-editor {
  min-height: 300px;
}
</style>
