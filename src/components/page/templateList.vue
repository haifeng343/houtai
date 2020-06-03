<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="模板名称:">
          <el-input v-model="name" placeholder="请输入模板名称"></el-input>
        </el-form-item>
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
        <el-button class="Popadd" type="primary" @click="add()">绑定</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="paymentListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" width="180" label="ID" fixed></el-table-column>
        <el-table-column prop="Amount" align="center" label="模板名称"></el-table-column>
        <el-table-column prop="CreateTime" width="180" align="center" label="绑定时间"></el-table-column>
        <el-table-column align="center" width="180" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">解绑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 绑定业务模板 -->
    <el-dialog title="绑定业务模板" :visible.sync="addVisible" width="800px">
      <el-form ref="addForm" :model="addForm" :rules="addRules">
        <el-form-item>
          <el-checkbox-group v-model="addForm.name">
            <el-checkbox label="复选框 A"></el-checkbox>
            <el-checkbox label="复选框 B"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="add('addForm')" type="primary" size="medium">确 定</el-button>
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
import { GetPaymentRecordList } from "api/finance.js";
export default {
  name: "PaymentLog",
  data() {
    return {
      name: "", //弹窗名称
      searchTime: "", //创建时间
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      paymentListTable: [], //列表

      addVisible: false, //创建弹窗
      addRules: {
        // name: [{ required: true, message: "请输入弹窗名称", trigger: "blur" }],
        // Identification: [
        //   { required: true, message: "请输入分组标识", trigger: "blur" }
        // ],
        // imageUrl: [{ required: true, message: "请选择图片", trigger: "blur" }],
      },
      addForm: {
        //弹窗form
        name: ""
      },
    };
  },
  created() {
    this._getPaymentRecordList();
  },
  methods: {
    //搜索
    paymentListSearch() {
      this.pageIndex = 1;
      this._getPaymentRecordList();
    },
    //列表分页变化
    paymentListCurrentChange(val) {
      this.pageIndex = val;
      this._getPaymentRecordList();
    },
    //创建任务
    add() {
      this.addVisible = true;
    },

    //确定添加
    addTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //修改是否有效
    changeStatus(status, item) {
      this._modifySheetPrizeRulesDetailsNormalStatus(item.Id, status);
    },
    _modifySheetPrizeRulesDetailsNormalStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySheetPrizeRulesDetailsNormalStatus(par);
    },
    //获取打款记录列表
    _getPaymentRecordList() {
      var par = {
        StartTime: this.searchTime != null ? this.searchTime[0] : "",
        EndTime: this.searchTime != null ? this.searchTime[1] : "",
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetPaymentRecordList(par).then(res => {
        this.paymentListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
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
.ml30 {
  margin-left: 53px;
}
</style>
