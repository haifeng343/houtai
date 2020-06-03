<template>
  <div class="menuPage">
    <div class="m_header flex">
      <div class="header-left flex">您好 {{realName}} ,欢迎登录亲学宝后台管理系统</div>
      <div class="flex">
        <div class="user-click" @click="modify">
          <img src="../../assets/Key.png" width="23px" height="24px" alt />
          <p>修改密码</p>
        </div>
        <div class="user-click" @click="_adminLoginOut">
          <img src="../../assets/Logout.png" alt />
          <p>注销</p>
        </div>
      </div>
    </div>
    <div class="m_menu_box flex">
      <ul class="menu_list flex">
        <li
          class="menu-item flex"
          @click="changeRoute(item.MenuId)"
          v-for="item in menuList"
          :key="item.MenuId"
        >
          <img :src="item.IconUrl" :alt="item.Title" :title="item.Title" />
          <p class="title-name">{{item.Title}}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { GetMenuList,AdminLoginOut } from "api/admin.js";
export default {
  data() {
    return {
      menuList: [],
      realName: ""
    };
  },
  created() {
    let realName = localStorage.getItem("realName");
    if (realName != null) {
      this.realName = realName;
    }
    this._getMenuList();
  },
  methods: {
    modify() {
      this.$router.push("/ModifyPassword");
    },
    //退出登陆
    _adminLoginOut() {
      AdminLoginOut().then(res => {
        localStorage.removeItem("realName");
        localStorage.removeItem("userToken");
        this.$router.push("/login");
      });
    },
    // 获取模块
    _getMenuList() {
      var par = {
        FatherMenuId: 0
      };
      return GetMenuList(par).then(res => {
        console.log(res);
        this.menuList = res;
      });
    },
    changeRoute(type) {
      localStorage.setItem("module", type);
      this.$router.push("/dashboard");
    }
  }
};
</script>

<style scoped lang="less">
.user-name {
  color: #ffffff;
}
.menuPage {
  width: 100%;
  height: 100%;
  background: url(../../assets/login-bg.jpg) no-repeat center center;
  background-attachment: fixed;
  background-size: cover;
  .m_header {
    width: 100%;
    opacity: 0.85;
    height: 90px;
    box-sizing: border-box;
    padding: 0 60px;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    .header-left {
      justify-content: center;
      align-items: center;
      img {
        margin-right: 5px;
        width: 24px;
        height: 24px;
      }
    }
  }
  .m_menu_box {
    width: 1460px;
    min-width: 1460px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    .menu_list {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      position: relative;
      top: 100px;
      .menu-item {
        width: 320px;
        height: 225px;
        margin-top: 60px;
        justify-content: flex-start;
        text-align: center;
        flex-direction: column;
        align-items: center;
        background-color: #fff;
        font-size: 20px;
        margin-right: 55px;
        cursor: pointer;
        border-radius: 15px;
        > img {
          display: block;
          width: 60px;
          height: 60px;
          margin-top: 50px;
        }
        .title-name {
          margin-top: 48px;
          width: 100%;
          text-align: center;
          height: 26px;
          font-family: MicrosoftYaHei;
          font-size: 17px;
          font-weight: 600;
          line-height: 30px;
          letter-spacing: 2px;
          color: #848484;
        }
      }
      .menu-item:nth-child(4n) {
        margin-right: 0;
      }
    }
  }
}
.el-dropdown-menu__item {
  text-align: center;
  border-top: none;
}
.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}
.user-click {
  font-size: 14px;
  line-height: 30px;
  cursor: pointer;
}
.user-click img {
  text-align: center;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  object-fit: cover;
}
.user-click:first-child {
  position: relative;
  right: 50px;
}
</style>