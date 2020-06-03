<template>
  <div>
    <div class="checkboxgroup">
      <el-checkbox-group v-model="checkList">
        <div class="checkboxItem">
          <el-checkbox label="setup" @change="setCheckChange">设置</el-checkbox>
          <div class="checkboxItem-Second">
            <el-checkbox label="address" :disabled="!setChecked">地址管理</el-checkbox>
          </div>
          <div class="checkboxItem-Second">
            <el-checkbox label="modifyphone" :disabled="!setChecked">修改手机号</el-checkbox>
          </div>
        </div>
        <div class="checkboxItem">
          <el-checkbox label="aboutus">关于我们</el-checkbox>
        </div>
        <div class="checkboxItem">
          <el-checkbox label="callus">联系我们</el-checkbox>
        </div>
        <div class="checkboxItem">
          <el-checkbox label="share" @change="shareCheckChange">分享页面</el-checkbox>
          <el-checkbox-group v-model="shareCheckList">
            <el-form ref="sharePageForm" :model="sharePageForm" label-width="120px">
              <el-form-item label="外链页面Url:" style="margin-left:20px;">
                <el-input
                  v-model="sharePageForm.shareUrl"
                  placeholder="请输入外链页面Url"
                  style="width:600px;"
                  :disabled="!shareChecked"
                ></el-input>
              </el-form-item>
              <el-form-item label="分享页面图片:" style="margin-left:20px;">
                <div style="float:left;margin-right:30px;">
                  IphoneX
                  <el-upload
                    class="avatar-uploader"
                    action="../adminrocket/img/upload"
                    :show-file-list="false"
                    :headers="headers"
                    name="Share.Imgs"
                    :on-success="handlerAvatarSuccess1"
                    :before-upload="beforeAvatarUpload"
                    :disabled="!shareChecked"
                  >
                    <img
                      v-if="sharePageForm.ShowShareUrlIphoneX"
                      :src="sharePageForm.ShowShareUrlIphoneX"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <div style="float:left;margin-right:30px;">
                  Iphone6
                  <el-upload
                    class="avatar-uploader"
                    action="../adminrocket/img/upload"
                    :show-file-list="false"
                    :headers="headers"
                    name="Share.Imgs"
                    :on-success="handlerAvatarSuccess2"
                    :before-upload="beforeAvatarUpload"
                    :disabled="!shareChecked"
                  >
                    <img
                      v-if="sharePageForm.ShowShareUrlIphone6"
                      :src="sharePageForm.ShowShareUrlIphone6"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <div style="float:left;margin-right:30px;">
                  Android
                  <el-upload
                    class="avatar-uploader"
                    action="../adminrocket/img/upload"
                    :show-file-list="false"
                    :headers="headers"
                    name="Share.Imgs"
                    :on-success="handlerAvatarSuccess3"
                    :before-upload="beforeAvatarUpload"
                    :disabled="!shareChecked"
                  >
                    <img v-if="sharePageForm.showUrl" :src="sharePageForm.showUrl" class="avatar" />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <div style="float:left;margin-right:30px;">
                  三星
                  <el-upload
                    class="avatar-uploader"
                    action="../adminrocket/img/upload"
                    :show-file-list="false"
                    :headers="headers"
                    name="Share.Imgs"
                    :on-success="handlerAvatarSuccess4"
                    :before-upload="beforeAvatarUpload"
                    :disabled="!shareChecked"
                  >
                    <img
                      v-if="sharePageForm.ShowShareUrlSamsung"
                      :src="sharePageForm.ShowShareUrlSamsung"
                      class="avatar"
                    />
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
              </el-form-item>
              <el-checkbox
                label="showTitle"
                class="checkboxItem-Second"
                :disabled="!shareChecked"
                @change="shareTitleCheckChange"
              >显示分享标题</el-checkbox>
              <el-form-item label="标题名称:" style="margin-left:20px;">
                <el-input
                  v-model="sharePageForm.shareTitle"
                  placeholder="请输入标题名称"
                  style="width:600px;"
                  :disabled="!shareChecked || !shareTitleChecked"
                ></el-input>
              </el-form-item>
              <el-checkbox
                label="showButton"
                class="checkboxItem-Second"
                :disabled="!shareChecked"
                @change="shareButtonCheckChange"
              >显示分享按钮</el-checkbox>
              <el-form-item label="按钮名称:" style="margin-left:20px;">
                <el-input
                  v-model="sharePageForm.shareButtonTitle"
                  placeholder="请输入按钮名称"
                  style="width:600px;"
                  :disabled="!shareChecked || !shareButtonChecked"
                ></el-input>
              </el-form-item>
              <el-form-item label="背景色:" style="margin-left:20px;">
                <el-input
                  v-model="sharePageForm.shareButtonBgColor"
                  placeholder="请输入背景色"
                  style="width:600px;"
                  :disabled="!shareChecked || !shareButtonChecked"
                ></el-input>
              </el-form-item>
              <el-form-item label="字体颜色:" style="margin-left:20px;">
                <el-input
                  v-model="sharePageForm.shareButtonFtColor"
                  placeholder="请输入字体颜色"
                  style="width:600px;"
                  :disabled="!shareChecked || !shareButtonChecked"
                ></el-input>
              </el-form-item>
            </el-form>
          </el-checkbox-group>
        </div>
        <div class="checkboxItem">
          <el-checkbox label="invitation">推荐与邀请</el-checkbox>
        </div>
      </el-checkbox-group>
    </div>
    <div class="thisButton">
      <el-button @click="save()" type="primary" size="medium">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { GetPageDeployInfo, SetPageDeploy } from "api/page.js";
export default {
  name: "MyPage",
  data() {
    return {
      checkList: [], //整体选中
      setChecked: false, //设置是否选中
      shareChecked: false, //分享是否选中
      shareCheckList: [],
      shareTitleChecked: false, //分享标题选中
      shareButtonChecked: false, //分享按钮选中
      sharePageForm: {
        showUrl: "",
        url: "",
        ShowShareUrlIphoneX: "",
        ShareUrlIphoneX: "",
        ShowShareUrlIphone6: "",
        ShareUrlIphone6: "",
        ShowShareUrlSamsung: "",
        ShareUrlSamsung: "",
        shareTitle: "",
        shareButtonTitle: "",
        shareButtonBgColor: "",
        shareButtonFtColor: "",
        shareUrl:""
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
    this._getPageDeployInfo();
  },
  methods: {
    //设置选中变化
    setCheckChange(e) {
      this.setChecked = e;
    },
    //分享选中变化
    shareCheckChange(e) {
      this.shareChecked = e;
    },
    //分享标题选中变化
    shareTitleCheckChange(e) {
      this.shareTitleChecked = e;
    },
    //分享按钮选中变化
    shareButtonCheckChange(e) {
      this.shareButtonChecked = e;
    },
    //保存
    save() {
      this._setPageDeploy().then(val => {
        this._getPageDeployInfo();
        this.$message({
          showClose: true,
          message: "保存成功",
          type: "success"
        });
      });
    },
    handlerAvatarSuccess1(res, file) {
      this.sharePageForm.ShowShareUrlIphoneX = res.Data.ImgUrl;
      this.sharePageForm.ShareUrlIphoneX = res.Data.ImgPath;
    },
    handlerAvatarSuccess2(res, file) {
      this.sharePageForm.ShowShareUrlIphone6 = res.Data.ImgUrl;
      this.sharePageForm.ShareUrlIphone6 = res.Data.ImgPath;
    },
    handlerAvatarSuccess3(res, file) {
      this.sharePageForm.showUrl = res.Data.ImgUrl;
      this.sharePageForm.url = res.Data.ImgPath;
    },
    handlerAvatarSuccess4(res, file) {
      this.sharePageForm.ShowShareUrlSamsung = res.Data.ImgUrl;
      this.sharePageForm.ShareUrlSamsung = res.Data.ImgPath;
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
    //获取显示页面内容
    _getPageDeployInfo() {
      var par = {
        PageCode: "myPage"
      };
      return GetPageDeployInfo(par, 53).then(res => {
        this.checkList = res.ItemCode;
        if (res.ItemCode.indexOf("setup") >= 0) {
          this.setChecked = true;
        } else {
          this.setChecked = false;
        }
        if (res.ItemCode.indexOf("share") >= 0) {
          this.shareChecked = true;
        } else {
          this.shareChecked = false;
        }
        if (res.SharePageInfo != null) {
          this.sharePageForm.url = res.SharePageInfo.ShareUrl;
          this.sharePageForm.showUrl = res.SharePageInfo.ShareUrlShow;
          this.sharePageForm.shareUrl= res.SharePageInfo.Url;
          this.sharePageForm.ShareUrlIphoneX =
            res.SharePageInfo.ShareUrlIphoneX;
          this.sharePageForm.ShowShareUrlIphoneX =
            res.SharePageInfo.ShowShareUrlIphoneX;
          this.sharePageForm.ShareUrlIphone6 =
            res.SharePageInfo.ShareUrlIphone6;
          this.sharePageForm.ShowShareUrlIphone6 =
            res.SharePageInfo.ShowShareUrlIphone6;
          this.sharePageForm.ShareUrlSamsung =
            res.SharePageInfo.ShareUrlSamsung;
          this.sharePageForm.ShowShareUrlSamsung =
            res.SharePageInfo.ShowShareUrlSamsung;
          this.sharePageForm.shareTitle = res.SharePageInfo.ShareTitle;
          this.sharePageForm.shareButtonTitle =
            res.SharePageInfo.ShareButtonTitle;
          this.sharePageForm.shareButtonBgColor =
            res.SharePageInfo.ShareButtonBgColor;
          this.sharePageForm.shareButtonFtColor =
            res.SharePageInfo.ShareButtonFtColor;
          this.shareTitleChecked = res.SharePageInfo.IsShowShareTitle;
          if (this.shareTitleChecked == true) {
            this.shareCheckList.push("showTitle");
          }
          this.shareButtonChecked = res.SharePageInfo.IsShowShareButton;
          if (this.shareButtonChecked == true) {
            this.shareCheckList.push("showButton");
          }
        }
      });
    },
    //设置页面内容
    _setPageDeploy() {
      var par = {
        PageCode: "myPage",
        ItemCode: this.checkList,
        SharePageInfo: {
          ShareUrl: this.shareChecked ? this.sharePageForm.url : "",
          Url:this.sharePageForm.shareUrl,
          ShareUrlIphoneX: this.shareChecked
            ? this.sharePageForm.ShareUrlIphoneX
            : "",
          ShareUrlIphone6: this.shareChecked
            ? this.sharePageForm.ShareUrlIphone6
            : "",
          ShareUrlSamsung: this.shareChecked
            ? this.sharePageForm.ShareUrlSamsung
            : "",
          IsShowShareTitle: this.shareTitleChecked,
          ShareTitle:
            this.shareChecked && this.shareTitleChecked
              ? this.sharePageForm.shareTitle
              : "",
          IsShowShareButton: this.shareButtonChecked,
          ShareButtonTitle:
            this.shareChecked && this.shareButtonChecked
              ? this.sharePageForm.shareButtonTitle
              : "",
          ShareButtonBgColor:
            this.shareChecked && this.shareButtonChecked
              ? this.sharePageForm.shareButtonBgColor
              : "",
          ShareButtonFtColor:
            this.shareChecked && this.shareButtonChecked
              ? this.sharePageForm.shareButtonFtColor
              : ""
        }
      };
      return SetPageDeploy(par, 53);
    }
  }
};
</script>

<style scoped lang='less'>
.checkboxgroup {
  width: 90%;
  margin: 0 auto;
}
.checkboxItem {
  margin-bottom: 25px;
}
.checkboxItem label {
  font-weight: bold;
}
.checkboxItem:first-child {
  margin-top: 20px;
}
.thisButton {
  display: flex;
  justify-content: center;
}
.thisButton button {
  width: 120px;
}
.checkboxItem-Second {
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 25px;
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
}
</style>
