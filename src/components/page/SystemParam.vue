<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="参数名称:">
          <el-input v-model="searchParName" placeholder="参数名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="parListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="parListTable" border ref="multipleTable">
        <el-table-column prop="ParName" align="center" label="参数名称" fixed></el-table-column>
        <el-table-column prop="ParValue" align="center" label="参数值"></el-table-column>
        <el-table-column prop="ParDes" align="center" label="描述"></el-table-column>
        <el-table-column prop="UpdateTime" align="center" label="更新时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="400px">
          <template slot-scope="scope">
            <el-button v-if="common.haveRight('ModifySystemParam')" type="text" @click="showEditParDialog(scope.row)">编辑</el-button>
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
        @current-change="parListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 编辑系统参数弹窗 -->
    <el-dialog title="编辑系统参数" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="85px" :rules="rules">
        <el-form-item label="参数名称:" prop="parName">
          <el-input v-model="editForm.parName" placeholder="请输入参数名称"></el-input>
        </el-form-item>
        <el-form-item label="参数值:" prop="parValue">
          <el-input v-model="editForm.parValue" placeholder="请输入参数值"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="parDes">
          <el-input type="textarea" :rows="4" v-model="editForm.parDes" placeholder="请输入参数描述"></el-input>
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
import { GetSystemParamList ,ModifySystemParam} from "api/param.js";
export default {
  name: "SystemParam",
  data() {
    return {
      searchParName: "", //参数名搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      parListTable: [], //列表
      rules: {
        parName: [
          { required: true, message: "请输入参数名称", trigger: "blur" }
        ],
        parValue: [
          { required: true, message: "请输入参数值", trigger: "blur" }
        ],
        parDes: [{ required: true, message: "请输入参数描述", trigger: "blur" }]
      },
      editVisible: false,
      editForm: {
        parName: "",
        parValue: "",
        parDes: ""
      }
    };
  },
  created() {
    this._getSystemParamList();
  },
  methods: {
    //搜索
    parListSearch() {
      this.pageIndex = 1;
      this._getSystemParamList();
    },
    //分页变化
    parListCurrentChange(val) {
      this.pageIndex = val;
      this._getSystemParamList();
    },
    showEditParDialog(item) {
      this.editForm.parName = item.ParName;
      this.editForm.parValue = item.ParValue;
      this.editForm.parDes = item.ParDes;
      this.editVisible = true;
    },
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifySystemParam().then(val => {
            this.editVisible = false;
            this._getSystemParamList();
          });
        } else {
          return false;
        }
      });
    },
    //获取系统参数列表
    _getSystemParamList() {
      var par = {
        ParamName: this.searchParName,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetSystemParamList(par,12).then(res => {
        (this.parListTable = res.List), (this.pageTotalCount = res.TotalCount);
      });
    },
    //编辑系统参数
    _modifySystemParam() {
      var par = {
        ParName: this.editForm.parName,
        ParValue: this.editForm.parValue,
        ParDes: this.editForm.parDes
      };
      return ModifySystemParam(par,13);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
