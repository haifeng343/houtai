<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="类型名称:">
          <el-input v-model="searchItemTypeName" placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="itemTypeListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddItemTypeDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddSellerItemType')"
        >添加课程类型</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="ItemTypeListTable" border ref="multipleTable">
        <el-table-column prop="TypeId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TypeName" align="center" label="课程类型"></el-table-column>
        <el-table-column prop="InitialCount" align="center" label="验券奖励初始门数"></el-table-column>
        <el-table-column prop="InitialAmount" align="center" label="验券奖励初始金额（元）">
          <template slot-scope="scope">{{scope.row.InitialAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column prop="Gradient" align="center" label="验券奖励金额梯度（元）">
          <template slot-scope="scope">{{scope.row.Gradient*1.0/100}}</template>
        </el-table-column>
        <el-table-column label="状态" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySellerItemTypeStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showEditItemTypeDialog(scope.row)"
              v-if="common.haveRight('ModifySellerItemType')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleteItemType(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteSellerItemType')"
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
        @current-change="itemTypeListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加标签弹窗 -->
    <el-dialog title="添加标签" :visible.sync="addItemTypeVisible" width="633px">
      <el-form
        ref="addItemTypeForm"
        :model="addItemTypeForm"
        label-width="170px"
        :rules="itemTypeRules"
      >
        <el-form-item label="类型名称:" prop="itemTypeName">
          <el-input v-model="addItemTypeForm.itemTypeName"></el-input>
        </el-form-item>
        <el-form-item label="验券奖励初始门数:" prop="initialCount">
          <el-input v-model="addItemTypeForm.initialCount"></el-input>
        </el-form-item>
        <el-form-item label="验券奖励初始金额(分):" prop="initialAmount">
          <el-input v-model="addItemTypeForm.initialAmount"></el-input>
        </el-form-item>
        <el-form-item label="验券奖励金额梯度(分):" prop="gradient">
          <el-input v-model="addItemTypeForm.gradient"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addItemTypeVisible = false" size="medium">取 消</el-button>
        <el-button @click="addItemTypeOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑标签弹窗 -->
    <el-dialog title="编辑课程类型" :visible.sync="editItemTypeVisible" width="633px">
      <el-form
        ref="editItemTypeForm"
        :model="editItemTypeForm"
        label-width="170px"
        :rules="itemTypeRules"
      >
        <el-form-item label="类型名称:" prop="itemTypeName">
          <el-input v-model="editItemTypeForm.itemTypeName"></el-input>
        </el-form-item>
        <el-form-item label="验券奖励初始门数:" prop="initialCount">
          <el-input v-model="editItemTypeForm.initialCount"></el-input>
        </el-form-item>
        <el-form-item label="验券奖励初始金额(分):" prop="initialAmount">
          <el-input v-model="editItemTypeForm.initialAmount"></el-input>
        </el-form-item>
        <el-form-item label="验券奖励金额梯度(分):" prop="gradient">
          <el-input v-model="editItemTypeForm.gradient"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editItemTypeVisible = false" size="medium">取 消</el-button>
        <el-button @click="editItemTypeOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  AddItemType,
  GetItemTypeList,
  ModifyItemType,
  ModifyItemTypeStatus,
  DeleteItemType
} from "api/itemtype.js";
export default {
  name: "Tag",
  data() {
    return {
      searchItemTypeName: "", //名称搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      ItemTypeListTable: [], //项目列表
      clickItem: {}, //点击某一行数据
      addItemTypeVisible: false, //添加标签弹窗是否可见
      addItemTypeForm: {
        itemTypeName: "",
        initialCount: "",
        initialAmount: "",
        gradient: ""
      },
      editItemTypeVisible: false, //编辑弹窗是否可见
      editItemTypeForm: {
        itemTypeName: "",
        initialCount: "",
        initialAmount: "",
        gradient: ""
      },
      itemTypeRules: {
        itemTypeName: [
          { required: true, message: "请输入课程类型名称", trigger: "blur" }
        ],
        initialCount: [
          { required: true, message: "请输入验券奖励初始门数", trigger: "blur" }
        ],
        initialAmount: [
          { required: true, message: "请输入验券奖励初始金额", trigger: "blur" }
        ],
        gradient: [
          { required: true, message: "请输入验券奖励金额梯度", trigger: "blur" }
        ]
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
    this._getItemTypeList();
  },
  methods: {
    //搜索
    itemTypeListSearch() {
      this.pageIndex = 1;
      this._getItemTypeList();
    },
    //列表分页变化
    itemTypeListCurrentChange(val) {
      this.pageIndex = val;
      this._getItemTypeList();
    },
    //显示添加弹窗
    showAddItemTypeDialog() {
      this.addItemTypeVisible = true;
      this.addItemTypeForm.itemTypeName = "";
      this.addItemTypeForm.initialCount = "";
      this.addItemTypeForm.initialAmount = "";
      this.addItemTypeForm.gradient = "";
    },
    //添加确认
    addItemTypeOk() {
      this.$refs["addItemTypeForm"].validate(valid => {
        if (valid) {
          this._addItemType().then(val => {
            this.addItemTypeVisible = false;
            this._getItemTypeList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑弹窗
    showEditItemTypeDialog(item) {
      this.clickItem = item;
      this.editItemTypeForm.itemTypeName = item.TypeName;
      this.editItemTypeForm.initialCount = item.InitialCount;
      this.editItemTypeForm.initialAmount = item.InitialAmount;
      this.editItemTypeForm.gradient = item.Gradient;
      this.editItemTypeVisible = true;
    },
    //编辑确认
    editItemTypeOk() {
      this.$refs["editItemTypeForm"].validate(valid => {
        if (valid) {
          this._modifyItemType().then(val => {
            this.editItemTypeVisible = false;
            this._getItemTypeList();
          });
        } else {
          return false;
        }
      });
    },
    //修改账户状态
    changeStatus(status, item) {
      this._modifyItemTypeStatus(item.TypeId, status);
    },
    //删除商圈
    deleteItemType(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteItemType(item.TypeId).then(val => {
            this._getItemTypeList();
          });
        })
        .catch(() => {});
    },
    //添加商圈确定判断
    _addItemType() {
      var par = {
        TypeName: this.addItemTypeForm.itemTypeName,
        InitialCount: this.addItemTypeForm.initialCount,
        InitialAmount: this.addItemTypeForm.initialAmount,
        Gradient: this.addItemTypeForm.gradient
      };
      return AddItemType(par, 212);
    },
    //获取商圈列表
    _getItemTypeList() {
      var par = {
        TypeName: this.searchItemTypeName,
        Status: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetItemTypeList(par, 211).then(res => {
        this.ItemTypeListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //编辑商圈
    _modifyItemType() {
      var par = {
        TypeId: this.clickItem.TypeId,
        TypeName: this.editItemTypeForm.itemTypeName,
        InitialCount: this.editItemTypeForm.initialCount,
        InitialAmount: this.editItemTypeForm.initialAmount,
        Gradient: this.editItemTypeForm.gradient
      };
      return ModifyItemType(par,213);
    },
    //修改商圈状态
    _modifyItemTypeStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyItemTypeStatus(par,214);
    },
    //删除商圈
    _deleteItemType(id) {
      var par = {
        Id: id
      };
      return DeleteItemType(par,215);
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
