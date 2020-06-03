import fetch from 'common/js/request'

// 获取弹窗列表
export function popList(params,rightId) {
  return fetch('/adminrocket/pop/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//创建弹窗
export function popAdd(params,rightId) {
  return fetch('/adminrocket/pop/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//删除弹窗
export function popDelete(params,rightId) {
  return fetch('/adminrocket/pop/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改弹窗状态
export function popStatusModify(params,rightId) {
  return fetch('/adminrocket/pop/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改弹窗排序值
export function popOrderindexModify(params,rightId) {
  return fetch('/adminrocket/pop/orderindex/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改弹窗名称
export function popNameModify(params,rightId) {
  return fetch('/adminrocket/pop/name/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改弹窗分组标识
export function popGrouptokenModify(params,rightId) {
  return fetch('/adminrocket/pop/grouptoken/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改弹窗点击行为
export function popActionModify(params,rightId) {
  return fetch('/adminrocket/pop/action/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改弹窗定时关闭
export function popClosetimenModify(params,rightId) {
  return fetch('/adminrocket/pop/closetime/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改弹窗展示图片
export function popShowimgModify(params,rightId) {
  return fetch('/adminrocket/pop/showimg/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改弹窗规则
export function popRuleModify(params,rightId) {
  return fetch('/adminrocket/pop/rule/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取任务模板api列表
export function popTaskTemplateApiList(params,rightId) {
  return fetch('/adminrocket/pop/task/template/api/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//添加任务模板api
export function popTaskTemplateApiAdd(params,rightId) {
  return fetch('/adminrocket/pop/task/template/api/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改任务模板api
export function popTaskTemplateApiModify(params,rightId) {
  return fetch('/adminrocket/pop/task/template/api/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//删除任务模板api
export function popTaskTemplateApiDelete(params,rightId) {
  return fetch('/adminrocket/pop/task/template/api/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改任务模板api状态
export function popTaskTemplateApiStatusModify(params,rightId) {
  return fetch('/adminrocket/pop/task/template/api/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取可添加api列表
export function popApiList(params,rightId) {
  return fetch('/adminrocket/pop/api/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取任务列表
export function popTaskList(params,rightId) {
  return fetch('/adminrocket/pop/task/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//创建任务
export function AddPopTask(params,rightId) {
  return fetch('/adminrocket/pop/task/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//编辑任务
export function ModifyPopTask(params,rightId) {
  return fetch('/adminrocket/pop/task/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//删除任务
export function DeletePopTask(params,rightId) {
  return fetch('/adminrocket/pop/task/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改任务状态
export function ModifyPopTaskStatus(params,rightId) {
  return fetch('/adminrocket/pop/task/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取任务绑定的模板列表
export function GetPopTaskTemplateBindList(params,rightId) {
  return fetch('/adminrocket/pop/task/template/bind/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//绑定任务模板
export function BindPopTaskTemplate(params,rightId) {
  return fetch('/adminrocket/pop/task/template/bind', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//解绑任务模板
export function UnBindPopTaskTemplate(params,rightId) {
  return fetch('/adminrocket/pop/task/template/unbind', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取任务模板列表
export function popTaskTemplateList(params,rightId) {
  return fetch('/adminrocket/pop/task/template/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//编辑任务模板状态
export function popTaskTemplateStatusModify(params,rightId) {
  return fetch('/adminrocket/pop/task/template/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//添加任务模板
export function popTaskTemplateAdd(params,rightId) {
  return fetch('/adminrocket/pop/task/template/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//编辑任务模板
export function popTaskTemplateModify(params,rightId) {
  return fetch('/adminrocket/pop/task/template/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//删除任务模板
export function popTaskTemplateDelete(params,rightId) {
  return fetch('/adminrocket/pop/task/template/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取奖励记录列表
export function popTaskAccountRelList(params,rightId) {
  return fetch('/adminrocket/pop/task/account/rel/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取任务模板卡券奖励列表
export function GetPopTaskTemplateTicketList(params,rightId) {
  return fetch('/adminrocket/pop/task/template/ticket/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//删除任务模板奖励卡券
export function DeletePopTaskTemplateTicket(params,rightId) {
  return fetch('/adminrocket/pop/task/template/ticket/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//添加任务模板奖励卡券
export function AddPopTaskTemplateTicket(params,rightId) {
  return fetch('/adminrocket/pop/task/template/ticket/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取小程序客服设置列表
export function GetPopServiceSetList(params,rightId) {
  return fetch('/adminrocket/pop/service/set/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//添加小程序客服设置
export function AddPopServiceSet(params,rightId) {
  return fetch('/adminrocket/pop/service/set/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//编辑小程序客服设置
export function ModifyPopServiceSet(params,rightId) {
  return fetch('/adminrocket/pop/service/set/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//删除小程序客服设置
export function DeletePopServiceSet(params,rightId) {
  return fetch('/adminrocket/pop/service/set/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//编辑任务临时补贴点数奖励
export function ModifyPopTaskTemplateTempRate(params,rightId) {
  return fetch('/adminrocket/pop/task/template/temprate/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取兑换码列表
export function GetExchangeCodeList(params,rightId) {
  return fetch('/adminrocket/pop/exchangecode/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//添加兑换码
export function AddExchangeCode(params,rightId) {
  return fetch('/adminrocket/pop/exchangecode/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//编辑兑换码
export function ModifyExchangeCode(params,rightId) {
  return fetch('/adminrocket/pop/exchangecode/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//删除兑换码
export function DeleteExchangeCode(params,rightId) {
  return fetch('/adminrocket/pop/exchangecode/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改兑换码状态
export function ModifyExchangeCodeStatus(params,rightId) {
  return fetch('/adminrocket/pop/exchangecode/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//修改兑换码领取状态
export function ModifyExchangeCodeReviceStatus(params,rightId) {
  return fetch('/adminrocket/pop/exchangecode/revicestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//获取兑换记录
export function GetExchangeRecordList(params,rightId) {
  return fetch('/adminrocket/pop/exchangecode/record/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}
