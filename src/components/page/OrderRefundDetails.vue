<template>
  <div>
    <div class="refundFrame">
      <div class="refundTitle">
        退款确认
        <div class="refundButton">
          <el-button type="primary" @click="tongyi()">同意退款</el-button>
          <el-button @click="jujue()">拒绝退款</el-button>
        </div>
      </div>
      <div>
        <span class="mg50">订单编号：{{refundDetails.OrderSn}}</span>
        <span class="mg50">创建时间：{{refundDetails.OrderCreateTime}}</span>
        <span class="mg50">支付时间：{{refundDetails.OrderPayTime}}</span>
      </div>
      <div class="cell_dashed1"></div>
      <span class="mg50 content_text">
        退回到： 微信
        <img :src="refundDetails.HeadUrl" style="width:50px;height:50px;margin-top:2px;" />
        <label>{{refundDetails.AccountName}}(</label>
        <label>{{refundDetails.AccountMobile}})</label>
      </span>
      <span class="mg50">退款金额(元)：{{refundDetails.RefundAmount*1.0/100}}</span>
      <span class="mg50">申请退款时间：{{refundDetails.ApplyRefundTime}}</span>
      <div class="cell_dashed1"></div>
      <div>
        <span class="mg50">团单名称:{{refundDetails.SheetName}}</span>
        <span class="mg50">购买类型：{{refundDetails.BuyType==1?"团购":""}}</span>
        <span class="mg50">券码：{{refundDetails.TicketNumber}}</span>
      </div>
    </div>
    <div class="cell_dashed8"></div>
    <div class="refundFrame">
      <div class="refundTitle">退款原因</div>
      <el-form label-width="85px">
        <el-form-item label="退款原因：">{{refundDetails.RefundReason}}</el-form-item>
        <el-form-item label="凭证：">
          <el-image
            :src="item"
            style="margin-right:30px;margin-bottom:20px;width:200px;height:200px;object-fit:cover"
            v-for="item in refundDetails.RefundImg"
            :key="item"
          ></el-image>
        </el-form-item>
      </el-form>
    </div>
    <!-- 拒绝退款 -->
    <el-dialog title="确定拒绝此笔退款码？" :visible.sync="juJueVisible" width="633px">
      <el-form label-width="85px" ref="juJueForm" :model="juJueForm">
        <el-form-item label="备注：">
          <el-input type="textarea" :rows="6" v-model="juJueForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="juJueVisible = false" size="medium">取 消</el-button>
        <el-button @click="jujueOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 同意退款 -->
    <el-dialog title="确定同意此笔退款码？" :visible.sync="tongYiVisible" width="633px">
      <el-form label-width="85px" ref="tongYiForm" :model="tongYiForm">
        <el-form-item label="备注：">
          <el-input type="textarea" :rows="6" v-model="tongYiForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tongYiVisible = false" size="medium">取 消</el-button>
        <el-button @click="tongyiOk()" type="primary" size="medium">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { GetOrderRefundDetails, ModifyRefundStatus } from "api/finance.js";
export default {
  name: "OrderRefundDetails",
  data() {
    return {
      orderId: "",
      refundDetails: {}, //退款详情
      juJueVisible: false,
      juJueForm: {
        remark: ""
      },
      tongYiVisible: false,
      tongYiForm: {
        remark: ""
      }
    };
  },
  created() {
    this.orderId = this.$route.params.id;
    this._getOrderRefundDetails();
  },
  watch: {
    $route(newValue, oldValue) {
      this.orderId = this.$route.params.id;
      this._getOrderRefundDetails();
    }
  },
  methods: {
    jujue() {
      this.juJueForm.remark = "";
      this.juJueVisible = true;
    },
    jujueOk() {
      this._modifyRefundStatus(1).then(val => {
        this.juJueVisible = false;
      });
    },
    tongyi() {
      this.tongYiForm.remark = "";
      this.tongYiVisible = true;
    },
    tongyiOk() {
      this._modifyRefundStatus(2).then(val => {
        this.tongYiVisible = false;
      });
    },
    //获取退款详情
    _getOrderRefundDetails() {
      var par = {
        Id: this.orderId
      };
      return GetOrderRefundDetails(par,10).then(res => {
        this.refundDetails = res;
      });
    },
    //修改退款状态
    _modifyRefundStatus(status) {
      var par = {
        Id: this.refundDetails.RefundId,
        Status: status,
        StatusDes: status == 1 ? this.juJueForm.remark : this.tongYiForm.remark
      };
      return ModifyRefundStatus(par,10);
    }
  }
};
</script>

<style scoped lang='less'>
.refundFrame {
  margin: auto 50px;
}
.refundTitle {
  margin-bottom: 20px;
}
.refundButton {
  float: right;
}
.mg50 {
  margin-right: 50px;
  margin-bottom: 20px;
}
.content_text {
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
}
.content_text img {
  border-radius: 50%;
}
.cell_dashed1 {
  height: 10px;
  border-bottom: 1px solid #ccc;
  overflow: hidden;
  opacity: 0.2;
  margin-bottom: 20px;
}
.cell_dashed8 {
  height: 10px;
  border-bottom: 8px solid #ccc;
  overflow: hidden;
  opacity: 0.2;
  margin-bottom: 30px;
  margin-top: 30px;
}
</style>
