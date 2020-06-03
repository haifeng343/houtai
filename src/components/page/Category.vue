<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="门店品类名称:">
          <el-input v-model="searchCategoryName" placeholder="请输入门店品类名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="categoryListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddCategoryDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddSellerStoreCategory')"
        >添加门店品类</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="CategoryListTable" border ref="multipleTable">
        <el-table-column prop="CategoryId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="CategoryName" align="center" label="门店品类名称"></el-table-column>
        <el-table-column label="状态" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySellerStoreCategoryStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showEditCategoryDialog(scope.row)"
              v-if="common.haveRight('ModifySellerStoreCategory')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleteCategory(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteSellerStoreCategory')"
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
        @current-change="categoryListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加门店品类弹窗 -->
    <el-dialog title="添加门店品类" :visible.sync="addCategoryVisible" width="633px">
      <el-form
        ref="addCategoryForm"
        :model="addCategoryForm"
        label-width="120px"
        :rules="categoryRules"
      >
        <el-form-item label="门店品类名称:" prop="categoryName">
          <el-input v-model="addCategoryForm.categoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryVisible = false" size="medium">取 消</el-button>
        <el-button @click="addCategoryOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑门店品类弹窗 -->
    <el-dialog title="编辑课程类型" :visible.sync="editCategoryVisible" width="633px">
      <el-form
        ref="editCategoryForm"
        :model="editCategoryForm"
        label-width="120px"
        :rules="categoryRules"
      >
        <el-form-item label="门店品类名称:" prop="categoryName">
          <el-input v-model="editCategoryForm.categoryName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryVisible = false" size="medium">取 消</el-button>
        <el-button @click="editCategoryOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  AddSellerStoreCategory,
  GetSellerStoreCategoryList,
  ModifySellerStoreCategory,
  ModifySellerStoreCategoryStatus,
  DeleteSellerStoreCategory
} from "api/seller.js";
export default {
  name: "Tag",
  data() {
    return {
      searchCategoryName: "", //名称搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      CategoryListTable: [], //项目列表
      clickItem: {}, //点击某一行数据
      addCategoryVisible: false, //添加标签弹窗是否可见
      addCategoryForm: {
        categoryName: ""
      },
      editCategoryVisible: false, //编辑弹窗是否可见
      editCategoryForm: {
        categoryName: ""
      },
      categoryRules: {
        categoryName: [
          { required: true, message: "请输入门店品类名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this._getCategoryList();
  },
  methods: {
    //搜索
    categoryListSearch() {
      this.pageIndex = 1;
      this._getCategoryList();
    },
    //列表分页变化
    categoryListCurrentChange(val) {
      this.pageIndex = val;
      this._getCategoryList();
    },
    //显示添加弹窗
    showAddCategoryDialog() {
      this.addCategoryVisible = true;
      this.addCategoryForm.categoryName = "";
    },
    //添加确认
    addCategoryOk() {
      this.$refs["addCategoryForm"].validate(valid => {
        if (valid) {
          this._addCategory().then(val => {
            this.addCategoryVisible = false;
            this._getCategoryList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑弹窗
    showEditCategoryDialog(item) {
      this.clickItem = item;
      this.editCategoryForm.categoryName = item.CategoryName;
      this.editCategoryVisible = true;
    },
    //编辑确认
    editCategoryOk() {
      this.$refs["editCategoryForm"].validate(valid => {
        if (valid) {
          this._modifyCategory().then(val => {
            this.editCategoryVisible = false;
            this._getCategoryList();
          });
        } else {
          return false;
        }
      });
    },
    //修改门店品类状态
    changeStatus(status, item) {
      this._modifyCategoryStatus(item.CategoryId, status);
    },
    //删除门店品类
    deleteCategory(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteCategory(item.CategoryId).then(val => {
            this._getCategoryList();
          });
        })
        .catch(() => {});
    },
    //添加门店品类确定判断
    _addCategory() {
      var par = {
        CategoryName: this.addCategoryForm.categoryName
      };
      return AddSellerStoreCategory(par,222);
    },
    //获取门店品类列表
    _getCategoryList() {
      var par = {
        CategoryName: this.searchCategoryName,
        Status: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetSellerStoreCategoryList(par, 221).then(res => {
        this.CategoryListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //编辑门店品类
    _modifyCategory() {
      var par = {
        CategoryId: this.clickItem.CategoryId,
        CategoryName: this.editCategoryForm.categoryName
      };
      return ModifySellerStoreCategory(par,223);
    },
    //修改门店品类状态
    _modifyCategoryStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySellerStoreCategoryStatus(par,224);
    },
    //删除门店品类
    _deleteCategory(id) {
      var par = {
        Id: id
      };
      return DeleteSellerStoreCategory(par,225);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
