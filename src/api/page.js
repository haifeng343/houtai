import fetch from 'common/js/request'

//获取显示页面内容
export function GetPageDeployInfo(params,rightId) {
  return fetch('/adminrocket/page/info', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//设置页面内容
export function SetPageDeploy(params,rightId) {
  return fetch('/adminrocket/page/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取前端展示课程类型页面内容
export function GetItemTypeShowList(params,rightId) {
  return fetch('/adminrocket/page/itemtype', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//上传前端展示课程类型图标
export function UploadItemTypeIcon(params,rightId) {
  return fetch('/adminrocket/page/itemtype/icon/upload', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改前端展示课程类型排序值
export function ModifyItemTypeShowIndex(params,rightId) {
  return fetch('/adminrocket/page/itemtype/showindex/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改前端展示课程类型状态
export function ModifyItemTypeShowStatus(params,rightId) {
  return fetch('/adminrocket/page/itemtype/showstatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取客服页面数据列表
export function customerserviceList(params,rightId) {
  return fetch('/adminrocket/page/customerservice/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//添加客服页面数据
export function customerserviceAdd(params,rightId) {
  return fetch('/adminrocket/page/customerservice/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//编辑客服页面数据
export function customerserviceModify(params,rightId) {
  return fetch('/adminrocket/page/customerservice/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改客服页面数据状态
export function customerserviceStatusModify(params,rightId) {
  return fetch('/adminrocket/page/customerservice/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改客服页面是否可以移动
export function customerserviceIsmoveModify(params,rightId) {
  return fetch('/adminrocket/page/customerservice/ismove/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//删除客服页面数据
export function customerserviceDelete(params,rightId) {
  return fetch('/adminrocket/page/customerservice/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}
