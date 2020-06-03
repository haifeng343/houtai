import fetch from 'common/js/request'

// 获取用户卡券列表
export function GetAccountTicketList(params,rightId) {
  return fetch('/adminrocket/cardticket/account/rel/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 新增用户卡券
export function AddAccountTicket(params,rightId) {
  return fetch('/adminrocket/cardticket/account/rel/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑用户卡券
export function ModifyAccountTicket(params,rightId) {
  return fetch('/adminrocket/cardticket/account/rel/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改用户卡券状态
export function ModifyAccountTicketStatus(params,rightId) {
  return fetch('/adminrocket/cardticket/account/rel/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除用户卡券
export function DeleteAccountTicket(params,rightId) {
  return fetch('/adminrocket/cardticket/account/rel/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取卡券模板列表
export function GetTicketTemplateList(params,rightId) {
  return fetch('/adminrocket/cardticket/template/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 新增卡券模板
export function AddTicketTemplate(params,rightId) {
  return fetch('/adminrocket/cardticket/template/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑卡券模板
export function ModifyTicketTemplate(params,rightId) {
  return fetch('/adminrocket/cardticket/template/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改卡券模板状态
export function ModifyTicketTemplateStatus(params,rightId) {
  return fetch('/adminrocket/cardticket/template/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除卡券模板
export function DeleteTicketTemplate(params,rightId) {
  return fetch('/adminrocket/cardticket/template/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取卡券面值列表
export function GetTicketValueList(params,rightId) {
  return fetch('/adminrocket/cardticket/value/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 新增卡券面值
export function AddTicketValue(params,rightId) {
  return fetch('/adminrocket/cardticket/value/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑卡券面值
export function ModifyTicketValue(params,rightId) {
  return fetch('/adminrocket/cardticket/value/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改卡券面值状态
export function ModifyTicketValueStatus(params,rightId) {
  return fetch('/adminrocket/cardticket/value/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除卡券面值
export function DeleteTicketValue(params,rightId) {
  return fetch('/adminrocket/cardticket/value/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取卡券类型列表
export function GetTicketTypeList(params,rightId) {
  return fetch('/adminrocket/cardticket/type/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 新增卡券类型
export function AddTicketType(params,rightId) {
  return fetch('/adminrocket/cardticket/type/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑卡券类型
export function ModifyTicketType(params,rightId) {
  return fetch('/adminrocket/cardticket/type/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改卡券类型状态
export function ModifyTicketTypeStatus(params,rightId) {
  return fetch('/adminrocket/cardticket/type/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除卡券类型
export function DeleteTicketType(params,rightId) {
  return fetch('/adminrocket/cardticket/type/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}