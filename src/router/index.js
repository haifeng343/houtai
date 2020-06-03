import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/homeMenu'
        },
        {
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { title: '自述文件' },
            children:[
                {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/homeModule.vue'], resolve),
                    meta: { title: '' },
                },
                {
                    path: '/tabs',
                    component: resolve => require(['../components/page/Tabs.vue'], resolve),
                    meta: { title: 'Tabs' }
                },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                },
                {
                    path: '/GroupOrder',
                    component: resolve => require(['../components/page/GroupOrder.vue'], resolve),
                    meta: { title: '团单',father:'GroupOrder' }
                },
                {
                    path: '/extra',
                    component: resolve => require(['../components/page/extra.vue'], resolve),
                    meta: { title: '团单额外信息',father:'GroupOrder' }
                },
                {
                    path: '/Store/:id',
                    component: resolve => require(['../components/page/Store.vue'], resolve),
                    meta: { title: '参与门店',father:'ActivityList' }
                },
                {
                    path: '/addStore/:id',
                    component: resolve => require(['../components/page/addStore.vue'], resolve),
                    meta: { title: '添加参与门店',father:'ActivityList' }
                },
                {
                    path: '/editStore',
                    component: resolve => require(['../components/page/editStore.vue'], resolve),
                    meta: { title: '编辑参与门店',father:'ActivityList' }
                },
                {
                    path: '/ActivityList',
                    component: resolve => require(['../components/page/ActivityList.vue'], resolve),
                    meta: { title: '活动组列表',father:'ActivityList' }
                },
                {
                    path: '/SellerList',
                    component: resolve => require(['../components/page/SellerList.vue'], resolve),
                    meta: { title: '商家列表',father:'SellerList' }
                },
                {
                    path: '/StoreList/:id',
                    component: resolve => require(['../components/page/StoreList.vue'], resolve),
                    meta: { title: '门店列表',father:'SellerList' }
                },
                {
                    path: '/StoreItemTeacher/:id',
                    component: resolve => require(['../components/page/StoreItemTeacher.vue'], resolve),
                    meta: { title: '门店课程师资',father:'SellerList' }
                },
                {
                    path: '/StoreAdd/:id',
                    component: resolve => require(['../components/page/StoreAdd.vue'], resolve),
                    meta: { title: '添加门店',father:'SellerList' }
                },
                {
                    path: '/StoreEdit/:id',
                    component: resolve => require(['../components/page/StoreEdit.vue'], resolve),
                    meta: { title: '编辑门店',father:'SellerList' }
                },
                {
                    path: '/StoreDetails/:id',
                    component: resolve => require(['../components/page/StoreDetails.vue'], resolve),
                    meta: { title: '门店详情',father:'SellerList' }
                },
                {
                    path: '/ItemList/:id',
                    component: resolve => require(['../components/page/ItemList.vue'], resolve),
                    meta: { title: '课程列表',father:'SellerList' }
                },
                {
                    path: '/SellerAccountList/:id',
                    component: resolve => require(['../components/page/SellerAccountList.vue'], resolve),
                    meta: { title: '账户列表',father:'SellerList' }
                },
                {
                    path: '/TeacherList/:id',
                    component: resolve => require(['../components/page/TeacherList.vue'], resolve),
                    meta: { title: '师资列表',father:'SellerList' }
                },
                {
                    path: '/ItemImgs/:id',
                    component: resolve => require(['../components/page/ItemImgs.vue'], resolve),
                    meta: { title: '课程图片',father:'SellerList' }
                },
                {
                    path: '/TeacherImgs/:id',
                    component: resolve => require(['../components/page/TeacherImgs.vue'], resolve),
                    meta: { title: '师资图片',father:'SellerList' }
                },
                {
                    path: '/StoreListDialog/:id',
                    component: resolve => require(['../components/page/StoreListDialog.vue'], resolve),
                    meta: { title: '门店列表',father:'SellerList' }
                },
                {
                    path: '/ItemListDialog/:id',
                    component: resolve => require(['../components/page/ItemListDialog.vue'], resolve),
                    meta: { title: '课程列表',father:'SellerList' }
                },
                {
                    path: '/ItemType',
                    component: resolve => require(['../components/page/ItemType.vue'], resolve),
                    meta: { title: '课程类型',father:'ItemType' }
                },
                {
                    path: '/Tag',
                    component: resolve => require(['../components/page/Tag.vue'], resolve),
                    meta: { title: '标签',father:'Tag' }
                },
                {
                    path: '/Category',
                    component: resolve => require(['../components/page/Category.vue'], resolve),
                    meta: { title: '门店品类',father:'Category' }
                },
                {
                    path: '/TradingArea',
                    component: resolve => require(['../components/page/TradingArea.vue'], resolve),
                    meta: { title: '商圈管理',father:'TradingArea' }
                },
                {
                    path: '/Titles',
                    component: resolve => require(['../components/page/Titles.vue'], resolve),
                    meta: { title: '职称管理',father:'Titles' }
                },
                {
                    path: '/SheetItem/:id',
                    component: resolve => require(['../components/page/SheetItem.vue'], resolve),
                    meta: { title: '团单课程',father:'GroupOrder' }
                },
                {
                    path: '/RefundRulesBasePrice/:id',
                    component: resolve => require(['../components/page/RefundRulesBasePrice.vue'], resolve),
                    meta: { title: '退款基础价格',father:'GroupOrder' }
                },
                {
                    path: '/RefundRulesSpecialPrice/:id',
                    component: resolve => require(['../components/page/RefundRulesSpecialPrice.vue'], resolve),
                    meta: { title: '退款特殊价格',father:'GroupOrder' }
                },
                {
                    path: '/PrizeRulesBasePrice/:id',
                    component: resolve => require(['../components/page/PrizeRulesBasePrice.vue'], resolve),
                    meta: { title: '奖励基础价格',father:'GroupOrder' }
                },
                {
                    path: '/PrizeRulesSpecialPrice/:id',
                    component: resolve => require(['../components/page/PrizeRulesSpecialPrice.vue'], resolve),
                    meta: { title: '奖励特殊价格',father:'GroupOrder' }
                },
                {
                    path: '/SheetImgs/:id',
                    component: resolve => require(['../components/page/SheetImgs.vue'], resolve),
                    meta: { title: '团单图片',father:'GroupOrder' }
                },
                {
                    path: '/SystemParam',
                    component: resolve => require(['../components/page/SystemParam.vue'], resolve),
                    meta: { title: '系统参数',father:'SystemParam' }
                },
                {
                    path: '/ShareParam',
                    component: resolve => require(['../components/page/ShareParam.vue'], resolve),
                    meta: { title: '分享参数',father:'ShareParam' }
                },
                {
                    path: '/MyPage',
                    component: resolve => require(['../components/page/MyPage.vue'], resolve),
                    meta: { title: '我的页面',father:'MyPage' }
                },
                {
                    path: '/Banner',
                    component: resolve => require(['../components/page/Banner.vue'], resolve),
                    meta: { title: '广告设置',father:'Banner' }
                },
                {
                    path: '/PopList',
                    component: resolve => require(['../components/page/PopList.vue'], resolve),
                    meta: { title: '弹窗列表',father:'PopList' }
                },
                {
                    path: '/PopReceiveList',
                    component: resolve => require(['../components/page/PopReceiveList.vue'], resolve),
                    meta: { title: '领取规则列表',father:'PopReceiveList' }
                },
                {
                    path: '/PopTaskList',
                    component: resolve => require(['../components/page/PopTaskList.vue'], resolve),
                    meta: { title: '任务列表',father:'PopTaskList' }
                },
                {
                    path: '/templateList',
                    component: resolve => require(['../components/page/templateList.vue'], resolve),
                    meta: { title: '模板列表',father:'PopReceiveList' }
                },
                {
                    path: '/PopReceiveTokenList',
                    component: resolve => require(['../components/page/PopReceiveTokenList.vue'], resolve),
                    meta: { title: '领取标识',father:'PopReceiveTokenList' }
                },
                {
                    path: '/PopTaskApiList',
                    component: resolve => require(['../components/page/PopTaskApiList.vue'], resolve),
                    meta: { title: '任务API列表',father:'PopTaskApiList' }
                },
                {
                    path: '/PopTaskPrizeRecord',
                    component: resolve => require(['../components/page/PopTaskPrizeRecord.vue'], resolve),
                    meta: { title: '奖励记录',father:'PopTaskPrizeRecord' }
                },
                {
                    path: '/CustomerServicePage',
                    component: resolve => require(['../components/page/CustomerServicePage.vue'], resolve),
                    meta: { title: '客服页面',father:'CustomerServicePage' }
                },
                {
                    path: '/RushBuy',
                    component: resolve => require(['../components/page/RushBuy.vue'], resolve),
                    meta: { title: '抢购活动',father:'RushBuy' }
                },
                {
                    path: '/CashList',
                    component: resolve => require(['../components/page/CashList.vue'], resolve),
                    meta: { title: '提现记录',father:'CashList' }
                },
                {
                    path: '/PaymentLog',
                    component: resolve => require(['../components/page/PaymentLog.vue'], resolve),
                    meta: { title: '打款记录',father:'PaymentLog' }
                },
                {
                    path: '/CashbackList',
                    component: resolve => require(['../components/page/CashbackList.vue'], resolve),
                    meta: { title: '返现记录',father:'CashbackList' }
                },
                {
                    path: '/WechatManager',
                    component: resolve => require(['../components/page/WechatManager.vue'], resolve),
                    meta: { title: '微信管理',father:'WechatManager' }
                },
                {
                    path: '/ScoreRules',
                    component: resolve => require(['../components/page/ScoreRules.vue'], resolve),
                    meta: { title: '积分规则',father:'ScoreRules' }
                },
                {
                    path: '/AboutUs',
                    component: resolve => require(['../components/page/AboutUs.vue'], resolve),
                    meta: { title: '关于我们',father:'AboutUs' }
                },
                {
                    path: '/ItemTypeShow',
                    component: resolve => require(['../components/page/ItemTypeShow.vue'], resolve),
                    meta: { title: '课程类型',father:'ItemTypeShow' }
                },
                {
                    path: '/AboutUs_Seller',
                    component: resolve => require(['../components/page/AboutUs_Seller.vue'], resolve),
                    meta: { title: '商家端关于我们',father:'AboutUs_Seller' }
                },
                {
                    path: '/OrderList',
                    component: resolve => require(['../components/page/OrderList.vue'], resolve),
                    meta: { title: '订单记录',father:'OrderList' }
                },
                {
                    path: '/OrderRefundList',
                    component: resolve => require(['../components/page/OrderRefundList.vue'], resolve),
                    meta: { title: '订单退款记录',father:'OrderRefundList' }
                },
                {
                    path: '/SellerRechargeRecord',
                    component: resolve => require(['../components/page/SellerRechargeRecord.vue'], resolve),
                    meta: { title: '充值记录',father:'SellerRechargeRecord' }
                },
                {
                    path: '/SellerRefundList',
                    component: resolve => require(['../components/page/SellerRefundList.vue'], resolve),
                    meta: { title: '退款列表',father:'SellerRefundList' }
                },
                {
                    path: '/ClientAccountList',
                    component: resolve => require(['../components/page/ClientAccountList.vue'], resolve),
                    meta: { title: '账户列表',father:'ClientAccountList' }
                },
                {
                    path: '/OrderRefundDetails/:id',
                    component: resolve => require(['../components/page/OrderRefundDetails.vue'], resolve),
                    meta: { title: '退款详情',father:'ClientAccountList' }
                },
                {
                    path: '/WalletChange/:id',
                    component: resolve => require(['../components/page/WalletChange.vue'], resolve),
                    meta: { title: '变更日志',father:'ClientAccountList' }
                },
                {
                    path: '/ClientRegisterRecord',
                    component: resolve => require(['../components/page/ClientRegisterRecord.vue'], resolve),
                    meta: { title: '注册记录',father:'ClientRegisterRecord' }
                },
                {
                    path: '/AdminAccountList',
                    component: resolve => require(['../components/page/AdminAccountList.vue'], resolve),
                    meta: { title: '用户列表',father:'AdminAccountList' }
                },
                {
                    path: '/AdminRoleList',
                    component: resolve => require(['../components/page/AdminRoleList.vue'], resolve),
                    meta: { title: '角色列表',father:'AdminRoleList' }
                },
                {
                    path: '/AdminLoginLog',
                    component: resolve => require(['../components/page/AdminLoginLog.vue'], resolve),
                    meta: { title: '登录日志',father:'AdminLoginLog' }
                },
                {
                    path: '/AdminOperateLog',
                    component: resolve => require(['../components/page/AdminOperateLog.vue'], resolve),
                    meta: { title: '操作日志',father:'AdminOperateLog' }
                },
                {
                    path: '/ItemExtra/:id',
                    component: resolve => require(['../components/page/ItemExtra.vue'], resolve),
                    meta: { title: '课程额外信息',father:'SellerList' }
                },
                {
                    path: '/AdminRight/:id',
                    component: resolve => require(['../components/page/AdminRight.vue'], resolve),
                    meta: { title: '角色权限',father:'AdminRoleList' }
                },
                {
                    path: '/AdminRightSet/:id',
                    component: resolve => require(['../components/page/AdminRightSet.vue'], resolve),
                    meta: { title: '权限设置',father:'AdminRoleList' }
                },
                {
                    path: '/SellerMoneyChange/:id',
                    component: resolve => require(['../components/page/SellerMoneyChange.vue'], resolve),
                    meta: { title: '商家余额变更记录',father:'SellerList' }
                },
                {
                    path: '/StoreImgs/:id',
                    component: resolve => require(['../components/page/StoreImgs.vue'], resolve),
                    meta: { title: '门店图片管理',father:'SellerList' }
                },
                {
                    path: '/AccountCartList/:id',
                    component: resolve => require(['../components/page/AccountCartList.vue'], resolve),
                    meta: { title: '购物车',father:'ClientAccountList' }
                },
                {
                    path: '/PopTaskTemplateList/:id',
                    component: resolve => require(['../components/page/PopTaskTemplateList.vue'], resolve),
                    meta: { title: '任务列表',father:'PopReceiveList' }
                },
                {
                    path: '/NoticeSetting',
                    component: resolve => require(['../components/page/NoticeSetting.vue'], resolve),
                    meta: { title: '通知服务',father:'NoticeSetting' }
                },
                {
                    path: '/TicketList',
                    component: resolve => require(['../components/page/TicketList.vue'], resolve),
                    meta: { title: '卡券列表',father:'TicketList' }
                },
                {
                    path: '/TicketType',
                    component: resolve => require(['../components/page/TicketType.vue'], resolve),
                    meta: { title: '卡券类型',father:'TicketType' }
                },
                {
                    path: '/TicketTemplateList',
                    component: resolve => require(['../components/page/TicketTemplateList.vue'], resolve),
                    meta: { title: '卡券模板',father:'TicketTemplateList' }
                },
                {
                    path: '/TicketValueList',
                    component: resolve => require(['../components/page/TicketValueList.vue'], resolve),
                    meta: { title: '面值参数',father:'TicketValueList' }
                },
                {
                    path: '/NoticeList',
                    component: resolve => require(['../components/page/NoticeList.vue'], resolve),
                    meta: { title: '通知列表',father:'NoticeList' }
                },
                {
                    path: '/NoticeTime',
                    component: resolve => require(['../components/page/NoticeTime.vue'], resolve),
                    meta: { title: '预约通知',father:'NoticeTime' }
                },
                {
                    path: '/StoreExtra/:id',
                    component: resolve => require(['../components/page/StoreExtra.vue'], resolve),
                    meta: { title: '门店额外信息',father:'SellerList' }
                },
                {
                    path: '/TaskTicket/:id',
                    component: resolve => require(['../components/page/TaskTicket.vue'], resolve),
                    meta: { title: '任务卡券奖励',father:'PopTaskList' }
                },
                {
                    path: '/ItemAppointment/:id',
                    component: resolve => require(['../components/page/ItemAppointment.vue'], resolve),
                    meta: { title: '课程预约',father:'SellerList' }
                },
                {
                    path: '/ItemAppointmentRecord/:id',
                    component: resolve => require(['../components/page/ItemAppointmentRecord.vue'], resolve),
                    meta: { title: '课程预约记录',father:'SellerList' }
                },
                {
                    path: '/AppointmentOthercontent/:id',
                    component: resolve => require(['../components/page/AppointmentOthercontent.vue'], resolve),
                    meta: { title: '额外信息',father:'SellerList' }
                },
                {
                    path: '/Appointment/:id/:storeid/:itemid',
                    component: resolve => require(['../components/page/Appointment.vue'], resolve),
                    meta: { title: '预约表',father:'SellerList' }
                },
                {
                    path: '/AppointmentClass/:storeid/:itemid/:date',
                    component: resolve => require(['../components/page/AppointmentClass.vue'], resolve),
                    meta: { title: '预约详情',father:'SellerList' }
                },
                {
                    path: '/ServicePublic',
                    component: resolve => require(['../components/page/ServicePublic.vue'], resolve),
                    meta: { title: '小程序客服',father:'ServicePublic' }
                },
                {
                    path: '/SubsidyRecord/:id',
                    component: resolve => require(['../components/page/SubsidyRecord.vue'], resolve),
                    meta: { title: '成交记录',father:'SellerList' }
                },
                {
                    path: '/ExchangeCode',
                    component: resolve => require(['../components/page/ExchangeCode.vue'], resolve),
                    meta: { title: '兑换码',father:'ExchangeCode' }
                },
                {
                    path: '/ExchangeList/:id',
                    component: resolve => require(['../components/page/ExchangeList.vue'], resolve),
                    meta: { title: '兑换列表',father:'ExchangeCode' }
                },
                {
                    path: '/MemberList',
                    component: resolve => require(['../components/page/MemberList.vue'], resolve),
                    meta: { title: '会员列表',father:'MemberList' }
                },
                {
                    path: '/MemberRechargeRecord',
                    component: resolve => require(['../components/page/MemberRechargeRecord.vue'], resolve),
                    meta: { title: '会员充值记录表',father:'MemberRechargeRecord' }
                },
                {
                    path: '/MemberBusiness',
                    component: resolve => require(['../components/page/MemberBusiness.vue'], resolve),
                    meta: { title: '会员业务',father:'MemberBusiness' }
                },
                {
                    path: '/MemberEquity',
                    component: resolve => require(['../components/page/MemberEquity.vue'], resolve),
                    meta: { title: '会员权益',father:'MemberEquity' }
                },
                {
                    path: '/MemberEquitySetting',
                    component: resolve => require(['../components/page/MemberEquitySetting.vue'], resolve),
                    meta: { title: '权益配置',father:'MemberEquitySetting' }
                },
                {
                    path: '/demo',
                    component: resolve => require(['../components/page/demo.vue'], resolve),
                    meta: { title: 'demo' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '/homeMenu',
            component: resolve => require(['../components/common/HomeMenu.vue'], resolve)
        }, 
        {
            path: '/ModifyPassword',
            component: resolve => require(['../components/page/ModifyPassword.vue'], resolve),
            meta: { title: '修改密码' }
        }, 
        {
            path: '/ModifyUserInfo',
            component: resolve => require(['../components/page/ModifyUserInfo.vue'], resolve),
            meta: { title: '个人信息' }
        }, 
        {
            path: '/Rili',
            component: resolve => require(['../components/common/Rili.vue'], resolve),
            meta: { title: '日历demo' }
        }
    ]
})

