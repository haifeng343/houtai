import fetch from 'common/js/request'

// 获取客服微信列表
export function wechatList(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/list', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 添加客服微信号
  export function wechatAdd(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/add', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 修改客服微信号
  export function wechatModify(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/modify', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 删除客服微信号
  export function wechatDelete(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/delete', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 修改客服微信号状态
  export function wechatStatusModify(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/status/modify', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 修改客服微信号是否当前使用
  export function wechatCurrentModify(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/current/modify', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
 
  
  // 获取客服相关内容
  export function wechatContentList(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/content/list', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 添加客服相关内容
  export function wechatContentAdd(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/content/add', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 修改客服相关内容
  export function wechatContentModify(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/content/modify', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 删除客服相关内容
  export function wechatContentDelete(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/content/delete', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }
  
  // 修改客服相关内容状态
  export function wechatContenStatusModify(params,rightId) {
    return fetch('/adminrocket/customerservice/wechat/content/status/modify', 'post', params,rightId).then(res => {
      return Promise.resolve(res)
    })
  }