<template>
  <div class="thisContainer">
    <div class="thisTitle">
      <span style="margin-left:40px;margin-top:50%;">兑换码：{{detailsInfo.CodeNumber}}}</span>
      <span style="margin-left:70px;">兑换时间：{{detailsInfo.UseTime}}</span>
    </div>
    <div class="thisContent">
      <div class="cardItem" v-for="item in detailsInfo.TicketList" :key="item.Id">
        <div class="itemImg">
          <el-image style="width:100%;height:100%" :src="item.CardIconUrl" fit="fill"></el-image>
        </div>
        <div class="itemContent">
          <div>{{item.CardName}}({{item.CardType==3?"代金券":item.CardType==4?"补贴券":"其他"}})</div>
          <div>券码：{{item.QrCode}}</div>
          <div>有效期至：{{item.EndTime}}</div>
        </div>
      </div>
      <div class="cardItem" v-for="item in detailsInfo.TaskList" :key="item.Id">
        <div class="itemImg">
          <el-image style="width:100%;height:100%" :src="item.TaskIconShow" fit="fill"></el-image>
        </div>
        <div class="itemContent">
          <div>{{item.TaskName}}(现金券)</div>
          <div>有效期：{{item.TaskStartTime}}-{{item.TaskEndTime}}</div>
          <div>
            <span style="margin-right:5px">奖励现金：￥{{item.PrizeAmountNow*1.0/100}}</span>
            <span style="margin-right:5px">奖励积分：{{item.PrizeScoreNow}}</span>
            <span style="margin-right:5px">任务现金：{{item.PrizeAmountFinish*1.0/100}}</span>
            <span style="margin-right:5px">任务积分：{{item.PrizeScoreFinish}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GetExchangeRecordList } from "api/pop.js";
export default {
  data() {
    return {
      codeNumber: "",
      detailsInfo: {}
    };
  },
  created() {
    this.codeNumber = this.$route.params.id;
    this._getExchangeRecordList();
  },
  methods: {
    //获取兑换记录
    _getExchangeRecordList() {
      var par = {
        CodeNumber: this.codeNumber
      };
      return GetExchangeRecordList(par).then(res => {
        this.detailsInfo = res;
      });
    }
  }
};
</script>

<style scoped lang='less'>
.thisContainer {
  height: auto;
  width: 100%;
  border: 1px solid #d2d2d2;
}
.thisTitle {
  background: #efefef;
  height: 35px;
  width: 100%;
  color: #828282;
  line-height: 35px;
}
.thisContent {
  height: auto;
  width: 100%;
  padding: 30px 20px;
  display: flex;
  flex-wrap: wrap;
}
.cardItem {
  border: 2px solid #f2f2f2;
  width: 330px;
  height: 100px;
  padding: 30px 20px;
  margin-right: 79px;
  display: flex;
  margin-bottom: 30px;
}
.cardItem :last-child {
  margin-right: 0px;
}
.itemImg {
  width: 25%;
  height: 100%;
}
.itemContent {
  width: 75%;
  height: auto;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 0 10px;
}
</style>
