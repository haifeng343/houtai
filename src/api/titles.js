import fetch from 'common/js/request'

// 添加教师职称
export function AddTitles(params,rightId) {
  return fetch('/adminrocket/teachertitles/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取教师职称列表
export function GetTitlesList(params,rightId) {
  return fetch('/adminrocket/teachertitles/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑教师职称
export function ModifyTitles(params,rightId) {
  return fetch('/adminrocket/teachertitles/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改教师职称状态
export function ModifyTitlesStatus(params,rightId) {
  return fetch('/adminrocket/teachertitles/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除教师职称
export function DeleteTitles(params,rightId) {
  return fetch('/adminrocket/teachertitles/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}
