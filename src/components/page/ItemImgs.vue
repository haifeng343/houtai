<template>
  <div>
    <div>
      <div
        v-for="item in imgList"
        :key="item.ImgId"
        style="float:left;margin-right: 80px;margin-bottom:40px;"
      >
        <div style="margin-left:36px;font-size: xx-small;" :class="{red:item.ExamineStatus==3}">
          {{item.ExamineStatus==1?"等待审核。。。":item.ExamineStatus==2?"审核中。。。":item.ExamineStatus==3?"审核失败":"审核成功"}}
          <el-popover
            v-if="item.ExamineStatus==3 && item.ExamineStatusDes!=null && item.ExamineStatusDes.length>0"
            placement="top-start"
            title="审核失败原因"
            width="200"
            trigger="hover"
            :content="item.ExamineStatusDes"
          >
            <span slot="reference">
              <i class="el-icon-question"></i>
            </span>
          </el-popover>
        </div>
        <div style="text-align:center;">
          <i
            class="el-icon-close"
            @click="deleteImg(item)"
            v-if="common.haveRight('DeleteSellerItemImg')"
          ></i>
          <img :src="item.ImgAccessUrl" class="avatar" />
          <div>
            <el-button
              @click="showExamineDialog(item)"
              type="primary"
              style="height:30px;"
              v-if="common.haveRight('ModifySellerItemImgExamineStatus')"
            >{{item.ExamineStatus==1?"开始审核":"重新审核"}}</el-button>
          </div>
        </div>
        <div style="margin:0 50px;">
          <label>是否有效：</label>
          <el-switch
            v-model="item.Status"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="2"
            @change="statusChange($event,item)"
            :disabled="!common.haveRight('ModifySellerItemImgStatus')"
          ></el-switch>
        </div>
        <div>
          <label>上传时间：</label>
          <label>{{item.CreateTime}}</label>
        </div>
      </div>
      <el-upload
        class="avatar-uploader"
        action="../adminrocket/img/upload"
        :headers="headers"
        name="Item.Imgs"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <i class="el-icon-plus avatar-uploader-icon" v-if="common.haveRight('AddSellerItemImg')"></i>
      </el-upload>
    </div>
    <!-- 审核弹窗 -->
    <el-dialog title="图片审核" :visible.sync="imgExamineVisible" width="633px">
      <el-form ref="imgExamineForm" :model="imgExamineForm" label-width="100px">
        <el-form-item label="审核状态:" prop="examineStatus">
          <el-select v-model="imgExamineForm.examineStatus" placeholder="请选择状态">
            <el-option
              v-for="item in imgExamineForm.examineStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态描述:" prop="examineStatusDes">
          <el-input
            v-model="imgExamineForm.examineStatusDes"
            placeholder="请输入审核状态描述"
            type="textarea"
            :rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgExamineVisible = false" size="medium">取 消</el-button>
        <el-button @click="imgExamineOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetSellerItemImgList,
  AddSellerItemImg,
  DeleteSellerItemImg,
  ModifySellerItemImgStatus,
  ModifySellerItemImgExamineStatus
} from "api/seller.js";
export default {
  name: "ItemImgs",
  data() {
    return {
      itemId: 0,
      imgList: [],
      clickItem: {}, //点击某一行数据
      imgExamineVisible: false, //审核弹窗是否可见
      imgExamineForm: {
        examineStatus: 0,
        examineStatusList: [
          { id: 1, name: "等待审核" },
          { id: 2, name: "审核中" },
          { id: 3, name: "审核失败" },
          { id: 4, name: "审核成功" }
        ],
        examineStatusDes: ""
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
    this.itemId = this.$route.params.id;
    this._getSellerItemImgList();
  },
  watch: {
    $route(newValue, oldValue) {
      this.itemId = this.$route.params.id;
      this._getSellerItemImgList();
    }
  },
  methods: {
    //添加头像上传成功
    handleAvatarSuccess(res, file) {
      this._addSellerItemImg(res.Data.ImgPath).then(val => {
        this._getSellerItemImgList();
      });
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
    //删除图片
    deleteImg(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSellerItemImg(item.ImgId).then(val => {
            this._getSellerItemImgList();
          });
        })
        .catch(() => {});
    },
    //设置有效无效
    statusChange(statue, item) {
      this._modifySellerItemImgStatus(item.ImgId, statue);
    },
    //显示审核弹窗
    showExamineDialog(item) {
      this.clickItem = item;
      this.imgExamineVisible = true;
      this.imgExamineForm.examineStatus = item.ExamineStatus;
      this.imgExamineForm.examineStatusDes = item.ExamineStatusDes;
    },
    //确认审核
    imgExamineOk() {
      this._modifySellerItemImgExamineStatus().then(val => {
        this.imgExamineVisible = false;
        this._getSellerItemImgList();
      });
    },
    //获取项目图片列表信息
    _getSellerItemImgList() {
      var par = {
        Id: this.itemId
      };
      return GetSellerItemImgList(par, 175).then(res => {
        this.imgList = res;
      });
    },
    //添加项目图片
    _addSellerItemImg(imgurl) {
      var par = {
        ItemId: this.itemId,
        ImgUrl: imgurl
      };
      return AddSellerItemImg(par, 176);
    },
    //删除项目图片
    _deleteSellerItemImg(id) {
      var par = {
        Id: id
      };
      return DeleteSellerItemImg(par,179);
    },
    //修改项目图片状态
    _modifySellerItemImgStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifySellerItemImgStatus(par, 177);
    },
    //修改项目图片审核状态
    _modifySellerItemImgExamineStatus() {
      var par = {
        StatusDes: this.imgExamineForm.examineStatusDes,
        Status: this.imgExamineForm.examineStatus,
        Id: this.clickItem.ImgId
      };
      return ModifySellerItemImgExamineStatus(par, 178);
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
}
.el-icon-close {
  position: relative;
  top: -170px;
  left: 198px;
  cursor: pointer;
}
</style>
