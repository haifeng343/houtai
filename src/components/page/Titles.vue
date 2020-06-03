<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="职称名称:">
          <el-input v-model="searchTitlesName" placeholder="请输入职称名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="titlesListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddTitlesDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddTeacherTitles')"
        >添加职称</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="TitlesListTable" border ref="multipleTable">
        <el-table-column prop="TitlesId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TitlesName" align="center" label="职称名称"></el-table-column>
        <el-table-column label="状态" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyTeacherTitlesStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showEditTitlesDialog(scope.row)"
              v-if="common.haveRight('ModifyTeacherTitles')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleteTitles(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteTeacherTitles')"
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
        @current-change="titlesListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加职称弹窗 -->
    <el-dialog title="添加职称" :visible.sync="addTitlesVisible" width="633px">
      <el-form ref="addTitlesForm" :model="addTitlesForm" label-width="85px" :rules="titlesRules">
        <el-form-item label="职称名称:" prop="titlesName">
          <el-input v-model="addTitlesForm.titlesName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTitlesVisible = false" size="medium">取 消</el-button>
        <el-button @click="addTitlesOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑职称弹窗 -->
    <el-dialog title="编辑课程类型" :visible.sync="editTitlesVisible" width="633px">
      <el-form ref="editTitlesForm" :model="editTitlesForm" label-width="85px" :rules="titlesRules">
        <el-form-item label="职称名称:" prop="titlesName">
          <el-input v-model="editTitlesForm.titlesName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTitlesVisible = false" size="medium">取 消</el-button>
        <el-button @click="editTitlesOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  AddTitles,
  GetTitlesList,
  ModifyTitles,
  ModifyTitlesStatus,
  DeleteTitles
} from "api/titles.js";
export default {
  name: "Tag",
  data() {
    return {
      searchTitlesName: "", //名称搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      TitlesListTable: [], //项目列表
      clickItem: {}, //点击某一行数据
      addTitlesVisible: false, //添加标签弹窗是否可见
      addTitlesForm: {
        titlesName: ""
      },
      editTitlesVisible: false, //编辑弹窗是否可见
      editTitlesForm: {
        titlesName: ""
      },
      titlesRules: {
        titlesName: [
          { required: true, message: "请输入职称名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this._getTitlesList();
  },
  methods: {
    //搜索
    titlesListSearch() {
      this.pageIndex = 1;
      this._getTitlesList();
    },
    //列表分页变化
    titlesListCurrentChange(val) {
      this.pageIndex = val;
      this._getTitlesList();
    },
    //显示添加弹窗
    showAddTitlesDialog() {
      this.addTitlesVisible = true;
      this.addTitlesForm.titlesName = "";
    },
    //添加确认
    addTitlesOk() {
      this.$refs["addTitlesForm"].validate(valid => {
        if (valid) {
          this._addTitles().then(val => {
            this.addTitlesVisible = false;
            this._getTitlesList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑弹窗
    showEditTitlesDialog(item) {
      this.clickItem = item;
      this.editTitlesForm.titlesName = item.TitlesName;
      this.editTitlesVisible = true;
    },
    //编辑确认
    editTitlesOk() {
      this.$refs["editTitlesForm"].validate(valid => {
        if (valid) {
          this._modifyTitles().then(val => {
            this.editTitlesVisible = false;
            this._getTitlesList();
          });
        } else {
          return false;
        }
      });
    },
    //修改账户状态
    changeStatus(status, item) {
      this._modifyTitlesStatus(item.TitlesId, status);
    },
    //删除商圈
    deleteTitles(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteTitles(item.TitlesId).then(val => {
            this._getTitlesList();
          });
        })
        .catch(() => {});
    },
    //添加商圈确定判断
    _addTitles() {
      var par = {
        TitlesName: this.addTitlesForm.titlesName
      };
      return AddTitles(par, 232);
    },
    //获取商圈列表
    _getTitlesList() {
      var par = {
        TitlesName: this.searchTitlesName,
        Status: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetTitlesList(par, 231).then(res => {
        this.TitlesListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //编辑商圈
    _modifyTitles() {
      var par = {
        TitlesId: this.clickItem.TitlesId,
        TitlesName: this.editTitlesForm.titlesName
      };
      return ModifyTitles(par, 233);
    },
    //修改商圈状态
    _modifyTitlesStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyTitlesStatus(par, 234);
    },
    //删除商圈
    _deleteTitles(id) {
      var par = {
        Id: id
      };
      return DeleteTitles(par, 235);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
