import fetch from 'common/js/request'

// 获取活动组列表
export function activitygroupList(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加活动组
export function activitygroupAdd(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑活动组
export function activitygroupModify(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除活动组
export function activitygroupDeleted(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取商圈列表
export function tradingareaList(params,rightId) {
  return fetch('/adminrocket/tradingarea/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改活动组状态
export function activitygroupStatusModify(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取活动组参与门店列表
export function activitygroupStoreList(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/store/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取活动组参与门店详情
export function activitygroupStoreInfo(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/store/details', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加活动组参与门店
export function activitygroupStoreAdd(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/store/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑活动组参与门店
export function activitygroupStoreModify(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/store/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取团单列表
export function sheetList(params,rightId) {
  return fetch('/adminrocket/sheet/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单
export function sheetAdd(params,rightId) {
  return fetch('/adminrocket/sheet/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑团单
export function sheetModify(params,rightId) {
  return fetch('/adminrocket/sheet/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单状态
export function sheetStatusModify(params,rightId) {
  return fetch('/adminrocket/sheet/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单
export function sheetDelete(params,rightId) {
  return fetch('/adminrocket/sheet/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店列表信息
export function sellerStoreList(params,rightId) {
  return fetch('/adminrocket/seller/store/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取项目列表信息
export function sellerItemList(params,rightId) {
  return fetch('/adminrocket/seller/item/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除活动组参与门店
export function DeleteActivityGroupStore(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/store/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取购买须知模板
export function activitygroupBuynotesList(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/buynotes/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取团单额外信息列表
export function extraList(params,rightId) {
  return fetch('/adminrocket/sheet/extra/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单额外信息
export function extraAdd(params,rightId) {
  return fetch('/adminrocket/sheet/extra/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑团单额外信息
export function extraModify(params,rightId) {
  return fetch('/adminrocket/sheet/extra/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单额外信息状态
export function extraStatusModify(params,rightId) {
  return fetch('/adminrocket/sheet/extra/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单额外信息
export function extraDelete(params,rightId) {
  return fetch('/adminrocket/sheet/extra/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}


// 获取标签列表
export function tagList(params,rightId) {
  return fetch('/adminrocket/tag/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取团单分组列表
export function GetSheetItemGroupList(params,rightId) {
  return fetch('/adminrocket/sheet/item/group/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取团单基础价格列表
export function GetSheetNormalPriceList(params,rightId) {
  return fetch('/adminrocket/sheet/normal/price/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取团单特殊价格列表
export function GetSheetSpecialPriceList(params,rightId) {
  return fetch('/adminrocket/sheet/special/price/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取团单退款规则列表
export function GetSheetRefundRulesList(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取团单奖励规则列表
export function GetSheetPrizeRulesList(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单项目分组
export function AddSheetItemGroup(params,rightId) {
  return fetch('/adminrocket/sheet/item/group/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑团单项目分组
export function ModifySheetItemGroup(params,rightId) {
  return fetch('/adminrocket/sheet/item/group/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单项目分组
export function DeleteSheetItemGroup(params,rightId) {
  return fetch('/adminrocket/sheet/item/group/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单基础价格
export function AddSheetNormalPrice(params,rightId) {
  return fetch('/adminrocket/sheet/normal/price/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑团单基础价格
export function ModifySheetNormalPrice(params,rightId) {
  return fetch('/adminrocket/sheet/normal/price/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单基础价格
export function DeleteSheetNormalPrice(params,rightId) {
  return fetch('/adminrocket/sheet/normal/price/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单基础价格状态
export function ModifySheetNormalPriceStatus(params,rightId) {
  return fetch('/adminrocket/sheet/normal/price/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单特殊价格
export function AddSheetSpecialPrice(params,rightId) {
  return fetch('/adminrocket/sheet/special/price/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑团单特殊价格
export function ModifySheetSpecialPrice(params,rightId) {
  return fetch('/adminrocket/sheet/special/price/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单特殊价格
export function DeleteSheetSpecialPrice(params,rightId) {
  return fetch('/adminrocket/sheet/special/price/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单特殊价格状态
export function ModifySheetSpecialPriceStatus(params,rightId) {
  return fetch('/adminrocket/sheet/special/price/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单退款规则
export function AddSheetRefundRules(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑团单退款规则
export function ModifySheetRefundRules(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单退款规则
export function DeleteSheetRefundRules(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单退款规则状态
export function ModifySheetRefundRulesStatus(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单奖励规则
export function AddSheetPrizeRules(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑团单奖励规则
export function ModifySheetPrizeRules(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单奖励规则
export function DeleteSheetPrizeRules(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单奖励规则状态
export function ModifySheetPrizeRulesStatus(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//  获取团单退款规则详情—普通列表
export function GetSheetRefundRulesDetailsNormalList(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/normal/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单退款规则详情—普通
export function AddSheetRefundRulesDetailsNormal(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/normal/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单退款规则详情—普通状态
export function ModifySheetRefundRulesDetailsNormalStatus(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/normal/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//  编辑团单退款规则详情—普通
export function ModifySheetRefundRulesDetailsNormal(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/normal/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单退款规则详情—普通
export function DeleteSheetRefundRulesDetailsNormal(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/normal/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//  获取团单退款规则详情—特殊列表
export function GetSheetRefundRulesDetailsSpecialList(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/special/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单退款规则详情—特殊
export function AddSheetRefundRulesDetailsSpecial(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/special/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单退款规则详情—特殊状态
export function ModifySheetRefundRulesDetailsSpecialStatus(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/special/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//  编辑团单退款规则详情—特殊
export function ModifySheetRefundRulesDetailsSpecial(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/special/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单退款规则详情—特殊
export function DeleteSheetRefundRulesDetailsSpecial(params,rightId) {
  return fetch('/adminrocket/sheet/refund/rules/details/special/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//  获取团单奖励规则详情—普通列表
export function GetSheetPrizeRulesDetailsNormalList(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/normal/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单奖励规则详情—普通
export function AddSheetPrizeRulesDetailsNormal(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/normal/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单奖励规则详情—普通状态
export function ModifySheetPrizeRulesDetailsNormalStatus(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/normal/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//  编辑团单奖励规则详情—普通
export function ModifySheetPrizeRulesDetailsNormal(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/normal/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单奖励规则详情—普通
export function DeleteSheetPrizeRulesDetailsNormal(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/normal/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//  获取团单奖励规则详情—特殊列表
export function GetSheetPrizeRulesDetailsSpecialList(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/special/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单奖励规则详情—特殊
export function AddSheetPrizeRulesDetailsSpecial(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/special/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单奖励规则详情—特殊状态
export function ModifySheetPrizeRulesDetailsSpecialStatus(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/special/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

//  编辑团单奖励规则详情—特殊
export function ModifySheetPrizeRulesDetailsSpecial(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/special/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单奖励规则详情—特殊
export function DeleteSheetPrizeRulesDetailsSpecial(params,rightId) {
  return fetch('/adminrocket/sheet/prize/rules/details/special/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取团单图片列表信息
export function GetSheetImgList(params,rightId) {
  return fetch('/adminrocket/sheet/img/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加团单图片
export function AddSheetImg(params,rightId) {
  return fetch('/adminrocket/sheet/img/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单图片状态
export function ModifySheetImgStatus(params,rightId) {
  return fetch('/adminrocket/sheet/img/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单图片审核状态
export function ModifySheetImgExamineStatus(params,rightId) {
  return fetch('/adminrocket/sheet/img/examinestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除团单图片
export function DeleteSheetImg(params,rightId) {
  return fetch('/adminrocket/sheet/img/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 团单下架
export function SheetLower(params,rightId) {
  return fetch('/adminrocket/sheet/lower', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 团单上架
export function SheetUpper(params,rightId) {
  return fetch('/adminrocket/sheet/upper', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 复制团单价格信息
export function CopySheetPrice(params,rightId) {
  return fetch('/adminrocket/sheet/price/copy', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 团单验券奖励特殊价格初始化
export function PrizeSpecialPriceInit(params,rightId) {
  return fetch('/adminrocket/sheet/prize/special/price/init', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 设置剩余招生人数
export function SetActivityGroupStoreRemainCount(params,rightId) {
  return fetch('/adminrocket/sheet/activitygroup/store/remaincount/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改团单访问量
export function ModifySheetVisit(params,rightId) {
  return fetch('/adminrocket/sheet/visit/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}















