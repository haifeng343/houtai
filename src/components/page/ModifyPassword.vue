<template>
  <div>
    <vheader></vheader>
    <div class="header-tips" @click="jumpToHome()">
      <img src="../../assets/logo.png" alt />
      <span>亲学宝后台管理系统</span>
    </div>
    <div class="box-shadow">
      <div class="slidbar-modify">修改密码</div>
      <div class="container-password">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="margin-top:-40px">
          <el-breadcrumb-item :to="{ path: '/' }" class="cor">首页</el-breadcrumb-item>
          <el-breadcrumb-item class="cor-blue">修改密码</el-breadcrumb-item>
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
          <el-form-item label="原密码" prop="oldpass">
            <el-input
              type="password"
              v-model="changeForm.oldpass"
              placeholder="请输入原始密码"
              auto-complete="new-password"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpass">
            <el-input
              type="password"
              v-model="changeForm.newpass"
              placeholder="6-12位字符，英文、数字或符号组成"
              auto-complete="new-password"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="repass">
            <el-input
              type="password"
              v-model="changeForm.repass"
              placeholder="确认新密码"
              auto-complete="new-password"
            ></el-input>
          </el-form-item>
          <el-button type="primary" @click="changePasswordOk()" class="btn-sure">确 定</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { AdminLoginOut, ChangePassword } from "api/admin.js";
import vheader from "components/common/Header.vue";
export default {
  name: "ModifyPassword",
  components: {
    vheader
  },
  data() {
    var repassword = (rule, value, callback) => {
      if (this.changeForm.newpass != value) {
        callback("两次密码输入不一致");
      } else {
        callback();
      }
    };
    return {
      changeForm: {
        oldpass: "",
        newpass: "",
        repass: ""
      },
      rules: {
        oldpass: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newpass: [
          { required: true, message: "请输入新密码", trigger: "blur" },
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
        ],
        repass: [
          { required: true, message: "请再次确认新密码", trigger: "blur" },
          { validator: repassword, trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  methods: {
    jumpToHome() {
      this.$router.push("/homeMenu");
    },
    //重置弹出窗口
    resetForm(formName) {
      if (this.$refs[formName] != undefined) {
        this.$refs[formName].resetFields();
      }
    },
    // 修改密码
    changePasswordOk() {
      this.$refs["changeForm"].validate(valid => {
        if (valid) {
          this._changePassword().then(val => {
            this.resetForm("changeForm");
            this.$message({
              showClose: true,
              message: "修改密码成功",
              type: "success"
            });
            this.$router.go(-1); //返回上一层
          });
        } else {
          return false;
        }
      });
    },
    //修改密码
    _changePassword() {
      var par = {
        OldPassword: this.$md5(this.changeForm.oldpass),
        NewPassword: this.$md5(this.changeForm.newpass)
      };
      return ChangePassword(par);
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

