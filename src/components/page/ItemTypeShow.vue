<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="类型名称:">
          <el-input v-model="searchItemTypeName" placeholder="请输入类型名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="itemTypeListSearch()">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="ItemTypeListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TypeName" align="center" label="类型名称"></el-table-column>
        <el-table-column prop="ImgUrlShow" align="center" label="图标">
          <template slot-scope="scope">
            <el-upload
              class="avatar-uploader"
              action="../adminrocket/img/upload"
              :show-file-list="false"
              :headers="headers"
              name="ItemType.Img"
              :on-success="handlerAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img
                v-if="scope.row.ImgUrlShow"
                :src="scope.row.ImgUrlShow"
                class="avatarIcon"
                @click="common.haveRight('UploadItemTypeIcon')==true?getClick(scope.row):''"
              />
              <el-button
                v-else
                type="text"
                @click="common.haveRight('UploadItemTypeIcon')==true?getClick(scope.row):''"
              >上传图片</el-button>
            </el-upload>
          </template>
        </el-table-column>
        <el-table-column prop="ShowIndex" align="center" label="排序值">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showIndexDialog(scope.row)"
              :disabled="!common.haveRight('ModifyItemTypeShowIndex')"
            >{{scope.row.ShowIndex}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifyItemTypeShowStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="UpdateTime" align="center" label="最后修改时间"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="itemTypeListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 编辑排序值弹窗 -->
    <el-dialog
      :title="`编辑课程类型排序值-${clickItem.TypeName}`"
      :visible.sync="indexVisible"
      width="633px"
    >
      <el-form ref="indexForm" :model="indexForm" label-width="100px">
        <el-form-item label="排序值:" prop="showIndex">
          <el-input v-model="indexForm.showIndex"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="indexVisible = false" size="medium">取 消</el-button>
        <el-button @click="editShowIndexOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetItemTypeShowList,
  UploadItemTypeIcon,
  ModifyItemTypeShowIndex,
  ModifyItemTypeShowStatus
} from "api/page.js";
export default {
  name: "ItemTypeShow",
  data() {
    return {
      searchItemTypeName: "", //名称搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      ItemTypeListTable: [], //项目列表
      clickItem: {}, //点击某一行数据
      imgForm: {
        imgUrl: "",
        imgUrlShow: ""
      },
      indexVisible: false,
      indexForm: {
        showIndex: ""
      },
      statusForm: {
        status: ""
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
    this._getItemTypeShowList();
  },
  methods: {
    getClick(item) {
      this.clickItem = item;
    },
    //搜索
    itemTypeListSearch() {
      this.pageIndex = 1;
      this._getItemTypeShowList();
    },
    //列表分页变化
    itemTypeListCurrentChange(val) {
      this.pageIndex = val;
      this._getItemTypeShowList();
    },
    //图片上传成功
    handlerAvatarSuccess(res, file) {
      this.imgForm.imgUrl = res.Data.ImgPath;
      this.imgForm.imgUrlShow = res.Data.ImgUrl;
      this._uploadItemTypeIcon().then(val => {
        this._getItemTypeShowList();
      });
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
    //修改账户状态
    changeStatus(status, item) {
      this.clickItem = item;
      this.statusForm.status = status;
      this._modifyItemTypeShowStatus();
    },
    showIndexDialog(item) {
      this.clickItem = item;
      this.indexForm.showIndex = item.ShowIndex;
      this.indexVisible = true;
    },
    editShowIndexOk() {
      this._modifyItemTypeShowIndex().then(val => {
        this._getItemTypeShowList();
        this.indexVisible = false;
      });
    },
    //获取前端展示课程类型页面内容
    _getItemTypeShowList() {
      var par = {
        ItemTypeName: this.searchItemTypeName,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetItemTypeShowList(par, 239).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.ItemTypeListTable = res.List;
      });
    },
    //上传前端展示课程类型图标
    _uploadItemTypeIcon() {
      var par = {
        ItemTypeId: this.clickItem.Id,
        ImgUrl: this.imgForm.imgUrl
      };
      return UploadItemTypeIcon(par, 240);
    },
    //修改前端展示课程类型排序值
    _modifyItemTypeShowIndex() {
      var par = {
        ItemTypeId: this.clickItem.Id,
        ShowIndex: this.indexForm.showIndex
      };
      return ModifyItemTypeShowIndex(par, 241);
    },
    //修改前端展示课程类型状态
    _modifyItemTypeShowStatus() {
      var par = {
        Id: this.clickItem.Id,
        Status: this.statusForm.status
      };
      return ModifyItemTypeShowStatus(par,242);
    }
  }
};
</script>

<style scoped lang='less'>
.avatarIcon{
  width: 120px;
  height: 120px;
}
</style>
