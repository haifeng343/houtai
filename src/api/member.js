import fetch from 'common/js/request'

// 获取会员用户列表
export function memberAccountList(params, rightId) {
    return fetch('/adminrocket/member/account/list', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 获取会员用户有效期记录列表
export function memberAccountRecordList(params, rightId) {
    return fetch('/adminrocket/member/account/record/list', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 设置会员用户状态
export function memberAccountStatusModify(params, rightId) {
    return fetch('/adminrocket/member/account/status/modify', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 获取会员充值记录列表
export function memberRechargeRecordList(params, rightId) {
    return fetch('/adminrocket/member/recharge/record/list', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 获取会员业务列表
export function memberBusinessList(params, rightId) {
    return fetch('/adminrocket/member/business/list', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 创建会员业务
export function memberBusinessAdd(params, rightId) {
    return fetch('/adminrocket/member/business/add', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 获取会员等级列表
export function memberGradeList(params, rightId) {
    return fetch('/adminrocket/member/grade/list', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 创建会员等级
export function memberGradeAdd(params, rightId) {
    return fetch('/adminrocket/member/grade/add', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 编辑会员等级
export function memberGradeModify(params, rightId) {
    return fetch('/adminrocket/member/grade/modify', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 编辑会员等级
export function memberStatusModify(params, rightId) {
    return fetch('/adminrocket/member/status/modify', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}

// 删除会员等级
export function memberGradeDelete(params, rightId) {
    return fetch('/adminrocket/member/grade/delete', 'post', params, rightId).then(res => {
        return Promise.resolve(res)
    })
}