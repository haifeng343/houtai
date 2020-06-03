<template>
  <div>
    <el-collapse v-model="activeNames">
      <el-collapse-item
        v-for="item in menuList"
        :key="item.MenuId"
        :title="item.Title"
        :name="item.MenuId"
      >
        <div v-for="x in item.Children" :key="x.MenuId">
          <div>
            <el-checkbox
              :indeterminate="x.isIndeterminate"
              v-model="x.checkAll"
              @change="handleCheckAllChange($event,x)"
            >{{x.Title}}</el-checkbox>
          </div>
          <div class="checkstyle">
            <el-checkbox-group v-model="checkedRight" @change="handleCheckedCitiesChange($event,x)">
              <el-checkbox
                v-for="y in x.RightList"
                :label="y.RightId"
                :key="y.RightId"
                style="width:250px;"
              >{{y.RightName}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
    <div>
      <el-button type="primary" @click="rightSave()" class="save">保 存</el-button>
    </div>
  </div>
</template>

<script>
import { GetMenuList, GetRoleRightList, SetRoleRight } from "api/admin.js";
export default {
  name: "AdminRightSet",
  data() {
    return {
      roleId: 0,
      menuFatherId: 0,
      menuList: [],
      checkedRight: [],
      activeNames: [],
      setMenuIdList: []
    };
  },

  watch: {
    $route(newValue, oldValue) {
      this.roleId = this.$route.query.roleId;
      this.menuFatherId = this.$route.params.id;
      this._getRoleRightList().then(val => {
        this._getMenuList(this.menuFatherId).then(res => {
          res.forEach(item => {
            var temp = item.Children.map(e => {
              var tempArr = e.RightList.filter(x => {
                return this.checkedRight.indexOf(x.RightId) > -1;
              });
              let checkedCount = tempArr.length;
              e.checkAll = checkedCount === e.RightList.length;
              e.isIndeterminate =
                checkedCount > 0 && checkedCount < e.RightList.length;
              return e.MenuId;
            });
            this.setMenuIdList = this.setMenuIdList.concat(temp);
          });
          this.menuList = res;
          this.activeNames = this.menuList.map(e => {
            return e.MenuId;
          });
        });
      });
    }
  },
  created() {
    this.roleId = this.$route.query.roleId;
    this.menuFatherId = this.$route.params.id;
    this._getRoleRightList().then(val => {
      this._getMenuList(this.menuFatherId).then(res => {
        res.forEach(item => {
          var temp = item.Children.map(e => {
            var tempArr = e.RightList.filter(x => {
              return this.checkedRight.indexOf(x.RightId) > -1;
            });
            let checkedCount = tempArr.length;
            e.checkAll = checkedCount === e.RightList.length;
            e.isIndeterminate =
              checkedCount > 0 && checkedCount < e.RightList.length;
            return e.MenuId;
          });
          this.setMenuIdList = this.setMenuIdList.concat(temp);
        });
        this.menuList = res;
        this.activeNames = this.menuList.map(e => {
          return e.MenuId;
        });
      });
    });
  },
  methods: {
    handleCheckAllChange(value, item) {
      item.RightList.forEach(x => {
        if (value) {
          if (this.checkedRight.indexOf(x.RightId) == -1) {
            this.checkedRight.push(x.RightId);
          }
        } else {
          var index = this.checkedRight.indexOf(x.RightId);
          if (index > -1) {
            this.checkedRight.splice(index, 1);
          }
        }
      });
      item.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value, item) {
      var tempArr = item.RightList.filter(x => {
        return value.indexOf(x.RightId) > -1;
      });
      let checkedCount = tempArr.length;
      item.checkAll = checkedCount === item.RightList.length;
      item.isIndeterminate =
        checkedCount > 0 && checkedCount < item.RightList.length;
    },
    rightSave() {
      this._setRoleRight().then(val => {
        this.$message({
          type: "success",
          message: "权限设置成功",
          showClose: "true"
        });
      });
    },
    //获取菜单列表
    _getMenuList(fatherMenuId) {
      var par = {
        FatherMenuId: fatherMenuId,
        Type: 1
      };
      return GetMenuList(par);
    },
    //获取角色权限
    _getRoleRightList() {
      var par = {
        Id: this.roleId
      };
      return GetRoleRightList(par,43).then(res => {
        this.checkedRight = res;
      });
    },
    //设置角色权限
    _setRoleRight() {
      var par = {
        RoleId: this.roleId,
        MenuIdList: this.setMenuIdList,
        RightIdList: this.checkedRight
      };
      return SetRoleRight(par,43);
    }
  }
};
</script>

<style scoped lang='less'>
.checkstyle {
  margin-left: 24px;
  margin-bottom: 20px;
  margin-top: 5px;
}
.save {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  margin-top: 20px;
}
</style>
