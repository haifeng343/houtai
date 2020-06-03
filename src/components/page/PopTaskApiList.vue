<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="创建时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="paymentListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          class="Popadd"
          type="primary"
          @click="add()"
          v-if="common.haveRight('AddPopTaskTemplateApi')"
        >添加API</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="paymentListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" width="180" label="Id" fixed></el-table-column>
        <el-table-column prop="ApiUrl" align="center" label="API"></el-table-column>
        <el-table-column prop="Description" width="240" align="center" label="API描述"></el-table-column>
        <el-table-column align="center" width="140" label="是否有效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyPopTaskTemplateApiStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" width="180" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" width="180" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="edit(scope.row)"
              v-if="common.haveRight('ModifyPopTaskTemplateApi')"
            >编辑</el-button>
            <el-button
              type="text"
              class="red"
              @click="deleteApi(scope.row)"
              v-if="common.haveRight('DeletePopTaskTemplateApi')"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建API -->
    <el-dialog title="创建API" :visible.sync="addApiVisible" width="800px">
      <el-form ref="addApiForm" :model="addApiForm" label-width="135px" :rules="addApiRules">
        <el-form-item label="搜索:">
          <el-select
            v-model="addApiForm.ApiName"
            multiple
            filterable
            default-first-option
            placeholder="请选择Api"
            style="width:100%;"
          >
            <el-option
              v-for="item in ApiList"
              :key="item.Id"
              :label="item.Description"
              :value="item.Id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addApiVisible = false" size="medium">取 消</el-button>
        <el-button @click="addTask()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑API描述-->
    <el-dialog title="创建API" :visible.sync="editApiVisible" width="800px">
      <el-form ref="editApiForm" :model="editApiForm" label-width="135px" :rules="editApiRules">
        <el-form-item label="API描述:" prop="Description">
          <el-input v-model="editApiForm.Description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editApiVisible = false" size="medium">取 消</el-button>
        <el-button @click="editTask('editApiForm')" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="paymentListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  popTaskTemplateApiList,
  popApiList,
  popTaskTemplateApiAdd,
  popTaskTemplateApiStatusModify,
  popTaskTemplateApiDelete,
  popTaskTemplateApiModify
} from "api/pop.js";
export default {
  name: "PaymentLog",
  data() {
    return {
      Id: "", //Id
      ApiList: [], //获取可添加的api列表
      Popname: "", //弹窗名称
      searchTime: "", //创建时间
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      paymentListTable: [], //列表

      addApiVisible: false, //创建弹窗
      addApiRules: {},
      addApiForm: {
        //弹窗form
        ApiName: ""
      },

      editApiForm: {
        Description: ""
      },
      editApiRules: {
        Description: [
          {
            required: true,
            message: "请输入API藐视",
            trigger: "blur"
          }
        ]
      },
      editApiVisible: false
    };
  },
  created() {
    this._popTaskTemplateApiList();
  },
  methods: {
    //获取到可添加的api列表
    _getPopApiList(Id) {
      popApiList({ ApiId: Id }, 273).then(res => {
        this.ApiList = res;
      });
    },
    //搜索
    paymentListSearch() {
      this.pageIndex = 1;
      this._popTaskTemplateApiList();
    },
    //列表分页变化
    paymentListCurrentChange(val) {
      this.pageIndex = val;
      this._popTaskTemplateApiList();
    },
    //创建任务
    add() {
      this.addApiVisible = true;
      this._getPopApiList();
      this.addApiForm.ApiName = [];
      this.$refs.multipleTable.clearSelection();
    },

    //确定添加
    addTask() {
      this._popTaskTemplateApiAdd();
      this.addApiVisible = false;
    },
    _popTaskTemplateApiAdd() {
      var par = {
        ApiIdList: this.addApiForm.ApiName
      };
      popTaskTemplateApiAdd(par, 273).then(res => {
        this._popTaskTemplateApiList();
      });
    },
    edit(item) {
      this.Id = item.Id;
      this.editApiForm.Description = item.Description;
      this.editApiVisible = true;
    },
    editTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._popTaskTemplateApiModify();
          this.editApiVisible = false;
        } else {
          return false;
        }
      });
    },
    _popTaskTemplateApiModify() {
      var par = {
        Id: this.Id,
        Description: this.editApiForm.Description
      };
      popTaskTemplateApiModify(par,274).then(res => {
        this._popTaskTemplateApiList();
      });
    },
    //修改是否有效
    changeStatus(status, item) {
      this._popTaskTemplateApiStatusModify(item.Id, status);
    },
    _popTaskTemplateApiStatusModify(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return popTaskTemplateApiStatusModify(par,276);
    },
    //获取API列表
    _popTaskTemplateApiList() {
      var par = {
        StartTime: this.searchTime != null ? this.searchTime[0] : "",
        EndTime: this.searchTime != null ? this.searchTime[1] : "",
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return popTaskTemplateApiList(par, 272).then(res => {
        this.paymentListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //删除
    deleteApi(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._popTaskTemplateApiDelete(item.Id).then(val => {
            this._popTaskTemplateApiList();
          });
        })
        .catch(() => {});
    },
    //删除
    _popTaskTemplateApiDelete(id) {
      var par = {
        Id: id
      };
      return popTaskTemplateApiDelete(par,275);
    }
  }
};
</script>

<style scoped lang='less'>
.Popadd {
  position: absolute;
  right: 40px;
}
.w80 {
  width: 80%;
}
.w78 {
  width: 78%;
}
.addBorder {
  display: flex;
  justify-content: flex-start;
}
.addClose {
  margin: 0 20px 0 30px;
}
.w160 {
  width: 160px;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
}
.posiLeft {
  position: absolute;
  left: -30px;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px solid #ccc;
}
.mtop20 {
  margin-top: 20px;
}
.w585 {
  width: 585px;
}
.m20 {
  margin: 20px 0;
}
.ml30 {
  margin-left: 53px;
}
.b5 {
  color: #5b5b5b;
}
</style>
