import fetch from 'common/js/request'

// 获取系统参数列表
export function GetSystemParamList(params,rightId) {
  return fetch('/adminrocket/param/system/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑系统参数
export function ModifySystemParam(params,rightId) {
  return fetch('/adminrocket/param/system/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取分享参数列表
export function GetShareParamList(params,rightId) {
  return fetch('/adminrocket/param/share/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 新增分享参数
export function AddShareParam(params,rightId) {
  return fetch('/adminrocket/param/share/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑分享参数
export function EditShareParam(params,rightId) {
  return fetch('/adminrocket/param/share/edit', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除分享参数
export function DeleteShareParam(params,rightId) {
  return fetch('/adminrocket/param/share/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改分享参数状态
export function ModifyShareParamStatus(params,rightId) {
  return fetch('/adminrocket/param/share/status/edit', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}