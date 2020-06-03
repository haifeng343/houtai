import fetch from 'common/js/request'

// 用户登录
export function AdminLogin(params,rightId) {
  return fetch('/adminrocket/admin/login', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 用户登出
export function AdminLoginOut(params,rightId) {
  return fetch('/adminrocket/admin/loginout', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 用户修改密码
export function ChangePassword(params,rightId) {
  return fetch('/adminrocket/admin/change/password', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取菜单列表
export function GetMenuList(params,rightId) {
  return fetch('/adminrocket/admin/menu/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取登录日志列表
export function getLoginLog(params,rightId) {
  return fetch('/adminrocket/admin/loginlog/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取操作日志列表
export function getOperationLog(params,rightId) {
  return fetch('/adminrocket/admin/operationlog/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取用户列表
export function GetAccountList(params,rightId) {
  return fetch('/adminrocket/admin/account/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 新增用户
export function AddAccount(params,rightId) {
  return fetch('/adminrocket/admin/account/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑用户
export function ModifyAccount(params,rightId) {
  return fetch('/adminrocket/admin/account/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 设置用户状态
export function ModifyAccountStatus(params,rightId) {
  return fetch('/adminrocket/admin/account/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 设置用户管理员状态
export function ModifyAccountAdminStatus(params,rightId) {
  return fetch('/adminrocket/admin/account/adminstatus/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 修改密码
export function ModifyAccountPassword(params,rightId) {
  return fetch('/adminrocket/admin/account/password/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取角色列表
export function GetRoleList(params,rightId) {
  return fetch('/adminrocket/admin/role/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 新增角色
export function AddRole(params,rightId) {
  return fetch('/adminrocket/admin/role/add', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 编辑角色
export function ModifyRole(params,rightId) {
  return fetch('/adminrocket/admin/role/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 设置角色状态
export function ModifyRoleStatus(params,rightId) {
  return fetch('/adminrocket/admin/role/status/modify', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 删除角色
export function DeleteRole(params,rightId) {
  return fetch('/adminrocket/admin/role/delete', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 设置用户角色
export function SetAccountRole(params,rightId) {
  return fetch('/adminrocket/admin/account/role/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取角色权限
export function GetRoleRightList(params,rightId) {
  return fetch('/adminrocket/admin/role/right/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 设置角色权限
export function SetRoleRight(params,rightId) {
  return fetch('/adminrocket/admin/role/right/set', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取个人信息
export function GetAdminUserInfo(params,rightId) {
  return fetch('/adminrocket/admin/userinfo', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 用户修改个人信息
export function ChangeUserInfo(params,rightId) {
  return fetch('/adminrocket/admin/change/userinfo', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

// 获取用户权限列表
export function GetRightList(params,rightId) {
  return fetch('/adminrocket/admin/right/list', 'post', params,rightId).then(res => {
    return Promise.resolve(res)
  })
}

