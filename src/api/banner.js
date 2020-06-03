import fetch from 'common/js/request'

// 获取banner列表
export function GetBannerList(params,rightId) {
  return fetch('/adminrocket/banner/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加banner
export function AddBanner(params,rightId) {
  return fetch('/adminrocket/banner/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑banner
export function ModifyBanner(params,rightId) {
  return fetch('/adminrocket/banner/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改辑banner状态
export function ModifyBannerStatus(params,rightId) {
  return fetch('/adminrocket/banner/modify/status', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除banner
export function DeleteBanner(params,rightId) {
  return fetch('/adminrocket/banner/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取banner Code列表
export function GetBannerCodeList(params,rightId) {
  return fetch('/adminrocket/banner/code/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取页面配置内容
export function GetPageContent(params,rightId) {
  return fetch('/adminrocket/banner/pagecontent', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 设置页面配置内容
export function SetPageContent(params,rightId) {
  return fetch('/adminrocket/banner/pagecontent/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}