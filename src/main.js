import Vue from 'vue';
import App from './App';
import store from './store'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';    // 默认主题
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import '../static/css/icon.css';
// import 'babel-polyfill';
import md5 from 'js-md5';
import filters from 'common/js/filter'
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import echarts from 'echarts'
import { provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import JsonExcel from 'vue-json-excel'
import common from 'common/js/common'
Vue.component('downloadExcel', JsonExcel)
Vue.use(ElementUI, { size: 'small' }).use(VueQuillEditor);
Vue.prototype.$axios = axios;
Vue.prototype.$md5 = md5;
Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false
Vue.prototype.common = common;
import router from './router';
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

//使用钩子函数对路由进行权限跳转
// router.beforeEach((to, from, next) => {
//     const role = localStorage.getItem('ms_username');
//     const token=localStorage.getItem("userToken")
//     if((!role || token== undefined) && to.path != '/login'){
//         next('/login');
//     }else if(to.meta.permission){
//         // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
//         role === 'admin' ? next() : next('/403');
//     }else{
//         // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
//         if(navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor'){
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         }else{
//             next();
//         }
//     }
// })

new Vue({
    store,
    router,
    render: h => h(App)
}).$mount('#app');