<template>
  <div>
    <div>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="姓名:">
          <el-input v-model="searchName" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="TeacherListSearch()">搜索</el-button>
        </el-form-item>
        <el-button
          type="primary"
          @click="showAddTeacherDialog()"
          style="float:right;margin-bottom:10px;"
          v-if="common.haveRight('AddSellerTeacher')"
        >添加师资</el-button>
      </el-form>
    </div>
    <div>
      <el-table :data="teacherListTable" border ref="multipleTable">
        <el-table-column prop="TeacherId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="TeacherName" align="center" label="姓名"></el-table-column>
        <el-table-column prop="HeaderAccessUrl" align="center" label="头像">
          <template slot-scope="scope">
            <el-button type="text" @click="showHeader(scope.row)">预览图片</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="HeaderAccessUrl" align="center" label="头像">
          <template slot-scope="scope">
            <img :src="scope.row.HeaderAccessUrl" style="height:100px;width:100px;"/>
          </template>
        </el-table-column>-->

        <el-table-column prop="Mobile" align="center" label="手机号"></el-table-column>
        <el-table-column prop="TeachingAge" align="center" label="教龄"></el-table-column>
        <el-table-column align="center" label="审核状态">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="ChangeExamineStatus(scope.row)"
              :disabled="!common.haveRight('ModifySellerTeacherExamineStatus')"
            >{{parseExamineStatus(scope.row.ExamineStatus)}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ExamineStatusDes" align="center" label="审核状态描述"></el-table-column>
        <el-table-column prop="Status" label="师资状态" width="181px;">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.Status"
              active-text="有效"
              inactive-text="无效"
              :active-value="1"
              :inactive-value="2"
              @change="changeStatus($event, scope.row)"
              :disabled="!common.haveRight('ModifySellerTeacherStatus')"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="CreateTime" align="center" label="创建时间"></el-table-column>
        <el-table-column align="center" label="操作" fixed="right" width="400px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="showEditTeacherDialog(scope.row)"
              v-if="common.haveRight('ModifySellerTeacher')"
            >编辑</el-button>
            <el-button
              type="text"
              @click="jumpToItemListDialog(scope.row)"
              v-if="common.haveRight('GetSellerTeacherItemList')"
            >课程列表</el-button>
            <el-button
              type="text"
              @click="showSetTitlesDialog(scope.row)"
              v-if="common.haveRight('SetSellerTeacherTitles')"
            >分配职称</el-button>
            <el-button
              type="text"
              @click="jumpToTeacherImgs(scope.row)"
              v-if="common.haveRight('GetSellerTeacherImgList')"
            >相册管理</el-button>
            <el-button
              type="text"
              @click="deleteTeacher(scope.row)"
              class="red"
              v-if="common.haveRight('DeleteSellerTeacher')"
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
        @current-change="TeacherListCurrentChange"
      ></el-pagination>
    </div>
    <!-- 头像图片预览弹窗 -->
    <el-dialog :title="`头像预览-${clickItem.TeacherName}`" :visible.sync="headerVisible" width="333px">
      <img :src="clickItem.HeaderAccessUrl" />
    </el-dialog>
    <!-- 修改审核状态弹窗 -->
    <el-dialog
      :title="`审核状态修改-${clickItem.TeacherName}`"
      :visible.sync="examineStatusVisible"
      width="633px"
    >
      <el-form ref="examineStatusForm" :model="examineStatusForm">
        <el-form-item label="审核状态:" label-width="100px">
          <el-select v-model="examineStatusForm.examineStatus" placeholder="请选择状态">
            <el-option
              v-for="item in examineStatusForm.examineStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态描述:" label-width="100px">
          <el-input type="textarea" :rows="6" v-model="examineStatusForm.examineStatusDes"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="examineStatusVisible = false" size="medium">取 消</el-button>
        <el-button @click="modifyExamineStatusOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加师资弹窗 -->
    <el-dialog title="添加师资" :visible.sync="addTeacherVisible" width="633px">
      <el-form ref="addTeacherForm" :model="addTeacherForm" label-width="85px" :rules="rules">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="addTeacherForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="mobile">
          <el-input v-model="addTeacherForm.mobile" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="头像:">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Teacher.Main"
            :on-success="handlerAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="addTeacherForm.HeadShowUrl" :src="addTeacherForm.HeadShowUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="教龄:" prop="teachingAge">
          <el-input v-model="addTeacherForm.teachingAge" placeholder="请输入教龄"></el-input>
        </el-form-item>
        <el-form-item label="个人经历:" prop="experience">
          <el-input
            type="textarea"
            :rows="4"
            v-model="addTeacherForm.experience"
            placeholder="请输入个人经历"
          ></el-input>
        </el-form-item>
        <el-form-item label="所获荣誉:" prop="honor">
          <el-input type="textarea" :rows="4" v-model="addTeacherForm.honor" placeholder="请输入所获荣誉"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addTeacherVisible = false" size="medium">取 消</el-button>
        <el-button @click="addTeacherOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑师资弹窗 -->
    <el-dialog
      :title="`编辑师资-${clickItem.TeacherName}`"
      :visible.sync="editTeacherVisible"
      width="633px"
    >
      <el-form ref="editTeacherForm" :model="editTeacherForm" label-width="85px" :rules="rules">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="editTeacherForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="联系方式:" prop="mobile">
          <el-input v-model="editTeacherForm.mobile" placeholder="请输入联系方式"></el-input>
        </el-form-item>
        <el-form-item label="头像:">
          <label>(图片规格：360x360)</label>
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :show-file-list="false"
            :headers="headers"
            name="Teacher.Main"
            :on-success="editAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img
              v-if="editTeacherForm.HeadShowUrl"
              :src="editTeacherForm.HeadShowUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="教龄:" prop="teachingAge">
          <el-input v-model="editTeacherForm.teachingAge" placeholder="请输入教龄"></el-input>
        </el-form-item>
        <el-form-item label="个人经历:" prop="experience">
          <el-input
            type="textarea"
            :rows="4"
            v-model="editTeacherForm.experience"
            placeholder="请输入个人经历"
          ></el-input>
        </el-form-item>
        <el-form-item label="所获荣誉:" prop="honor">
          <el-input type="textarea" :rows="4" v-model="editTeacherForm.honor" placeholder="请输入所获荣誉"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editTeacherVisible = false" size="medium">取 消</el-button>
        <el-button @click="editTeacherOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配职称 -->
    <el-dialog
      :title="`分配职称-${clickItem.TeacherName}`"
      :visible.sync="setTitlesVisible"
      width="633px"
    >
      <el-checkbox-group v-model="selectTitlesList">
        <el-checkbox
          v-for="item in totalTitlesList"
          :label="item.TitlesId"
          :key="item.TitlesId"
        >{{item.TitlesName}}</el-checkbox>
      </el-checkbox-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setTitlesVisible = false" size="medium">取 消</el-button>
        <el-button @click="setTitlesOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetSellerTeacherList,
  AddSellerTeacher,
  ModifySellerTeacherExamineStatus,
  ModifySellerTeacherStatus,
  ModifySellerTeacher,
  DeleteSellerTeacher,
  GetTeacherTitlesList,
  SetSellerTeacherTitles
} from "api/seller.js";
export default {
  name: "TeacherList",
  data() {
    return {
      sellerId: 0, //商家Id
      searchName: "", //姓名搜索
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      teacherListTable: [], //账户列表
      clickItem: {}, //点击某一行数据
      headerVisible: false, //头像预览弹窗是否可见
      addTeacherVisible: false, //添加师资弹窗是否显示
      addTeacherForm: {
        name: "",
        mobile: "",
        HeadShowUrl: "",
        HeadUrl: "",
        teachingAge: "",
        experience: "",
        honor: ""
      },
      editTeacherVisible: false, //添加师资弹窗是否显示
      editTeacherForm: {
        name: "",
        mobile: "",
        HeadShowUrl: "",
        HeadUrl: "",
        teachingAge: "",
        experience: "",
        honor: ""
      },
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        // mobile: [
        //   { required: true, message: "请输入联系方式", trigger: "blur" },
        //   {
        //     pattern: /^((13[0-9])|(14[5,7])|(15[0-3,5-9])|(17[0,3,5-8])|(18[0-9])|166|198|199|(147))\d{8}$/,
        //     message: "请填写正确的手机号码",
        //     trigger: "blur"
        //   }
        // ],
        teachingAge: [
          { required: true, message: "请输入教龄", trigger: "blur" }
        ]
      },
      examineStatusVisible: false, //审核状态弹窗是否可见
      //审核状态弹窗信息
      examineStatusForm: {
        examineStatus: 0,
        examineStatusList: [
          { id: 1, name: "等待审核" },
          { id: 2, name: "审核中" },
          { id: 3, name: "审核失败" },
          { id: 4, name: "审核成功" }
        ],
        examineStatusDes: ""
      },
      setTitlesVisible: false, //分配职称弹窗是否可见
      totalTitlesList: [], //所有职称列表
      selectTitlesList: [] //选中职称列表
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
    this.sellerId = this.$route.params.id;
    this._getSellerTeacherList();
    this._getTeacherTitlesList();
  },

  watch: {
    $route(newValue, oldValue) {
      this.sellerId = this.$route.params.id;
      this._getSellerTeacherList();
      this._getTeacherTitlesList();
    }
  },
  methods: {
    //跳转到门店列表
    jumpToStoreListDialog(item) {
      this.$router.push({
        path: `/StoreListDialog/${item.TeacherId}`,
        query: {
          name: item.TeacherName,
          type: 1
        }
      });
    },
    //跳转到项目列表
    jumpToItemListDialog(item) {
      this.$router.push({
        path: `/ItemListDialog/${item.TeacherId}`,
        query: {
          name: item.TeacherName
        }
      });
    },
    //跳转到师资图片
    jumpToTeacherImgs(item) {
      this.$router.push({
        path: `/TeacherImgs/${item.TeacherId}`,
        query: {
          name: item.TeacherName
        }
      });
    },
    //搜索
    TeacherListSearch() {
      this.pageIndex = 1;
      this._getSellerTeacherList();
    },
    //师资列表分页变化
    TeacherListCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerTeacherList();
    },
    //显示头像预览弹窗
    showHeader(item) {
      this.clickItem = item;
      this.headerVisible = true;
    },
    //打开修改审核状态弹窗
    ChangeExamineStatus(item) {
      this.clickItem = item;
      this.examineStatusVisible = true;
      this.examineStatusForm.examineStatus = item.ExamineStatus;
      this.examineStatusForm.examineStatusDes = item.ExamineStatusDes;
    },
    //确定修改审核状态
    modifyExamineStatusOk() {
      this._modifySellerTeacherExamineStatus().then(val => {
        this.examineStatusVisible = false;
        this._getSellerTeacherList();
      });
    },
    //修改师资状态
    changeStatus(status, item) {
      this._modifySellerTeacherStatus(item.TeacherId, status);
    },
    //显示添加教师弹窗
    showAddTeacherDialog() {
      this.addTeacherVisible = true;
      this.addTeacherForm.name = "";
      this.addTeacherForm.mobile = "";
      this.addTeacherForm.HeadShowUrl = "";
      this.addTeacherForm.HeadUrl = "";
      this.addTeacherForm.teachingAge = "";
      this.addTeacherForm.experience = "";
      this.addTeacherForm.honor = "";
    },
    //添加师资确认
    addTeacherOk() {
      this.$refs["addTeacherForm"].validate(valid => {
        if (valid) {
          this._addSellerTeacher().then(val => {
            this.addTeacherVisible = false;
            this._getSellerTeacherList();
          });
        } else {
          return false;
        }
      });
    },
    //显示编辑教师弹窗
    showEditTeacherDialog(item) {
      this.clickItem = item;
      this.editTeacherVisible = true;
      this.editTeacherForm.name = item.TeacherName;
      this.editTeacherForm.mobile = item.Mobile;
      this.editTeacherForm.HeadShowUrl = item.HeaderAccessUrl;
      this.editTeacherForm.HeadUrl = item.HeaderUrl;
      this.editTeacherForm.teachingAge = item.TeachingAge;
      this.editTeacherForm.experience = item.Experience;
      this.editTeacherForm.honor = item.Honor;
    },
    //编辑师资确认
    editTeacherOk() {
      this.$refs["editTeacherForm"].validate(valid => {
        if (valid) {
          this._modifySellerTeacher().then(val => {
            this.editTeacherVisible = false;
            this._getSellerTeacherList();
          });
        } else {
          return false;
        }
      });
    },
    //删除师资
    deleteTeacher(item) {
      this.$confirm("此操作将永久删除该项, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this._deleteSellerTeacher(item.TeacherId).then(val => {
            this._getSellerTeacherList();
          });
        })
        .catch(() => {});
    },
    //添加头像上传成功
    handlerAvatarSuccess(res, file) {
      this.addTeacherForm.HeadShowUrl = res.Data.ImgUrl;
      this.addTeacherForm.HeadUrl = res.Data.ImgPath;
    },
    //编辑头像上传成功
    editAvatarSuccess(res, file) {
      this.editTeacherForm.HeadShowUrl = res.Data.ImgUrl;
      this.editTeacherForm.HeadUrl = res.Data.ImgPath;
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
    //显示分配职称弹窗
    showSetTitlesDialog(item) {
      this.clickItem = item;
      this.setTitlesVisible = true;
      this.selectTitlesList = item.TitlesList;
    },
    //设置职称确认
    setTitlesOk() {
      this._setSellerTeacherTitles().then(val => {
        this.setTitlesVisible = false;
        this._getSellerTeacherList();
      });
    },
    //解析审核状态
    //审核状态1.等待审核 2审核中 3审核失败 4审核成功
    parseExamineStatus(status) {
      switch (status) {
        case 1:
          return "等待审核";
        case 2:
          return "审核中";
        case 3:
          return "审核失败";
        case 4:
          return "审核成功";
        default:
          return "未知";
      }
    },
    //获取师资列表信息
    _getSellerTeacherList() {
      var par = {
        SellerId: this.sellerId,
        TeacherName: this.searchName,
        Status: 0,
        ExamineStatus: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetSellerTeacherList(par, 196).then(res => {
        this.teacherListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    },
    //添加师资
    _addSellerTeacher() {
      var par = {
        SellerId: this.sellerId,
        TeacherName: this.addTeacherForm.name,
        HeaderUrl: this.addTeacherForm.HeadUrl,
        Mobile: this.addTeacherForm.mobile,
        TeachingAge: this.addTeacherForm.teachingAge,
        Experience: this.addTeacherForm.experience,
        Honor: this.addTeacherForm.honor
      };
      return AddSellerTeacher(par, 197);
    },
    //修改师资审核状态
    _modifySellerTeacherExamineStatus() {
      var par = {
        StatusDes: this.examineStatusForm.examineStatusDes,
        Status: this.examineStatusForm.examineStatus,
        Id: this.clickItem.TeacherId
      };
      return ModifySellerTeacherExamineStatus(par, 201);
    },
    //修改师资状态
    _modifySellerTeacherStatus(id, status) {
      var par = {
        Status: status,
        Id: id
      };
      return ModifySellerTeacherStatus(par, 200);
    },
    //编辑师资
    _modifySellerTeacher() {
      var par = {
        TeacherId: this.clickItem.TeacherId,
        TeacherName: this.editTeacherForm.name,
        HeaderUrl: this.editTeacherForm.HeadUrl,
        Mobile: this.editTeacherForm.mobile,
        TeachingAge: this.editTeacherForm.teachingAge,
        Experience: this.editTeacherForm.experience,
        Honor: this.editTeacherForm.honor
      };
      return ModifySellerTeacher(par, 199);
    },
    //删除师资
    _deleteSellerTeacher(id) {
      var par = {
        Id: id
      };
      return DeleteSellerTeacher(par, 202);
    },
    //获取教师职称列表
    _getTeacherTitlesList() {
      var par = {
        TitlesName: "",
        Status: 1,
        PageIndex: 1,
        PageCount: 100
      };
      return GetTeacherTitlesList(par, 196).then(res => {
        this.totalTitlesList = res.List;
      });
    },
    //师资分配职称
    _setSellerTeacherTitles() {
      var par = {
        TeacherId: this.clickItem.TeacherId,
        TitlesList: this.selectTitlesList
      };
      return SetSellerTeacherTitles(par, 203);
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
.header {
  width: 100%;
  height: auto;
}
</style>
