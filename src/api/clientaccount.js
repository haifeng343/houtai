import fetch from 'common/js/request'

// 获取前端用户列表 
export function GetClientAccountList(params,rightId) {
  return fetch('/adminrocket/client/account/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改前端用户状态 
export function ModifyClientAccountStatus(params,rightId) {
  return fetch('/adminrocket/client/account/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改前端用户是否支持验券奖励状态 
export function ModifyClientAccountPrizeStatus(params,rightId) {
  return fetch('/adminrocket/client/account/prize/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改前端用户是否支持推荐验券奖励状态 
export function ModifyClientAccountReferPrizeStatus(params,rightId) {
  return fetch('/adminrocket/client/account/referprize/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改前端用户是否支持商家端用户验券奖励状态 
export function ModifyClientAccountSellerPrizeStatus(params,rightId) {
  return fetch('/adminrocket/client/account/sellerprize/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取用户钱包变更记录 
export function GetClientAccountWalletChangeList(params,rightId) {
  return fetch('/adminrocket/client/wallet/change/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取用户注册记录 
export function GetClientAccountRegisterList(params,rightId) {
  return fetch('/adminrocket/client/register/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改前端用户是否有显示数据统计菜单权限 
export function ModifyClientAccountSalesmanStatus(params,rightId) {
  return fetch('/adminrocket/client/account/salesman/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取用户购物车数据 
export function GetClientAccountCartList(params,rightId) {
  return fetch('/adminrocket/client/account/cart/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除用户购物车数据 
export function DeleteClientAccountCart(params,rightId) {
  return fetch('/adminrocket/client/account/cart/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取用户购物车课程数据 
export function GetClientAccountCartItemList(params,rightId) {
  return fetch('/adminrocket/client/account/cart/item/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 根据邀请码获取前端用户列表 
export function GetClientAccountByRecommandCode(params,rightId) {
  return fetch('/adminrocket/client/account/byrecommandcode', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}