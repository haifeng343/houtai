import fetch from 'common/js/request'

// 创建商家
export function GetSellerList(params,rightId) {
  return fetch('/adminrocket/seller/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改商家审核状态
export function ModifySellerExamineStatus(params,rightId) {
  return fetch('/adminrocket/seller/examinestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改商家状态
export function ModifySellerStatus(params,rightId) {
  return fetch('/adminrocket/seller/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加商家信息
export function AddSeller(params,rightId) {
  return fetch('/adminrocket/seller/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑商家信息
export function ModifySeller(params,rightId) {
  return fetch('/adminrocket/seller/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除商家信息
export function DeleteSeller(params,rightId) {
  return fetch('/adminrocket/seller/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店列表信息
export function GetSellerStoreList(params,rightId) {
  return fetch('/adminrocket/seller/store/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店品类列表信息
export function GetSellerStoreCategoryList(params,rightId) {
  return fetch('/adminrocket/seller/store/category/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加门店品类
export function AddSellerStoreCategory(params,rightId) {
  return fetch('/adminrocket/seller/store/category/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑门店品类
export function ModifySellerStoreCategory(params,rightId) {
  return fetch('/adminrocket/seller/store/category/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改门店品类状态
export function ModifySellerStoreCategoryStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/category/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除门店品类
export function DeleteSellerStoreCategory(params,rightId) {
  return fetch('/adminrocket/seller/store/category/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取商圈列表
export function GetTradingAreaList(params,rightId) {
  return fetch('/adminrocket/tradingarea/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加门店
export function AddSellerStore(params,rightId) {
  return fetch('/adminrocket/seller/store/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改门店审核状态
export function ModifySellerStoreExamineStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/examinestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店详情
export function GetSellerStoreDetails(params,rightId) {
  return fetch('/adminrocket/seller/store/details', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑门店
export function ModifySellerStore(params,rightId) {
  return fetch('/adminrocket/seller/store/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取项目列表信息
export function GetSellerItemList(params,rightId) {
  return fetch('/adminrocket/seller/item/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取项目类型列表信息
export function GetSellerItemTypeList(params,rightId) {
  return fetch('/adminrocket/seller/item/type/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取标签列表
export function GetTagList(params,rightId) {
  return fetch('/adminrocket/tag/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加项目信息
export function AddSellerItem(params,rightId) {
  return fetch('/adminrocket/seller/item/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改项目审核状态
export function ModifySellerItemExamineStatus(params,rightId) {
  return fetch('/adminrocket/seller/item/examinestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改项目状态
export function ModifySellerItemStatus(params,rightId) {
  return fetch('/adminrocket/seller/item/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑项目信息
export function ModifySellerItem(params,rightId) {
  return fetch('/adminrocket/seller/item/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除项目
export function DeleteSellerItem(params,rightId) {
  return fetch('/adminrocket/seller/item/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加账户信息
export function AddSellerAccount(params,rightId) {
  return fetch('/adminrocket/seller/account/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取账户列表信息
export function GetSellerAccountList(params,rightId) {
  return fetch('/adminrocket/seller/account/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改账户状态
export function ModifySellerAccountStatus(params,rightId) {
  return fetch('/adminrocket/seller/account/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改账户是否管理员状态
export function ModifySellerAccountIsAdministrator(params,rightId) {
  return fetch('/adminrocket/seller/account/administrator/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑账户信息
export function ModifySellerAccount(params,rightId) {
  return fetch('/adminrocket/seller/account/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取师资列表信息
export function GetSellerTeacherList(params,rightId) {
  return fetch('/adminrocket/seller/teacher/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加师资
export function AddSellerTeacher(params,rightId) {
  return fetch('/adminrocket/seller/teacher/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改师资审核状态
export function ModifySellerTeacherExamineStatus(params,rightId) {
  return fetch('/adminrocket/seller/teacher/examinestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改师资状态
export function ModifySellerTeacherStatus(params,rightId) {
  return fetch('/adminrocket/seller/teacher/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑师资
export function ModifySellerTeacher(params,rightId) {
  return fetch('/adminrocket/seller/teacher/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除师资
export function DeleteSellerTeacher(params,rightId) {
  return fetch('/adminrocket/seller/teacher/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 门店分配项目
export function SetSellerStoreItem(params,rightId) {
  return fetch('/adminrocket/seller/store/item/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 门店分配师资
export function SetSellerStoreTeacher(params,rightId) {
  return fetch('/adminrocket/seller/store/teacher/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 门店分配账户
export function SetSellerStoreAccount(params,rightId) {
  return fetch('/adminrocket/seller/store/account/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除门店
export function DeleteSellerStore(params,rightId) {
  return fetch('/adminrocket/seller/store/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 项目分配师资
export function SetSellerItemTeacher(params,rightId) {
  return fetch('/adminrocket/seller/item/teacher/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改账户密码
export function ModifySellerAccountPassword(params,rightId) {
  return fetch('/adminrocket/seller/account/password/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取教师职称列表
export function GetTeacherTitlesList(params,rightId) {
  return fetch('/adminrocket/teachertitles/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 师资分配职称
export function SetSellerTeacherTitles(params,rightId) {
  return fetch('/adminrocket/seller/teacher/titles/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取项目图片列表信息
export function GetSellerItemImgList(params,rightId) {
  return fetch('/adminrocket/seller/item/img/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加项目图片
export function AddSellerItemImg(params,rightId) {
  return fetch('/adminrocket/seller/item/img/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除项目图片
export function DeleteSellerItemImg(params,rightId) {
  return fetch('/adminrocket/seller/item/img/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改项目图片状态
export function ModifySellerItemImgStatus(params,rightId) {
  return fetch('/adminrocket/seller/item/img/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改项目图片审核状态
export function ModifySellerItemImgExamineStatus(params,rightId) {
  return fetch('/adminrocket/seller/item/img/examinestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取师资图片列表信息
export function GetSellerTeacherImgList(params,rightId) {
  return fetch('/adminrocket/seller/teacher/img/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加师资图片
export function AddSellerTeacherImg(params,rightId) {
  return fetch('/adminrocket/seller/teacher/img/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除师资图片
export function DeleteSellerTeacherImg(params,rightId) {
  return fetch('/adminrocket/seller/teacher/img/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改师资图片审核状态
export function ModifySellerTeacherImgStatus(params,rightId) {
  return fetch('/adminrocket/seller/teacher/img/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改项目图片审核状态
export function ModifySellerTeacherImgExamineStatus(params,rightId) {
  return fetch('/adminrocket/seller/teacher/img/examinestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取项目额外信息列表
export function GetItemExtraList(params,rightId) {
  return fetch('/adminrocket/seller/item/extra/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加项目额外信息
export function AddItemExtra(params,rightId) {
  return fetch('/adminrocket/seller/item/extra/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑项目额外信息
export function ModifyItemExtra(params,rightId) {
  return fetch('/adminrocket/seller/item/extra/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改项目额外信息状态
export function ModifyItemExtraStatus(params,rightId) {
  return fetch('/adminrocket/seller/item/extra/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除项目额外信息
export function DeleteItemExtra(params,rightId) {
  return fetch('/adminrocket/seller/item/extra/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取师资课程信息
export function GetSellerTeacherItemList(params,rightId) {
  return fetch('/adminrocket/seller/teacher/item/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 项目分配标签
export function SetSellerItemTag(params,rightId) {
  return fetch('/adminrocket/seller/item/tag/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
} 

// 编辑商家钱包余额
export function ModifySellerMoney(params,rightId) {
  return fetch('/adminrocket/seller/money/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
} 

// 分配钱包余额使用权限
export function SetSellerMoneyRight(params,rightId) {
  return fetch('/adminrocket/seller/money/right/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
} 

// 修改门店状态
export function ModifySellerStoreStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
} 

// 修改门店支付密码
export function ModifySellerStorePayPassword(params,rightId) {
  return fetch('/adminrocket/seller/store/paypassword/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
} 

// 修改门店是否支持过期验券
export function ModifySellerStoreExpireCheck(params,rightId) {
  return fetch('/adminrocket/seller/store/expirecheck/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
} 

// 获取商家钱包变更记录 
export function GetSellerMoneyChangeList(params,rightId) {
  return fetch('/adminrocket/seller/money/change/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
} 





// 获取门店图片列表信息
export function GetSellerStoreImgList(params,rightId) {
  return fetch('/adminrocket/seller/store/img/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加门店图片
export function AddSellerStoreImg(params,rightId) {
  return fetch('/adminrocket/seller/store/img/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除门店图片
export function DeleteSellerStoreImg(params,rightId) {
  return fetch('/adminrocket/seller/store/img/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改门店图片状态
export function ModifySellerStoreImgStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/img/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改门店图片审核状态
export function ModifySellerStoreImgExamineStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/img/examinestatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改门店前端奖励用户
export function ModifySellerStoreClientAccount(params,rightId) {
  return fetch('/adminrocket/seller/store/clientaccount/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改门店成交前端奖励用户
export function ModifySellerStoreClientAccountDeal(params,rightId) {
  return fetch('/adminrocket/seller/store/clientaccount/deal/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店额外信息列表
export function GetStoreExtraList(params,rightId) {
  return fetch('/adminrocket/seller/store/extra/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加门店额外信息
export function AddStoreExtra(params,rightId) {
  return fetch('/adminrocket/seller/store/extra/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑门店额外信息
export function ModifyStoreExtra(params,rightId) {
  return fetch('/adminrocket/seller/store/extra/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改门店额外信息状态
export function ModifyStoreExtraStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/extra/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除门店额外信息
export function DeleteStoreExtra(params,rightId) {
  return fetch('/adminrocket/seller/store/extra/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店课程预约信息
export function GetStoreItemAppointment(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointment', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 开启/关闭门店课程预约
export function ModifyStoreItemAppointmentStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointment/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店课程额外信息列表
export function GetStoreItemOthercontentList(params,rightId) {
  return fetch('/adminrocket/seller/store/item/othercontent/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加门店课程额外信息
export function AddStoreItemOthercontent(params,rightId) {
  return fetch('/adminrocket/seller/store/item/othercontent/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑门店课程额外信息
export function ModifyStoreItemOthercontent(params,rightId) {
  return fetch('/adminrocket/seller/store/item/othercontent/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改门店课程额外信息状态
export function ModifyStoreItemOthercontentStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/item/othercontent/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除门店课程额外信息
export function DeleteStoreItemOthercontent(params,rightId) {
  return fetch('/adminrocket/seller/store/item/othercontent/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店课程预约表信息
export function GetStoreItemAppointmenttableList(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointmenttable/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店课程预约排课信息
export function GetStoreItemAppointmentDetails(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointmentdetails', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 添加门店课程预约排课信息
export function AddStoreItemAppointmentDetails(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointmentdetails/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑门店课程预约排课信息
export function ModifyStoreItemAppointmentDetails(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointmentdetails/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除门店课程预约排课信息
export function DeleteStoreItemAppointmentDetails(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointmentdetails/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除门店课程预约表统计信息
export function DeleteStoreItemAppointmenttable(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointmenttable/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店课程批量排课列表
export function GetStoreItemScheduleBatchList(params,rightId) {
  return fetch('/adminrocket/seller/store/item/schedule/batch/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 批量清空课程排课
export function DeleteStoreItemScheduleBatch(params,rightId) {
  return fetch('/adminrocket/seller/store/item/schedule/batch/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店课程预约记录
export function GetStoreItemAppointmentRecordList(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointment/record/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 取消预约
export function CancelAppointment(params,rightId) {
  return fetch('/adminrocket/seller/store/item/appointment/cancel', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取门店成交记录
export function GetStoreDealRecordList(params,rightId) {
  return fetch('/adminrocket/seller/store/deal/record/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改成交记录实付价格
export function ModifyStoreDealRecordPayAmount(params,rightId) {
  return fetch('/adminrocket/seller/store/deal/record/payamount/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改成交记录状态
export function ModifyStoreDealRecordStatus(params,rightId) {
  return fetch('/adminrocket/seller/store/deal/record/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}


