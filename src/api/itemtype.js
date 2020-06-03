import fetch from 'common/js/request'

// 添加项目类型
export function AddItemType(params,rightId) {
    return fetch('/adminrocket/seller/item/type/add', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 获取项目类型列表
  export function GetItemTypeList(params,rightId) {
    return fetch('/adminrocket/seller/item/type/list', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 编辑项目类型
  export function ModifyItemType(params,rightId) {
    return fetch('/adminrocket/seller/item/type/modify', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 修改项目类型状态
  export function ModifyItemTypeStatus(params,rightId) {
    return fetch('/adminrocket/seller/item/type/status/modify', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 删除项目类型
  export function DeleteItemType(params,rightId) {
    return fetch('/adminrocket/seller/item/type/delete', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }