<template>
  <div>
    <div>
      <el-table :data="ItemListTable" border ref="multipleTable">
        <el-table-column prop="Id" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="StoreName" align="center" label="门店名称">
          <template slot-scope="scope">
            <el-button type="text" @click="jumpToStoreDetails(scope.row)">{{scope.row.StoreName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ItemName" align="center" label="课程名称"></el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="sellerListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { GetSellerTeacherItemList } from "api/seller.js";
export default {
  name: "ItemListDialog",
  data() {
    return {
      teacherId: 0, //商家Id
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      ItemListTable: [] //项目列表
    };
  },
  created() {
    this.teacherId = this.$route.params.id;
    this._getSellerTeacherItemList();
  },

  watch: {
    $route(newValue, oldValue) {
      this.teacherId = this.$route.params.id;
      this._getSellerTeacherItemList();
    }
  },
  methods: {
    //跳转到门店详情
    jumpToStoreDetails(item) {
      this.$router.push({
        path: `/StoreDetails/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    //项目列表分页变化
    sellerListCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerTeacherItemList();
    },
    //获取项目列表信息
    _getSellerTeacherItemList() {
      var par = {
        Id: this.teacherId,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetSellerTeacherItemList(par,210).then(res => {
        this.pageTotalCount = res.TotalCount;
        this.ItemListTable = res.List;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
