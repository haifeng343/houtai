<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="bind()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('BindPopTaskTemplate')"
        >绑定</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TemplateName" align="center" label="模板名称"></el-table-column>
        <el-table-column prop="BindTime" align="center" label="绑定时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="unbind(scope.row)" v-if="common.haveRight('UnBindPopTaskTemplate')">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 绑定模板 -->
    <el-dialog title="绑定任务" :visible.sync="bindVisible" width="633px">
      <el-checkbox-group v-model="bindForm.TemplateIdList">
        <el-checkbox v-for="item in totalBindList" :label="item.Id" :key="item.Id">{{item.Name}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bindVisible = false" size="medium">取 消</el-button>
        <el-button @click="bindOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetPopTaskTemplateBindList,
  BindPopTaskTemplate,
  UnBindPopTaskTemplate,
  popTaskTemplateList
} from "api/pop.js";
export default {
  data() {
    return {
      taskId: "",
      listTable: [],
      totalBindList: [],
      bindVisible: false,
      bindForm: {
        TemplateIdList: []
      }
    };
  },
  created() {
    this.taskId = this.$route.params.id;
    this._getPopTaskList();
  },
  methods: {
    //搜索
    listSearch() {
      this.pageIndex = 1;
      this._getPopTaskList();
    },
    bind() {
      this.bindForm.TemplateIdList = this.listTable.map(item => {
        return item.TemplateId;
      });
      this._getPopTaskTemplateList();
      this.bindVisible = true;
    },
    bindOk() {
      this._bindPopTaskTemplate().then(val => {
        this._getPopTaskList();
        this.bindVisible = false;
      });
    },
    unbind(item) {
      this._unBindPopTaskTemplate(item.Id).then(val => {
        this._getPopTaskList();
      });
    },
    //获取任务列表
    _getPopTaskList() {
      var par = {
        Id: this.taskId
      };
      return GetPopTaskTemplateBindList(par, 263).then(res => {
        this.listTable = res;
      });
    },
    //绑定任务模板
    _bindPopTaskTemplate() {
      var par = {
        TaskId: this.taskId,
        TemplateIdList: this.bindForm.TemplateIdList
      };
      return BindPopTaskTemplate(par,264);
    },
    //解绑任务模板
    _unBindPopTaskTemplate(id) {
      var par = {
        Id: id
      };
      return UnBindPopTaskTemplate(par,265);
    },
    //获取任务模板列表
    _getPopTaskTemplateList() {
      var par = {
        Status: 1,
        PageCount: 100,
        PageIndex: 1
      };
      return popTaskTemplateList(par,264).then(res => {
        this.totalBindList = res.List;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
