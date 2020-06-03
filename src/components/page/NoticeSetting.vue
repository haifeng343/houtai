<template>
  <div>
    <el-form ref="form" :model="form">
      <div v-for="item in noticeList" :key="item.NoticeType">
        <el-form-item>
          <el-checkbox
            v-model="item.checked"
            @change="modify(item)"
            :label="item.NoticeTypeDes"
            name="type"
          ></el-checkbox>
        </el-form-item>
        <el-form-item label="页面跳转:" label-width="120px" class="mg40">
          <el-input :disabled="item.checked==true" v-model="item.PageUrl" class="w500"></el-input>
        </el-form-item>
        <el-form-item label="通知模板Id:" label-width="120px" class="mg40">
          <el-input :disabled="item.checked==true" v-model="item.TemplateId" class="w500"></el-input>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import {
  wechatnoticeSettingList,
  wechatnoticeSettingModify
} from "api/wechatnotice.js";
export default {
  name: "NoticeSetting",
  data() {
    return {
      form: {
        noticeType: "",
        status: "",
        pageUrl: "",
        templateId: ""
      },
      noticeList: [] //列表
    };
  },
  created() {
    this._wechatnoticeSettingList();
  },
  methods: {
    //编辑微信通知服务设置
    modify(item) {
      console.log(item.checked);
      this.form.noticeType = item.NoticeType;
      this.form.status = item.checked == true ? 1 : 2;
      this.form.pageUrl = item.PageUrl;
      this.form.templateId = item.TemplateId;
      this._wechatnoticeSettingModify();
    },

    //编辑微信通知服务设置
    _wechatnoticeSettingModify() {
      var par = {
        NoticeType: this.form.noticeType,
        Status: this.form.status,
        PageUrl: this.form.pageUrl,
        TemplateId: this.form.templateId
      };
      return wechatnoticeSettingModify(par,307);
    },

    //获取列表数据
    _wechatnoticeSettingList() {
      wechatnoticeSettingList(null,306).then(res => {
        res.forEach(item => {
          if (item.Status == 1) {
            item.checked = true;
          } else {
            item.checked = false;
          }
        });
        this.noticeList = res;
      });
    }
  }
};
</script>

<style scoped lang='less'>
.w500 {
  width: 500px;
}
.mg40 {
  margin-left: 40px;
}
</style>
