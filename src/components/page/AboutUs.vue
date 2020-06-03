<template>
  <div>
    <quill-editor
      v-model="content"
      :options="editorOption"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @ready="onEditorReady($event)"
    ></quill-editor>
    <div>
      <el-button @click="save()" type="primary" size="medium"  style="display:flex;margin:20px auto;">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { quillEditor } from "vue-quill-editor";
import { GetPageContent, SetPageContent } from "api/banner.js";
export default {
  name: "AboutUs",
  data() {
    return {
      content: "",
      editorOption: {}
    };
  },
  created() {
    this._getPageContent();
  },
  methods: {
    onEditorBlur() {
      //失去焦点事件
    },
    onEditorFocus() {
      //获得焦点事件
    },
    onEditorReady(editor, html, text) {
      //编辑器文本发生变化
      //this.content可以实时获取当前编辑器里面的文本内容
      //   console.log(this.addForm.content);
    },
    save() {
      this._setPageContent().then(val => {
        this.$message({
          message: "保存成功",
          type: "success",
          showClose: true
        });
      });
    },
    //获取页面配置内容
    _getPageContent() {
      var par = {
        Code: "AboutUs"
      };
      return GetPageContent(par,56).then(res => {
        this.content = res.Content;
      });
    },
    //设置页面配置内容
    _setPageContent() {
      var par = {
        Code: "AboutUs",
        Content: this.content
      };
      return SetPageContent(par,56);
    }
  }
};
</script>

<style>
.ql-editor{
  min-height:500px;
}
</style>
