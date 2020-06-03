<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="广告名称:">
          <el-input v-model="searchBannerName" placeholder="请输入广告名称"></el-input>
        </el-form-item>
        <el-form-item label="页面:">
          <el-select v-model="searchBannerCode" placeholder="请选择">
            <el-option
              v-for="item in bannerCodeList"
              :key="item.BannerCode"
              :label="item.CodeDes"
              :value="item.BannerCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="bannerListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button
        type="primary"
        @click="showAddBannerDialog()"
        style="float:right;margin-bottom:10px;"
        v-if="common.haveRight('AddBanner')"
      >添加广告</el-button>
    </div>
    <div>
      <el-table :data="bannerListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="BannerName" align="center" label="广告名称"></el-table-column>
        <el-table-column prop="BannerDescription" align="center" label="描述"></el-table-column>
        <el-table-column prop="BannerPath" align="center" label="广告图片链接"></el-table-column>
        <el-table-column prop="OrderIndex" align="center" label="排序值"></el-table-column>
        <el-table-column prop="Status" align="center" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyBannerStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="400px">
          <template slot-scope="scope">
            <el-button v-if="common.haveRight('ModifyBanner')" type="text" @click="showEditBannerDialog(scope.row)">编辑</el-button>
            <el-button v-if="common.haveRight('DeleteBanner')" type="text" @click="deleteBanner(scope.row)" class="red">删除</el-button>
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
        @current-change="bannerListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加广告弹窗 -->
    <el-dialog title="添加广告" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="页面:" prop="bannerCode">
          <el-select v-model="addForm.bannerCode" placeholder="请选择">
            <el-option
              v-for="item in bannerCodeList2"
              :key="item.BannerCode"
              :label="item.CodeDes"
              :value="item.BannerCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告名称:" prop="bannerName">
          <el-input v-model="addForm.bannerName" placeholder="请输入广告名称"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="bannerDescription">
          <el-input
            type="textarea"
            :rows="4"
            v-model="addForm.bannerDescription"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序值:" prop="orderIndex">
          <el-input v-model="addForm.orderIndex" placeholder="请输入排序值"></el-input>
        </el-form-item>
        <el-form-item label="广告图片:" prop="bannerImg">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Banner.Imgs"
            :on-success="handlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.bannerImgUrl" :src="addForm.bannerImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片跳转类型:">
          <el-select v-model="addForm.actionType" placeholder="请选择">
            <el-option
              v-for="item in actionTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片链接:" prop="bannerPath">
          <el-input v-model="addForm.bannerPath" placeholder="请输入图片链接"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑广告弹窗 -->
    <el-dialog title="编辑广告弹窗" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="rules">
        <el-form-item label="页面:" prop="bannerCode">
          <el-select v-model="editForm.bannerCode" placeholder="请选择">
            <el-option
              v-for="item in bannerCodeList2"
              :key="item.BannerCode"
              :label="item.CodeDes"
              :value="item.BannerCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="广告名称:" prop="bannerName">
          <el-input v-model="editForm.bannerName" placeholder="请输入广告名称"></el-input>
        </el-form-item>
        <el-form-item label="描述:" prop="bannerDescription">
          <el-input
            type="textarea"
            :rows="4"
            v-model="editForm.bannerDescription"
            placeholder="请输入描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序值:" prop="orderIndex">
          <el-input v-model="editForm.orderIndex" placeholder="请输入排序值"></el-input>
        </el-form-item>
        <el-form-item label="广告图片:" prop="bannerImg">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Banner.Imgs"
            :on-success="edithandlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.bannerImgUrl" :src="editForm.bannerImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="图片跳转类型:">
          <el-select v-model="editForm.actionType" placeholder="请选择">
            <el-option
              v-for="item in actionTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片链接:" prop="bannerPath">
          <el-input v-model="editForm.bannerPath" placeholder="请输入图片链接"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" size="medium">取 消</el-button>
        <el-button @click="editOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetBannerList,
  AddBanner,
  ModifyBanner,
  ModifyBannerStatus,
  DeleteBanner,
  GetBannerCodeList
} from "api/banner.js";
export default {
  name: "Banner",
  data() {
    return {
      searchBannerName: "",
      searchBannerCode: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      bannerListTable: [], //列表
      bannerCodeList: [], //查询广告code列表
      bannerCodeList2: [], //操作广告code列表
      rules: {
        bannerCode: [
          { required: true, message: "请选择页面", trigger: "blur" }
        ],
        bannerName: [
          { required: true, message: "请填写广告名称", trigger: "blur" }
        ],
        bannerImg: [
          { required: true, message: "请填写广告图片", trigger: "blur" }
        ],
        orderIndex: [
          { required: true, message: "请填写广告排序", trigger: "blur" }
        ]
      },
      actionTypeList: [
        { id: 1, name: "跳转外部页面" },
        { id: 2, name: "跳转本地页面" }
      ],
      addVisible: false,
      addForm: {
        bannerCode: "",
        bannerName: "",
        bannerDescription: "",
        bannerImg: "",
        bannerImgUrl: "",
        bannerPath: "",
        orderIndex: "",
        actionType: 1
      },
      editVisible: false,
      editForm: {
        id: 0,
        bannerCode: "",
        bannerName: "",
        bannerDescription: "",
        bannerImg: "",
        bannerImgUrl: "",
        bannerPath: "",
        orderIndex: "",
        actionType: 1
      }
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
    this._getBannerList();
    this._getBannerCodeList();
  },
  methods: {
    //搜索
    bannerListSearch() {
      this.pageIndex = 1;
      this._getBannerList();
    },
    //列表分页变化
    bannerListCurrentChange(val) {
      this.pageIndex = val;
      this._getBannerList();
    },
    //添加图片上传成功
    handlerAvatarSuccess(res, file) {
      this.addForm.bannerImg = res.Data.ImgPath;
      this.addForm.bannerImgUrl = res.Data.ImgUrl;
    },
    //编辑图片上传成功
    edithandlerAvatarSuccess(res, file) {
      this.editForm.bannerImg = res.Data.ImgPath;
      this.editForm.bannerImgUrl = res.Data.ImgUrl;
    },
    //图片上传前
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
    //显示新增弹窗
    showAddBannerDialog() {
      this.addForm.bannerCode = "";
      this.addForm.bannerName = "";
      this.addForm.bannerDescription = "";
      this.addForm.bannerImg = "";
      this.addForm.bannerImgUrl = "";
      this.addForm.bannerPath = "";
      this.addForm.orderIndex = "";
      this.addForm.actionType = 1;
      this.addVisible = true;
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addBanner().then(val => {
            this.addVisible = false;
            this._getBannerList();
          });
        } else {
          return false;
        }
      });
    },
    showEditBannerDialog(item) {
      this.editForm.id = item.Id;
      this.editForm.bannerCode = item.BannerCode;
      this.editForm.bannerName = item.BannerName;
      this.editForm.bannerDescription = item.BannerDescription;
      this.editForm.bannerImg = item.BannerImg;
      this.editForm.bannerImgUrl = item.BannerImgUrl;
      this.editForm.bannerPath = item.BannerPath;
      this.editForm.orderIndex = item.OrderIndex;
      this.editForm.actionType = item.ActionType;
      this.editVisible = true;
    },
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyBanner().then(val => {
            this.editVisible = false;
            this._getBannerList();
          });
        } else {
          return false;
        }
      });
    },
    //修改状态
    changeStatus(status, item) {
      this._modifyBannerStatus(item.Id, status);
    },
    //删除banner
    deleteBanner(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteBanner(item.Id).then(val => {
            this._getBannerList();
          });
        })
        .catch(() => {});
    },
    //获取banner列表
    _getBannerList() {
      var par = {
        BannerName: this.searchBannerName,
        BannerCode: this.searchBannerCode,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetBannerList(par,58).then(res => {
        (this.bannerListTable = res.List),
          (this.pageTotalCount = res.TotalCount);
      });
    },
    //添加banner
    _addBanner() {
      var par = {
        BannerCode: this.addForm.bannerCode,
        BannerName: this.addForm.bannerName,
        BannerDescription: this.addForm.bannerDescription,
        BannerImg: this.addForm.bannerImg,
        BannerPath: this.addForm.bannerPath,
        OrderIndex: this.addForm.orderIndex,
        ActionType: this.addForm.actionType
      };
      return AddBanner(par,59);
    },
    //编辑banner
    _modifyBanner() {
      var par = {
        Id: this.editForm.id,
        BannerCode: this.editForm.bannerCode,
        BannerName: this.editForm.bannerName,
        BannerDescription: this.editForm.bannerDescription,
        BannerImg: this.editForm.bannerImg,
        BannerPath: this.editForm.bannerPath,
        OrderIndex: this.editForm.orderIndex,
        ActionType: this.editForm.actionType
      };
      return ModifyBanner(par,60);
    },
    //修改辑banner状态
    _modifyBannerStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyBannerStatus(par,61);
    },
    //删除banner
    _deleteBanner(id) {
      var par = {
        Id: id
      };
      return DeleteBanner(par,62);
    },
    //获取banner Code列表
    _getBannerCodeList() {
      return GetBannerCodeList(null,58).then(res => {
        this.bannerCodeList2 = res;
        this.bannerCodeList = [];
        this.bannerCodeList.push({ BannerCode: "", CodeDes: "全部" });
        this.bannerCodeList = this.bannerCodeList.concat(res);
      });
    }
  }
};
</script>

<style scoped lang='less'>
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
