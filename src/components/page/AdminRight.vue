<template>
  <div>
    <div class="m_menu_box flex">
      <ul class="menu_list flex">
        <li
          class="menu-item flex"
          @click="jumpToRightSet(item)"
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
import { GetMenuList } from "api/admin.js";
export default {
  name: "AdminRight",
  data() {
    return {
      roleId:0,
      menuList: []
    };
  },
  created() {
    this.roleId=this.$route.params.id;
    this._getMenuList(0).then(res => {
      this.menuList = res;
    });
  },
  methods: {
    jumpToRightSet(item) {
      this.$router.push({
        path: `/AdminRightSet/${item.MenuId}`,
        query: {
          name: item.Title,
          roleId:this.roleId
        }
      });
    },
    //获取菜单列表
    _getMenuList(fatherMenuId) {
      var par = {
        FatherMenuId: fatherMenuId,
        Type: 1
      };
      return GetMenuList(par);
    }
  }
};
</script>

<style scoped lang='less'>
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
      border: 1px solid #5c9eff;
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
</style>
