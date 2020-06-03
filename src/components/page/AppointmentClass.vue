<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" @click="listSearch()">刷新</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddDialog()"
          style="float:right;margin-bottom:10px;"
        >添加</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID"></el-table-column>
        <el-table-column prop="ScheduleName" align="center" label="预约描述"></el-table-column>
        <el-table-column prop="ClassTime" align="center" label="上课时间"></el-table-column>
        <el-table-column prop="ClassDuration" align="center" label="时长（分）"></el-table-column>
        <el-table-column prop="RemainQuota" align="center" label="剩余名额"></el-table-column>
        <el-table-column prop="AppointmentQuota" align="center" label="预约数量"></el-table-column>
        <el-table-column prop="AppointmentShiftQuota" align="center" label="插班数量"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
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
    <el-dialog title="添加预约" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="预约描述:" prop="ScheduleName">
          <el-input type="text" v-model="addForm.ScheduleName"></el-input>
        </el-form-item>
        <el-form-item label="上课时间:" prop="ClassTime">
          <el-input type="text" v-model="addForm.ClassTime"></el-input>
        </el-form-item>
        <el-form-item label="时长（分）:" prop="ClassDuration">
          <el-input type="text" v-model="addForm.ClassDuration"></el-input>
        </el-form-item>
        <el-form-item label="剩余名额:" prop="RemainQuota">
          <el-input type="text" v-model="addForm.RemainQuota"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑预约" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="rules">
        <el-form-item label="预约描述:" prop="ScheduleName">
          <el-input type="text" v-model="editForm.ScheduleName"></el-input>
        </el-form-item>
        <el-form-item label="上课时间:" prop="ClassTime">
          <el-input type="text" v-model="editForm.ClassTime"></el-input>
        </el-form-item>
        <el-form-item label="时长（分）:" prop="ClassDuration">
          <el-input type="text" v-model="editForm.ClassDuration"></el-input>
        </el-form-item>
        <el-form-item label="剩余名额:" prop="RemainQuota">
          <el-input type="text" v-model="editForm.RemainQuota"></el-input>
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
  GetStoreItemAppointmentDetails,
  AddStoreItemAppointmentDetails,
  ModifyStoreItemAppointmentDetails,
  DeleteStoreItemAppointmentDetails
} from "api/seller.js";
export default {
  name: "AppointmentClass",
  data() {
    return {
      storeId: "",
      itemId: "",
      date: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //商家列表
      rules: {
        ScheduleName: [
          { required: true, message: "请输入预约描述", trigger: "blur" }
        ],
        ClassTime: [
          { required: true, message: "请输入上课时间", trigger: "blur" }
        ],
        ClassDuration: [
          { required: true, message: "请输入时长", trigger: "blur" }
        ],
        RemainQuota: [
          { required: true, message: "请输入剩余名额", trigger: "blur" }
        ]
      },
      addVisible: false,
      addForm: {
        ScheduleName: "",
        ClassTime: "",
        ClassDuration: "",
        RemainQuota: ""
      },
      editVisible: false,
      editForm: {
        Id: "",
        ScheduleName: "",
        ClassTime: "",
        ClassDuration: "",
        RemainQuota: ""
      }
    };
  },
  created() {
    this.storeId = this.$route.params.storeid;
    this.itemId = this.$route.params.itemid;
    this.date = this.$route.params.date;
    this._getStoreItemAppointmentDetails();
  },
  methods: {
    //商户列表搜索
    listSearch() {
      this.pageIndex = 1;
      this._getStoreItemAppointmentDetails();
    },
    //商户列表页面变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getStoreItemAppointmentDetails();
    },
    showAddDialog() {
      this.addForm.ScheduleName = "";
      this.addForm.ClassTime = "";
      this.addForm.ClassDuration = "";
      this.addForm.RemainQuota = "";
      this.addVisible = true;
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addStoreItemAppointmentDetails().then(val => {
            this._getStoreItemAppointmentDetails();
            this.addVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    showEditDialog(item) {
      this.editForm.Id = item.Id;
      this.editForm.ScheduleName = item.ScheduleName;
      this.editForm.ClassTime = item.ClassTime;
      this.editForm.ClassDuration = item.ClassDuration;
      this.editForm.RemainQuota = item.RemainQuota;
      this.editVisible = true;
    },
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyStoreItemAppointmentDetails().then(val => {
            this._getStoreItemAppointmentDetails();
            this.editVisible = false;
          });
        } else {
          console.log("error submit!!");
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
          this._deleteStoreItemAppointmentDetails(item.Id).then(val => {
            this._getStoreItemAppointmentDetails();
          });
        })
        .catch(() => {});
    },
    //获取门店课程预约排课信息
    _getStoreItemAppointmentDetails() {
      var par = {
        StoreId: this.storeId,
        ItemId: this.itemId,
        Date: this.date,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetStoreItemAppointmentDetails(par).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //添加门店课程预约排课信息
    _addStoreItemAppointmentDetails() {
      var par = {
        StoreId: this.storeId,
        ItemId: this.itemId,
        ScheduleName: this.addForm.ScheduleName,
        ClassDate: this.date,
        ClassTime: this.addForm.ClassTime,
        ClassDuration: this.addForm.ClassDuration,
        TotalQuota: this.addForm.RemainQuota
      };
      return AddStoreItemAppointmentDetails(par);
    },
    //编辑门店课程预约排课信息
    _modifyStoreItemAppointmentDetails() {
      var par = {
        Id: this.editForm.Id,
        ScheduleName: this.editForm.ScheduleName,
        ClassTime: this.editForm.ClassTime,
        ClassDuration: this.editForm.ClassDuration,
        RemainQuota: this.editForm.RemainQuota
      };
      return ModifyStoreItemAppointmentDetails(par);
    },
    //删除门店课程预约排课信息
    _deleteStoreItemAppointmentDetails(id) {
      var par = {
        Id: id
      };
      return DeleteStoreItemAppointmentDetails(par);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
