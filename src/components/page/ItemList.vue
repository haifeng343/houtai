<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="课程名称:">
          <el-input v-model="searchItemName" placeholder="请输入课程名称"></el-input>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select v-model="searchExamineStatus" placeholder="请选择">
            <el-option
              v-for="item in examineStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="ItemListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddItemDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddSellerItem')"
        >添加课程</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="ItemListTable" border ref="multipleTable">
        <el-table-column prop="ItemId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="ItemName" align="center" label="课程名称"></el-table-column>
        <el-table-column align="center" label="审核状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="ChangeExamineStatus(scope.row)"
              :disabled="!common.haveRight('ModifySellerItemExamineStatus')"
            >{{parseExamineStatus(scope.row.ExamineStatus)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ExamineStatusDes" align="center" label="审核状态描述"></el-table-column>
        <el-table-column label="状态" width="180px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySellerItemStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="300px;">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showEditItemDialog(scope.row)"
              v-if="common.haveRight('ModifySellerItem')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="jumpToItemImgs(scope.row)"
              v-if="common.haveRight('GetSellerItemImgList')"
            >课程图片</el-button>
            <el-button
              type="text"
              @click="jumpToItemExtra(scope.row)"
              v-if="common.haveRight('GetItemExtraList')"
            >课程额外信息</el-button>
            <el-button
              type="text"
              @click="deleteItem(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteSellerItem')"
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
        @current-change="sellerListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 修改审核状态弹窗 -->
    <el-dialog
      :title="`审核状态修改-${clickItem.ItemName}`"
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
    <!-- 添加项目弹窗 -->
    <el-dialog title="添加课程" :visible.sync="addItemVisible" width="633px">
      <el-form ref="addItemForm" :model="addItemForm" label-width="80px">
        <el-form-item label="课程名称:">
          <el-input v-model="addItemForm.itemName"></el-input>
        </el-form-item>
        <el-form-item label="课程描述:">
          <el-input type="textarea" :rows="6" v-model="addItemForm.itemDes"></el-input>
        </el-form-item>
        <el-form-item label="课程分类:">
          <el-select
            v-model="addItemForm.selectItemTypeList"
            multiple
            filterable
            default-first-option
            placeholder="请选择课程分类"
            style="width:100%;"
          >
            <el-option
              v-for="item in totalItemTypeList"
              :key="item.TypeId"
              :label="item.TypeName"
              :value="item.TypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="课程标签:">
          <el-select
            v-model="addItemForm.selectItemTagList"
            multiple
            filterable
            default-first-option
            placeholder="请选择课程分类"
            style="width:100%;"
          >
            <el-option
              v-for="item in totalItemTagList"
              :key="item.TagId"
              :label="item.TagName"
              :value="item.TagId"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="课程主图:">
          <label>(主图规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Item.Main"
            :on-success="handlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="addItemForm.coverImgShowUrl"
              :src="addItemForm.coverImgShowUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addItemVisible = false" size="medium">取 消</el-button>
        <el-button @click="addItemOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑项目弹窗 -->
    <el-dialog :title="`编辑课程-${clickItem.ItemName}`" :visible.sync="editItemVisible" width="633px">
      <el-form ref="editItemForm" :model="editItemForm" label-width="80px">
        <el-form-item label="课程名称:">
          <el-input v-model="editItemForm.itemName"></el-input>
        </el-form-item>
        <el-form-item label="课程描述:">
          <el-input type="textarea" :rows="6" v-model="editItemForm.itemDes"></el-input>
        </el-form-item>
        <el-form-item label="课程分类:">
          <el-select
            v-model="editItemForm.selectItemTypeList"
            multiple
            filterable
            default-first-option
            placeholder="请选择课程分类"
            style="width:100%;"
          >
            <el-option
              v-for="item in totalItemTypeList"
              :key="item.TypeId"
              :label="item.TypeName"
              :value="item.TypeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="课程标签:">
          <el-select
            v-model="editItemForm.selectItemTagList"
            multiple
            filterable
            default-first-option
            placeholder="请选择课程分类"
            style="width:100%;"
          >
            <el-option
              v-for="item in totalItemTagList"
              :key="item.TagId"
              :label="item.TagName"
              :value="item.TagId"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="课程主图:">
          <label>(主图规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Item.Main"
            :on-success="editAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="editItemForm.coverImgShowUrl"
              :src="editItemForm.coverImgShowUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editItemVisible = false" size="medium">取 消</el-button>
        <el-button @click="editItemOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
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
  </div>
</template>

<script>
import {
  GetSellerItemList,
  GetSellerItemTypeList,
  GetTagList,
  AddSellerItem,
  ModifySellerItemExamineStatus,
  ModifySellerItemStatus,
  ModifySellerItem,
  DeleteSellerItem,
  GetSellerTeacherList,
  SetSellerItemTeacher
} from "api/seller.js";
export default {
  name: "ItemList",
  data() {
    return {
      sellerId: 0, //商家Id
      //审核状态列表
      examineStatusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "等待审核" },
        { id: 2, name: "审核中" },
        { id: 3, name: "审核失败" },
        { id: 4, name: "审核成功" }
      ],
      searchItemName: "", //项目名称搜索条件
      searchExamineStatus: 0, //审核状态搜索条件
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      ItemListTable: [], //项目列表
      clickItem: {}, //点击某一行数据
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
      totalItemTypeList: [], //总项目类型列表
      totalItemTagList: [], //总项目标签列表
      addItemVisible: false, //添加项目是否显示
      addItemForm: {
        itemName: "", //项目名称
        itemDes: "", //项目描述
        itemType: "", //项目类型
        selectItemTypeList: [], //选中项目类型列表
        itemTypeVisible: false, //类型选择是否可见
        itemTag: "", //项目标签
        selectItemTagList: [], //选中项目标签列表
        itemTagVisible: false, //标签选择是否可见
        coverImgShowUrl: "", //项目主图展示
        coverImg: "", //项目主图
        otherTitle: "", //其他信息标题
        otherContent: "" //其他信息内容
      },
      editItemVisible: false, //添加项目是否显示
      editItemForm: {
        itemName: "", //项目名称
        itemDes: "", //项目描述
        itemType: "", //项目类型
        selectItemTypeList: [], //选中项目类型列表
        itemTypeVisible: false, //类型选择是否可见
        itemTag: "", //项目标签
        selectItemTagList: [], //选中项目标签列表
        itemTagVisible: false, //标签选择是否可见
        coverImgShowUrl: "", //项目主图展示
        coverImg: "", //项目主图
        otherTitle: "", //其他信息标题
        otherContent: "" //其他信息内容
      },
      setTeacherVisible: false, //分配师资弹窗是否可见
      selectTeacherList: [], //分配师资列表
      totalTeacherList: [] //所有师资列表
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
    this.sellerId = this.$route.params.id;
    this._getTagList();
    this._getSellerItemTypeList();
    this._getSellerItemList();
    this._getSellerTeacherList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.sellerId = this.$route.params.id;
      this._getTagList();
      this._getSellerItemTypeList();
      this._getSellerItemList();
      this._getSellerTeacherList();
    }
  },

  methods: {
    //跳转到项目图片
    jumpToItemImgs(item) {
      this.$router.push({
        path: `/ItemImgs/${item.ItemId}`,
        query: {
          name: item.ItemName
        }
      });
    },
    //跳转到项目额外信息
    jumpToItemExtra(item) {
      this.$router.push({
        path: `/ItemExtra/${item.ItemId}`,
        query: {
          name: item.ItemName
        }
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
      this._setSellerItemTeacher().then(val => {
        this.setTeacherVisible = false;
        this._getSellerItemList();
      });
    },
    //搜索
    ItemListSearch() {
      this.pageIndex = 1;
      this._getSellerItemList();
    },
    //项目列表分页变化
    sellerListCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerItemList();
    },
    //修改审核状态确定
    modifyExamineStatusOk() {
      this._modifySellerItemExamineStatus().then(val => {
        this.examineStatusVisible = false;
        this._getSellerItemList();
      });
    },
    //修改项目状态
    changeStatus(status, item) {
      this._modifySellerItemStatus(item.ItemId, status);
    },
    //显示添加项目弹窗
    showAddItemDialog() {
      this.addItemVisible = true;
      this.addItemForm.itemName = "";
      this.addItemForm.itemDes = "";
      this.addItemForm.itemType = "";
      this.addItemForm.selectItemTypeList = [];
      this.addItemForm.itemTypeVisible = false;
      this.addItemForm.itemTag = "";
      this.addItemForm.selectItemTagList = [];
      this.addItemForm.itemTagVisible = false;
      this.addItemForm.coverImgShowUrl = "";
      this.addItemForm.coverImg = "";
      this.addItemForm.otherTitle = "";
      this.addItemForm.otherContent = "";
    },
    //确认添加项目
    addItemOk() {
      this._addSellerItem().then(val => {
        this.addItemVisible = false;
        this._getSellerItemList();
      });
    },
    //显示编辑项目弹窗
    showEditItemDialog(item) {
      this.editItemVisible = true;
      this.clickItem = item;
      this.editItemForm.itemName = item.ItemName;
      this.editItemForm.itemDes = item.ItemDes;
      this.editItemForm.selectItemTypeList = item.ItemTypeList;
      this.editItemTypeChange();
      // this.editItemForm.selectItemTagList = item.ItemTagList;
      // this.editItemTagChange();
      this.editItemForm.coverImg = item.ItemCoverImg;
      this.editItemForm.coverImgShowUrl = item.ItemCoverImgUrl;
      this.editItemForm.otherTitle =
        item.ItemOtherList.length > 0 ? item.ItemOtherList[0].Title : "";
      this.editItemForm.otherContent =
        item.ItemOtherList.length > 0 ? item.ItemOtherList[0].Content : "";
    },
    //编辑确认
    editItemOk() {
      this._modifySellerItem().then(val => {
        this.editItemVisible = false;
        this._getSellerItemList();
      });
    },
    //删除项目
    deleteItem(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSellerItem(item.ItemId).then(val => {
            this._getSellerItemList();
          });
        })
        .catch(() => {});
    },
    //是否显示项目类型选择列表
    ItemTypeIsShow() {
      this.addItemForm.itemTypeVisible = !this.addItemForm.itemTypeVisible;
    },
    //是否显示项目类型选择列表
    EditItemTypeIsShow() {
      this.editItemForm.itemTypeVisible = !this.editItemForm.itemTypeVisible;
    },
    //项目类型选择变化
    itemTypeChange() {
      var temp = this.totalItemTypeList.filter(item => {
        return this.addItemForm.selectItemTypeList.indexOf(item.TypeId) > -1;
      });
      this.addItemForm.itemType = temp.map(function(v) {
        return v.TypeName;
      });
    },
    //编辑项目类型选择变化
    editItemTypeChange() {
      var temp = this.totalItemTypeList.filter(item => {
        return this.editItemForm.selectItemTypeList.indexOf(item.TypeId) > -1;
      });
      this.editItemForm.itemType = temp.map(function(v) {
        return v.TypeName;
      });
    },
    //是否显示项目类型选择列表
    ItemTagIsShow() {
      this.addItemForm.itemTagVisible = !this.addItemForm.itemTagVisible;
    },
    //是否显示项目类型选择列表
    EditItemTagIsShow() {
      this.editItemForm.itemTagVisible = !this.editItemForm.itemTagVisible;
    },
    //项目类型选择变化
    itemTagChange() {
      var temp = this.totalItemTagList.filter(item => {
        return this.addItemForm.selectItemTagList.indexOf(item.TagId) > -1;
      });
      this.addItemForm.itemTag = temp.map(function(v) {
        return v.TagName;
      });
    },
    //项目类型选择变化
    editItemTagChange() {
      var temp = this.totalItemTagList.filter(item => {
        return this.editItemForm.selectItemTagList.indexOf(item.TagId) > -1;
      });
      this.editItemForm.itemTag = temp.map(function(v) {
        return v.TagName;
      });
    },
    //打开修改审核状态弹窗
    ChangeExamineStatus(item) {
      this.clickItem = item;
      this.examineStatusVisible = true;
      this.examineStatusForm.examineStatus = item.ExamineStatus;
      this.examineStatusForm.examineStatusDes = item.ExamineStatusDes;
    },
    //项目主图上传成功
    handlerAvatarSuccess(res, file) {
      this.addItemForm.coverImgShowUrl = res.Data.ImgUrl;
      this.addItemForm.coverImg = res.Data.ImgPath;
    },
    editAvatarSuccess(res, file) {
      this.editItemForm.coverImgShowUrl = res.Data.ImgUrl;
      this.editItemForm.coverImg = res.Data.ImgPath;
    },
    //项目主图上传前
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
    //获取项目列表信息
    _getSellerItemList() {
      var par = {
        SellerId: this.sellerId,
        ItemName: this.searchItemName,
        Status: 0,
        ExamineStatus: this.searchExamineStatus,
        TeacherId: 0
      };
      return GetSellerItemList(par, 168).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.ItemListTable = res.List;
      });
    },
    //获取项目类型列表信息
    _getSellerItemTypeList() {
      var par = {
        TypeName: "",
        Status: 1,
        PageIndex: 1,
        PageCount: 100
      };
      return GetSellerItemTypeList(par, 168).then(res => {
        this.totalItemTypeList = res.List;
      });
    },
    //获取标签列表
    _getTagList() {
      var par = {
        TagName: "",
        Status: 1,
        PageIndex: 1,
        PageCount: 100
      };
      return GetTagList(par, 168).then(res => {
        this.totalItemTagList = res.List;
      });
    },
    //添加项目信息
    _addSellerItem() {
      var par = {
        SellerId: this.sellerId,
        ItemName: this.addItemForm.itemName,
        ItemDes: this.addItemForm.itemDes,
        ItemCoverImg: this.addItemForm.coverImg,
        ItemTypeList: this.addItemForm.selectItemTypeList
      };
      return AddSellerItem(par, 169);
    },
    //修改项目审核状态
    _modifySellerItemExamineStatus() {
      var par = {
        StatusDes: this.examineStatusForm.examineStatusDes,
        Id: this.clickItem.ItemId,
        Status: this.examineStatusForm.examineStatus
      };
      return ModifySellerItemExamineStatus(par, 172);
    },
    //修改项目状态
    _modifySellerItemStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySellerItemStatus(par, 171);
    },
    //编辑项目信息
    _modifySellerItem() {
      var par = {
        ItemId: this.clickItem.ItemId,
        ItemName: this.editItemForm.itemName,
        ItemDes: this.editItemForm.itemDes,
        ItemCoverImg: this.editItemForm.coverImg,
        ItemTypeList: this.editItemForm.selectItemTypeList
      };
      return ModifySellerItem(par, 170);
    },
    //删除项目
    _deleteSellerItem(id) {
      var par = {
        Id: id
      };
      return DeleteSellerItem(par, 173);
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
      return GetSellerTeacherList(par, 168).then(res => {
        this.totalTeacherList = res.List;
      });
    },
    //项目分配师资
    _setSellerItemTeacher() {
      var par = {
        ItemId: this.clickItem.ItemId,
        TeacherList: this.selectTeacherList
      };
      return SetSellerItemTeacher(par);
    }
  }
};
</script>

<style scoped lang='less'>
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
</style>
