<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="名称:">
          <el-input v-model="nameSearch" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="类型:">
          <el-select v-model="typeSearch" placeholder="请选择">
            <el-option
              v-for="item in typeSearchList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="listSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          style="float:right;margin-bottom:10px;"
          type="primary"
          @click="showAddDialog()"
        >创建客服</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="listTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="Name" align="center" label="名称"></el-table-column>
        <el-table-column prop="SendTitle" align="center" label="发送标题"></el-table-column>
        <el-table-column prop="SendImgUrl" align="center" label="发送图片地址"></el-table-column>
        <el-table-column prop="SendLinkPath" align="center" label="发送点击链接"></el-table-column>
        <el-table-column prop="ReplyType" align="center" label="回复类型">
          <template slot-scope="scope">
            <span>{{scope.row.ReplyType==1?"图片":"未知"}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ReplyContent" align="center" label="回复内容"></el-table-column>
        <el-table-column prop="CreateTime" align="center" label="数据创建时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="showEditDialog(scope.row)">编辑</el-button>
              <el-button type="text" @click="deleteData(scope.row)" style="color:red">删除</el-button>
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
        @current-change="listCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加图片类型 -->
    <el-dialog title="添加客服图片类型" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="名称:" prop="Name">
          <el-input type="text" v-model="addForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="发送标题:" prop="ConSendTitletent">
          <el-input type="text" v-model="addForm.SendTitle"></el-input>
        </el-form-item>
        <el-form-item label="发送图片:" prop="SendImgUrl">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Pop.Img"
            :on-success="handlerAvatarSuccess2"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.SendImgUrl" :src="addForm.SendImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="发送点击链接:" prop="SendLinkPath">
          <el-input type="text" v-model="addForm.SendLinkPath"></el-input>
        </el-form-item>
        <el-form-item label="回复类型:" prop="ReplyType">
          <el-select v-model="addForm.ReplyType" placeholder="请选择">
            <el-option
              v-for="item in typeSearchListNoAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回复图片:" prop="ReplyType">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Pop.Img"
            :on-success="handlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.ReplyImgUrl" :src="addForm.ReplyImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑图片类型 -->
    <el-dialog title="编辑图片类型" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="rules">
        <el-form-item label="名称:" prop="Name">
          <el-input type="text" v-model="editForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="发送标题:" prop="ConSendTitletent">
          <el-input type="text" v-model="editForm.SendTitle"></el-input>
        </el-form-item>
        <el-form-item label="发送图片:" prop="SendImgUrl">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Pop.Img"
            :on-success="editAvatarSuccess2"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.SendImgUrl" :src="editForm.SendImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="发送点击链接:" prop="SendLinkPath">
          <el-input type="text" v-model="editForm.SendLinkPath"></el-input>
        </el-form-item>
        <el-form-item label="回复类型:" prop="ReplyType">
          <el-select v-model="editForm.ReplyType" placeholder="请选择">
            <el-option
              v-for="item in typeSearchListNoAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回复图片:" prop="ReplyType">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Pop.Img"
            :on-success="editAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.ReplyImgUrl" :src="editForm.ReplyImgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
  GetPopServiceSetList,
  AddPopServiceSet,
  ModifyPopServiceSet,
  DeletePopServiceSet
} from "api/pop.js";
export default {
  name: "ServicePublic",
  data() {
    return {
      typeSearchList: [
        {
          id: 0,
          name: "全部"
        },
        {
          id: 1,
          name: "图片"
        }
      ],
      typeSearchListNoAll: [
        {
          id: 1,
          name: "图片"
        }
      ],
      nameSearch: "",
      typeSearch: 0,
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      listTable: [], //商家列表
      rules: {
        Name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        SendTitle: [
          { required: true, message: "请输入发送标题", trigger: "blur" }
        ],
        ReplyType: [
          { required: true, message: "请输入回复内容类型", trigger: "blur" }
        ]
      },
      addVisible: false,
      addForm: {
        Name: "",
        SendTitle: "",
        SendImgUrl: "",
        SendLinkPath: "",
        ReplyContent: "",
        ReplyType: "",
        ReplyImgUrl: ""
      },

      editVisible: false,
      editForm: {
        Id: "",
        Name: "",
        SendTitle: "",
        SendImgUrl: "",
        SendLinkPath: "",
        ReplyContent: "",
        ReplyType: "",
        ReplyImgUrl: ""
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
    this._getPopServiceSetList();
  },
  methods: {
    //商户列表搜索
    listSearch() {
      this.pageIndex = 1;
      this._getPopServiceSetList();
    },
    //商户列表页面变化
    listCurrentChange(val) {
      this.pageIndex = val;
      this._getPopServiceSetList();
    },
    //显示添加弹窗
    showAddDialog() {
      this.addForm.Name = "";
      this.addForm.SendTitle = "";
      this.addForm.SendImgUrl = "";
      this.addForm.SendLinkPath = "";
      this.addForm.ReplyContent = "";
      this.addForm.ReplyType = "";
      this.addForm.ReplyImgUrl = "";
      this.addVisible = true;
    },
    //确认添加
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._addPopServiceSet().then(val => {
            this._getPopServiceSetList();
            this.addVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //显示编辑弹窗
    showEditDialog(item) {
      this.editForm.Id = item.Id;
      this.editForm.Name = item.Name;
      this.editForm.SendTitle = item.SendTitle;
      this.editForm.SendImgUrl = item.SendImgUrl;
      this.editForm.SendLinkPath = item.SendLinkPath;
      this.editForm.ReplyContent = item.ReplyContent;
      this.editForm.ReplyType = item.ReplyType;
      this.editForm.ReplyImgUrl = JSON.parse(item.ReplyContent).thumb_url;
      this.editVisible = true;
    },
    //编辑确认
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          this._modifyPopServiceSet().then(val => {
            this._getPopServiceSetList();
            this.editVisible = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteData(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deletePopServiceSet(item.Id).then(val => {
            this._getPopServiceSetList();
          });
        })
        .catch((e) => {});
    },
    //添加头像上传成功
    handlerAvatarSuccess(res, file) {
      this.addForm.ReplyImgUrl = res.Data.ImgUrl;
      this.addForm.ReplyContent =
        '{"api_reply_type": "receive_reply","reply_type":"image","thumb_url": "' +
        res.Data.ImgUrl +
        '"}';
    },
    //编辑头像上传成功
    editAvatarSuccess(res, file) {
      this.editForm.ReplyImgUrl = res.Data.ImgUrl;
      this.editForm.ReplyContent =
        '{"api_reply_type": "receive_reply","reply_type":"image","thumb_url": "' +
        res.Data.ImgUrl +
        '"}';
    },
    //添加头像上传成功
    handlerAvatarSuccess2(res, file) {
      this.addForm.SendImgUrl = res.Data.ImgUrl;
    },
    //编辑头像上传成功
    editAvatarSuccess2(res, file) {
      this.editForm.SendImgUrl = res.Data.ImgUrl;
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
    //获取小程序客服设置列表
    _getPopServiceSetList() {
      var par = {
        Name: this.nameSearch,
        Type: this.typeSearch,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetPopServiceSetList(par).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.listTable = res.List;
      });
    },
    //添加小程序客服设置
    _addPopServiceSet() {
      var par = {
        Name: this.addForm.Name,
        SendTitle: this.addForm.SendTitle,
        SendImgUrl: this.addForm.SendImgUrl,
        SendLinkPath: this.addForm.SendLinkPath,
        ReplyContent: this.addForm.ReplyContent,
        ReplyType: this.addForm.ReplyType
      };
      return AddPopServiceSet(par);
    },
    //编辑小程序客服设置
    _modifyPopServiceSet() {
      var par = {
        Id: this.editForm.Id,
        Name: this.editForm.Name,
        SendTitle: this.editForm.SendTitle,
        SendImgUrl: this.editForm.SendImgUrl,
        SendLinkPath: this.editForm.SendLinkPath,
        ReplyContent: this.editForm.ReplyContent,
        ReplyType: this.editForm.ReplyType
      };
      return ModifyPopServiceSet(par);
    },
    //删除小程序客服设置
    _deletePopServiceSet(id) {
      var par = {
        Id: id
      };
      return DeletePopServiceSet(par);
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
