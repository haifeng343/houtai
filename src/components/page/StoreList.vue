<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="门店名称:">
          <el-input v-model="searchStoreName" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="StoreListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="jumpToAddStore()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddSellerStore')"
        >添加门店</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="StoreListTable" border ref="multipleTable" style="width: 100%">
        <el-table-column prop="StoreId" align="center" label="ID" fixed width="80"></el-table-column>
        <el-table-column prop="StoreName" align="center" label="门店名称" width="120"></el-table-column>
        <el-table-column align="center" label="联系号码" width="120">
          <template slot-scope="scope">
            <div>
              <div v-for="item in scope.row.MobileList" :key="item">{{item}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="门店品类">
          <template slot-scope="scope">
            <div>
              <div v-for="item in scope.row.CategoryList" :key="item">
                <span>{{item}}</span>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="营业执照">
          <template slot-scope="scope">
            <el-button type="text" @click="showLicense(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="钱包余额(元)">
          <template slot-scope="scope">{{scope.row.Money*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="到店扣费(元)">
          <template slot-scope="scope">{{scope.row.ArrivalAmount*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="成交扣费点数（%）">
          <template slot-scope="scope">{{scope.row.DealAmountRate*1.0/100}}</template>
        </el-table-column>
        <el-table-column align="center" label="成交扣费次数/人">
          <template slot-scope="scope">{{scope.row.DealAmountCount}}</template>
        </el-table-column>
        <el-table-column align="center" label="体验课验券奖励人" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showClientAccount(scope.row)"
            >{{scope.row.ClientAccountRecommandCode?scope.row.ClientAccountRecommandCode:"暂未设置"}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="成交后奖励人" width="120">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showClientAccountDeal(scope.row)"
            >{{scope.row.ClientAccountRecommandCodeDeal?scope.row.ClientAccountRecommandCodeDeal:"暂未设置"}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="门店状态" width="180">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySellerStoreStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否支持过期验券" width="150">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.ExpireCheck"
              active-text="是"
              inactive-text="否"
              :active-value="true"
              :inactive-value="false"
              @change="changeExpireCheck($event, scope.row)"
              :disabled="!common.haveRight('ModifySellerStoreExpireCheck')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="ChangeExamineStatus(scope.row)"
              :disabled="!common.haveRight('ModifySellerStoreExamineStatus')"
            >{{parseExamineStatus(scope.row.ExamineStatus)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ExamineStatusDes" align="center" label="审核状态描述"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column
          prop="SellerMobile"
          align="center"
          label="操作"
          fixed="right"
          width="280px;"
          style="display:block"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="jumpToEditStore(scope.row)"
              v-if="common.haveRight('ModifySellerStore')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="showSetItemDialog(scope.row)"
              v-if="common.haveRight('SetSellerStoreItem')"
            >分配课程</el-button>
            <el-button
              type="text"
              @click="showSetTeacherDialog(scope.row)"
              v-if="common.haveRight('SetSellerStoreTeacher')"
            >分配师资</el-button>
            <el-button
              type="text"
              @click="showSetAccountDialog(scope.row)"
              v-if="common.haveRight('SetSellerStoreAccount')"
            >分配账户</el-button>
            <el-button
              type="text"
              @click="jumpToItemTeacher(scope.row)"
              v-if="common.haveRight('GetStoreItemTeacher')"
            >课程师资</el-button>
            <el-button
              type="text"
              @click="jumpToStoreImg(scope.row)"
              v-if="common.haveRight('GetSellerStoreImgList')"
            >图片管理</el-button>
            <el-button
              type="text"
              @click="jumpToStoreExtra(scope.row)"
              v-if="common.haveRight('GetStoreExtraList')"
            >门店额外信息</el-button>
            <el-button type="text" @click="jumpToItemAppointment(scope.row)">课程预约</el-button>
            <el-button type="text" @click="jumpToItemAppointmentRecord(scope.row)">预约记录</el-button>
            <el-button type="text" @click="jumpToSubsidyRecord(scope.row)">成交记录</el-button>
            <el-button type="text" @click="showSetPasswordDialog(scope.row)">修改支付密码</el-button>
            <el-button
              type="text"
              @click="deleteStore(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteSellerStore')"
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
        @current-change="storeListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 营业执照弹窗 -->
    <el-dialog :title="`营业执照-${clickItem.StoreName}`" :visible.sync="licenseVisible" width="633px">
      <img :src="licenseImgURL" class="license" />
    </el-dialog>
    <!-- 修改审核状态弹窗 -->
    <el-dialog
      :title="`审核状态修改-${clickItem.StoreName}`"
      :visible.sync="examineStatusVisible"
      width="633px"
    >
      <el-form ref="examineStatusForm" :model="examineStatusForm">
        <el-form-item label="审核状态:" label-width="100px">
          <el-select v-model="examineStatusForm.examineStatus" placeholder="请选择状态">
            <el-option
              v-for="item in examineStatusForm.examineStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态描述:" label-width="100px">
          <el-input type="textarea" :rows="6" v-model="examineStatusForm.examineStatusDes"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examineStatusVisible = false" size="medium">取 消</el-button>
        <el-button @click="modifyExamineStatusOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配项目弹窗 -->
    <el-dialog :title="`分配课程-${clickItem.StoreName}`" :visible.sync="setItemVisible" width="633px">
      <el-checkbox-group v-model="selectItemList">
        <el-checkbox v-for="item in totalItemList" :label="item.ItemId" :key="item.ItemId">
          <img :src="item.ItemCoverImgUrl" height="60px;" width="60px" class="imgDiv" />
          {{item.ItemName}}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setItemVisible = false" size="medium">取 消</el-button>
        <el-button @click="setItemOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配师资弹窗 -->
    <el-dialog
      :title="`分配师资-${clickItem.StoreName}`"
      :visible.sync="setTeacherVisible"
      width="633px"
    >
      <el-checkbox-group v-model="selectTeacherList">
        <el-checkbox v-for="item in totalTeacherList" :label="item.TeacherId" :key="item.TeacherId">
          <img :src="item.HeaderAccessUrl" height="60px;" width="60px" class="imgDiv" />
          {{item.TeacherName}}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setTeacherVisible = false" size="medium">取 消</el-button>
        <el-button @click="setTeacherOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配账户弹窗 -->
    <el-dialog
      :title="`分配账户-${clickItem.StoreName}`"
      :visible.sync="setAccountVisible"
      width="633px"
    >
      <el-checkbox-group v-model="selectAccountList">
        <el-checkbox v-for="item in totalAccountList" :label="item.AccountId" :key="item.AccountId">
          <img :src="item.HeaderAccessUrl" height="60px;" width="60px" class="imgDiv" />
          {{item.UserName}}
        </el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setAccountVisible = false" size="medium">取 消</el-button>
        <el-button @click="setAccountOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置前端奖励人员弹窗 -->
    <el-dialog title="设置前端奖励人员" :visible.sync="clientAccountVisible" width="633px">
      <el-form ref="clientAccountForm" :model="clientAccountForm">
        <el-form-item label="奖励额(1/万):" label-width="100px">
          <el-input v-model="clientAccountForm.amountRate"></el-input>
        </el-form-item>
        <el-form-item label="邀请码:" label-width="100px">
          <el-input v-model="clientAccountForm.recommandCode" @input="recommandCodeChange"></el-input>
        </el-form-item>
        <el-form-item
          label="昵称:"
          label-width="100px"
        >{{clientAccountData==null?"":clientAccountData.AccountName}}</el-form-item>
        <el-form-item
          label="手机号:"
          label-width="100px"
        >{{clientAccountData==null?"":clientAccountData.Mobile}}</el-form-item>
        <el-form-item
          label="性别:"
          label-width="100px"
        >{{clientAccountData==null?"":clientAccountData.Sex==1?"男":"女"}}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clientAccountVisible = false" size="medium">取 消</el-button>
        <el-button @click="setClientAccountOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 设置成交前端奖励人员弹窗 -->
    <el-dialog title="设置成交前端奖励人员" :visible.sync="clientAccountDealVisible" width="633px">
      <el-form ref="clientAccountDealForm" :model="clientAccountDealForm">
        <el-form-item label="奖励额(1/万):" label-width="100px">
          <el-input v-model="clientAccountDealForm.amountRate"></el-input>
        </el-form-item>
        <el-form-item label="邀请码:" label-width="100px">
          <el-input v-model="clientAccountDealForm.recommandCode" @input="recommandCodeDealChange"></el-input>
        </el-form-item>
        <el-form-item
          label="昵称:"
          label-width="100px"
        >{{clientAccountDealData==null?"":clientAccountDealData.AccountName}}</el-form-item>
        <el-form-item
          label="手机号:"
          label-width="100px"
        >{{clientAccountDealData==null?"":clientAccountDealData.Mobile}}</el-form-item>
        <el-form-item
          label="性别:"
          label-width="100px"
        >{{clientAccountDealData==null?"":clientAccountDealData.Sex==1?"男":"女"}}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clientAccountDealVisible = false" size="medium">取 消</el-button>
        <el-button @click="setClientAccountDealOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改支付密码弹窗 -->
    <el-dialog
      :title="`修改支付密码-${clickItem.StoreName}`"
      :visible.sync="payPasswordVisible"
      width="633px"
    >
      <el-form ref="payPasswordForm" :model="payPasswordForm">
        <el-form-item label="新支付密码:" label-width="100px">
          <el-input v-model="payPasswordForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="payPasswordVisible = false" size="medium">取 消</el-button>
        <el-button @click="modifyPayPasswordOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetSellerStoreList,
  ModifySellerStoreExamineStatus,
  GetSellerItemList,
  GetSellerTeacherList,
  GetSellerAccountList,
  SetSellerStoreItem,
  SetSellerStoreTeacher,
  SetSellerStoreAccount,
  DeleteSellerStore,
  ModifySellerStoreStatus,
  ModifySellerStoreExpireCheck,
  ModifySellerStoreClientAccount,
  ModifySellerStoreClientAccountDeal,
  ModifySellerStorePayPassword
} from "api/seller.js";
import { GetClientAccountByRecommandCode } from "api/clientaccount.js";
export default {
  name: "StoreList",
  data() {
    return {
      searchStoreName: "",
      sellerId: 0, //商家Id
      sellerName: "", //商家名称
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      StoreListTable: [], //门店列表
      clickItem: {}, //点击某一行数据
      licenseVisible: false, //营业执照弹窗是否可见
      licenseImgURL: "", //营业执照图片地址
      examineStatusVisible: false, //审核状态弹窗是否可见
      //审核状态弹窗信息
      examineStatusForm: {
        examineStatus: 0,
        examineStatusList: [
          { id: 1, name: "等待审核" },
          { id: 2, name: "审核中" },
          { id: 3, name: "审核失败" },
          { id: 4, name: "审核成功" }
        ],
        examineStatusDes: ""
      },
      setItemVisible: false, //分配项目弹窗是否可见
      selectItemList: [], //分配项目列表
      totalItemList: [], //所有项目列表
      setTeacherVisible: false, //分配师资弹窗是否可见
      selectTeacherList: [], //分配师资列表
      totalTeacherList: [], //所有师资列表
      setAccountVisible: false, //分配账户弹窗是否可见
      selectAccountList: [], //分配账户列表
      totalAccountList: [], //所有账户列表
      clientAccountVisible: false,
      clientAccountForm: {
        recommandCode: "",
        amountRate: ""
      },
      clientAccountData: null,
      clientAccountDealVisible: false,
      clientAccountDealForm: {
        recommandCode: "",
        amountRate: ""
      },
      clientAccountDealData: null,
      payPasswordVisible: false,
      payPasswordForm: {
        password: ""
      }
    };
  },
  watch: {
    $route(newValue, oldValue) {
      this.sellerId = newValue.params.id;
      this.sellerName = newValue.query.name;
      this._getSellerStoreList();
      this._getSellerItemList();
      this._getSellerTeacherList();
      this._getSellerAccountList();
    }
  },
  created() {
    this.sellerId = this.$route.params.id;
    this.sellerName = this.$route.query.name;
    this._getSellerStoreList();
    this._getSellerItemList();
    this._getSellerTeacherList();
    this._getSellerAccountList();
  },
  methods: {
    //跳转到门店图片管理
    jumpToStoreImg(item) {
      this.$router.push({
        path: `/StoreImgs/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    //跳转到门店课程师资
    jumpToItemTeacher(item) {
      this.$router.push({
        path: `/StoreItemTeacher/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    //跳转到添加门店
    jumpToAddStore() {
      this.$router.push({
        path: `/StoreAdd/${this.sellerId}`,
        query: {
          name: this.sellerName
        }
      });
    },
    //跳转到编辑门店
    jumpToEditStore(item) {
      this.$router.push({
        path: `/StoreEdit/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    //跳转到门店额外信息
    jumpToStoreExtra(item) {
      this.$router.push({
        path: `/StoreExtra/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    jumpToItemAppointment(item) {
      this.$router.push({
        path: `/ItemAppointment/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    jumpToItemAppointmentRecord(item) {
      this.$router.push({
        path: `/ItemAppointmentRecord/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    jumpToSubsidyRecord(item) {
      this.$router.push({
        path: `/SubsidyRecord/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    //分配项目
    showSetItemDialog(item) {
      this.clickItem = item;
      this.selectItemList = item.ItemList;
      this.setItemVisible = true;
    },
    //分配项目确定
    setItemOk() {
      this._setSellerStoreItem().then(val => {
        this.setItemVisible = false;
        this._getSellerStoreList();
      });
    },
    //分配师资
    showSetTeacherDialog(item) {
      this.clickItem = item;
      this.selectTeacherList = item.TeacherList;
      this.setTeacherVisible = true;
    },
    //分配师资确定
    setTeacherOk() {
      this._setSellerStoreTeacher().then(val => {
        this.setTeacherVisible = false;
        this._getSellerStoreList();
      });
    },
    //分配账户
    showSetAccountDialog(item) {
      this.clickItem = item;
      this.selectAccountList = item.AccountList;
      this.setAccountVisible = true;
    },
    //分配账户确定
    setAccountOk() {
      this._setSellerStoreAccount().then(val => {
        this.setAccountVisible = false;
        this._getSellerStoreList();
      });
    },
    StoreListSearch() {
      this.pageIndex = 1;
      this._getSellerStoreList();
    },
    //分页页码变化
    storeListCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerStoreList();
    },
    //查看营业执照图片
    showLicense(item) {
      this.clickItem = item;
      this.licenseVisible = true;
      this.licenseImgURL = item.LicenseAccessUrl;
    },
    //打开修改审核状态弹窗
    ChangeExamineStatus(item) {
      this.clickItem = item;
      this.examineStatusVisible = true;
      this.examineStatusForm.examineStatus = item.ExamineStatus;
      this.examineStatusForm.examineStatusDes = item.ExamineStatusDes;
    },
    //确定修改审核状态
    modifyExamineStatusOk() {
      this._modifySellerStoreExamineStatus().then(val => {
        this.examineStatusVisible = false;
        this._getSellerStoreList();
      });
    },
    //删除门店
    deleteStore(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSellerStore(item.StoreId).then(val => {
            this._getSellerStoreList();
          });
        })
        .catch(() => {});
    },
    //解析审核状态
    //审核状态1.等待审核 2审核中 3审核失败 4审核成功
    parseExamineStatus(status) {
      switch (status) {
        case 1:
          return "等待审核";
        case 2:
          return "审核中";
        case 3:
          return "审核失败";
        case 4:
          return "审核成功";
        default:
          return "未知";
      }
    },
    changeStatus(status, item) {
      this._modifySellerStoreStatus(item.StoreId, status);
    },
    changeExpireCheck(status, item) {
      this._modifySellerStoreExpireCheck(item.StoreId, status == true ? 1 : 2);
    },
    showClientAccount(item) {
      this.clickItem = item;
      this.clientAccountForm.recommandCode = item.ClientAccountRecommandCode;
      this.clientAccountForm.amountRate = item.ClientAccountAmountRate;
      if (item.ClientAccountRecommandCode) {
        this._getClientAccountByRecommandCode(
          item.ClientAccountRecommandCode
        ).then(res => {
          this.clientAccountData = res;
        });
      } else {
        this.clientAccountData = null;
      }
      this.clientAccountVisible = true;
    },
    showClientAccountDeal(item) {
      this.clickItem = item;
      this.clientAccountDealForm.recommandCode =
        item.ClientAccountRecommandCodeDeal;
      this.clientAccountDealForm.amountRate = item.ClientAccountAmountRateDeal;
      if (item.ClientAccountRecommandCodeDeal) {
        this._getClientAccountByRecommandCode(
          item.ClientAccountRecommandCodeDeal
        ).then(res => {
          this.clientAccountDealData = res;
        });
      } else {
        this.clientAccountDealData = null;
      }
      this.clientAccountDealVisible = true;
    },
    setClientAccountOk() {
      // if (!this.clientAccountData) {
      //   this.$message.error("请输入正确邀请码");
      //   return;
      // }
      this._modifySellerStoreClientAccount().then(val => {
        this.clientAccountVisible = false;
        this._getSellerStoreList();
      });
    },
    setClientAccountDealOk() {
      // if (!this.clientAccountDealData) {
      //   this.$message.error("请输入正确邀请码");
      //   return;
      // }
      this._modifySellerStoreClientAccountDeal().then(val => {
        this.clientAccountDealVisible = false;
        this._getSellerStoreList();
      });
    },
    recommandCodeChange() {
      if (this.clientAccountForm.recommandCode.length == 12) {
        this._getClientAccountByRecommandCode(
          this.clientAccountForm.recommandCode
        ).then(res => {
          this.clientAccountData = res;
        });
      } else {
        this.clientAccountData = null;
      }
    },
    recommandCodeDealChange() {
      if (this.clientAccountDealForm.recommandCode.length == 12) {
        this._getClientAccountByRecommandCode(
          this.clientAccountDealForm.recommandCode
        ).then(res => {
          this.clientAccountDealData = res;
        });
      } else {
        this.clientAccountDealData = null;
      }
    },
    showSetPasswordDialog(item) {
      this.clickItem = item;
      this.payPasswordForm.password = "";
      this.payPasswordVisible = true;
    },
    modifyPayPasswordOk() {
      this._modifySellerStorePayPassword().then(val => {
        this.payPasswordVisible = false;
      });
    },
    //获取门店列表信息
    _getSellerStoreList() {
      var par = {
        StoreName: this.searchStoreName,
        SellerId: this.sellerId,
        AccountId: 0,
        TeacherId: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetSellerStoreList(par, 151).then(res => {
        this.StoreListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //修改门店审核状态
    _modifySellerStoreExamineStatus() {
      var par = {
        Id: this.clickItem.StoreId,
        Status: this.examineStatusForm.examineStatus,
        StatusDes: this.examineStatusForm.examineStatusDes
      };
      return ModifySellerStoreExamineStatus(par, 153);
    },
    //修改门店状态
    _modifySellerStoreStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySellerStoreStatus(par, 152);
    },
    //修改门店是否支持过期验券
    _modifySellerStoreExpireCheck(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySellerStoreExpireCheck(par, 154);
    },
    //获取项目列表信息
    _getSellerItemList() {
      var par = {
        SellerId: this.sellerId,
        ItemName: "",
        Status: 1,
        ExamineStatus: 4,
        TeacherId: 0,
        StoreId: 0,
        PageCount: 100,
        PageIndex: 1
      };
      return GetSellerItemList(par, 151).then(res => {
        this.totalItemList = res.List;
      });
    },
    //获取师资列表信息
    _getSellerTeacherList() {
      var par = {
        SellerId: this.sellerId,
        TeacherName: "",
        Status: 1,
        ExamineStatus: 4,
        PageCount: 100,
        PageIndex: 1
      };
      return GetSellerTeacherList(par, 151).then(res => {
        this.totalTeacherList = res.List;
      });
    },
    //获取账户列表信息
    _getSellerAccountList() {
      var par = {
        SellerId: this.sellerId,
        AccountName: "",
        Mobile: "",
        StartTime: "",
        EndTime: "",
        Status: 1,
        PageCount: 100,
        PageIndex: 1
      };
      return GetSellerAccountList(par, 151).then(res => {
        this.totalAccountList = res.List;
      });
    },
    //门店分配项目
    _setSellerStoreItem() {
      var par = {
        StoreId: this.clickItem.StoreId,
        ItemList: this.selectItemList
      };
      return SetSellerStoreItem(par, 160);
    },
    //门店分配师资
    _setSellerStoreTeacher() {
      var par = {
        StoreId: this.clickItem.StoreId,
        TeacherList: this.selectTeacherList
      };
      return SetSellerStoreTeacher(par, 161);
    },
    //门店分配账户
    _setSellerStoreAccount() {
      var par = {
        StoreId: this.clickItem.StoreId,
        AccountList: this.selectAccountList
      };
      return SetSellerStoreAccount(par, 162);
    },
    //删除门店
    _deleteSellerStore(id) {
      var par = {
        Id: id
      };
      return DeleteSellerStore(par, 155);
    },
    //根据邀请码获取前端用户列表
    _getClientAccountByRecommandCode(recommandCode) {
      var par = {
        RecommandCode: recommandCode
      };
      return GetClientAccountByRecommandCode(par, 315);
    },
    //修改门店前端奖励用户
    _modifySellerStoreClientAccount() {
      var par = {
        Id: this.clickItem.StoreId,
        RecommandCode: this.clientAccountData.MyRecommandCode,
        ClientAccountAmountRate: this.clientAccountForm.amountRate
      };
      return ModifySellerStoreClientAccount(par, 315);
    },
    //修改门店成交前端奖励用户
    _modifySellerStoreClientAccountDeal() {
      var par = {
        Id: this.clickItem.StoreId,
        RecommandCode:
          this.clientAccountDealData == null
            ? ""
            : this.clientAccountDealData.MyRecommandCode,
        ClientAccountAmountRate: this.clientAccountDealForm.amountRate
      };
      return ModifySellerStoreClientAccountDeal(par);
    },
    //修改门店支付密码
    _modifySellerStorePayPassword() {
      var par = {
        StoreId: this.clickItem.StoreId,
        PayPassword: this.$md5(this.payPasswordForm.password)
      };
      return ModifySellerStorePayPassword(par);
    }
  }
};
</script>

<style scoped lang="less">
.license {
  width: 100%;
  height: auto;
}
.imgDiv {
  position: relative;
  bottom: -30px;
}
.el-checkbox,
.el-checkbox__input {
  bottom: 30px;
}
</style>
