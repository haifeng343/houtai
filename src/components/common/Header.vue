<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="header-right">
      <div class="header-user-con">
        <!-- 用户头像 -->
        <!-- <div class="user-avator">
          <img src="static/img/img.jpg">
        </div> -->
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand" style="color:#000">
          <span class="el-dropdown-link">
            {{realName}}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item divided command="changePass">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="changeUserInfo">个人信息</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import { AdminLoginOut, changePassword } from "api/admin.js";
export default {
  name:"Header",
  data() {
    return {};
  },
  computed: {
    realName() {
      let realName = localStorage.getItem("realName");
      return (realName!=null && realName.length>0) ? realName : "未知用户";
    }
  },
  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == "loginout") {
        AdminLoginOut().then(res => {
          localStorage.removeItem("realName");
          localStorage.removeItem("userToken");
          this.$router.push("/login");
        });
      } else if (command == "changePass") {
        this.$router.push(`/ModifyPassword`);
      }else if(command == "changeUserInfo"){
        this.$router.push(`/ModifyUserInfo`);
      }
    }
  }
};
</script>
<style scoped>

</style>
