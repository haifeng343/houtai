<template>
  <div>
    <div class="customer-title">
      <label>微信号</label>
      <el-input v-model="wechatName" style="width:200px;margin:0 15px"></el-input>
      <el-button plain @click="search">搜索</el-button>
      <el-button v-if="common.haveRight('AddWechat')" class="add" @click="add" type="primary">增加</el-button>
    </div>
    <el-table :data="List" border style="width: 100%;margin-top:20px" max-height="650px">
      <el-table-column align="center" prop="WechatNumber" label="微信号"></el-table-column>
      <el-table-column align="center" prop="WechatImg" label="微信二维码">
        <template slot-scope="scope">
          <el-button size="mini" type="text" @click="see(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="是否当前使用">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.IsCurrent"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="_wechatCurrentModify(scope.row)"
            :disabled="!common.haveRight('ModifyWechatCurrent')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="CreateTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="UpdateTime" label="更新时间"></el-table-column>
      <el-table-column prop="name" label="状态修改">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.Status"
            active-text="有效"
            inactive-text="无效"
            :active-value="1"
            :inactive-value="2"
            @change="_wechatStatusModify(scope.row)"
            :disabled="!common.haveRight('ModifyWechatStatus')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="操作">
        <template slot-scope="scope">
          <el-button
            v-if="common.haveRight('ModifyWechat')"
            size="mini"
            type="text"
            @click="edit(scope.row)"
          >编辑</el-button>
          <el-button
            v-if="common.haveRight('DeleteWechat')"
            size="mini"
            type="text"
            class="red"
            @click="delate(scope.row.Id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--增加微信弹窗-->
    <el-dialog title="增加微信号" center :visible.sync="addVisible" width="500px">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item style="text-align:left" label="微信号：" prop="wechatNumber">
          <el-input v-model="ruleForm.wechatNumber" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left" label="微信二维码：" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :headers="headers"
            name="Wechat.Imgs"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="ruleForm.imageUrl" :src="ruleForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" style="line-height:200px"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--编辑微信弹窗-->
    <el-dialog title="编辑微信号" center :visible.sync="editVisible" width="500px">
      <el-form
        :model="editForm"
        status-icon
        :rules="editrules"
        ref="editForm"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item style="text-align:left" label="微信号：" prop="wechatNumber">
          <el-input v-model="editForm.wechatNumber" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left" label="微信二维码：" prop="imageUrl">
          <el-upload
            class="avatar-uploader"
            action="../adminrocket/img/upload"
            :headers="headers"
            name="Wechat.Imgs"
            :show-file-list="false"
            :on-success="editSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="editForm.imageUrl" :src="editForm.imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editBtn('editForm')" size="medium">保存</el-button>
          <el-button @click="editVisible = false" size="medium">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--查看弹窗-->
    <el-dialog title="查看微信二维码" :visible.sync="look" width="400px">
      <div class="lecence">
        <img class :src="imgUrl" alt />
      </div>
    </el-dialog>

    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 4, 5, 6, 7]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TotalCount"
      ></el-pagination>
    </div>

    <div class="customer-title">
      <label>标题</label>
      <el-input v-model="titleName" style="width:200px;margin:0 15px"></el-input>
      <el-button plain @click="search1">搜索</el-button>
      <el-button v-if="common.haveRight('AddWechatContent')" class="add" @click="add1" type="primary">增加</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-top:20px" max-height="650px">
      <el-table-column align="center" prop="OrderIndex" label="	排序值"></el-table-column>
      <el-table-column align="center" prop="Title" label="标题"></el-table-column>
      <el-table-column align="center" prop="Content" label="内容"></el-table-column>
      <el-table-column align="center" prop="CreateTime" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="UpdateTime" label="更新时间"></el-table-column>
      <el-table-column prop="name" label="状态修改">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.Statue"
            active-text="有效"
            inactive-text="无效"
            :active-value="1"
            :inactive-value="2"
            @change="_wechatContenStatusModify(scope.row)" 
            :disabled="!common.haveRight('ModifyWechatContentStatus')"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="操作">
        <template slot-scope="scope">
          <el-button v-if="common.haveRight('ModifyWechatContent')" size="mini" type="text" @click="edit1(scope.row)">编辑</el-button>
          <el-button v-if="common.haveRight('DeleteWechatContent')" size="mini" type="text" class="red" @click="delate1(scope.row.Id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--增加微信弹窗-->
    <el-dialog title="增加微信内容" center :visible.sync="addVisible1" width="500px">
      <el-form
        :model="ruleForm1"
        status-icon
        :rules="rules1"
        ref="ruleForm1"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item style="text-align:left" label="标题:" prop="title">
          <el-input v-model="ruleForm1.title" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left" label="内容:" prop="content">
          <el-input v-model="ruleForm1.content" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left" label="排序值:" prop="orderIndex">
          <el-input v-model="ruleForm1.orderIndex" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm1('ruleForm1')">提交</el-button>
          <el-button @click="resetForm1('ruleForm1')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!--编辑微信弹窗-->
    <el-dialog title="编辑微信内容" center :visible.sync="editVisible1" width="500px">
      <el-form
        :model="editForm1"
        status-icon
        :rules="editrules1"
        ref="editForm1"
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item style="text-align:left" label="标题:" prop="title">
          <el-input v-model="editForm1.title" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left" label="内容:" prop="content">
          <el-input v-model="editForm1.content" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item style="text-align:left" label="排序值:" prop="orderIndex">
          <el-input v-model="editForm1.orderIndex" style="width:200px"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="editBtn1('editForm1')">保存</el-button>
          <el-button @click="editVisible1 = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="pagination">
      <el-pagination
        background
        @size-change="handleSizeChange1"
        @current-change="handleCurrentChange1"
        :current-page="currentPage1"
        :page-sizes="[3, 4, 5, 6, 7]"
        :page-size="pageSize1"
        layout="total, sizes, prev, pager, next, jumper"
        :total="TotalCount"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import {
  wechatList,
  wechatAdd,
  wechatDelete,
  wechatModify,
  wechatStatusModify,
  wechatCurrentModify,
  wechatContentList,
  wechatContentAdd,
  wechatContentModify,
  wechatContentDelete,
  wechatContenStatusModify
} from "api/customerservice.js";
export default {
  name: "WechatManager",
  data() {
    return {
      List: [],
      tableData: [],
      imgUrl: "", //微信二维码
      imgPath: "",
      Id: "",
      titleName: "",
      wechatName: "", //微信号
      addVisible: false, //增加微信号弹窗
      editVisible: false, //修改微信号弹窗
      addVisible1: false,
      editVisible1: false,
      currentPage: 1, //页码
      pageSize: 5, //每页数量
      TotalCount: 0, //总数
      currentPage1: 1, //页码
      pageSize1: 5, //每页数量
      TotalCount1: 0, //总数
      look: false,
      myHeaders: {
        application: `manager`
      },
      ruleForm: {
        wechatNumber: "",
        imageUrl: "",
        imgPath: ""
      },
      rules: {
        wechatNumber: [{ required: true, message: "微信号", trigger: "blur" }],
        imageUrl: [{ required: true, trigger: "blur", message: "图片不能为空" }]
      },
      editForm: {
        wechatNumber: "",
        imageUrl: "",
        imgPath: ""
      },
      editrules: {
        wechatNumber: [{ required: true, message: "微信号", trigger: "blur" }],
        imageUrl: [{ required: true, trigger: "blur", message: "图片不能为空" }]
      },

      ruleForm1: {
        title: "",
        content: "",
        orderIndex: ""
      },
      rules1: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        content: [{ required: true, trigger: "blur", message: "内容不能为空" }],
        orderIndex: [
          { required: true, trigger: "blur", message: "排序值不能为空" }
        ]
      },
      editForm1: {
        title: "",
        content: "",
        orderIndex: ""
      },
      editrules1: {
        title: [{ required: true, message: "微信号", trigger: "blur" }],
        content: [{ required: true, trigger: "blur", message: "图片不能为空" }],
        orderIndex: [
          { required: true, trigger: "blur", message: "排序值不能为空" }
        ]
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
    this._wechatList();
    this._wechatContentList();
  },
  methods: {
    //获取列表
    _wechatList() {
      const params = {
        WechatNumber: this.wechatName,
        PageIndex: this.currentPage,
        PageCount: this.pageSize
      };
      return wechatList(params, 19).then(res => {
        this.List = res.List;
        this.TotalCount = res.TotalCount;
      });
    },
    //分页导航尺寸更改
    handleSizeChange(val) {
      this.pageSize = val;
      this._wechatList();
    },
    // 分页导航
    handleCurrentChange(val) {
      this.currentPage = val;
      this._wechatList();
    },
    //状态修改
    _wechatStatusModify(item) {
      const params = {
        Id: item.Id,
        Status: item.Status
      };
      return wechatStatusModify(params, 23);
    },
    //是否当前使用修改
    _wechatCurrentModify(item) {
      const params = {
        Id: item.Id,
        IsCurrent: item.IsCurrent
      };
      wechatCurrentModify(params, 24).then(res => {
        this._wechatList();
      });
    },
    search() {
      this.currentPage = 1;
      this._wechatList();
    },
    ShowErrorReason(item) {
      this.ErrorReason = item.ErrorReason;
    },
    see(row) {
      this.imgUrl = "";
      this.look = true;
      this.form = Object.assign({}, row);
      this.imgUrl = row.WechatImgUrl;
    },
    handleAvatarSuccess(res, file) {
      this.ruleForm.imageUrl = res.Data.ImgUrl;
      this.ruleForm.imgPath = res.Data.ImgPath;
    },
    editSuccess(res, file) {
      this.editForm.imageUrl = res.Data.ImgUrl;
      this.editForm.imgPath = res.Data.ImgPath;
    },
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
    delate(id) {
      this.$confirm("确认删除?", "提示", {
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          wechatDelete({ Id: id }, 22).then(res => {
            this.$message({
              type: "success",
              message: "删除成功",
              showClose: true
            });
            this._wechatList();
          });
        })
        .catch(error => {});
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            WechatNumber: this.ruleForm.wechatNumber,
            WechatImg: this.ruleForm.imgPath
          };
          wechatAdd(params, 20).then(res => {
            this.addVisible = false;
            this.$message({
              type: "success",
              message: "添加成功",
              showClose: true
            });
            this._wechatList();
            this.currentPage = 1;
          });
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.addVisible = false;
    },
    add() {
      this.addVisible = true;
    },
    edit(item) {
      this.editVisible = true;
      this.Id = item.Id;
      this.editForm.wechatNumber = item.WechatNumber;
      this.editForm.imageUrl = item.WechatImgUrl;
      this.editForm.imgPath = item.WechatImg;
    },
    editBtn(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            Id: this.Id,
            WechatNumber: this.editForm.wechatNumber,
            WechatImg: this.editForm.imgPath
          };
          wechatModify(params, 21).then(res => {
            this.editVisible = false;
            this.$message({
              type: "success",
              message: "修改成功",
              showClose: true
            });
            this._wechatList();
          });
        } else {
          return false;
        }
      });
    },
    //获取列表
    _wechatContentList() {
      const params = {
        Title: this.titleName,
        PageIndex: this.currentPage1,
        PageCount: this.pageSize1
      };
      wechatContentList(params,25).then(res => {
        this.tableData = res.List;
        this.TotalCount1 = res.TotalCount;
      });
    },
    search1() {
      this.currentPage1 = 1;
      this._wechatContentList();
    },
    resetForm1(formName) {
      this.$refs[formName].resetFields();
      this.addVisible1 = false;
    },
    add1() {
      this.addVisible1 = true;
    },
    //状态修改
    _wechatContenStatusModify(item) {
      const params = {
        Id: item.Id,
        Status: item.Statue
      };
      return wechatContenStatusModify(params,29);
    },
    submitForm1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            Title: this.ruleForm1.title,
            Content: this.ruleForm1.content,
            OrderIndex: this.ruleForm1.orderIndex
          };
          wechatContentAdd(params,26).then(res => {
            this.addVisible1 = false;
            this.$message({
              type: "success",
              message: "添加成功",
              showClose: true
            });
            this._wechatContentList();
            this.currentPage1 = 1;
          });
        } else {
          return false;
        }
      });
    },
    //分页导航尺寸更改
    handleSizeChange1(val) {
      this.pageSize1 = val;
      this._wechatContentList();
    },
    // 分页导航
    handleCurrentChange1(val) {
      this.currentPage1 = val;
      this._wechatContentList();
    },
    edit1(item) {
      this.editVisible1 = true;
      this.Id = item.Id;
      console.log(item);
      this.editForm1.title = item.Title;
      this.editForm1.content = item.Content;
      this.editForm1.orderIndex = item.OrderIndex;
    },
    editBtn1(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const params = {
            Id: this.Id,
            Title: this.editForm1.title,
            Content: this.editForm1.content,
            OrderIndex: this.editForm1.orderIndex
          };
          wechatContentModify(params,27).then(res => {
            this.editVisible1 = false;
            this.$message({
              type: "success",
              message: "修改成功",
              showClose: true
            });
            this._wechatContentList();
          });
        } else {
          return false;
        }
      });
    },
    delate1(id) {
      this.$confirm("确认删除?", "提示", {
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          wechatContentDelete({ Id: id },28).then(res => {
            this.$message({
              type: "success",
              message: "删除成功",
              showClose: true
            });
            this._wechatContentList();
          });
        })
        .catch(error => {});
    }
  }
};
</script>

<style scoped>
.customer-title {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
  position: relative;
}
.customer-title label {
  line-height: 40px;
}
.customer-title .add {
  position: absolute;
  right: 20px;
  top: 0px;
}
.erwei {
  position: relative;
  right: -2px;
  top: 15px;
}
.imgBor {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  position: relative;
  left: 100px;
  top: 0px;
  margin-bottom: 30px;
}
.lecence img {
  width: 100%;
  height: auto;
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
  display: block;
}
</style>

