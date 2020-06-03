<template>
  <div class="login-wrap">
    <div class="login-left">
      <div class="ms-login">
        <div class="ms-title">亲学宝后台管理系统</div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="ms-content">
          <span class="login-title">用户名</span>
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" class="bg-input" placeholder></el-input>
          </el-form-item>
          <span class="login-title">密码</span>
          <el-form-item prop="password">
            <el-input
              type="password"
              class="bg-input"
              placeholder
              v-model="loginForm.password"
              @keyup.enter.native="submitForm()"
              auto-complete="new-password"
            ></el-input>
          </el-form-item>
          <el-checkbox v-model="checked" class="font">记住密码</el-checkbox>
          <div style="margin:0 30%;">
            <el-button class="login-btn" type="primary" @click="submitForm()">登录 →</el-button>
            <!-- <router-link to="/forget" class="forget" alt="forget">忘记密码？</router-link> -->
          </div>
        </el-form>
      </div>
    </div>
    <div class="login-right">
      <img :src="logoImg" alt />
      <div class="login-text">
        <p>亲学宝后台管理系统</p>
        <p>2019 intelligent operation platform</p>
      </div>
    </div>
  </div>
</template>

<script>
import { AdminLogin, GetRightList } from "api/admin.js";
export default {
  name: "Login",
  data: function() {
    return {
      checked: false,
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          },
          {
            pattern: /^(\w){6,20}$/,
            message: "只能输入6-20个字母、数字、下划线"
          }
        ]
      },
      logoImg: require("../../assets/login.png")
    };
  },
  created() {
    let userName = localStorage.getItem("userName");
    let password = localStorage.getItem("password");
    if (userName != null) {
      this.loginForm.username = userName;
    }
    if (password != null) {
      this.checked = true;
      this.loginForm.password = password;
    }
  },
  methods: {
    //登录提交
    submitForm() {
      this.$refs["loginForm"].validate(valid => {
        if (valid) {
          this._adminLogin().then(res => {
            localStorage.setItem("userName", res.UserName);
            localStorage.setItem("isAdministrator", res.IsAdministrator);
            if (this.checked) {
              localStorage.setItem("password", this.loginForm.password);
            } else {
              localStorage.removeItem("password");
            }
            localStorage.setItem("realName", res.RealName);
            localStorage.setItem("userToken", res.UserToken);
            this._getRightList().then(res => {
              //用户权限存缓存
              localStorage.setItem(
                "accountright",
                res.map(v => {
                  return v.RightCode;
                })
              );
            });
            this.$router.push("/homeMenu");
          });
        } else {
          return false;
        }
      });
    },
    //登录接口
    _adminLogin() {
      const params = {
        username: this.loginForm.username,
        password: this.$md5(this.loginForm.password)
      };
      return AdminLogin(params);
    },
    //获取用户权限列表
    _getRightList() {
      return GetRightList();
    }
  }
};
</script>

<style scoped lang="less">
.codeImg_box {
  width: 80px;
  height: 32px;
  float: right;
  text-align: center;
  .codeImg {
    width: 100%;
    height: 100%;
    display: inline-block;
  }
}
.login-wrap {
  position: relative;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  width: 94%;
  left: 3%;
  min-width: 1200px;
  height: 100%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
}
.login-left,
.login-right {
  position: relative;
  width: 50%;
  height: 100%;
  background: #fff;
}
.login-right {
  background-image: url(../../assets/login-bg.jpg);
  background-size: 100%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.login-right img {
  width: 180px;
  height: auto;
  position: fixed;
  margin: auto;
  top: 350px;
}
.login-text {
  position: fixed;
  text-align: center;
  line-height: 50px;
  font-size: 18px;
  letter-spacing: 1px;
  top: 700px;
  opacity: 0.8;
}
.login-text p:last-child {
  font-size: 16px;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 28px;
  color: #192c43;
}
.ms-login {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 430px;
  height: 550px;
  margin: auto;
  align-items: center;
  border-radius: 5px;
  background: #fff;
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-title {
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #a2a2a2;
}
.login-btn {
  margin-top: 30px;
  width: auto;
  text-align: left;
  padding: 0 30px;
  height: 40px;
  margin-bottom: 10px;
  border-radius: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
.forget {
  color: #449ce6;
  font-size: 13px;
  text-align: right;
  line-height: 40px;
  margin-top: 30px;
}
.zh-en {
  font-size: 11px;
  letter-spacing: 15px;
  height: 50px;
  line-height: 50px;
}
.font {
  color: #449ce6;
  font-size: 13px;
}
</style>