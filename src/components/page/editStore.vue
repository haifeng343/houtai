<template>
  <div>
    <h4 style="margin-bottom:20px">添加参与门店</h4>
    <el-form
      :label-position="labelPosition"
      :rules="addrules"
      ref="addForm"
      label-width="140px"
      :model="addForm"
    >
      <el-form-item label="选择门店" prop="StoreId">
        <el-select v-model="addForm.StoreId" filterable @change="selStore" style="width:420px">
          <el-option
            v-for="item in options1"
            :key="item.StoreId"
            :label="item.StoreName+'('+item.SellerName+')'"
            :value="item.StoreId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择课程" prop="ItemId">
        <el-select
          v-model="addForm.ItemId"
          filterable
          style="width:420px"
          :disabled="!addForm.StoreId"
        >
          <el-option
            v-for="item in options2"
            :key="item.ItemId"
            :label="item.ItemName"
            :value="item.ItemId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原价（分）" prop="Price">
        <el-input v-model="addForm.Price" style="width:420px"></el-input>
      </el-form-item>
      <el-form-item label="课程数量" prop="CoursesNumber">
        <el-input v-model="addForm.CoursesNumber" style="width:420px"></el-input>
      </el-form-item>
      <el-form-item label="章节课时" prop="SingleTime">
        <el-input v-model="addForm.SingleTime" style="width:420px"></el-input>
      </el-form-item>
      <!-- <el-form-item label="最低招生人数" prop="MinNumber">
        <el-input v-model="addForm.MinNumber" style="width:420px"></el-input>
      </el-form-item>
      <el-form-item label="最大招生人数" prop="MaxNumber">
        <el-input v-model="addForm.MaxNumber" style="width:420px"></el-input>
      </el-form-item>-->
      <el-form-item label="每人最大购买数量" prop="MaxBuyCount">
        <el-input v-model="addForm.MaxBuyCount" style="width:420px"></el-input>
      </el-form-item>
      <el-form-item label="到店扣费（分）" prop="ArrivalAmount">
        <el-input v-model="addForm.ArrivalAmount" style="width:420px"></el-input>
      </el-form-item>
      <h4 style="margin:40px 0 20px 0">购买须知</h4>
      <div v-show="hasyu">
        <label>{{Title1}}：</label>
        <el-radio v-model="radio" :label="1">
          是 提前
          <el-input v-model="time1" :disabled="radio==2" style="width:40px"></el-input>小时
        </el-radio>
        <br />
        <el-radio v-model="radio" :label="2" style="margin-left:116px;margin-top:15px">否</el-radio>
      </div>
      <br />
      <br />
      <div class="hasSex">
        <label style="margin-left:30px">{{Title2}}：</label>
        <el-radio-group v-model="radio1">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </div>
      <h4 style="margin:40px 0 20px 0">不可用日期</h4>
      <el-checkbox-group v-model="checkList">
        <el-checkbox :label="1" @change="check1">节假日不可用</el-checkbox>
        <i class="el-icon-arrow-down" @click="show('showData1')"></i>
        <br />
        <el-checkbox :label="2" @change="check2" style="margin:20px 0">每周不可用</el-checkbox>
        <i class="el-icon-arrow-down" @click="show('showData2')"></i>
        <br />
        <el-checkbox :label="3" @change="check3">自定义不可用时间段</el-checkbox>
      </el-checkbox-group>
      <!-- <el-checkbox v-model="Type" :label="1">
        节假日不可用
        <i class="el-icon-arrow-down"></i>
      </el-checkbox>-->
      <el-table
        ref="table1"
        :data="tableData1"
        style="width: 140px;margin-top:-60px;z-index:999;"
        @selection-change="handleSelectionChange1"
        :show-header="false"
        :border="true"
        v-show="showData1"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">{{ scope.row }}</template>
        </el-table-column>
      </el-table>

      <el-table
        ref="table2"
        :data="tableData2"
        style="width: 140px;margin-top:-30px;z-index:999"
        @selection-change="handleSelectionChange2"
        :show-header="false"
        :border="true"
        v-show="showData2"
      >
        <el-table-column type="selection"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">{{ scope.row }}</template>
        </el-table-column>
      </el-table>

      <div class="form3" v-show="showData3">
        <div v-for="item,index in dates">
          <el-date-picker
            v-model="dates[index]"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
          <a href="javascript:;" class="del" @click="delDate(index)">x</a>
        </div>
        <a href="javascript:;" @click="addDate" v-show="showAdd">+</a>
      </div>

      <el-form-item style="text-align:right;margin-right:200px">
        <el-button @click="resetForm('addForm')">取消</el-button>
        <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  sellerStoreList,
  sellerItemList,
  activitygroupStoreModify,
  activitygroupBuynotesList,
  activitygroupStoreInfo
} from "api/sheet.js";
const cityOptions = ["节假日不可用", "每周不可用", "自定义不可用时间段"];
const moment = require("moment");
export default {
  name: "addStore",
  data() {
    return {
      labelPosition: "right",
      Id: "", //商圈id
      options1: [], //选择门店
      options2: [], //选择项目
      options3: [], //课程标签
      radio: 1, //是否预约
      time1: "1", //预约时间
      radio1: 0, //性别限制
      Type: 1,
      checkList: [],
      cities: cityOptions,
      addForm: {
        StoreId: "",
        ItemId: "",
        Price: "",
        CoursesNumber: "",
        SingleTime: "",
        MinNumber: "",
        MaxNumber: "",
        MaxBuyCount: "",
        BuyNotesList: [],
        TimeList: [],
        ArrivalAmount: ""
      },
      tableData1: [
        "春节",
        "元旦",
        "清明节",
        "端午节",
        "中秋节",
        "国际劳动节",
        "国庆节"
      ],
      checkBoxData1: [
        "春节",
        "元旦",
        "清明节",
        "端午节",
        "中秋节",
        "国际劳动节",
        "国庆节"
      ], //多选框选择的值
      tableData2: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      checkBoxData2: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"], //多选框选择的值
      addrules: {
        StoreId: [{ required: true, message: "请选择门店", trigger: "change" }],
        ItemId: [{ required: true, message: "请选择课程", trigger: "change" }],
        Price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        CoursesNumber: [
          { required: true, message: "请输入数量", trigger: "blur" }
        ],
        SingleTime: [
          { required: true, message: "请输入章节课时", trigger: "blur" }
        ],
        MaxBuyCount: [
          { required: true, message: "请输入每人最大购买数量", trigger: "blur" }
        ],
        ArrivalAmount: [
          { required: true, message: "请输入到店扣费金额", trigger: "blur" }
        ]
      },
      showData1: false,
      showData2: false,
      showData3: false,
      dates: [["", ""]],
      showAdd: true,
      hasyu: false,
      hasSex: false,
      buynotes: [],
      Title1: "",
      Title2: "",
      ActivityGroupId: "",
      TradingAreaId: "",
      info: {},
      relId: "" //关系Id
    };
  },
  mounted() {
    this.ActivityGroupId = this.$route.query.Id;
    this.TradingAreaId = this.$route.query.TradingAreaId;
    this.relId = this.$route.query.RelId;
    this.StoreId = this.$route.query.StoreId;
    this._sellerStoreList();
    this.selStore(this.StoreId);
    this._activitygroupBuynotesList();
    this._activitygroupStoreInfo();
    this.addForm.StoreId = this.StoreId;
  },
  watch: {
    $route(newValue, oldValue) {
      this.ActivityGroupId = this.$route.query.Id;
      this.TradingAreaId = this.$route.query.TradingAreaId;
      this._sellerStoreList();
      this._activitygroupBuynotesList();
    }
  },
  methods: {
    _sellerStoreList() {
      //门店列表
      const params = {
        SellerId: 0,
        AccountId: 0,
        TeacherId: 0,
        TradingAreaId: this.TradingAreaId,
        PageCount: 1000,
        PageIndex: 1,
        Status: 1,
        ExamineStatus: 4
      };
      sellerStoreList(params,140).then(res => {
        this.options1 = res.List;
      });
    },
    selStore(e) {
      //项目列表
      const params = {
        SellerId: 0,
        ItemName: "",
        Status: 1,
        ExamineStatus: 4,
        TeacherId: 0,
        StoreId: e,
        PageCount: 1000,
        PageIndex: 1,
        ActivityGroupId: this.ActivityGroupId,
        RelId:this.relId
      };
      sellerItemList(params,140).then(res => {
        this.options2 = res.List;
      });
    },
    //门店详情
    _activitygroupStoreInfo() {
      const _this = this;
      activitygroupStoreInfo({ Id: _this.relId },140).then(res => {
        this.addForm = res;
        this.$nextTick(() => {
          res.BuyNotesList.forEach(item => {
            if (item.Code == "appointment") {
              this.radio = JSON.parse(item.Content).radio;
              this.time1 = JSON.parse(item.Content).time;
            }
            if (item.Code == "sex") {
              this.radio1 = JSON.parse(item.Content).sex;
            }
          });
          res.TimeList.forEach(item => {
            this.checkList.push(item.Type);
            if (item.Type == 1) {
              this.checkBoxData1 = JSON.parse(item.DetailsTime);
              for (let v of this.checkBoxData1) {
                this.$refs["table1"].toggleRowSelection(v);
              }
            }
            if (item.Type == 2) {
              this.checkBoxData2 = JSON.parse(item.DetailsTime);
              for (let v of this.checkBoxData2) {
                this.$refs["table2"].toggleRowSelection(v);
              }
            }
            if (item.Type == 3) {
              this.dates = [];
              let arr = item.DetailsTime.split(",");
              for (let v of arr) {
                let arr1 = v.split("~");
                this.dates.push(arr1);
              }
              this.showData3 = true;
            }
          });
        });
      });
    },
    //购买须知
    _activitygroupBuynotesList() {
      activitygroupBuynotesList(null,140).then(res => {
        this.buynotes = res;
        res.forEach(item => {
          if (item.Code == "appointment") {
            this.Title1 = item.Title;
            this.hasyu = true;
          }
          if (item.Code == "sex") {
            this.Title2 = item.Title;
            this.hasSex = true;
          }
        });
      });
    },
    _activitygroupStoreModify() {
      let arr = [];
      let buynotesArr = [];
      for (let v of this.checkList) {
        if (v == 1) {
          arr.push({
            Type: 1,
            DetailsTime: JSON.stringify(this.checkBoxData1)
          });
        } else if (v == 2) {
          arr.push({
            Type: 2,
            DetailsTime: JSON.stringify(this.checkBoxData2)
          });
        } else if (v == 3) {
          let str = [];
          for (let d of this.dates) {
            d[0] = moment(new Date(d[0])).format("YYYY-MM-DD");
            d[1] = moment(new Date(d[1])).format("YYYY-MM-DD");
            str.push(d[0] + "~" + d[1]);
          }
          arr.push({
            Type: 3,
            DetailsTime: str.join(",")
          });
        }
      }
      for (let k of this.buynotes) {
        if (k.Code == "appointment") {
          if (this.radio == 2) {
            this.time1 = "";
          }
          buynotesArr.push({
            Code: "appointment",
            Content: JSON.stringify({ radio: this.radio, time: this.time1 }),
            Descption: "",
            Title: "是否需要预约"
          });
        } else if (k.Code == "sex") {
          buynotesArr.push({
            Code: "sex",
            Content: JSON.stringify({ sex: this.radio1 }),
            Descption: "",
            Title: "性别限制"
          });
        }
      }

      const params = {
        StoreId: this.addForm.StoreId,
        ItemId: this.addForm.ItemId,
        Price: this.addForm.Price,
        CoursesNumber: this.addForm.CoursesNumber,
        SingleTime: this.addForm.SingleTime,
        MaxBuyCount: this.addForm.MaxBuyCount,
        BuyNotesList: buynotesArr,
        TimeList: arr,
        RelId: this.relId,
        ArrivalAmount:this.addForm.ArrivalAmount
      };
      activitygroupStoreModify(params,140).then(res => {
        this.$message({
          message: "保存成功",
          type: "success",
          showClose: true
        });
        this.showData3 = false;
      });
    },
    handleSelectionChange1(val) {
      this.checkBoxData1 = val;
    },
    handleSelectionChange2(val) {
      this.checkBoxData2 = val;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._activitygroupStoreModify();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    show(n) {
      this[n] = !this[n];
    },
    check1(e) {
      if (e && this.checkBoxData1.length >= 0) {
        this.$refs["table1"].toggleAllSelection();
      } else {
        this.$refs["table1"].clearSelection();
      }
    },
    check2(e) {
      if (e && this.checkBoxData2.length >= 0) {
        this.$refs["table2"].toggleAllSelection();
      } else {
        this.$refs["table2"].clearSelection();
      }
    },
    check3(e) {
      if (e) {
        this.showData3 = true;
      } else {
        this.showData3 = false;
      }
    },
    delDate(index) {
      if (this.dates.length < 2) return;
      this.dates.splice(index, 1);
    },
    addDate() {
      this.dates.push(["", ""]);
      if (this.dates.length >= 32) {
        this.showAdd = false;
      } else {
        this.showAdd = true;
      }
    }
  }
};
</script>

<style scoped lang="less">
.add {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
  flex-direction: column;
  justify-content: flex-start;
}
.el-icon-arrow-down {
  font-size: 14px;
  color: #409eff;
  margin-left: 5px;
}
.del {
  margin-left: 15px;
}
</style>
