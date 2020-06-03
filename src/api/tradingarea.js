import fetch from 'common/js/request'

// 添加商圈
export function AddTradingArea(params,rightId) {
  return fetch('/adminrocket/tradingarea/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取商圈列表
export function GetTradingAreaList(params,rightId) {
  return fetch('/adminrocket/tradingarea/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑商圈
export function ModifyTradingArea(params,rightId) {
  return fetch('/adminrocket/tradingarea/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改商圈状态
export function ModifyTradingAreaStatus(params,rightId) {
  return fetch('/adminrocket/tradingarea/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除商圈
export function DeleteTradingArea(params,rightId) {
  return fetch('/adminrocket/tradingarea/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}