<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="页面编码:">
          <el-input v-model="searchPageCode" placeholder="请输入页面编码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="shareParamListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-button
        v-if="common.haveRight('AddShareParam')"
        type="primary"
        @click="showAddShareParamDialog()"
        style="float:right;margin-bottom:10px;"
      >添加参数</el-button>
    </div>
    <div>
      <el-table :data="paramListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="PageCode" align="center" label="页面编码"></el-table-column>
        <el-table-column prop="DetailsId" align="center" label="详细Id"></el-table-column>
        <el-table-column prop="ShareTitle" align="center" label="分享标题"></el-table-column>
        <el-table-column prop="ShareDesc" align="center" label="分享描述"></el-table-column>
        <el-table-column prop="Status" label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyShareParamStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="SharePath" align="center" label="跳转链接"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="400px">
          <template slot-scope="scope">
            <el-button v-if="common.haveRight('EditShareParam')" type="text" @click="showEditParamDialog(scope.row)">编辑</el-button>
            <el-button v-if="common.haveRight('DeleteShareParam')" type="text" @click="deleteParam(scope.row)" class="red">删除</el-button>
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
        @current-change="paramListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加参数弹窗 -->
    <el-dialog title="添加参数" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="120px" :rules="rules">
        <el-form-item label="页面编码:" prop="pageCode">
          <el-input v-model="addForm.pageCode" placeholder="请输入页面编码"></el-input>
        </el-form-item>
        <el-form-item label="详细Id:" prop="detailsId">
          <el-input v-model="addForm.detailsId" placeholder="请输入详细Id"></el-input>
        </el-form-item>
        <el-form-item label="分享标题:" prop="shareTitle">
          <el-input v-model="addForm.shareTitle" placeholder="请输入分享标题"></el-input>
        </el-form-item>
        <el-form-item label="分享图片:">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Share.Imgs"
            :on-success="handlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.sharePicUrl" :src="addForm.sharePicUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="分享描述:" prop="shareDes">
          <el-input v-model="addForm.shareDes" placeholder="请输入分享描述"></el-input>
        </el-form-item>
        <el-form-item label="分享点击链接:" prop="sharePath">
          <el-input v-model="addForm.sharePath" placeholder="请输入分享点击链接"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input type="textarea" :rows="4" v-model="addForm.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑参数弹窗 -->
    <el-dialog title="编辑参数" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="120px" :rules="rules">
        <el-form-item label="页面编码:" prop="pageCode">
          <el-input v-model="editForm.pageCode" placeholder="请输入页面编码"></el-input>
        </el-form-item>
        <el-form-item label="详细Id:" prop="detailsId">
          <el-input v-model="editForm.detailsId" placeholder="请输入详细Id"></el-input>
        </el-form-item>
        <el-form-item label="分享标题:" prop="shareTitle">
          <el-input v-model="editForm.shareTitle" placeholder="请输入分享标题"></el-input>
        </el-form-item>
        <el-form-item label="分享图片:">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Share.Imgs"
            :on-success="editAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.sharePicUrl" :src="editForm.sharePicUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="分享描述:" prop="shareDes">
          <el-input v-model="editForm.shareDes" placeholder="请输入分享描述"></el-input>
        </el-form-item>
        <el-form-item label="分享点击链接:" prop="sharePath">
          <el-input v-model="editForm.sharePath" placeholder="请输入分享点击链接"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
          <el-input type="textarea" :rows="4" v-model="editForm.remark" placeholder="请输入备注"></el-input>
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
  GetShareParamList,
  AddShareParam,
  EditShareParam,
  DeleteShareParam,
  ModifyShareParamStatus
} from "api/param.js";
export default {
  name: "ShareParam",
  data() {
    return {
      searchPageCode: "",
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      paramListTable: [], //账户列表
      rules: {
        pageCode: [
          { required: true, message: "请输入页面编码", trigger: "blur" }
        ],
        shareTitle: [
          { required: true, message: "请输入分享标题", trigger: "blur" }
        ],
        sharePath: [
          { required: true, message: "请输入分享点击链接", trigger: "blur" }
        ]
      },
      addVisible: false,
      addForm: {
        pageCode: "",
        detailsId: "",
        shareTitle: "",
        sharePic: "",
        sharePicUrl: "",
        shareDes: "",
        sharePath: "",
        remark: ""
      },
      editVisible: false,
      editForm: {
        id: "",
        pageCode: "",
        detailsId: "",
        shareTitle: "",
        sharePic: "",
        sharePicUrl: "",
        shareDes: "",
        sharePath: "",
        remark: ""
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
    this._getShareParamList();
  },
  methods: {
    //搜索
    shareParamListSearch() {
      this.pageIndex = 1;
      this._getShareParamList();
    },
    //列表分页变化
    paramListCurrentChange(val) {
      this.pageIndex = val;
      this._getShareParamList();
    },
    //显示添加分享参数弹窗
    showAddShareParamDialog() {
      this.addForm.pageCode = "";
      this.addForm.detailsId = "";
      this.addForm.shareTitle = "";
      this.addForm.sharePic = "";
      this.addForm.sharePicUrl = "";
      this.addForm.shareDes = "";
      this.addForm.sharePath = "";
      this.addForm.remark = "";
      this.addVisible = true;
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addShareParam().then(val => {
            this.addVisible = false;
            this._getShareParamList();
          });
        } else {
          return false;
        }
      });
    },
    showEditParamDialog(item) {
      this.editForm.id = item.Id;
      this.editForm.pageCode = item.PageCode;
      this.editForm.detailsId = item.DetailsId;
      this.editForm.shareTitle = item.ShareTitle;
      this.editForm.sharePic = item.SharePic;
      this.editForm.sharePicUrl = item.SharePicUrl;
      this.editForm.shareDes = item.ShareDesc;
      this.editForm.sharePath = item.SharePath;
      this.editForm.remark = item.Remark;
      this.editVisible = true;
    },
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._editShareParam().then(val => {
            this.editVisible = false;
            this._getShareParamList();
          });
        } else {
          return false;
        }
      });
    },
    //添加头像上传成功
    handlerAvatarSuccess(res, file) {
      this.addForm.sharePicUrl = res.Data.ImgUrl;
      this.addForm.sharePic = res.Data.ImgPath;
    },
    //编辑头像上传成功
    editAvatarSuccess(res, file) {
      this.editForm.sharePicUrl = res.Data.ImgUrl;
      this.editForm.sharePic = res.Data.ImgPath;
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
    changeStatus(status, item) {
      this._modifyShareParamStatus(item.Id, status);
    },
    deleteParam(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteShareParam(item.Id).then(val => {
            this._getShareParamList();
          });
        })
        .catch(() => {});
    },
    //获取分享参数列表
    _getShareParamList() {
      var par = {
        PageCode: this.searchPageCode,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetShareParamList(par, 14).then(res => {
        this.paramListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //新增分享参数
    _addShareParam() {
      var par = {
        PageCode: this.addForm.pageCode,
        DetailId: this.addForm.detailsId,
        ShareTitle: this.addForm.shareTitle,
        SharePic: this.addForm.sharePic,
        ShareDesc: this.addForm.shareDes,
        SharePath: this.addForm.sharePath,
        Remark: this.addForm.remark
      };
      return AddShareParam(par, 15);
    },
    //编辑分享参数
    _editShareParam() {
      var par = {
        Id: this.editForm.id,
        PageCode: this.editForm.pageCode,
        DetailId: this.editForm.detailsId,
        ShareTitle: this.editForm.shareTitle,
        SharePic: this.editForm.sharePic,
        ShareDesc: this.editForm.shareDes,
        SharePath: this.editForm.sharePath,
        Remark: this.editForm.remark
      };
      return EditShareParam(par,16);
    },
    //删除分享参数
    _deleteShareParam(id) {
      var par = {
        Id: id
      };
      return DeleteShareParam(par,17);
    },
    //修改分享参数状态
    _modifyShareParamStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyShareParamStatus(par,18);
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
