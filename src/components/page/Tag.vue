<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="标签名称:">
          <el-input v-model="searchTagName" placeholder="请输入标签名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="tagListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddTagDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddTag')"
        >添加标签</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="TagListTable" border ref="multipleTable">
        <el-table-column prop="TagId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TagName" align="center" label="标签名称"></el-table-column>
        <el-table-column prop="FontColor" align="center" label="字体颜色"></el-table-column>
        <el-table-column prop="BgColor" align="center" label="背景颜色"></el-table-column>
        <el-table-column prop="BorColor" align="center" label="边框颜色"></el-table-column>
        <el-table-column label="状态" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyTagStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showEditTagDialog(scope.row)"
              v-if="common.haveRight('ModifyTag')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="deleteTag(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteTag')"
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
        @current-change="tagListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 添加标签弹窗 -->
    <el-dialog title="添加标签" :visible.sync="addTagVisible" width="633px">
      <el-form ref="addTagForm" :model="addTagForm" label-width="85px" :rules="tagRules">
        <el-form-item label="标签名称:" prop="tagName">
          <el-input v-model="addTagForm.tagName"></el-input>
        </el-form-item>
        <el-form-item label="字体颜色:" prop="fontColor">
          <el-input v-model="addTagForm.fontColor"></el-input>
        </el-form-item>
        <el-form-item label="背景颜色:" prop="bgColor">
          <el-input v-model="addTagForm.bgColor"></el-input>
        </el-form-item>
        <el-form-item label="边框颜色:" prop="borColor">
          <el-input v-model="addTagForm.borColor"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTagVisible = false" size="medium">取 消</el-button>
        <el-button @click="addTagOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑标签弹窗 -->
    <el-dialog title="编辑标签" :visible.sync="editTagVisible" width="633px">
      <el-form ref="editTagForm" :model="editTagForm" label-width="85px" :rules="tagRules">
        <el-form-item label="标签名称:" prop="tagName">
          <el-input v-model="editTagForm.tagName"></el-input>
        </el-form-item>
        <el-form-item label="字体颜色:" prop="fontColor">
          <el-input v-model="editTagForm.fontColor"></el-input>
        </el-form-item>
        <el-form-item label="背景颜色:" prop="bgColor">
          <el-input v-model="editTagForm.bgColor"></el-input>
        </el-form-item>
        <el-form-item label="边框颜色:" prop="borColor">
          <el-input v-model="editTagForm.borColor"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTagVisible = false" size="medium">取 消</el-button>
        <el-button @click="editTagOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  AddTag,
  GetTagList,
  ModifyTag,
  ModifyTagStatus,
  DeleteTag
} from "api/tag.js";
export default {
  name: "Tag",
  data() {
    return {
      searchTagName: "", //标签名称搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      TagListTable: [], //项目列表
      clickItem: {}, //点击某一行数据
      addTagVisible: false, //添加标签弹窗是否可见
      addTagForm: {
        tagName: "",
        fontColor: "",
        bgColor: "",
        borColor: ""
      },
      editTagVisible: false, //编辑标签弹窗是否可见
      editTagForm: {
        tagName: "",
        fontColor: "",
        bgColor: "",
        borColor: ""
      },
      tagRules: {
        tagName: [
          { required: true, message: "请输入标签名称", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this._getTagList();
  },
  methods: {
    //搜索
    tagListSearch() {
      this.pageIndex = 1;
      this._getTagList();
    },
    //列表分页变化
    tagListCurrentChange(val) {
      this.pageIndex = val;
      this._getTagList();
    },
    //显示添加弹窗
    showAddTagDialog() {
      this.addTagVisible = true;
      this.addTagForm.tagName = "";
      this.addTagForm.fontColor = "";
      this.addTagForm.bgColor = "";
      this.addTagForm.borColor = "";
    },
    //添加确认
    addTagOk() {
      this.$refs["addTagForm"].validate(valid => {
        if (valid) {
          this._addTag().then(val => {
            this.addTagVisible = false;
            this._getTagList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑弹窗
    showEditTagDialog(item) {
      this.clickItem = item;
      this.editTagForm.tagName = item.TagName;
      this.editTagForm.fontColor = item.FontColor;
      this.editTagForm.bgColor = item.BgColor;
      this.editTagForm.borColor = item.BorColor;
      this.editTagVisible = true;
    },
    //编辑确认
    editTagOk() {
      this.$refs["editTagForm"].validate(valid => {
        if (valid) {
          this._modifyTag().then(val => {
            this.editTagVisible = false;
            this._getTagList();
          });
        } else {
          return false;
        }
      });
    },
    //修改账户状态
    changeStatus(status, item) {
      this._modifyTagStatus(item.TagId, status);
    },
    //删除商圈
    deleteTag(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteTag(item.TagId).then(val => {
            this._getTagList();
          });
        })
        .catch(() => {});
    },
    //添加商圈确定判断
    _addTag() {
      var par = {
        TagName: this.addTagForm.tagName,
        FontColor: this.addTagForm.fontColor,
        BgColor: this.addTagForm.bgColor,
        BorColor: this.addTagForm.borColor
      };
      return AddTag(par,217);
    },
    //获取商圈列表
    _getTagList() {
      var par = {
        TagName: this.searchTagName,
        Status: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetTagList(par, 216).then(res => {
        this.TagListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //编辑商圈
    _modifyTag() {
      var par = {
        TagId: this.clickItem.TagId,
        TagName: this.editTagForm.tagName,
        FontColor: this.editTagForm.fontColor,
        BgColor: this.editTagForm.bgColor,
        BorColor: this.editTagForm.borColor
      };
      return ModifyTag(par,218);
    },
    //修改商圈状态
    _modifyTagStatus(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return ModifyTagStatus(par,219);
    },
    //删除商圈
    _deleteTag(id) {
      var par = {
        Id: id
      };
      return DeleteTag(par,220);
    }
  }
};
</script>

<style scoped lang='less'>
</style>
