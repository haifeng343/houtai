<template>
  <div>
    <div>
      <el-table :data="storeListTable" border ref="multipleTable">
        <el-table-column prop="StoreId" align="center" label="ID" fixed></el-table-column>
        <el-table-column prop="StoreName" align="center" label="门店名称">
          <template slot-scope="scope">
            <el-button type="text" @click="jumpToStoreDetails(scope.row)">{{scope.row.StoreName}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="pageTotalCount"
        :page-size="pageSize"
        @current-change="storeListCurrentChange"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { GetSellerStoreList } from "api/seller.js";
export default {
  name: "StoreListDialog",
  data() {
    return {
      teacherId: 0,
      accountId: 0,
      pageTotalCount: 0, //分页总条数
      pageIndex: 1, //分页页码
      pageSize: 20, //分页每页数量
      storeListTable: [], //门店列表
      clickItem: {} //点击某一行数据
    };
  },
  created() {
    var type = this.$route.query.type;
    if (type == 1) {
      this.teacherId = this.$route.params.id;
    } else if (type == 2) {
      this.accountId = this.$route.params.id;
    }
    this._getSellerStoreList();
  },
  watch: {
    $route(newValue, oldValue) {
      var type = this.$route.query.type;
      if (type == 1) {
        this.teacherId = this.$route.params.id;
      } else if (type == 2) {
        this.accountId = this.$route.params.id;
      }
      this._getSellerStoreList();
    }
  },
  methods: {
    //分页页码变化
    storeListCurrentChange(val) {
      this.pageIndex = val;
      this._getSellerStoreList();
    },
    //跳转到门店详情
    jumpToStoreDetails(item) {
      this.$router.push({
        path: `/StoreDetails/${item.StoreId}`,
        query: {
          name: item.StoreName
        }
      });
    },
    //获取门店列表信息
    _getSellerStoreList() {
      var par = {
        SellerId: 0,
        AccountId: this.accountId,
        TeacherId: this.teacherId,
        TradingAreaId: 0,
        PageIndex: this.pageIndex,
        PageCount: this.pageSize
      };
      return GetSellerStoreList(par,190).then(res => {
        this.storeListTable = res.List;
        this.pageTotalCount = res.TotalCount;
      });
    }
  }
};
</script>

<style scoped lang='less'>
</style>
