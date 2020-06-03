<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="团单名称">
        <el-input v-model="name" placeholder="请输入团单名称"></el-input>
      </el-form-item>
      <el-form-item label="所属商圈">
        <el-input v-model="tradingareaName" placeholder="请输入所属商圈"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
      </el-form-item>
      <el-button v-if="common.haveRight('AddSheet')" type="primary" class="add" @click="add">添加团单</el-button>
    </el-form>
    <el-table :data="tableData" center style="width: 100%">
      <el-table-column label="团单ID" align="center" prop="SheetId"></el-table-column>
      <el-table-column label="团单名称" align="center" prop="SheetName"></el-table-column>
      <el-table-column label="团单类型" align="center">
        <template slot-scope="scope">{{scope.row.SheetType==2?"商圈模式":"团单模式"}}</template>
      </el-table-column>
      <el-table-column label="团单类型描述" align="center" prop="BuyTypeDes"></el-table-column>
      <el-table-column label="访问数量" align="center" prop="Pageviews">
        <template slot-scope="scope">
          <el-button
            :disabled="!common.haveRight('ModifySheetVisit')"
            type="text"
            @click="showVisitDialog(scope.row)"
          >{{scope.row.Pageviews}}</el-button>
        </template>
      </el-table-column>

      <el-table-column label="门店扣费次数" align="center" prop="StorePayCount"></el-table-column>
      <el-table-column label="所属商圈" align="center" prop="TradingareaName"></el-table-column>
      <el-table-column label="团单主图" align="center">
        <template slot-scope="scope">
          <el-button type="text" @click="ImgDialog(scope.row)">预览图片</el-button>
        </template>
      </el-table-column>
      <el-table-column label="有效期" align="center">
        <template slot-scope="scope">{{scope.row.UpperTime}}~{{scope.row.LowerTime}}</template>
      </el-table-column>
      <el-table-column label="团单状态" align="center" prop="TradingareaName">
        <template slot-scope="scope">
          <span @click="changeUpperStatus">{{scope.row.UpperStatus | UpperStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否有效" align="center" width="151">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.Status"
            :active-value="1"
            :inactive-value="2"
            @change="modifyStatus(scope.row)"
            style="display: block"
            active-color="#61A4FE"
            inactive-color="#CDCCCA"
            active-text="有效"
            inactive-text="无效"
            :disabled="!common.haveRight('ModifySheetStatus')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="CreateTime"></el-table-column>
      <el-table-column label="操作" width="350px">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="showLowerForm(scope.row)"
            v-if="scope.row.UpperStatus==2 && common.haveRight('SheetUpperOrLower')"
          >下架</el-button>
          <el-button
            type="text"
            @click="showUperForm(scope.row)"
            v-if="(scope.row.UpperStatus==3 || scope.row.UpperStatus==1) && common.haveRight('SheetUpperOrLower')"
          >上架</el-button>
          <el-button
            type="text"
            @click="showUperForm(scope.row)"
            v-if="scope.row.UpperStatus==4 && common.haveRight('SheetUpperOrLower')"
          >重新上架</el-button>
          <el-button
            v-if="common.haveRight('GetSheetItemRight')"
            type="text"
            @click="jumpToSheetItem(scope.row)"
          >团单课程</el-button>
          <el-button
            v-if="common.haveRight('GetSheetExtraList')"
            type="text"
            @click="extra(scope.row)"
          >团单额外信息</el-button>
          <el-button
            v-if="common.haveRight('GetSheetImgList')"
            type="text"
            @click="jumpToSheetImgs(scope.row)"
          >团单图片</el-button>
          <el-button v-if="common.haveRight('ModifySheet')" type="text" @click="edit(scope.row)">编辑</el-button>
          <el-button
            v-if="common.haveRight('DeleteSheet')"
            type="text"
            class="red"
            @click="deleteData(scope.row.SheetId)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--增加-->
    <el-dialog title="添加团单" :visible.sync="addVisible" width="1000px">
      <h3>团单信息</h3>
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addForm"
        label-width="130px"
        class="demo-ruleForm"
      >
        <el-form-item label="团单名称:" prop="SheetName">
          <el-input v-model="addForm.SheetName" placeholder="请输入团单名称"></el-input>
        </el-form-item>
        <el-form-item label="团单类型:">
          <el-select v-model="addForm.SheetType" placeholder="请输入团单类型" style="width:100%;">
            <el-option
              v-for="item in sheetTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团单类型描述:" prop="BuyTypeDes">
          <el-input v-model="addForm.BuyTypeDes" placeholder="请输入团单类型描述"></el-input>
        </el-form-item>
        <!-- <el-form-item label="团单标签:" prop="TagList">
          <el-input v-model="IDlist" disabled placeholder="请输入团单名称"></el-input>
          <el-checkbox-group v-model="addForm.TagList" @change="handleCheckedCitiesChange">
            <el-checkbox
              v-for="item in options1"
              :label="item.TagId"
              :key="item.TagId"
            >{{item.TagName}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>-->
        <el-form-item label="团单标签:" prop="TagList">
          <el-select
            v-model="addForm.TagList"
            multiple
            filterable
            default-first-option
            placeholder="请输入团单名称"
            style="width:100%;"
          >
            <el-option
              v-for="item in options1"
              :key="item.TagId"
              :label="item.TagName"
              :value="item.TagId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="团单描述:" prop="SheetDescription">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入团单描述"
            v-model="addForm.SheetDescription"
          ></el-input>
        </el-form-item> 
        <el-form-item label="门店扣费次数:" prop="StorePayCount">
          <el-input placeholder="请输入门店扣费次数" v-model="addForm.StorePayCount"></el-input>
        </el-form-item>
        <el-form-item label="图片预览:">
          <div class="bor">
            <div class="iamge">
              <img :src="imageUrl" alt />
            </div>
            <el-upload
              class="avatar-uploader upload"
              action="../adminrocket/img/upload"
              :headers="headers"
              name="Sheet.Main"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-button size="medium" class="upload" plain>
                <i class="el-icon-upload el-icon--right"></i>上传图片
              </el-button>
            </el-upload>
            <p class="tip">主图规格：360x360</p>
          </div>
        </el-form-item>
        <el-form-item label="选择活动组:" prop="ActivityGroupId">
          <el-select v-model="addForm.ActivityGroupId" placeholder="请选择活动组" style="width:790px">
            <el-option
              v-for="item in options2"
              :key="item.ActivityGroupId"
              :label="item.ActivityGroupName"
              :value="item.ActivityGroupId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最大可售:" prop="Stock">
          <el-input v-model="addForm.Stock" placeholder="请输入最大可售"></el-input>
        </el-form-item>
        <el-form-item label="团单有效期:">
          <el-radio v-model="radio1" :label="1">
            下单后:
            <el-input v-model="day" :disabled="radio1 ==2" style="width:80px;"></el-input>天有效
          </el-radio>
          <br />
          <el-radio v-model="radio1" :label="2" style="margin-top:20px">
            有效期至:
            <el-date-picker
              v-model="time1"
              :disabled="radio1 ==1"
              type="datetime"
              placeholder="选择日期时间"
            ></el-date-picker>
          </el-radio>
          <br />下单后
          <el-input v-model="can" style="width:60px;margin-top:20px"></el-input>分钟可以退款（0表示不可退款，-1表示随时可退）
        </el-form-item>
        <h3>购买须知</h3>
        <el-form-item label="购买人群限制:">
          <el-radio-group v-model="CrowdLimit">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">新用户</el-radio>
            <el-radio :label="2">老用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="购买限制:">
          每人最多购买数量:
          <el-input v-model="addForm.MaxBuyCount" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="是否使用积分优惠:">
          <el-radio v-model="hasScoreRate" :label="1" style="margin-right:15px">是</el-radio>最多不超过实际价格的
          <el-input v-model="UseScoreRate" :disabled="hasScoreRate==0" style="width:100px"></el-input>/万
          <br />
          <el-radio v-model="hasScoreRate" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')">关 闭</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确 定</el-button>
      </span>
    </el-dialog>

    <!--查看图片-->
    <el-dialog :title="`查看-${tableData.id}`" :visible.sync="ImgVisible" width="500px">
      <img :src="ImgUrl" class="imgDialog" alt />
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="ImgVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--确定下架弹窗-->
    <el-dialog :visible.sync="lowerVisible" width="500px">
      <label>确定下架团单【{{lowerForm.sheetName}}】吗？</label>
      <span slot="footer" class="dialog-footer">
        <el-button @click="lowerVisible = false">取 消</el-button>
        <el-button type="primary" @click="lowerOk()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上架弹窗 -->
    <el-dialog :title="`上架团单-${upperForm.sheetName}`" :visible.sync="upperVisible" width="633px">
      <el-form ref="upperForm" :model="upperForm" label-width="125px">
        <el-form-item label="上架时间:">
          <el-radio v-model="upperForm.upperType" label="1">立即上架</el-radio>
          <el-radio v-model="upperForm.upperType" label="2">指定时间</el-radio>
          <el-date-picker
            v-model="upperForm.upperTime"
            type="datetime"
            placeholder="选择日期时间"
            :disabled="upperForm.upperType!=2"
            style="width:193px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="过期时间:">
          <el-radio v-model="upperForm.expireType" label="1">
            上架后
            <el-input
              v-model="upperForm.day"
              style="width:100px;"
              :disabled="upperForm.expireType!=1"
            ></el-input>天失效
          </el-radio>
          <div style="margin-top:10px;">
            <el-radio v-model="upperForm.expireType" label="2">指定时间</el-radio>
            <el-date-picker
              v-model="upperForm.expireTime"
              type="datetime"
              placeholder="选择日期时间"
              :disabled="upperForm.expireType!=2"
              style="width:193px;"
            ></el-date-picker>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upperVisible = false" size="medium">取 消</el-button>
        <el-button @click="upperOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!--修改访问量-->
    <el-dialog title="修改访问量" :visible.sync="visitVisible" width="500px">
      <el-form ref="visitForm" :model="visitForm" label-width="125px">
        <el-form-item label="访问数量:">
          <el-input v-model="visitForm.VisitCount" placeholder="请输入访问数量"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visitVisible = false" size="medium">取 消</el-button>
        <el-button @click="visitOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!--分页-->
    <div class="pagination">
      <el-pagination
        prev-text="上一页"
        next-text="下一页"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :pager-count="11"
        layout="prev, pager, next"
        :total="TotalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  activitygroupList,
  tagList,
  sheetList,
  sheetAdd,
  sheetModify,
  sheetDelete,
  sheetStatusModify,
  SheetLower,
  SheetUpper,
  ModifySheetVisit
} from "api/sheet.js";
export default {
  name: "GroupOrder",
  data() {
    return {
      sheetTypeList: [{ id: 1, name: "团单模式" }, { id: 2, name: "商圈模式" }],
      tradingareaName: "",
      name: "",
      tableData: [],
      TotalCount: 0,
      pageSize: 20,
      currentPage: 1,
      ImgVisible: false,
      addVisible: false,
      CoverImg: "", //图片相对路径
      imageUrl: "", //上传图片
      ImgUrl: "", //图片预览
      options1: [], //团单标签
      options2: [], //活动组
      radio1: 1, //团单有效期
      day: "1", //时长
      can: "", //退款
      CrowdLimit: 0, //人群限制
      hasScoreRate: 1, //是否使用积分优惠
      UseScoreRate: "", //可以使用积分的百分比（1/万）
      time1: "2200-11-10 10:10:00",
      addForm: {
        SheetName: "",
        TagList: "",
        Stock: "",
        SheetDescription: "",
        ActivityGroupId: "",
        MaxBuyCount: "",
        SheetType: 1,
        BuyTypeDes: "",
        StorePayCount:""
      },
      addrules: {
        SheetName: [
          { required: true, message: "请输入团单名称", trigger: "blur" }
        ],
        // Stock: [{ required: true, message: "请输入最大可售", trigger: "blur" }],
        TagList: [
          { required: true, message: "请选择团单标签", trigger: "change" }
        ],
        SheetDescription: [
          { required: true, message: "请输入团单描述", trigger: "blur" }
        ],
        ActivityGroupId: [
          { required: true, message: "请选择活动组", trigger: "change" }
        ],
        MaxBuyCount: [
          { required: true, message: "请输入最大可售数量", trigger: "blur" }
        ]
      },
      IDlist: "", //复选框数组
      lowerVisible: false,
      lowerForm: {
        sheetId: "",
        sheetName: ""
      },
      upperVisible: false,
      upperForm: {
        sheetId: "",
        sheetName: "",
        upperType: 1, //上架类型1.立即上架 2.指定时间上架
        upperTime: "",
        expireType: 1, //过期类型1.上架后几天过期 2.指定时间过期
        day: 0,
        expireTime: ""
      },
      visitVisible: false,
      visitForm: {
        VisitCount: 0,
        SheetId: 0
      }
    };
  },
  computed: {
    headers() {
      let token = localStorage.getItem("userToken");
      let obj = {
        userToken: token,
        application: "callcenter_0.0.0.1"
      };
      return obj;
    }
  },
  filters: {
    UpperStatus(status) {
      switch (status) {
        case 1:
          return "等待上架";
        case 2:
          return "已上架";
        case 3:
          return "已下架";
        case 4:
          return "已过期";
      }
    }
  },
  mounted() {
    this._sheetList(1);
  },
  methods: {
    //跳转到团单项目
    jumpToSheetItem(item) {
      this.$router.push({
        path: `/SheetItem/${item.SheetId}`,
        query: {
          name: item.SheetName,
          activityGroupId: item.ActivityGroupId
        }
      });
    },
    //跳转到团单图片
    jumpToSheetImgs(item) {
      this.$router.push({
        path: `/SheetImgs/${item.SheetId}`,
        query: {
          name: item.SheetName
        }
      });
    },
    showLowerForm(item) {
      this.lowerForm.sheetId = item.SheetId;
      this.lowerForm.sheetName = item.SheetName;
      this.lowerVisible = true;
    },
    //团单下架
    lowerOk() {
      this._sheetLower().then(val => {
        this._sheetList();
        this.lowerVisible = false;
      });
    },
    showUperForm(item) {
      this.upperForm.sheetId = item.SheetId;
      this.upperForm.sheetName = item.SheetName;
      this.upperForm.upperType = item.UpperTime == null ? "1" : "2";
      this.upperForm.upperTime = item.UpperTime == null ? "" : item.UpperTime;
      this.upperForm.expireType = item.LowerTime == null ? "1" : "2";
      this.upperForm.day = 7;
      this.upperForm.expireTime = item.LowerTime;
      this.upperVisible = true;
    },
    upperOk() {
      this._sheetUpper().then(val => {
        this._sheetList();
        this.upperVisible = false;
      });
    },
    //团单列表
    _sheetList() {
      const params = {
        SheetName: this.name,
        TradingareaName: this.tradingareaName,
        PageCount: this.pageSize,
        PageIndex: this.currentPage
      };
      sheetList(params, 63).then(res => {
        this.tableData = res.List;
        this.TotalCount = res.TotalCount;
      });
    },
    //标签列表
    _tagList(rightId) {
      const params = {
        TagName: "",
        Status: 1,
        PageCount: 1000,
        PageIndex: 1
      };
      tagList(params, rightId).then(res => {
        this.options1 = res.List;
      });
    },
    //活动组列表
    _activitygroupList(rightId) {
      const params = {
        Name: "",
        Status: 1,
        PageCount: 1000,
        PageIndex: 1
      };
      activitygroupList(params, rightId).then(res => {
        this.options2 = res.List;
      });
    },
    //修改团单状态
    modifyStatus(item) {
      const params = {
        Id: item.SheetId,
        Status: item.Status
      };
      sheetStatusModify(params, 66);
    },
    //添加团单
    _sheetAdd(F) {
      const params = {
        SheetName: this.addForm.SheetName,
        TagList: this.addForm.TagList,
        ActivityGroupId: this.addForm.ActivityGroupId,
        SheetDescription: this.addForm.SheetDescription,
        CoverImg: this.CoverImg,
        ValidType: this.radio1 == 1 ? 2 : 1,
        Validtime: this.radio1 == 2 ? this.time1 : "",
        OrderTime: this.radio1 == 1 ? this.day : "",
        RefundTime: this.can,
        Stock: this.addForm.Stock,
        UseScoreRate: this.hasScoreRate == 1 ? this.UseScoreRate : "0",
        MaxBuyCount: this.addForm.MaxBuyCount,
        MinBuyCount: 0,
        CrowdLimit: this.CrowdLimit,
        Keywords: "",
        SheetId: this.addForm.SheetId,
        SheetType: this.addForm.SheetType,
        BuyTypeDes: this.addForm.BuyTypeDes,
        StorePayCount:this.addForm.StorePayCount
      };
      let Url = F == 1 ? sheetModify : sheetAdd;
      Url(params, F == 1 ? 65 : 64).then(res => {
        this.$message({
          message: F == 1 ? "编辑成功" : "增加成功",
          showClose: true,
          type: "success"
        });
        this._sheetList();
      });
    },
    //图片预览
    ImgDialog(item) {
      this.tableData.id = item.SheetId;
      this.ImgUrl = item.CoverAccessImg;
      this.ImgVisible = true;
    },
    //改变团单状态
    changeUpperStatus() {},
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this._sheetList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this._sheetList();
    },
    //复选框勾选
    handleCheckedCitiesChange(val) {
      let arr = [];
      val.forEach(item => {
        this.options1.forEach(item1 => {
          if (item == item1.TagId) {
            arr.push(item1.TagName);
          }
        });
      });
      this.IDlist = arr.join(",");
    },
    //搜索
    search() {
      this.currentPage = 1;
      this._sheetList();
    },
    //添加团单
    add() {
      this._activitygroupList(64);
      this._tagList(64);
      this.addVisible = true;
      this.imageUrl = "";
      this.day = "1";
      this.CrowdLimit = 0;

      this.addForm = {
        TagList: []
      };
    },
    edit(item) {
      this._activitygroupList(65);
      this._tagList(65);
      this.addVisible = true;
      this.addForm = Object.assign({}, item);
      this.imageUrl = item.CoverAccessImg;
      this.UseScoreRate = item.UseScoreRate;
      this.day = item.OrderTime;
      this.time1 = item.Validtime;
      this.can = item.RefundTime;
      let arr = [];
      item.TagList.forEach(item => {
        this.options1.forEach(item1 => {
          if (item == item1.TagId) {
            arr.push(item1.TagName);
          }
        });
      });
      this.CrowdLimit = item.CrowdLimit;
      this.IDlist = arr.join(",");
      if (item.UseScoreRate != 0) {
        this.hasScoreRate = 1;
        this.UseScoreRate = item.UseScoreRate;
      } else {
        this.hasScoreRate = 0;
      }
      this.radio1 = item.ValidType == 1 ? 2 : 1;
    },
    submitForm(formName) {
      let F = this.addForm.SheetId ? 1 : 0;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.hasScoreRate == 1) {
            if (this.UseScoreRate <= 0) {
              this.$message({
                message: "请输入正确的积分比例",
                showClose: true,
                type: "error"
              });
              return;
            }
          }
          if (!this.imageUrl) {
            this.$message.error({ showClose: true, message: "请上传图片" });
            return;
          }
          this._sheetAdd(F);
          this.addVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //设置标签
    tagset(item) {},
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addVisible = false;
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
      this.CoverImg = res.Data.ImgPath;
    },
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
    extra(item) {
      this.$router.push({
        path: "/extra",
        query: { Id: item.SheetId }
      });
    },
    // 删除
    deleteData(Id) {
      this.$confirm("此操作将永久删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = {
            Id: Id
          };
          sheetDelete(params, 67)
            .then(res => {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this._sheetList();
            })
            .catch(error => {});
        })
        .catch(() => {});
    },
    showVisitDialog(item) {
      this.visitForm.SheetId = item.SheetId;
      this.visitForm.VisitCount = item.Pageviews;
      this.visitVisible = true;
    },
    visitOk() {
      this._modifySheetVisit(
        this.visitForm.SheetId,
        this.visitForm.VisitCount
      ).then(val => {
        this._sheetList();
        this.visitVisible = false;
      });
    },
    //团单下架
    _sheetLower() {
      var par = {
        Id: this.lowerForm.sheetId
      };
      return SheetLower(par, 73);
    },
    //团单上架
    _sheetUpper() {
      var par = {
        SheetId: this.upperForm.sheetId,
        UpperType: this.upperForm.upperType,
        UpperTime: this.upperForm.upperTime,
        ExpireType: this.upperForm.expireType,
        Day: this.upperForm.day,
        ExpireTime: this.upperForm.expireTime
      };
      return SheetUpper(par, 73);
    },
    //修改团单访问量
    _modifySheetVisit(id, count) {
      var par = {
        SheetId: id,
        VisitCount: count
      };
      return ModifySheetVisit(par, 92);
    }
  }
};
</script>

<style scoped lang="less">
.bor {
  width: 350px;
  height: 260px;
  border: 1px solid #ccc;
  position: relative;
}
.avatar-uploader {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.iamge {
  width: 180px;
  height: 180px;
  border: 1px solid #ccc;
  padding: 6px;
  position: relative;
  left: 22%;
  top: 10px;
}
.iamge img {
  width: 100%;
  object-fit: cover;
  height: 100%;
}
.tip {
  position: absolute;
  width: 150px;
  left: 360px;
  bottom: -10px;
}
</style>
