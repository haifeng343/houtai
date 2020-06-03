<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="商圈名称:">
          <el-input v-model="searchAreaName" placeholder="请输入商圈名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="areaListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddAreaDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddTradingArea')"
        >添加商圈</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="AreaListTable" border ref="multipleTable">
        <el-table-column prop="TradingAreaId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TradingAreaName" align="center" label="商圈名称"></el-table-column>
        <el-table-column prop="TradingAreaAddress" align="center" label="地址"></el-table-column>
        <el-table-column label="状态" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyTradingAreaStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showEditAreaDialog(scope.row)"
              v-if="common.haveRight('ModifyTradingArea')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleteArea(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteTradingArea')"
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
        @current-change="areaListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加商圈弹窗 -->
    <el-dialog
      title="添加商圈"
      :visible.sync="addAreaVisible"
      width="833px"
      :before-close="handleClose"
    >
      <el-form ref="addAreaForm" :model="addAreaForm" label-width="85px" :rules="areaRules">
        <el-form-item label="商圈名称:" prop="areaName">
          <el-input v-model="addAreaForm.areaName"></el-input>
        </el-form-item>
        <el-form-item label="商圈地址:" prop="areaAddress">
          <el-input v-model="addAreaForm.areaAddress"></el-input>
        </el-form-item>
        <el-form-item label="定位地址:">
          <baiduMap v-on:location="locationChange" v-if="addAreaForm.show"></baiduMap>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCancel" size="medium">取 消</el-button>
        <el-button @click="addAreaOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑商圈弹窗 -->
    <el-dialog
      title="编辑商圈"
      :visible.sync="editAreaVisible"
      width="833px"
      :before-close="editHandleClose"
    >
      <el-form ref="editAreaForm" :model="editAreaForm" label-width="85px" :rules="areaRules">
        <el-form-item label="商圈名称:" prop="areaName">
          <el-input v-model="editAreaForm.areaName"></el-input>
        </el-form-item>
        <el-form-item label="商圈地址:" prop="areaAddress">
          <el-input v-model="editAreaForm.areaAddress"></el-input>
        </el-form-item>
        <el-form-item label="定位地址:">
          <baiduMap v-on:location="locationChange" v-if="editAreaForm.show" :data="location"></baiduMap>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCancel" size="medium">取 消</el-button>
        <el-button @click="editAreaOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import baiduMap from "components/common/BMap.vue";
import {
  AddTradingArea,
  GetTradingAreaList,
  ModifyTradingArea,
  ModifyTradingAreaStatus,
  DeleteTradingArea
} from "api/tradingarea.js";
export default {
  name: "TradingArea",
  components: {
    baiduMap
  },
  data() {
    return {
      searchAreaName: "", //商圈名称搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      AreaListTable: [], //项目列表
      clickItem: {}, //点击某一行数据
      addAreaVisible: false, //添加商圈弹窗是否可见
      addAreaForm: {
        areaName: "",
        areaAddress: "",
        show: false
      },
      editAreaVisible: false, //编辑商圈弹窗是否可见
      editAreaForm: {
        areaName: "",
        areaAddress: "",
        show: false
      },
      areaRules: {
        areaName: [
          { required: true, message: "请输入商圈名称", trigger: "blur" }
        ],
        areaAddress: [
          { required: true, message: "请输入商圈地址", trigger: "blur" }
        ]
      },
      longitude: 0, //精度
      latitude: 0, //纬度
      province: "",
      city: "",
      district: "",
      location: {} //位置信息
    };
  },
  created() {
    this._getTradingAreaList();
  },
  methods: {
    getAddress(point) {
      let that = this;
      //反向地理编码
      // 创建地理编码实例
      var myGeo = new BMap.Geocoder(); // 根据坐标得到地址描述
      myGeo.getLocation(point, function(result) {
        if (result) {
          that.province = result.addressComponents.province;
          that.city = result.addressComponents.city;
          that.district = result.addressComponents.district;
        }
      });
    },
    addCancel() {
      this.addAreaVisible = false;
      this.addAreaForm.show = false;
    },
    handleClose(done) {
      this.addAreaForm.show = false;
      done();
    },
    editCancel() {
      this.editAreaVisible = false;
      this.editAreaForm.show = false;
    },
    editHandleClose(done) {
      this.editAreaForm.show = false;
      done();
    },
    // 监听子组件传回的数据
    locationChange(data) {
      if (data != null) {
        this.getAddress(data);
        this.longitude = data.lng;
        this.latitude = data.lat;
      }
    },
    //搜索
    areaListSearch() {
      this.pageIndex = 1;
      this._getTradingAreaList();
    },
    //项目列表分页变化
    areaListCurrentChange(val) {
      this.pageIndex = val;
      this._getTradingAreaList();
    },
    //显示添加弹窗
    showAddAreaDialog() {
      this.addAreaVisible = true;
      this.addAreaForm.areaName = "";
      this.addAreaForm.areaAddress = "";
      this.longitude = 0;
      this.latitude = 0;
      this.province = "";
      this.city = "";
      this.district = "";
      this.addAreaForm.show = true;
    },
    //添加确认
    addAreaOk() {
      this.$refs["addAreaForm"].validate(valid => {
        if (valid) {
          this._addTradingArea().then(val => {
            this.addAreaVisible = false;
            this.addAreaForm.show = false;
            this._getTradingAreaList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑弹窗
    showEditAreaDialog(item) {
      this.clickItem = item;
      this.editAreaForm.areaName = item.TradingAreaName;
      this.editAreaForm.areaAddress = item.TradingAreaAddress;
      this.longitude = item.Longitude;
      this.latitude = item.Latitude;
      this.province = item.Province;
      this.city = item.City;
      this.district = item.District;
      this.location = {
        lng: item.Longitude,
        lat: item.Latitude
      };
      this.editAreaForm.show = true;
      this.editAreaVisible = true;
    },
    //编辑确认
    editAreaOk() {
      this.$refs["editAreaForm"].validate(valid => {
        if (valid) {
          this._modifyTradingArea().then(val => {
            this.editAreaVisible = false;
            this.editAreaForm.show = false;
            this._getTradingAreaList();
          });
        } else {
          return false;
        }
      });
    },
    //修改账户状态
    changeStatus(status, item) {
      this._modifyTradingAreaStatus(item.TradingAreaId, status);
    },
    //删除商圈
    deleteArea(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteTradingArea(item.TradingAreaId).then(val => {
            this._getTradingAreaList();
          });
        })
        .catch(() => {});
    },
    //添加商圈确定判断
    _addTradingArea() {
      var par = {
        TradingAreaName: this.addAreaForm.areaName,
        TradingAreaAddress: this.addAreaForm.areaAddress,
        TradingAreaHouseNumber: "",
        Longitude: this.longitude,
        Latitude: this.latitude,
        Province: this.province,
        City: this.city,
        District: this.district
      };
      return AddTradingArea(par, 227);
    },
    //获取商圈列表
    _getTradingAreaList() {
      var par = {
        TradingAreaName: this.searchAreaName,
        Status: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetTradingAreaList(par, 226).then(res => {
        this.AreaListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //编辑商圈
    _modifyTradingArea() {
      var par = {
        TradingAreaId: this.clickItem.TradingAreaId,
        TradingAreaName: this.editAreaForm.areaName,
        TradingAreaAddress: this.editAreaForm.areaAddress,
        TradingAreaHouseNumber: "",
        Longitude: this.longitude,
        Latitude: this.latitude,
        Province: this.province,
        City: this.city,
        District: this.district
      };
      return ModifyTradingArea(par, 228);
    },
    //修改商圈状态
    _modifyTradingAreaStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyTradingAreaStatus(par, 229);
    },
    //删除商圈
    _deleteTradingArea(id) {
      var par = {
        Id: id
      };
      return DeleteTradingArea(par, 230);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
