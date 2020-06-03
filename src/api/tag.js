import fetch from 'common/js/request'

// 添加标签
export function AddTag(params,rightId) {
  return fetch('/adminrocket/tag/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取标签列表
export function GetTagList(params,rightId) {
  return fetch('/adminrocket/tag/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑标签
export function ModifyTag(params,rightId) {
  return fetch('/adminrocket/tag/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改标签状态
export function ModifyTagStatus(params,rightId) {
  return fetch('/adminrocket/tag/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除标签
export function DeleteTag(params,rightId) {
  return fetch('/adminrocket/tag/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}