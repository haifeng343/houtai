<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="会员名称:">
          <el-input v-model="searchBannerName" placeholder="请输入会员名称"></el-input>
        </el-form-item>
        <el-form-item label="状态:">
          <el-select v-model="searchStatus">
            <el-option
              v-for="item in statusList"
              :label="item.name"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="bannerListSearch()">搜索</el-button>
        </el-form-item>

        <el-button type="primary" @click="showAdd()" style="float:right;margin-bottom:10px;">创建</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="gradeList" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="GradeName" align="center" label="会员等级"></el-table-column>
        <el-table-column prop="GradeDes" align="center" label="会员描述"></el-table-column>
        <el-table-column align="center" label="会员图片">
          <template slot-scope="scope">
            <img :src="scope.row.IconUrlShow" class="table-icon" alt />
          </template>
        </el-table-column>
        <el-table-column align="center" label="权益配置">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="attributes(scope.row)"
            >{{scope.row.MemberEquityDes==""?'空':scope.row.MemberEquityDes}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="Status" align="center" label="是否有效">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="最后更新时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteBanner(scope.row)" class="red">删除</el-button>
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
    <!-- 创建会员权益 -->
    <el-dialog title="创建会员权益" :visible.sync="addVisible" width="633px">
      <el-form ref="addForm" :model="addForm" label-width="100px" :rules="rules">
        <el-form-item label="会员名称:" prop="GradeName">
          <el-input v-model="addForm.GradeName" placeholder="请输入会员名称"></el-input>
        </el-form-item>
        <el-form-item label="会员描述:" prop="GradeDes">
          <el-input type="textarea" :rows="4" v-model="addForm.GradeDes" placeholder="请输入会员描述"></el-input>
        </el-form-item>
        <el-form-item label="会员图片:" prop="IconUrl">
          <!-- <label>(图片规格：360x360)</label> -->
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Member.Img"
            :on-success="handlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addForm.IconUrl" :src="addForm.IconUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetForm('addForm')" size="medium">取 消</el-button>
        <el-button @click="addOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑会员权益 -->
    <el-dialog title="编辑会员权益" :visible.sync="editVisible" width="633px">
      <el-form ref="editForm" :model="editForm" label-width="100px" :rules="rules">
        <el-form-item label="会员名称:" prop="GradeName">
          <el-input v-model="editForm.GradeName" placeholder="请输入会员名称"></el-input>
        </el-form-item>
        <el-form-item label="会员描述:" prop="GradeDes">
          <el-input type="textarea" :rows="4" v-model="editForm.GradeDes" placeholder="请输入会员描述"></el-input>
        </el-form-item>
        <el-form-item label="会员图片:" prop="IconUrl">
          <!-- <label>(图片规格：360x360)</label> -->
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Member.Img"
            :on-success="edithandlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.IconUrl" :src="editForm.IconUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false" size="medium">取 消</el-button>
        <el-button @click="editOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 属性弹窗 -->
    <el-dialog title="选择权益配置" :visible.sync="attributeVisible" width="580px">
      <el-checkbox-group @change="attributeChange()">
        <el-checkbox v-for="city in cities" :label="city" :key="city">{{city}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="attributeVisible = false" size="medium">取 消</el-button>
        <el-button @click="attributeOk()" type="primary" size="medium">确 定</el-button>
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

import { memberGradeList, memberGradeAdd,memberGradeModify,memberStatusModify,memberGradeDelete } from "api/member";
export default {
  name: "MemberEquity",
  data() {
    return {
      searchBannerName: "",
      searchStatus: 0,
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      gradeList: [], //列表
      bannerCodeList: [], //查询广告code列表
      bannerCodeList2: [], //操作广告code列表
      rules: {
        GradeName: [
          { required: true, message: "请选择会员名称", trigger: "blur" }
        ],
        GradeDes: [
          { required: true, message: "请填写会员描述", trigger: "blur" }
        ],
        IconUrl: [
          { required: true, message: "请填写会员图标", trigger: "blur" }
        ]
      },
      statusList: [
        { id: 0, name: "全部" },
        { id: 1, name: "有效" },
        { id: 2, name: "无效" }
      ],
      addVisible: false,
      addForm: {
        bannerName: "",
        bannerDescription: "",
        ImgPath: "",
        IconUrl: ""
      },
      editVisible: false,
      editForm: {
        id: 0,
        bannerName: "",
        bannerDescription: "",
        ImgPath: "",
        IconUrl: ""
      },
      attributeVisible: false,
      cities: ["1", "2"]
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
    this._memberGradeList();
  },
  methods: {
    //搜索
    bannerListSearch() {
      this.pageIndex = 1;
      this._memberGradeList();
    },
    //列表分页变化
    bannerListCurrentChange(val) {
      this.pageIndex = val;
      this._memberGradeList();
    },
    //添加图片上传成功
    handlerAvatarSuccess(res, file) {
      this.addForm.ImgPath = res.Data.ImgPath;
      this.addForm.IconUrl = res.Data.ImgUrl;
    },
    //编辑图片上传成功
    edithandlerAvatarSuccess(res, file) {
      this.editForm.ImgPath = res.Data.ImgPath;
      this.editForm.IconUrl = res.Data.ImgUrl;
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
    showAdd() {
      this.addForm = {
        bannerName: "",
        bannerDescription: "",
        ImgPath: "",
        IconUrl: ""
      };
      this.addVisible = true;
    },
    addOk() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          this._memberGradeAdd();
        } else {
          return false;
        }
      });
    },
    edit(item) {
      this.editForm.id = item.Id;
      this.editForm.IconUrl = item.IconUrlShow;
      this.editForm.GradeDes = item.GradeDes;
      this.editForm.GradeName = item.GradeName;
      this.editVisible = true;
    },
    editOk() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
            this._memberGradeModify();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addVisible = false;
    },
    // 选择权益配置
    attributes(item) {
      this.attributeVisible = true;
    },
    //修改状态
    changeStatus(status, item) {
      this._memberStatusModify(item.Id, status);
    },
    //删除banner
    deleteBanner(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._memberGradeDelete(item.Id).then(val => {
            this._memberGradeList();
          });
        })
        .catch(() => {});
    },
    //获取列表
    _memberGradeList() {
      var par = {
        GradeName: this.searchBannerName,
        Status: this.searchStatus,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return memberGradeList(par).then(res => {
        (this.gradeList = res.List), (this.pageTotalCount = res.TotalCount);
      });
    },
    //修改状态
    _memberStatusModify(id, status) {
      var par = {
        Id: id,
        Status: status
      };
      return memberStatusModify(par);
    },
    //添加
    _memberGradeAdd() {
      var par = {
        GradeName: this.addForm.GradeName,
        GradeDes: this.addForm.GradeDes,
        IconUrl: this.addForm.ImgPath
      };
      return memberGradeAdd(par).then(res => {
        this._memberGradeList();
        this.addVisible = false;
      });
    },
    //编辑
    _memberGradeModify() {
        var par ={
            Id:this.editForm.id,
            GradeName:this.editForm.GradeName,
            GradeDes:this.editForm.GradeDes,
            IconUrl:this.editForm.ImgPath
        }
        return memberGradeModify(par).then(res=>{
            this.editVisible=false;
            this._memberGradeList();
        })
    },
    //删除
    _memberGradeDelete(id) {
      var par = {
        Id: id
      };
      return memberGradeDelete(par);
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
.table-icon {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
</style>
