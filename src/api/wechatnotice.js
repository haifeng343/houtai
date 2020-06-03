import fetch from 'common/js/request'

// 获取微信通知服务设置列表
export function wechatnoticeSettingList(params,rightId) {
  return fetch('/adminrocket/wechatnotice/setting/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑微信通知服务设置
export function wechatnoticeSettingModify(params,rightId) {
  return fetch('/adminrocket/wechatnotice/setting/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取微信通知列表
export function wechatnoticeList(params,rightId) {
  return fetch('/adminrocket/wechatnotice/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取微信预约通知列表
export function wechatnoticeSubscribeList(params,rightId) {
  return fetch('/adminrocket/wechatnotice/subscribe/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加微信预约通知
export function wechatnoticeSubscribeAdd(params,rightId) {
  return fetch('/adminrocket/wechatnotice/subscribe/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除微信预约通知
export function wechatnoticeSubscribeDelete(params,rightId) {
  return fetch('/adminrocket/wechatnotice/subscribe/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}
