<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="课程名称:">
          <el-input v-model="searchItemName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="ItemId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="ItemName" align="center" label="课程名称"></el-table-column>
        <el-table-column align="center" label="师资数量">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showSetTeacherDialog(scope.row)"
              :disabled="!common.haveRight('SetSellerItemTeacher')"
            >{{scope.row.TeacherList.length}}</el-button>
          </template>
        </el-table-column>
        <el-table-column align="center" label="标签数量">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showSetTagDialog(scope.row)"
              :disabled="!common.haveRight('SetSellerItemTag')"
            >{{scope.row.TagList.length}}</el-button>
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
    <!-- 分配师资弹窗 -->
    <el-dialog
      :title="`分配师资-${clickItem.ItemName}`"
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
    <!-- 分配标签弹窗 -->
    <el-dialog :title="`分配标签-${clickItem.ItemName}`" :visible.sync="setTagVisible" width="633px">
      <el-checkbox-group v-model="selectTagList">
        <el-checkbox
          v-for="item in totalTagList"
          :label="item.TagId"
          :key="item.TagId"
        >{{item.TagName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setTagVisible = false" size="medium">取 消</el-button>
        <el-button @click="setTagOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetSellerItemList,
  GetSellerTeacherList,
  SetSellerItemTeacher,
  SetSellerItemTag
} from "api/seller.js";
import { GetTagList } from "api/tag.js";
export default {
  name: "StoreItemTeacher",
  data() {
    return {
      storeId: "", //门店Id
      searchItemName: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //列表
      clickItem: {}, //点击某一行数据
      setTeacherVisible: false, //分配师资弹窗是否可见
      selectTeacherList: [], //分配师资列表
      totalTeacherList: [], //所有师资列表
      setTagVisible: false, //分配标签弹窗是否可见
      selectTagList: [], //分配标签列表
      totalTagList: [] //所有标签列表
    };
  },
  created() {
    this.storeId = this.$route.params.id;
    this._getSellerItemList();
    this._getSellerTeacherList();
    this._getTagList();
  },
  methods: {
    //搜索
    search() {
      this.pageIndex = 1;
      this._getSellerItemList();
    },
    //列表分页变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerItemList();
    },

    //分配师资
    showSetTeacherDialog(item) {
      this.clickItem = item;
      this.selectTeacherList = item.TeacherList;
      this.setTeacherVisible = true;
    },
    //分配师资确定
    setTeacherOk() {
      this._setSellerItemTeacher().then(val => {
        this.setTeacherVisible = false;
        this._getSellerItemList();
      });
    },
    //分配标签
    showSetTagDialog(item) {
      this.clickItem = item;
      this.selectTagList = item.TagList;
      this.setTagVisible = true;
    },
    //分配标签确定
    setTagOk() {
      this._setSellerItemTag().then(val => {
        this.setTagVisible = false;
        this._getSellerItemList();
      });
    },
    //获取项目列表信息
    _getSellerItemList() {
      var par = {
        ItemName: this.searchItemName,
        Status: 1,
        ExamineStatus: 4,
        StoreId: this.storeId,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetSellerItemList(par, 316).then(res => {
        this.listTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //获取师资列表信息
    _getSellerTeacherList() {
      var par = {
        StoreId: this.storeId,
        Status: 1,
        ExamineStatus: 4,
        PageCount: 100,
        PageIndex: 1
      };
      return GetSellerTeacherList(par, 316).then(res => {
        this.totalTeacherList = res.List;
      });
    },
    //项目分配师资
    _setSellerItemTeacher() {
      var par = {
        ItemId: this.clickItem.ItemId,
        TeacherList: this.selectTeacherList,
        StoreId: this.storeId
      };
      return SetSellerItemTeacher(par, 323);
    },
    //项目分配标签
    _setSellerItemTag() {
      var par = {
        ItemId: this.clickItem.ItemId,
        TagList: this.selectTagList,
        StoreId: this.storeId
      };
      return SetSellerItemTag(par, 324);
    },
    //获取标签列表
    _getTagList() {
      var par = {
        TagName: "",
        Status: 1,
        PageCount: 100,
        PageIndex: 1
      };
      return GetTagList(par, 316).then(res => {
        this.totalTagList = res.List;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
