<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="商户名称:">
          <el-input v-model="searchSellerName" placeholder="请输入商户名称"></el-input>
        </el-form-item>
        <el-form-item label="门店名称:">
          <el-input v-model="searchStoreName" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="联系号码:">
          <el-input v-model="searchMobile" placeholder="请输入联系号码"></el-input>
        </el-form-item>
        <el-form-item label="注册时间:">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="sellerListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddSellerDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddSeller')"
        >添加商家</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="sellerListTable" border ref="multipleTable">
        <el-table-column prop="SellerId" align="center" label="ID" width="61px;" fixed></el-table-column>
        <el-table-column prop="SellerName" align="center" label="商户名称" width="212px;"></el-table-column>
        <el-table-column prop="SellerMobile" align="center" label="联系号码" width="138px;"></el-table-column>
        <el-table-column prop="Money" align="center" label="钱包余额(元)" width="100px;">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showMoneySetDialog(scope.row)"
              :disabled="!common.haveRight('ModifySellerMoney')"
            >{{scope.row.Money*1.0/100}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="营业执照" width="115px;">
          <template slot-scope="scope">
            <el-button type="text" @click="showLicense(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核状态" width="122px;">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="ChangeExamineStatus(scope.row)"
              :disabled="!common.haveRight('ModifySellerExamineStatus')"
            >{{parseExamineStatus(scope.row.ExamineStatus)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ExamineStatusDes" align="center" label="审核状态描述" width="117px;"></el-table-column>
        <el-table-column label="是否有效" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySellerStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="注册时间" width="142px;"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button
                type="text"
                @click="showEditSellerDialog(scope.row)"
                v-if="common.haveRight('ModifySeller')"
              >编辑</el-button>
              <el-button
                type="text"
                @click="jumpToStoreList(scope.row)"
                v-if="common.haveRight('GetSellerStoreList')"
              >门店管理</el-button>
              <el-button
                type="text"
                @click="jumpToItemList(scope.row)"
                v-if="common.haveRight('GetSellerItemList')"
              >课程管理</el-button>
              <el-button
                type="text"
                @click="jumpToSellerAccountList(scope.row)"
                v-if="common.haveRight('GetSellerAccountList')"
              >账户管理</el-button>
              <el-button
                type="text"
                @click="jumpToTeacherList(scope.row)"
                v-if="common.haveRight('GetSellerTeacherList')"
              >师资管理</el-button>
              <el-button
                type="text"
                @click="showWalletRightDialog(scope.row)"
                v-if="common.haveRight('SetSellerMoneyRight')"
              >分配钱包权限</el-button>
              <el-button
                type="text"
                @click="jumpToSellerMoneyChange(scope.row)"
                v-if="common.haveRight('GetSellerMoneyChangeList')"
              >钱包变更记录</el-button>
            </div>
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
        @current-change="sellerListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 营业执照弹窗 -->
    <el-dialog :title="`营业执照-${clickItem.SellerName}`" :visible.sync="licenseVisible" width="633px">
      <img :src="licenseImgURL" class="license" />
    </el-dialog>
    <!-- 修改审核状态弹窗 -->
    <el-dialog
      :title="`审核状态修改-${clickItem.SellerName}`"
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
    <!-- 添加商家弹窗 -->
    <el-dialog title="添加商家" :visible.sync="addSellerVisible" width="633px">
      <el-form ref="addSellerForm" :model="addSellerForm">
        <el-form-item label="商家名称:" label-width="100px">
          <el-input type="text" v-model="addSellerForm.sellerName"></el-input>
        </el-form-item>
        <el-form-item label="联系号码:" label-width="100px">
          <el-input type="text" v-model="addSellerForm.sellerMobile"></el-input>
        </el-form-item>
        <el-form-item label="营业执照:" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Admin.License"
            :on-success="addAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addSellerForm.license" :src="addSellerForm.license" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSellerVisible = false" size="medium">取 消</el-button>
        <el-button @click="addSellerOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑商家弹窗 -->
    <el-dialog
      :title="`编辑商家-${clickItem.SellerName}`"
      :visible.sync="editSellerVisible"
      width="633px"
    >
      <el-form ref="editSellerForm" :model="editSellerForm">
        <el-form-item label="商家名称:" label-width="100px">
          <el-input type="text" v-model="editSellerForm.sellerName"></el-input>
        </el-form-item>
        <el-form-item label="联系号码:" label-width="100px">
          <el-input type="text" v-model="editSellerForm.sellerMobile"></el-input>
        </el-form-item>
        <el-form-item label="营业执照:" label-width="100px">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Admin.License"
            :on-success="editAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editSellerForm.license" :src="editSellerForm.license" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSellerVisible = false" size="medium">取 消</el-button>
        <el-button @click="editSellerOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑商家钱包余额弹窗 -->
    <el-dialog
      :title="`编辑商家钱包余额-${clickItem.SellerName}`"
      :visible.sync="walletVisible"
      width="633px"
    >
      <el-form ref="walletForm" :model="walletForm" label-width="100px">
        <el-form-item label="钱包余额(分):">
          <el-input v-model="walletForm.money"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="walletVisible = false" size="medium">取 消</el-button>
        <el-button @click="editSellerWalletOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配钱包权限 -->
    <el-dialog
      :title="`分配钱包权限-${clickItem.SellerName}`"
      :visible.sync="walletRightVisible"
      width="633px"
    >
      <el-checkbox-group v-model="sellerStoreChecked">
        <el-checkbox
          v-for="item in sellerStoreList"
          :label="item.StoreId"
          :key="item.StoreId"
        >{{item.StoreName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="walletRightVisible = false" size="medium">取 消</el-button>
        <el-button @click="walletRightOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetSellerList,
  ModifySellerExamineStatus,
  ModifySellerStatus,
  AddSeller,
  ModifySeller,
  ModifySellerMoney,
  GetSellerStoreList,
  SetSellerMoneyRight,
  DeleteSeller
} from "api/seller.js";
export default {
  name: "SellerList",
  data() {
    return {
      searchSellerName: "", //商户名称搜索
      searchStoreName: "", //门店名称搜索
      searchMobile: "", //联系号码搜索
      searchTime: [], //注册时间搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      sellerListTable: [], //商家列表
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
      addSellerVisible: false, //添加商家弹窗是否可见
      //添加商家弹窗信息
      addSellerForm: {
        sellerName: "",
        sellerMobile: "",
        license: "",
        licenseImg: ""
      },
      editSellerVisible: false, //编辑商家弹窗是否可见
      //编辑商家弹窗信息
      editSellerForm: {
        sellerName: "",
        sellerMobile: "",
        license: "",
        licenseImg: ""
      },
      walletVisible: false,
      walletForm: {
        money: 0
      },
      walletRightVisible: false,

      sellerStoreList: [], //商户门店
      sellerStoreChecked: [] //选中门店
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
    this._getSellerList();
  },

  methods: {
    //跳转到门店管理
    jumpToStoreList(item) {
      this.$router.push({
        path: `/StoreList/${item.SellerId}`,
        query: {
          name: item.SellerName
        }
      });
    },
    //跳转到项目管理
    jumpToItemList(item) {
      this.$router.push({
        path: `/ItemList/${item.SellerId}`,
        query: {
          name: item.SellerName
        }
      });
    },
    //跳转到账户管理
    jumpToSellerAccountList(item) {
      this.$router.push({
        path: `/SellerAccountList/${item.SellerId}`,
        query: {
          name: item.SellerName
        }
      });
    },
    //跳转到师资管理
    jumpToTeacherList(item) {
      this.$router.push({
        path: `/TeacherList/${item.SellerId}`,
        query: {
          name: item.SellerName
        }
      });
    },
    jumpToSellerMoneyChange(item) {
      this.$router.push({
        path: `/SellerMoneyChange/${item.SellerId}`,
        query: {
          name: item.SellerName
        }
      });
    },
    //商户列表搜索
    sellerListSearch() {
      this.pageIndex = 1;
      this._getSellerList();
    },
    //商户列表页面变化
    sellerListCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerList();
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
      this._modifySellerExamineStatus().then(val => {
        this.examineStatusVisible = false;
        this._getSellerList();
      });
    },
    //修改商家状态
    changeStatus(status, item) {
      this._modifySellerStatus(item.SellerId, status);
    },
    //新增商家营业执照上传成功
    addAvatarSuccess(res, file) {
      this.addSellerForm.license = res.Data.ImgUrl;
      this.addSellerForm.licenseImg = res.Data.ImgPath;
    },
    //编辑商家营业执照上传成功
    editAvatarSuccess(res, file) {
      this.editSellerForm.license = res.Data.ImgUrl;
      this.editSellerForm.licenseImg = res.Data.ImgPath;
    },
    //营业执照上传前
    beforeAvatarUpload(file) {
      const isJPEG = file.type === "image/jpeg";
      const isJPG = file.type === "image/jpg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPEG && !isJPG && !isPNG) {
        this.$message.error("上传图片类型只能是jpeg,jpg和png!");
        return false;
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    //显示添加商家弹窗
    showAddSellerDialog() {
      this.addSellerForm.sellerName = "";
      this.addSellerForm.sellerMobile = "";
      this.addSellerForm.license = "";
      this.addSellerForm.licenseImg = "";
      this.addSellerVisible = true;
    },
    //新增商户确认
    addSellerOk() {
      this._addSeller().then(val => {
        this.addSellerVisible = false;
        this.pageIndex = 1;
        this._getSellerList();
      });
    },
    //显示编辑商家弹窗
    showEditSellerDialog(item) {
      this.clickItem = item;
      this.editSellerForm.sellerName = item.SellerName;
      this.editSellerForm.sellerMobile = item.SellerMobile;
      this.editSellerForm.license = item.LicenseAccessUrl;
      this.editSellerForm.licenseImg = item.LicenseUrl;
      this.editSellerVisible = true;
    },
    //编辑商户确认
    editSellerOk() {
      this._editSeller().then(val => {
        this.editSellerVisible = false;
        this._getSellerList();
      });
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
    //显示修改商家钱包余额弹窗
    showMoneySetDialog(item) {
      this.clickItem = item;
      this.walletForm.money = item.Money;
      this.walletVisible = true;
    },
    editSellerWalletOk() {
      this._modifySellerMoney().then(val => {
        this._getSellerList();
        this.walletVisible = false;
      });
    },
    showWalletRightDialog(item) {
      this.clickItem = item;
      this.sellerStoreChecked = item.StoreRightList;
      this._getSellerStoreList().then(val => {
        this.walletRightVisible = true;
      });
    },
    walletRightOk() {
      this._setSellerMoneyRight().then(val => {
        this._getSellerList();
        this.walletRightVisible = false;
      });
    },
    deleteSeller(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSeller(item.SellerId).then(val => {
            this._getSellerList();
          });
        })
        .catch(() => {});
    },
    //获取商家列表接口
    _getSellerList() {
      var par = {
        SellerName: this.searchSellerName,
        SellerMobile: this.searchMobile,
        StartTime:
          this.searchTime == null || this.searchTime.length != 2
            ? ""
            : this.searchTime[0],
        EndTime:
          this.searchTime == null || this.searchTime.length != 2
            ? ""
            : this.searchTime[1],
        PageIndex: this.pageIndex,
        PageCount: this.pageSize,
        StoreName: this.searchStoreName
      };
      return GetSellerList(par, 143).then(res => {
        this.sellerListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //修改商家审核状态
    _modifySellerExamineStatus() {
      var par = {
        Id: this.clickItem.SellerId,
        Status: this.examineStatusForm.examineStatus,
        StatusDes: this.examineStatusForm.examineStatusDes
      };
      return ModifySellerExamineStatus(par, 147);
    },
    //修改商家状态
    _modifySellerStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySellerStatus(par, 146);
    },
    //添加商家信息
    _addSeller() {
      var par = {
        SellerName: this.addSellerForm.sellerName,
        SellerMobile: this.addSellerForm.sellerMobile,
        LicenseUrl: this.addSellerForm.licenseImg
      };
      return AddSeller(par, 144);
    },
    //编辑商家信息
    _editSeller() {
      var par = {
        SellerId: this.clickItem.SellerId,
        SellerName: this.editSellerForm.sellerName,
        SellerMobile: this.editSellerForm.sellerMobile,
        LicenseUrl: this.editSellerForm.licenseImg
      };
      return ModifySeller(par, 145);
    },
    //编辑商家钱包余额
    _modifySellerMoney() {
      var par = {
        SellerId: this.clickItem.SellerId,
        Money: this.walletForm.money
      };
      return ModifySellerMoney(par, 148);
    },
    //获取商户门店列表信息
    _getSellerStoreList() {
      var par = {
        SellerId: this.clickItem.SellerId,
        PageIndex: 1,
        PageCount: 100
      };
      return GetSellerStoreList(par, 149).then(res => {
        this.sellerStoreList = res.List;
      });
    },
    //分配钱包余额使用权限
    _setSellerMoneyRight() {
      var par = {
        SellerId: this.clickItem.SellerId,
        StoreIdList: this.sellerStoreChecked
      };
      return SetSellerMoneyRight(par, 149);
    },
    //删除商家
    _deleteSeller(id) {
      var par = {
        Id: id
      };
      return DeleteSeller(par);
    }
  }
};
</script>

<style scoped lang="less">
.license {
  width: 100%;
  height: auto;
}
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