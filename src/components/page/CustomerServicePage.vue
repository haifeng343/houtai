<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="页面名称:">
          <el-input v-model="PageName" placeholder="请输入页面名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="paymentListSearch()">搜索</el-button>
        </el-form-item>
        <el-button class="Popadd" type="primary" @click="add()" v-if="common.haveRight('AddCustomerService')">创建客服</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="paymentListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" width="100" label="ID" fixed></el-table-column>
        <el-table-column prop="PageName" align="center" label="页面名称"></el-table-column>
        <el-table-column prop="PageDes" align="center" label="页面描述"></el-table-column>
        <el-table-column align="center" label="客服位置">
          <template slot-scope="scope">
            <span>{{scope.row.PositionType==1?'左':'右'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="PositionHight" label="位置高度"></el-table-column>
        <el-table-column align="center" label="是否可移动">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.IsMove"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
              @change="changeMobileStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyCustomerServiceIsMove')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="是否有效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyCustomerServiceStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)" v-if="common.haveRight('ModifyCustomerService')">编辑</el-button>
            <el-button type="text" class="red" @click="deleteTask(scope.row)" v-if="common.haveRight('DeleteCustomerService')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 创建客服 -->
    <el-dialog title="创建客服" :visible.sync="addTaskVisible" width="580px">
      <el-form ref="addTaskForm" :model="addTaskForm" label-width="90px" :rules="addTaskRules">
        <el-form-item label="页面名称:">
          <el-select
            v-model="addTaskForm.tempPage"
            class="w410"
            value-key="Id"
            placeholder="请选择页面名称"
          >
            <el-option v-for="item in pagesForm" :label="item.name" :key="item.Id" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面描述:" prop="PageDes">
          <el-input type="textarea" rows="5" v-model="addTaskForm.PageDes" placeholder="请输入页面描述"></el-input>
        </el-form-item>
        <el-form-item label="客服位置:">
          <el-select class="w410" v-model="addTaskForm.PositionType" placeholder="请选择客服位置">
            <el-option v-for="item in typeForm" :label="item.name" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置高度:">
          <el-input placeholder="请输入位置高度" v-model="addTaskForm.PositionHight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTaskVisible = false" size="medium">取 消</el-button>
        <el-button @click="addTask('addTaskForm')" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑客服 -->
    <el-dialog title="编辑客服" :visible.sync="editTaskVisible" width="580px">
      <el-form ref="editTaskForm" :model="editTaskForm" label-width="90px" :rules="editTaskRules">
        <el-form-item label="页面名称:">
          <el-select
            v-model="editTaskForm.tempPage"
            value-key="Id"
            class="w410"
            placeholder="请选择页面名称"
          >
            <el-option v-for="item in pagesForm" :label="item.name" :key="item.Id" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="页面描述:" prop="PageDes">
          <el-input type="textarea" rows="5" v-model="editTaskForm.PageDes" placeholder="请输入页面描述"></el-input>
        </el-form-item>
        <el-form-item label="客服位置:">
          <el-select class="w410" v-model="editTaskForm.PositionType" placeholder="请选择客服位置">
            <el-option v-for="item in typeForm" :label="item.name" :key="item.Id" :value="item.Id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="位置高度:">
          <el-input placeholder="请输入位置高度" v-model="editTaskForm.PositionHight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTaskVisible = false" size="medium">取 消</el-button>
        <el-button @click="editTask('editTaskForm')" type="primary" size="medium">确 定</el-button>
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
  customerserviceList,
  customerserviceAdd,
  customerserviceModify,
  customerserviceIsmoveModify,
  customerserviceStatusModify,
  customerserviceDelete
} from "api/page.js";
export default {
  name: "CustomerServicePage",
  data() {
    return {
      PageName: "", //页面名称
      popTaskApiList: [], //api列表
      searchTime: "", //创建时间
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      paymentListTable: [], //列表
      taskType: "/pages/index/index", //0全部 1现金奖励券

      pagesForm: [
        {
          Id: "/pages/index/index",
          name: "首页"
        },
        {
          Id: "/pages/order/order",
          name: "我的订单"
        },
        {
          Id: "/pages/mine/mine",
          name: "我的"
        },
        {
          Id: "/pages/chooseClass/chooseClass",
          name: "选择体验课"
        },
        {
          Id: "/pages/mechanism/mechanism",
          name: "机构详情"
        },
        {
          Id: "/pages/courseDetail/courseDetail",
          name: "课程详情"
        },
        // {
        //   Id: "/pages/allTeacher/allTeacher",
        //   name: "全部老师"
        // },
        {
          Id: "/pages/car/car",
          name: "待体验课程"
        },
        // {
        //   Id: "/pages/payOrder/payOrder",
        //   name: "预约订单"
        // },
        {
          Id: "/pages/rewradRule/rewradRule",
          name: "押金退还及奖励规则"
        },
        {
          Id: "/pages/orderDetail/orderDetail",
          name: "订单详情"
        },
        // {
        //   Id: "/pages/binding/binding",
        //   name: "绑定手机号"
        // },
        // {
        //   Id: "/pages/selectAddress/selectAddress",
        //   name: "选择地址"
        // },
        // {
        //   Id: "/pages/payOk/payOk",
        //   name: "购买成功"
        // },
        // {
        //   Id: "/pages/refund/refund",
        //   name: "退款确认"
        // },
        {
          Id: "/pages/integralLog/integralLog",
          name: "我的积分"
        },
        // {
        //   Id: "/pages/integralList/integralList",
        //   name: "积分变更记录"
        // },
        // {
        //   Id: "/pages/jifen/jifen",
        //   name: "积分规则"
        // },
        // {
        //   Id: "/pages/setting/setting",
        //   name: "设置"
        // },
        // {
        //   Id: "/pages/address/address",
        //   name: "地址管理"
        // },
        // {
        //   Id: "/pages/editAddress/editAddress",
        //   name: "增加地址"
        // },
        // {
        //   Id: "/pages/searchAddress/searchAddress",
        //   name: "选择地址"
        // },
        {
          Id: "/pages/wallet/wallet",
          name: "我的钱包"
        },
        // {
        //   Id: "/pages/ballanceLog/balanceLog",
        //   name: "余额变更记录"
        // },
        {
          Id: "/pages/withdraw/withdraw",
          name: "提现"
        },
        // {
        //   Id: "/pages/withdrawLog/withdrawLog",
        //   name: "提现记录"
        // },
        // {
        //   Id: "/pages/cashLog/cashLog",
        //   name: "现金券奖励记录"
        // },
        // {
        //   Id: "/pages/addBank/addBank",
        //   name: "添加银行卡"
        // },
        {
          Id: "/pages/keepCarList/keepCarList",
          name: "支持的银行卡"
        },
        // {
        //   Id: "/pages/bankList/bankList",
        //   name: "银行卡列表"
        // },
        // {
        //   Id: "/pages/bill/bill",
        //   name: "账单"
        // },
        // {
        //   Id: "/pages/cashBack/cashBack",
        //   name: "返现记录"
        // },
        // {
        //   Id: "/pages/share/share",
        //   name: "分享好友"
        // },
        // {
        //   Id: "/pages/invite/invite",
        //   name: "推荐与邀请"
        // },
        // {
        //   Id: "/pages/recommendation/recommendation",
        //   name: "设置推荐人"
        // },
        // {
        //   Id: "/pages/aboutUs/aboutUs",
        //   name: "关于我们"
        // },
        // {
        //   Id: "/pages/callUs/callUs",
        //   name: "联系我们"
        // },
        // {
        //   Id: "/pages/map/map",
        //   name: "数据统计"
        // },
        // {
        //   Id: "/pages/inquire/inquire",
        //   name: "数据查询"
        // },
        // {
        //   Id: "/pages/search/search",
        //   name: "搜索商圈/团单"
        // },
        {
          Id: "/pages/category/category",
          name: "课程分类查询"
        }
        // {
        //   Id: "/pages/searchCategory/searchCategory",
        //   name: "搜索课程/机构"
        // }
      ],
      typeForm: [
        {
          Id: 1,
          name: "左"
        },
        {
          Id: 2,
          name: "右"
        }
      ],

      addTaskVisible: false, //创建弹窗
      addTaskRules: {
        // Name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        // ActionParams: [
        //   { required: true, message: "请输入跳转参数", trigger: "blur" }
        // ],
        // Description: [
        //   { required: true, message: "请输入简介", trigger: "blur" }
        // ],
        // ActionBtnText: [
        //   { required: true, message: "请输入按钮文本", trigger: "blur" }
        // ],
        // IconShow: [
        //   { required: true, message: "请选择图片", trigger: "change" }
        // ],
        // Type: [
        //   { required: true, message: "请选择任务类型", trigger: "change" }
        // ],
        // ActionType: [
        //   { required: true, message: "请选择跳转类型", trigger: "change" }
        // ]
      },
      addTaskForm: {
        tempPage: {
          Id: "",
          name: ""
        },
        //弹窗form
        PageName: "",
        PositionType: "",
        PageDes: "",
        PositionHight: ""
      },

      editTaskVisible: false, //编辑任务
      editTaskRules: {
        // Name: [{ required: true, message: "请输入模板名称", trigger: "blur" }],
        // ActionParams: [
        //   { required: true, message: "请输入跳转参数", trigger: "blur" }
        // ],
        // Description: [
        //   { required: true, message: "请输入简介", trigger: "blur" }
        // ],
        // ActionBtnText: [
        //   { required: true, message: "请输入按钮文本", trigger: "blur" }
        // ],
        // IconShow: [
        //   { required: true, message: "请选择图片", trigger: "change" }
        // ],
        // Type: [
        //   { required: true, message: "请选择任务类型", trigger: "change" }
        // ],
        // ActionType: [
        //   { required: true, message: "请选择跳转类型", trigger: "change" }
        // ]
      },

      editTaskForm: {
        Id: "",
        tempPage: {
          Id: "",
          name: ""
        },
        PageName: "",
        PositionType: "",
        PageDes: "",
        PositionHight: ""
      }
    };
  },
  created() {
    this._customerserviceList();
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
  filters: {
    ActionTypeStatus(param) {
      switch (param) {
        case 0:
          return "无行为";
        case 1:
          return "本地跳转";
        case 2:
          return "url跳转";
        case 3:
          return "执行本地代码";
      }
    }
  },
  methods: {
    //搜索
    paymentListSearch() {
      this.pageIndex = 1;
      this._customerserviceList();
    },
    //列表分页变化
    paymentListCurrentChange(val) {
      this.pageIndex = val;
      this._customerserviceList();
    },
    //创建任务
    add() {
      this.addTaskVisible = true;
      this.addTaskForm = {
        tempPage: {
          Id: "",
          name: ""
        }
      };
    },

    //确定添加
    addTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._customerserviceAdd();
          this.$refs[formName].resetFields();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    _customerserviceAdd() {
      var par = {
        PageCode: this.addTaskForm.tempPage.Id,
        PageName: this.addTaskForm.tempPage.name,
        PageDes: this.addTaskForm.PageDes,
        PositionType: this.addTaskForm.PositionType,
        PositionHight: this.addTaskForm.PositionHight
      };
      customerserviceAdd(par,281).then(res => {
        this._customerserviceList();
        this.addTaskVisible = false;
      });
    },

    //编辑任务
    edit(item) {
      this.editTaskForm.Id = item.Id;
      this.editTaskVisible = true;
      console.log(item);
      this.editTaskForm.tempPage = { Id: item.PageCode, name: item.PageName };
      this.editTaskForm.PageDes = item.PageDes;
      this.editTaskForm.PositionType = item.PositionType;
      this.editTaskForm.PositionHight = item.PositionHight;
    },
    //确定修改
    editTask(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._customerserviceModify();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    _customerserviceModify() {
      var par = {
        Id: this.editTaskForm.Id,
        PageCode: this.editTaskForm.tempPage.Id,
        PageName: this.editTaskForm.tempPage.name,
        PageDes: this.editTaskForm.PageDes,
        PositionType: this.editTaskForm.PositionType,
        PositionHight: this.editTaskForm.PositionHight
      };
      customerserviceModify(par,282).then(res => {
        this._customerserviceList();
        this.editTaskVisible = false;
      });
    },
    //修改是否有效
    changeStatus(status, item) {
      this._customerserviceStatusModify(item.Id, status);
    },
    _customerserviceStatusModify(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return customerserviceStatusModify(par,283);
    },
    //修改是否可移动
    changeMobileStatus(IsMove, item) {
      this._customerserviceIsmoveModify(item.Id, IsMove);
    },
    _customerserviceIsmoveModify(id, IsMove) {
      var par = {
        Id: id,
        IsMove: IsMove == 1 ? "true" : false
      };
      return customerserviceIsmoveModify(par,284);
    },

    //获取列表
    _customerserviceList() {
      var par = {
        PageName: this.PageName,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return customerserviceList(par,280).then(res => {
        this.paymentListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //删除
    deleteTask(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._delete(item.Id).then(val => {
            this._customerserviceList();
          });
        })
        .catch(() => {});
    },
    //删除
    _delete(id) {
      var par = {
        Id: id
      };
      return customerserviceDelete(par,285);
    }
  }
};
</script>

<style scoped lang='less'>
.w410 {
  width: 410px;
}
.Popadd {
  position: absolute;
  right: 40px;
}
.ml30 {
  margin-left: 53px;
}
</style>
