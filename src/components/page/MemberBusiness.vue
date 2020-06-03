<template>
  <div>
    <div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="会员名称:">
          <el-input v-model="form.seachName" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="业务属性:">
          <el-select v-model="form.searchStatus" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="更新时间:">
          <el-date-picker
            v-model="form.searchTime"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="noticeSearch()">搜索</el-button>
        </el-form-item>
        <el-button type="primary" class="float-right" @click="addMember()">创建</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="memberList" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" width="160px" fixed></el-table-column>
        <el-table-column prop="BusinessName" align="center" width="140px" label="业务名称"></el-table-column>
        <el-table-column align="center" label="业务属性" width="140px">
          <template slot-scope="scope">
            <el-button type="text" @click="attributes(scope.row)">空</el-button>
            <span>{{scope.row.BusinessType==1?'充值':'任务'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="GradeName" align="center" label="会员名称"></el-table-column>
        <el-table-column prop="BusinessDes" align="center" label="会员详情"></el-table-column>
        <el-table-column align="center" label="时间类型">
          <template slot-scope="scope">
            <span>{{scope.row.TimeType | timetype}}/{{scope.row.TimeInterval}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="价格(元)">
          <template slot-scope="scope">
            <span>{{scope.row.DiscountPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="TotalCount" align="center" label="购买总数"></el-table-column>
        <el-table-column prop="AccountCount" align="center" label="购买次数"></el-table-column>
        <el-table-column prop="OrderIndex" align="center" label="排序值"></el-table-column>
        <el-table-column align="center" width="160px" label="是否有效">
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
        <el-table-column prop="CreateTime" width="200px" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editMember(scope.row)">编辑</el-button>
            <el-button type="text" class="red" @click="deleteGetData(scope.row)">删除</el-button>
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
        @current-change="noticeCurrentChange"
      ></el-pagination>
    </div>

    <!-- 属性弹窗 -->
    <el-dialog title="选择业务属性" :visible.sync="attributeVisible" width="580px">
      <el-checkbox-group @change="attributeChange()">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="attributeVisible = false" size="medium">取 消</el-button>
        <el-button @click="attributeOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 创建业务 -->
    <el-dialog title="创建业务" :visible.sync="addVisible" width="580px">
      <el-form ref="addForm" :model="addForm" :rules="rules" label-width="120px">
        <el-form-item label="业务名称:" prop="BusinessName">
          <el-input v-model="addForm.BusinessName" placeholder="请输入业务名称"></el-input>
        </el-form-item>
        <el-form-item label="业务类型:" prop="BusinessType">
          <el-select v-model="addForm.BusinessType" placeholder="请选择业务类型" style="width:100%">
            <el-option
              v-for="item in businessList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员名称:" prop="GradeId">
          <el-select v-model="addForm.GradeId" placeholder="请选择名称会员" style="width:100%">
            <el-option v-for="item in grandList" :key="item.Id" :label="item.GradeName" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员详情:" prop="BusinessDes">
          <el-input type="textarea" v-model="addForm.BusinessDes" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="时间类型:" prop="TimeType">
          <el-select
            v-model="addForm.TimeType"
            placeholder="请选择时间类型"
            style="width:45%;margin-right:30px"
          >
            <el-option v-for="item in timeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-input rows="5" v-model="addForm.TimeInterval" style="width:45%"></el-input>
        </el-form-item>
        <el-form-item label="价格(分):" prop="Price">
          <el-input rows="5" v-model="addForm.Price"></el-input>
        </el-form-item>
        <el-form-item label="折扣价(分):" prop="DiscountPrice">
          <el-input rows="5" v-model="addForm.DiscountPrice"></el-input>
        </el-form-item>
        <el-form-item label="购买总数:" prop="TotalCount">
          <el-input rows="5" v-model="addForm.TotalCount"></el-input>
        </el-form-item>
        <el-form-item label="购买次数:" prop="AccountCount">
          <el-input rows="5" v-model="addForm.AccountCount"></el-input>
        </el-form-item>
        <el-form-item label="排序值:" prop="OrderIndex">
          <el-input rows="5" v-model="addForm.OrderIndex"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')" size="medium">取 消</el-button>
        <el-button @click="memberAddOk('addForm')" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!--编辑业务 -->
    <el-dialog title="编辑业务" :visible.sync="editMemberAddVisible" width="580px">
      <el-form ref="editMemberForm" :model="editMemberForm" :rules="rules" label-width="120px">
        <el-form-item label="业务名称:">
          <el-input></el-input>
        </el-form-item>
        <el-form-item label="名称会员:">
          <el-select placeholder="请选择活动区域" style="width:100%">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员详情:">
          <el-input type="textarea" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="时间类型:">
          <el-select placeholder="请选择活动区域" style="width:45%;margin-right:30px">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-input rows="5" style="width:45%"></el-input>
        </el-form-item>
        <el-form-item label="价格(元):">
          <el-input rows="5"></el-input>
        </el-form-item>
        <el-form-item label="购买总数:">
          <el-input rows="5"></el-input>
        </el-form-item>
        <el-form-item label="购买次数:">
          <el-input rows="5"></el-input>
        </el-form-item>
        <el-form-item label="排序值:">
          <el-input rows="5"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMemberAddVisible = false" size="medium">取 消</el-button>
        <el-button @click="memberEditOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 有效期列表 -->
    <el-dialog :title="`有效期列表-${vipName}`" :visible.sync="periodVisible" width="800px">
      <el-table :data="periodList" border ref="periodList">
        <el-table-column prop="Id" align="center" label="会员名称" width="160px" fixed></el-table-column>
        <el-table-column prop="AccountName" align="center" width="120px" label="会员等级"></el-table-column>
        <el-table-column prop="AccountName" align="center" width="120px" label="充值金额(元)"></el-table-column>
        <el-table-column prop="AccountName" align="center" label="有效期"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="periodVisible = false" type="primary">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { memberBusinessList, memberBusinessAdd,memberGradeList } from "api/member.js";
export default {
  name: "MemberList",
  data() {
    return {
      vipName: "", //会员名称
      pageTotalCount: 0,
      form: {
        seachName: "",
        searchStatus: 0,
        searchTime: []
      },
      pageIndex: 1,
      pageSize: 30,

      addVisible: false, //添加业务弹窗
      addForm: {
        //添加业务表单
        BusinessName: "",
        BusinessType: "",
        BusinessDes: "",
        GradeId: "",
        TimeType: "",
        TimeInterval: "",
        Price: "",
        DiscountPrice: "",
        TotalCount: "",
        AccountCount: "",
        OrderIndex: ""
      },
      rules: {
        BusinessName: [
          { required: true, message: "请填写业务名称", trigger: "blur" }
        ],
        BusinessType: [
          { required: true, message: "请选择业务类型", trigger: "change" }
        ],
        GradeId: [
          { required: true, message: "请选择会员名称", trigger: "change" }
        ],
        BusinessDes: [
          { required: true, message: "请填写会员描述", trigger: "blur" }
        ],
        TimeType: [
          { required: true, message: "请选择时间类型", trigger: "change" }
        ],
        Price: [{ required: true, message: "请填写原价", trigger: "blur" }],
        DiscountPrice: [
          { required: true, message: "请填写折扣价", trigger: "blur" }
        ],
        TotalCount: [
          { required: true, message: "请填写用户购买总数量", trigger: "blur" }
        ],
        AccountCount: [
          {
            required: true,
            message: "请填写用户最多可购买数量",
            trigger: "blur"
          }
        ],
        OrderIndex: [
          { required: true, message: "请填写排序值", trigger: "blur" }
        ]
      },
      cities: ["1", "2"],
      memberAddForm: {
        //详情列表
        time: "",
        dec: ""
      },
      editMemberAddVisible: false, //编辑业务弹窗
      editMemberForm: {}, //编辑业务表单
      attributeVisible: false, //业务属性弹窗

      statusList: [
        //业务类型
        {
          id: 0,
          name: "全部"
        },
        {
          id: 1,
          name: "充值"
        },
        {
          id: 2,
          name: "任务"
        }
      ],
      businessList: [
        //业务类型
        {
          id: 1,
          name: "充值"
        },
        {
          id: 2,
          name: "任务"
        }
      ],
      grandList: [
        //会员等级
        {
          id: 1,
          name: "黄金会员"
        },
        {
          id: 2,
          name: "白金会员"
        }
      ],
      timeList: [
        //时间间隔
        {
          id: 1,
          name: "天"
        },
        {
          id: 2,
          name: "周"
        },
        {
          id: 3,
          name: "月"
        },
        {
          id: 4,
          name: "季度"
        },
        {
          id: 5,
          name: "年"
        }
      ],
      memberList: [], //列表数据
      periodList: [], //有效期列表
      periodVisible: false //有效期列表弹窗
    };
  },
  created() {
    this._memberBusinessList();
  },
  filters: {
    timetype(params) {
      switch (params) {
        case 1:
          return "天";
        case 2:
          return "周";
        case 3:
          return "月";
        case 4:
          return "季度";
        case 5:
          return "年";
      }
    }
  },
  methods: {
    noticeSearch() {
      this.pageIndex = 1;
      this._memberBusinessList();
    },
    //列表分页变化
    noticeCurrentChange(val) {
      this.pageIndex = val;
      this._memberBusinessList();
    },
    //修改是否有效
    changeStatus(status, item) {
      this._popStatusModify(item.Id, status);
    },
    // 创建会员业务
    addMember() {
      this.addForm = {
        BusinessName: "",
        BusinessType: "",
        BusinessDes: "",
        GradeId: "",
        TimeType: "",
        TimeInterval: "",
        Price: "",
        DiscountPrice: "",
        TotalCount: "",
        AccountCount: "",
        OrderIndex: ""
      };
      this._memberGradeList();
      this.addVisible = true;
    },
    // 编辑会员业务
    editMember(item) {},
    //删除会员业务
    deleteGetData(item) {},
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addVisible = false;
    },
    //确定添加会员业务
    memberAddOk(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.addForm.TimeInterval) {
            this._memberBusinessAdd();
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑编辑业务
    editMember(item) {
      this.editMemberForm = {};
      this.editMemberAddVisible = true;
    },
    //确定编辑会员业务
    memberEditOk() {},
    // 属性弹窗
    attributes() {
      this.attributeVisible = true;
    },
    //改变属性
    attributeChange(e) {},

    //列表
    _memberBusinessList() {
      var par = {
        BusinessName: this.form.seachName,
        BusinessType: this.form.searchStatus,
        // StartTime: this.form.searchTime != null ? this.form.searchTime[0] : "",
        // EndTime: this.form.searchTime != null ? this.form.searchTime[1] : "",
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return memberBusinessList(par).then(res => {
        this.memberList = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    // 获取会员等级列表
    _memberGradeList(){
        var par = {
        GradeName: this.searchBannerName,
        Status: this.searchStatus,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return memberGradeList(par).then(res => {
        this.grandList=res.List;
      });
    },
    _memberBusinessAdd() {
      var par = {
        BusinessName: this.addForm.BusinessName,
        BusinessType: this.addForm.BusinessType,
        BusinessDes: this.addForm.BusinessDes,
        GradeId: this.addForm.GradeId,
        TimeType: this.addForm.TimeType,
        Price: this.addForm.Price,
        DiscountPrice: this.addForm.DiscountPrice,
        TotalCount: this.addForm.TotalCount,
        AccountCount: this.addForm.AccountCount,
        OrderIndex: this.addForm.OrderIndex
      };
      return memberBusinessAdd(par).then(res => {
        this._memberBusinessList();
        this.addVisible=false;
      });
    }
  }
};
</script>

<style scoped lang='less'>
.float-right {
  float: right;
}
</style>
