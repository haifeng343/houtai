<template>
  <div class="sidebar">
    <div class="header-tips" @click="jumpToHome()">
      <img src="../../assets/logo.png" alt />
      <span>亲学宝后台管理系统</span>
    </div>
    <el-menu
      class="sidebar-el-menu"
      :default-active="defaultActive"
      :default-openeds="defaultOpen"
      background-color="#5C9EFF"
      text-color="#676767"
      active-text-color="#ffffff"
      unique-opened
    >
      <template v-for="item in items">
        <template v-if="item.Children">
          <el-submenu :index="item.MenuPage" :key="item.MenuId">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title" style="font-size:18px;">{{ item.Title }}</span>
            </template>
            <template v-for="subItem in item.Children">
              <el-menu-item
                :index="subItem.MenuPage"
                :key="subItem.MenuId"
                @click="jump(subItem.MenuPage)"
              >{{ subItem.Title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.MenuPage" :key="item.MenuId" @click="jump(item.MenuPage)">
            <i class="el-icon-menu"></i>
            <span slot="title">{{ item.Title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import bus from "../common/bus";
import { GetMenuList  } from "api/admin.js";
export default {
  data() {
    return {
      module: 0,
      items: [],
      defaultOpen: ["", ""],
      defaultActive: ""
    };
  },
  watch: {
    $route(newValue, oldValue) {
      this.defaultActive = newValue.meta.father;
    }
  },
  created() {
    this.module = localStorage.getItem("module");
    this._getMenuList(this.module).then(val => {
      if (localStorage.getItem("activePath") == null) {
        this.$router.push(`/${this.items[0].Children[0].MenuPage}`);
      } else {
        this.$router.push(localStorage.getItem("activePath"));
      }
    });
  },
  methods: {
    //跳转到首页
    jumpToHome() {
      this.$router.push("/homeMenu");
    },
    jump(Url) {
      this.$router.push(`/${Url}`);
    },
    _getMenuList(id) {
      const params = {
        FatherMenuId: id
      };
      return GetMenuList(params).then(res => {
        this.items = res;
      });
    }
  }
};
</script>

<style scoped>
.header-tips {
  width: 250px;
  height: 90px;
  position: fixed;
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
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 90px;
  bottom: 0;
  overflow-y: scroll;
  z-index: 1;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
</style>
