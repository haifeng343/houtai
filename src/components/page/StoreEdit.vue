<template>
  <div>
    <div class="storeAddFrame">
      <div class="storeAddTitle">基础信息</div>
      <el-form label-width="120px">
        <el-form-item label="门店名称:" prop="storeName">
          <el-input v-model="storeName" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="门店简介:" prop="remark">
          <el-input v-model="remark" placeholder="请输入门店简介"></el-input>
        </el-form-item>
        <el-form-item label="到店体验扣费（分）:" prop="arrivalAmount">
          <el-input v-model="arrivalAmount" placeholder="请输入到店体验扣费"></el-input>
        </el-form-item>
        <el-form-item label="成交扣费点数（1/万）:" prop="dealAmountRate">
          <el-input v-model="dealAmountRate" placeholder="请输入成交扣费点数"></el-input>
        </el-form-item>
        <el-form-item label="成交扣费次数/人:" prop="dealAmountCount">
          <el-input v-model="dealAmountCount" placeholder="请输入成交扣费次数/人"></el-input>
        </el-form-item>
        <el-form-item label="门店品类:">
          <el-select
            v-model="selectCategoryList"
            multiple
            filterable
            default-first-option
            placeholder="请选择门店品类"
            style="width:100%;"
          >
            <el-option
              v-for="item in totalCategoryList"
              :key="item.CategoryId"
              :label="item.CategoryName"
              :value="item.CategoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店电话:">
          <el-table :data="mobileList" border ref="multipleTable">
            <el-table-column prop="CountyCode" align="center" label="国家" fixed></el-table-column>
            <el-table-column align="center" label="电话类型">
              <template slot-scope="scope">{{scope.row.Type==1?"移动电话":"固话"}}</template>
            </el-table-column>
            <el-table-column prop="Mobile" align="center" label="号码"></el-table-column>
            <el-table-column align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="showEditMobileDialog(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteMobile(scope.row)" class="red">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-button
            type="primary"
            @click="showAddMobileDialog()"
            style="float:right;margin-top:10px;"
          >添加电话号码</el-button>
        </el-form-item>
        <el-form-item label="营业执照:">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Admin.License"
            :on-success="licenseAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="licenseShowUrl" :src="licenseShowUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="营业状态:">
          <el-select v-model="businessStatus" placeholder="请选择">
            <el-option
              v-for="item in businessStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="营业时间:">
          <el-table :data="businessTimeList" border ref="multipleTable">
            <el-table-column prop="DateDes" align="center" label="日期" fixed></el-table-column>
            <el-table-column prop="TimeDes" align="center" label="时间"></el-table-column>
            <el-table-column align="center" label="类型">
              <template slot-scope="scope">{{scope.row.Type==1?"正常":"特殊"}}</template>
            </el-table-column>
            <el-table-column align="center" label="操作" fixed="right">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteBusinessTime(scope.row)" class="red">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="float:right;margin-top:10px;">
            <el-button type="primary" @click="showAddNormalTimeDialog()">添加营业时间</el-button>
            <el-button type="primary" @click="showAddSpecialTimeDialog()">添加特殊营业时间</el-button>
          </div>
        </el-form-item>
        <el-form-item label="负责人:" prop="leader">
          <el-input v-model="leader" placeholder="请输入负责人" style="width:215px;"></el-input>
        </el-form-item>
        <el-form-item label="负责人电话:">
          <el-input v-model="leaderMobile" placeholder="请输入负责人电话" style="width:215px;"></el-input>
        </el-form-item>
      </el-form>
      <div class="storeAddTitle">门店主图</div>
      <el-form label-width="100px">
        <el-form-item label="主图规格:">
          <label>360X360</label>
        </el-form-item>
        <el-form-item label="图片预览:">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Store.Main"
            :on-success="handlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="coverImgShowUrl" :src="coverImgShowUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <div class="cell_dashed"></div>
    <div class="storeAddFrame">
      <div class="storeAddTitle">地理位置</div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="省份:" label-width="100px" prop="province">
          <el-select v-model="province" placeholder="请选择省份" @change="choseProvince">
            <el-option
              v-for="item in provinceList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市:" prop="province" @change="choseCity">
          <el-select v-model="city" placeholder="请选择市">
            <el-option v-for="item in shi1" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区/县:" prop="province" @change="choseDistrict">
          <el-select v-model="district" placeholder="请选择区/县">
            <el-option v-for="item in qu1" :key="item.id" :label="item.name" :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form label-width="100px">
        <!-- <el-form-item label="门店商圈:">
          <el-input v-model="tradingArea" placeholder="请选择门店商圈" disabled></el-input>
          <i
            :class="{'el-icon-arrow-down':!tradingAreaVisible,'el-icon-arrow-up':tradingAreaVisible}"
            class="arrowLocation"
            @click="tradingAreaIsShow"
          ></i>
          <div v-if="tradingAreaVisible==true">
            <el-checkbox-group v-model="selectTradingAreaList" @change="tradingAreaChange()">
              <el-checkbox
                v-for="x in totalTradingAreaList"
                :label="x.TradingAreaId"
                :key="x.TradingAreaId"
              >{{x.TradingAreaName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>-->
        <el-form-item label="门店商圈:">
          <el-select
            v-model="selectTradingAreaList"
            multiple
            filterable
            default-first-option
            placeholder="请选择门店商圈"
            style="width:100%;"
          >
            <el-option
              v-for="item in totalTradingAreaList"
              :key="item.TradingAreaId"
              :label="item.TradingAreaName"
              :value="item.TradingAreaId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店地址:" prop="address">
          <el-input v-model="address" placeholder="请输入门店地址"></el-input>
        </el-form-item>
        <el-form-item label="定位地址:">
          <baiduMap :data="location" v-on:location="locationChange" v-if="locationFinish==1"></baiduMap>
        </el-form-item>
      </el-form>
    </div>
    <div style="text-align:center;">
      <el-button @click="editSellerOk()" type="primary" size="medium">确 定</el-button>
    </div>
    <!-- 添加门店电话弹出框 -->
    <el-dialog title="添加电话号码" :visible.sync="addMobileVisible" width="633px">
      <el-form ref="addMobileForm" :model="addMobileForm" :rules="mobileFormRules">
        <el-form-item label="国家:" label-width="100px" prop="countyCode">
          <el-select v-model="addMobileForm.countyCode" placeholder="请选择">
            <el-option
              v-for="item in countyCodeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话类型:" label-width="100px" prop="type">
          <el-radio v-model="addMobileForm.type" label="1">移动电话</el-radio>
          <el-radio v-model="addMobileForm.type" label="2">固话</el-radio>
        </el-form-item>
        <el-form-item label="号码 :" label-width="100px" prop="mobile">
          <el-input v-model="addMobileForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addMobileVisible = false" size="medium">取 消</el-button>
        <el-button @click="addMobileOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑门店电话弹出框 -->
    <el-dialog title="编辑电话号码" :visible.sync="editMobileVisible" width="633px">
      <el-form ref="editMobileForm" :model="editMobileForm" :rules="mobileFormRules">
        <el-form-item label="国家:" label-width="100px" prop="countyCode">
          <el-select v-model="editMobileForm.countyCode" placeholder="请选择">
            <el-option
              v-for="item in countyCodeList"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电话类型:" label-width="100px" prop="type">
          <el-radio v-model="editMobileForm.type" label="1">移动电话</el-radio>
          <el-radio v-model="editMobileForm.type" label="2">固话</el-radio>
        </el-form-item>
        <el-form-item label="号码 :" label-width="100px" prop="mobile">
          <el-input v-model="editMobileForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editMobileVisible = false" size="medium">取 消</el-button>
        <el-button @click="editMobileOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加特殊营业时间弹出框 -->
    <el-dialog title="添加特殊营业时间" :visible.sync="addSpecialTimeVisible" width="633px">
      <el-form ref="addSpecialTimeForm" :model="addSpecialTimeForm" label-width="110px">
        <el-form-item label="特殊营业日期:">
          <el-date-picker
            v-model="addSpecialTimeForm.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="修改营业时间 :">
          <el-radio v-model="addSpecialTimeForm.type" label="1">全年不营业</el-radio>
          <el-radio v-model="addSpecialTimeForm.type" label="2">修改营业时间段</el-radio>
        </el-form-item>
        <el-form-item label="营业时间 :" v-if="addSpecialTimeForm.type=='2'">
          <el-time-picker
            is-range
            arrow-control
            v-model="tempTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm:ss"
          ></el-time-picker>
          <el-button @click="addSpecialTime()" type="primary">添 加</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="addSpecialTimeForm.timeList"
        border
        ref="multipleTable"
        v-if="addSpecialTimeForm.type=='2'"
      >
        <el-table-column prop="time" align="center" label="营业时间" width="412px;"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteSpecialTime(scope.row)" class="red">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addSpecialTimeVisible = false" size="medium">取 消</el-button>
        <el-button @click="addSpecialTimeOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加普通营业时间弹出框 -->
    <el-dialog title="添加营业时间" :visible.sync="addNormalTimeVisible" width="633px">
      <el-form ref="addNormalTimeForm" :model="addNormalTimeForm" label-width="110px">
        <el-form-item label="每年营业季节:">
          <el-radio v-model="addNormalTimeForm.type" label="1">全年</el-radio>
          <el-radio v-model="addNormalTimeForm.type" label="2">分季度</el-radio>
        </el-form-item>
        <el-form-item label="季节:" v-if="addNormalTimeForm.type=='2'">
          <el-checkbox-group v-model="addNormalTimeForm.selectSeasonList">
            <el-checkbox v-for="x in totalSeasonList" :label="x.Name" :key="x.Name">{{x.Name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="每周营业时间 :">
          <el-checkbox-group v-model="addNormalTimeForm.selectWeekList">
            <el-checkbox v-for="x in totalWeekList" :label="x.Name" :key="x.Name">{{x.Name}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="营业时间 :">
          <el-time-picker
            is-range
            arrow-control
            v-model="tempTime"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围"
            value-format="HH:mm:ss"
          ></el-time-picker>
          <el-button @click="addNormalTime()" type="primary">添 加</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="addNormalTimeForm.timeList" border ref="multipleTable">
        <el-table-column prop="time" align="center" label="营业时间" width="412px;"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="deleteNormalTime(scope.row)" class="red">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addNormalTimeVisible = false" size="medium">取 消</el-button>
        <el-button @click="addNormalTimeOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import baiduMap from "components/common/BMap.vue";
import {
  GetSellerStoreCategoryList,
  GetTradingAreaList,
  GetSellerStoreDetails,
  ModifySellerStore
} from "api/seller.js";
import axios from "axios";
export default {
  name: "StoreEdit",
  components: {
    baiduMap
  },
  data() {
    return {
      storeId: 0, //门店Id
      storeName: "", //门店名称
      remark: "", //门店简介
      arrivalAmount: "", //到店扣费
      dealAmountRate: "", //成交扣费点数
      dealAmountCount: "", //成交次数/人
      category: "", //门店品类显示
      licenseUrl: "", //营业执照相对地址
      licenseShowUrl: "", //营业执照展示地址
      selectCategoryList: [], //选中的门店品类列表
      totalCategoryList: [], //所有门店品类列表
      mobileList: [], //门店电话列表
      businessStatus: 1, //营业状态1.营业中 2已关门 3筹建中 4暂停营业
      businessStatusList: [
        { id: 1, name: "营业中" },
        { id: 2, name: "已关门" },
        { id: 3, name: "筹建中" },
        { id: 4, name: "暂停营业" }
      ], //营业状态穷举
      businessTimeList: [], //营业时间
      leader: "", //负责人
      leaderMobile: "", //负责人电话
      coverImg: "", //门店主图相对地址
      coverImgShowUrl: "", //门店主图展示地址
      province: "", //省份
      city: "", //城市
      district: "", //区县
      address: "", //地址
      location: {}, //位置信息
      locationFinish: 0, //位置是否加载完成
      longitude: 0, //精度
      latitude: 0, //纬度
      tradingArea: "", //商圈描述
      selectTradingAreaList: [], //选中的门店品类列表
      totalTradingAreaList: [], //商圈列表
      tradingAreaVisible: false,
      categoryVisible: false,

      //国家列表（目前暂只支持中国）
      countyCodeList: [{ id: 1, name: "中国(+86)" }],
      addMobileVisible: false, //添加门店电话弹窗是否可见
      //添加门店弹窗信息
      addMobileForm: {
        countyCode: "中国(+86)",
        type: "1",
        mobile: ""
      },
      editMobileVisible: false, //编辑门店电话弹窗是否可见
      //编辑门店弹窗信息
      editMobileForm: {
        id: "",
        countyCode: "",
        type: "",
        mobile: "",
        item: {}
      },
      mobileFormRules: {
        countyCode: [
          { required: true, message: "请选择国家", trigger: "blur" }
        ],
        type: [{ required: true, message: "请选择电话类型", trigger: "blur" }]
        // mobile: [
        //   { required: true, message: "请输入号码", trigger: "blur" },
        //   {
        //     pattern: /^(((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8})|((\+\d{2}-)?0\d{2,3}-\d{7,8})$/,
        //     message: "请填写正确的号码(固话格式：区号-号码)",
        //     trigger: "blur"
        //   }
        // ]
      },
      tempTime: "",
      totalSeasonList: [
        { Name: "春季(3月-5月)" },
        { Name: "夏季(6月-8月)" },
        { Name: "秋季(9月-11月)" },
        { Name: "冬季(12月-次年2月)" }
      ],
      totalWeekList: [
        { Name: "周一" },
        { Name: "周二" },
        { Name: "周三" },
        { Name: "周四" },
        { Name: "周五" },
        { Name: "周六" },
        { Name: "周天" }
      ],
      addSpecialTimeVisible: false, //添加特殊营业时间弹窗是否可见
      //添加特殊营业时间弹窗信息
      addSpecialTimeForm: {
        type: "2",
        date: [],
        timeList: []
      },
      addNormalTimeVisible: false, //添加普通营业时间弹窗是否可见
      addNormalTimeForm: {
        type: "1",
        selectSeasonList: [],
        selectWeekList: [],
        timeList: []
      },
      mapJson: "../static/json/map.json",
      provinceList: [],
      cityList: [],
      districtList: [],
      shi1: [],
      qu1: []
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
    this.storeId = this.$route.params.id;
    this.getCityData();
    this._getTradingAreaList().then(val => {
      this._getSellerStoreCategoryList().then(v => {
        this._getSellerStoreDetails();
      });
    });
  },
  watch: {
    $route(newValue, oldValue) {
      this.storeId = this.$route.params.id;
      this.getCityData();
      this._getTradingAreaList().then(val => {
        this._getSellerStoreCategoryList().then(v => {
          this._getSellerStoreDetails();
        });
      });
    }
  },
  methods: {
    // 监听子组件传回的数据
    locationChange(data) {
      if (data != null) {
        this.longitude = data.lng;
        this.latitude = data.lat;
      }
    },
    //是否显示门店平列选择列表
    CategoryIsShow() {
      this.categoryVisible = !this.categoryVisible;
    },
    tradingAreaIsShow() {
      this.tradingAreaVisible = !this.tradingAreaVisible;
    },
    //门店品类选择变化
    categoryChange() {
      var temp = this.totalCategoryList.filter(item => {
        return this.selectCategoryList.indexOf(item.CategoryId) > -1;
      });
      this.category = temp.map(function(v) {
        return v.CategoryName;
      });
    },
    tradingAreaChange() {
      var temp = this.totalTradingAreaList.filter(item => {
        return this.selectTradingAreaList.indexOf(item.TradingAreaId) > -1;
      });
      this.tradingArea = temp.map(function(v) {
        return v.TradingAreaName;
      });
    },
    //门店主图上传成功
    handlerAvatarSuccess(res, file) {
      this.coverImgShowUrl = res.Data.ImgUrl;
      this.coverImg = res.Data.ImgPath;
    },
    //营业执照上传成功
    licenseAvatarSuccess(res, file) {
      this.licenseShowUrl = res.Data.ImgUrl;
      this.licenseUrl = res.Data.ImgPath;
    },
    //门店主图上传前
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
    //显示添加门店电话弹出框
    showAddMobileDialog() {
      this.addMobileVisible = true;
      this.addMobileForm.type = "1";
      this.addMobileForm.mobile = "";
    },
    //添加门店电话
    addMobileOk() {
      this.$refs["addMobileForm"].validate(valid => {
        if (valid) {
          var temp = this.mobileList.filter(item => {
            return item.mobile == this.addMobileForm.mobile;
          });
          if (temp != null && temp.length > 0) {
            this.$message.error("该号码已添加");
            return false;
          }
          this.mobileList.push({
            Id: Date.now().toString(36),
            CountyCode: this.addMobileForm.countyCode,
            Type: this.addMobileForm.type,
            Mobile: this.addMobileForm.mobile
          });
          this.addMobileVisible = false;
        } else {
          return false;
        }
      });
    },
    //显示编辑门店电话弹出框
    showEditMobileDialog(item) {
      this.editMobileVisible = true;
      this.editMobileForm.id = item.Id;
      this.editMobileForm.type = item.Type;
      this.editMobileForm.countyCode = item.CountyCode;
      this.editMobileForm.mobile = item.Mobile;
      this.editMobileForm.item = item;
    },
    //编辑门店电话
    editMobileOk() {
      this.$refs["editMobileForm"].validate(valid => {
        if (valid) {
          this.mobileList.forEach(item => {
            if (item.Id == this.editMobileForm.id) {
              item.CountyCode = this.editMobileForm.countyCode;
              item.Type = this.editMobileForm.type;
              item.Mobile = this.editMobileForm.mobile;
            }
          });
          this.editMobileVisible = false;
        } else {
          return false;
        }
      });
    },
    //删除门店电话
    deleteMobile(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var index = this.mobileList.indexOf(item);
          this.mobileList.splice(index, 1);
        })
        .catch(() => {});
    },
    //显示添加特殊营业时间弹窗
    showAddSpecialTimeDialog() {
      this.addSpecialTimeVisible = true;
      this.addSpecialTimeForm.date = [];
      this.addSpecialTimeForm.type = "2";
      this.addSpecialTimeForm.timeList = [];
      this.tempTime = "";
    },
    //添加特殊营业时间
    addSpecialTime() {
      if (this.tempTime.length != 2) {
        this.$message.error("请填写营业时间");
        return false;
      }
      this.addSpecialTimeForm.timeList.push({
        time: this.tempTime[0] + "~" + this.tempTime[1]
      });
    },
    //删除特殊营业时间
    deleteSpecialTime(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var index = this.addSpecialTimeForm.timeList.indexOf(item);
          this.addSpecialTimeForm.timeList.splice(index, 1);
        })
        .catch(() => {});
    },
    //添加特殊营业时间确定
    addSpecialTimeOk() {
      this.businessTimeList.push({
        Type: 2,
        DateDes:
          this.addSpecialTimeForm.date[0] +
          "~" +
          this.addSpecialTimeForm.date[1],
        TimeDes: JSON.stringify({
          type: this.addSpecialTimeForm.type,
          time: this.addSpecialTimeForm.timeList
        })
      });
      this.addSpecialTimeVisible = false;
    },
    //显示添加营业时间弹窗
    showAddNormalTimeDialog() {
      this.addNormalTimeVisible = true;
      this.addNormalTimeForm.type = "1";
      this.addNormalTimeForm.selectSeasonList = [];
      this.addNormalTimeForm.selectWeekList = [];
      this.addNormalTimeForm.timeList = [];
      this.tempTime = "";
    },
    //添加普通营业时间
    addNormalTime() {
      if (this.tempTime.length != 2) {
        this.$message.error("请填写营业时间");
        return false;
      }
      this.addNormalTimeForm.timeList.push({
        time: this.tempTime[0] + "~" + this.tempTime[1]
      });
    },
    //删除普通营业时间
    deleteNormalTime(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var index = this.addNormalTimeForm.timeList.indexOf(item);
          this.addNormalTimeForm.timeList.splice(index, 1);
        })
        .catch(() => {});
    },
    //添加普通营业时间确定
    addNormalTimeOk() {
      this.businessTimeList.push({
        Type: 1,
        DateDes: JSON.stringify({
          type: this.addNormalTimeForm.type,
          season: this.addNormalTimeForm.selectSeasonList,
          week: this.addNormalTimeForm.selectWeekList
        }),
        TimeDes: JSON.stringify({
          type: this.addNormalTimeForm.type,
          time: this.addNormalTimeForm.timeList
        })
      });
      this.addNormalTimeVisible = false;
    },
    //添加门店确认
    editSellerOk() {
      this._editSellerStore().then(val => {
        this.$message({
          showClose: true,
          message: "门店编辑成功",
          type: "success"
        });
      });
    },
    //删除营业时间
    deleteBusinessTime(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          var index = this.businessTimeList.indexOf(item);
          this.businessTimeList.splice(index, 1);
        })
        .catch(() => {});
    },
    //获取门店品类列表信息
    _getSellerStoreCategoryList() {
      var par = {
        Status: 1,
        PageIndex: 1,
        PageCount: 100
      };
      return GetSellerStoreCategoryList(par, 159).then(res => {
        this.totalCategoryList = res.List;
      });
    },
    //获取商圈列表
    _getTradingAreaList() {
      var par = {
        TradingAreaName: "",
        Status: 1,
        PageIndex: 1,
        PageCount: 100
      };
      return GetTradingAreaList(par, 159).then(res => {
        this.totalTradingAreaList = res.List;
      });
    },
    //获取门店详情
    _getSellerStoreDetails() {
      var par = {
        Id: this.storeId
      };
      return GetSellerStoreDetails(par, 159).then(res => {
        this.storeName = res.StoreName;
        this.remark = res.Remark;
        this.arrivalAmount = res.ArrivalAmount;
        this.dealAmountRate=res.DealAmountRate,
        this.dealAmountCount=res.DealAmountCount,
        this.leader = res.Leader;
        this.leaderMobile = res.LeaderMobile;
        this.mobileList = res.MobileList;
        this.selectCategoryList = res.CategoryList;
        if (res.CategoryList.length > 0) {
          var temp = this.totalCategoryList.filter(item => {
            return this.selectCategoryList.indexOf(item.CategoryId) > -1;
          });
          this.category = temp.map(function(v) {
            return v.CategoryName;
          });
        }
        this.licenseUrl = res.LicenseUrl;
        this.licenseShowUrl = res.LicenseAccessUrl;
        this.businessStatus = res.BusinessStatus;
        this.businessTimeList = res.BusinessTimeList;
        this.coverImg = res.CoverImg;
        this.coverImgShowUrl = res.CoverImgUrl;
        this.province = res.Province;
        this.choseProvince(res.Province);
        this.city = res.City;
        this.choseCity(res.City);
        this.district = res.District;
        this.selectTradingAreaList = res.TradingAreaList;
        if (res.TradingAreaList.length > 0) {
          var temp = this.totalTradingAreaList.filter(item => {
            return this.selectTradingAreaList.indexOf(item.TradingAreaId) > -1;
          });
          this.tradingArea = temp.map(function(v) {
            return v.TradingAreaName;
          });
        }
        this.address = res.Address;
        this.longitude = res.Longitude;
        this.latitude = res.Latitude;
        if (res.Longitude > 0 && res.Latitude > 0) {
          this.location = {
            lng: res.Longitude,
            lat: res.Latitude
          };
        } else {
          this.location = null;
        }
        this.locationFinish = 1;
      });
    },
    //编辑门店
    _editSellerStore() {
      var par = {
        StoreId: this.storeId,
        StoreName: this.storeName,
        ArrivalAmount: this.arrivalAmount,
        DealAmountRate: this.dealAmountRate,
        DealAmountAccount: this.dealAmountAccount,
        Leader: this.leader,
        LeaderMobile: this.leaderMobile,
        MobileList: this.mobileList,
        CategoryList: this.selectCategoryList,
        LicenseUrl: this.licenseUrl,
        BusinessStatus: this.businessStatus,
        CoverImg: this.coverImg,
        Province: this.province,
        City: this.city,
        District: this.district,
        Address: this.address,
        Longitude: this.longitude,
        Latitude: this.latitude,
        TradingAreaList: this.selectTradingAreaList,
        BusinessTimeList: this.businessTimeList,
        Remark: this.remark
      };
      return ModifySellerStore(par, 159);
    },
    // 加载china地点数据，三级
    getCityData: function() {
      var that = this;
      axios
        .get(this.mapJson)
        .then(function(response) {
          if (response.status == 200) {
            var data = response.data;
            that.provinceList = [];
            that.cityList = [];
            that.districtList = [];
            // 省市区数据分类
            for (var item in data) {
              if (item.match(/0000$/)) {
                //省
                that.provinceList.push({
                  id: item,
                  name: data[item],
                  children: []
                });
              } else if (item.match(/00$/)) {
                //市
                that.cityList.push({
                  id: item,
                  name: data[item],
                  children: []
                });
              } else {
                //区
                that.districtList.push({ id: item, name: data[item] });
              }
            }
            // 分类市级
            for (var index in that.provinceList) {
              for (var index1 in that.cityList) {
                if (
                  that.provinceList[index].id.slice(0, 2) ===
                  that.cityList[index1].id.slice(0, 2)
                ) {
                  that.provinceList[index].children.push(that.cityList[index1]);
                }
              }
            }
            // 分类区级
            for (var item1 in that.cityList) {
              for (var item2 in that.districtList) {
                if (
                  that.districtList[item2].id.slice(0, 4) ===
                  that.cityList[item1].id.slice(0, 4)
                ) {
                  that.cityList[item1].children.push(that.districtList[item2]);
                }
              }
            }
          } else {
          }
        })
        .catch(function(error) {});
    },
    // 选省
    choseProvince: function(e) {
      for (var index2 in this.provinceList) {
        if (e === this.provinceList[index2].name) {
          this.shi1 = this.provinceList[index2].children;
          this.city = this.provinceList[index2].children[0].name;
          this.qu1 = this.provinceList[index2].children[0].children;
          this.district = this.provinceList[
            index2
          ].children[0].children[0].name;
        }
      }
    },
    // 选市
    choseCity: function(e) {
      for (var index3 in this.cityList) {
        if (e === this.cityList[index3].name) {
          this.qu1 = this.cityList[index3].children;
          this.district = this.cityList[index3].children[0].name;
        }
      }
    },
    // 选区
    choseDistrict: function(e) {}
  }
};
</script>

<style scoped lang='less'>
.storeAddFrame {
  margin: auto 50px;
}
.storeAddTitle {
  margin-bottom: 20px;
}
.arrowLocation {
  position: absolute;
  top: 6px;
  right: 3px;
  color: #c5c5c5;
  font-size: 33px;
  cursor: pointer;
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
.cell_dashed {
  height: 10px;
  border-bottom: 8px solid #ccc;
  overflow: hidden;
  opacity: 0.2;
  margin-bottom: 30px;
  margin-top: 30px;
}
</style>
