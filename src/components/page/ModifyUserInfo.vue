<template>
  <div>
    <vheader></vheader>
    <div class="header-tips" @click="jumpToHome()">
      <img src="../../assets/logo.png" alt />
      <span>亲学宝后台管理系统</span>
    </div>
    <div class="box-shadow">
      <div class="slidbar-modify">个人信息</div>
      <div class="container-password">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:-40px">
          <el-breadcrumb-item :to="{ path: '/' }" class="cor">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="cor-blue">个人信息</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="form-modify">
        <el-form
          ref="changeForm"
          label-position="left"
          :model="changeForm"
          :rules="rules"
          label-width="100px"
        >
          <el-form-item label="用户名" prop="UserName">
            <el-input v-model="changeForm.UserName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="Mobile">
            <el-input v-model="changeForm.Mobile" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="RealName">
            <el-input v-model="changeForm.RealName" placeholder="请输入真实姓名"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="Sex">
            <el-select v-model="changeForm.Sex" placeholder="请选择">
              <el-option v-for="item in SexList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" @click="changeUserInfoOk()" class="btn-sure">确 定</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { GetAdminUserInfo, ChangeUserInfo } from "api/admin.js";
import vheader from "components/common/Header.vue";
export default {
  name: "ModifyUserInfo",
  components: {
    vheader
  },
  data() {
    return {
      SexList: [{ id: 1, name: "男" }, { id: 2, name: "女" }],
      changeForm: {},
      rules: {
        UserName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        Mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        RealName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this._getAdminUserInfo();
  },
  methods: {
    jumpToHome() {
      this.$router.push("/homeMenu");
    },
    // 修改密码
    changeUserInfoOk() {
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          this._changeUserInfo().then(val => {
            this.$message({
              showClose: true,
              message: "修改密码成功",
              type: "success"
            });
            localStorage.setItem("realName", this.changeForm.RealName);
            this.$router.go(-1); //返回上一层
          });
        } else {
          return false;
        }
      });
    },

    //获取个人信息
    _getAdminUserInfo() {
      return GetAdminUserInfo().then(res => {
        this.changeForm = res;
      });
    },
    //用户修改个人信息
    _changeUserInfo() {
      var par = {
        UserName: this.changeForm.UserName,
        Mobile: this.changeForm.Mobile,
        RealName: this.changeForm.RealName,
        Sex: this.changeForm.Sex
      };
      return ChangeUserInfo(par);
    }
  }
};
</script>

<style <style lang="less" scoped>
.header-tips {
  width: 306px;
  height: 90px;
  position: absolute;
  top: 0;
  background-color: #5c9eff;
  color: #fff;
  cursor: pointer;
}
.header-tips img {
  width: 30px;
  margin: 21.5px;
  margin-left: 30px;
}
.header-tips span {
  position: absolute;
  line-height: 90px;
  font-size: 17px;
  font-weight: 700;
  top: 0;
}
.slidbar-modify {
  background-color: #5c9eff;
  color: #fff;
  width: 220px;
  margin-left: 15px;
  margin-top: 30px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 5px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.6);
}
.container-password {
  margin-left: 300px;
}
.box-shadow {
  width: 100%;
  height: 700px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
}
.cor {
  color: #a3a3a3;
}
.cor-blue .el-breadcrumb__item:last-child .el-breadcrumb__inner {
  color: #658bee;
}
.form-modify {
  width: 350px;
  margin-left: 300px;
  margin-top: 50px;
}
.btn-sure {
  width: 120px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
.headerd {
  position: relative;
  box-sizing: border-box;
  min-width: 1200px;
  margin-left: 250px;
  height: 90px;
  font-size: 22px;
  color: #fff;
  background-color: #5c9eff;
}
.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 90px;
}
.header .logo {
  float: left;
  width: 250px;
  line-height: 45px;
  cursor: pointer;
}
.header-right {
  float: right;
  padding-right: 50px;
}
.header-user-con {
  display: flex;
  height: 90px;
  align-items: center;
}
.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}
.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}
.btn-bell .el-icon-bell {
  color: #fff;
}
.user-name {
  margin-left: 10px;
}
.user-avator {
  margin-left: 20px;
}
.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.el-dropdown-menu__item {
  text-align: center;
  border-top: none;
}
.headerd-link {
  color: #fff;
  cursor: pointer;
  margin: 0 10px;
}
</style>

