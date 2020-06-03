import fetch from 'common/js/request'

// 获取提现列表 
export function GetCashRecordList(params,rightId) {
  return fetch('/adminrocket/finance/cash/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改提现状态 
export function ModifyCashStatus(params,rightId) {
  return fetch('/adminrocket/finance/cash/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 提现确认打款 
export function CashPayment(params,rightId) {
  return fetch('/adminrocket/finance/cash/payment', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取打款记录列表 
export function GetPaymentRecordList(params,rightId) {
  return fetch('/adminrocket/finance/payment/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取返现记录列表 
export function GetCashBackRecordList(params,rightId) {
  return fetch('/adminrocket/finance/cashback/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取订单退款记录列表 
export function GetOrderRefundRecordList(params,rightId) {
  return fetch('/adminrocket/finance/refund/record/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取订单列表 
export function GetOrderList(params,rightId) {
  return fetch('/adminrocket/finance/order/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取订单退款详情 
export function GetOrderRefundDetails(params,rightId) {
  return fetch('/adminrocket/finance/order/refund/details', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改退款状态 
export function ModifyRefundStatus(params,rightId) {
  return fetch('/adminrocket/finance/refund/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取商家门店充值记录列表
export function GetRechargeRecordList(params,rightId) {
  return fetch('/adminrocket/finance/store/recharge/record/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取商家门店充值退款记录列表
export function GetRefundRecordList(params,rightId) {
  return fetch('/adminrocket/finance/store/recharge/refund/record/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 商家门店充值拒绝退款
export function RefundReject(params,rightId) {
  return fetch('/adminrocket/finance/store/recharge/refund/reject', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}
// 商家门店充值同意退款
export function RefundAgree(params,rightId) {
  return fetch('/adminrocket/finance/store/recharge/refund/agree', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}