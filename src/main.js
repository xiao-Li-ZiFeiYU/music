import Vue from 'vue'
import App from './App'

// 引入Vuex
import store from './/store'

// 全局引入阿里字体图标库
import './static/iconfont/iconfont.css'

// 导入封装的请求库
import request from './utils/request'
// 挂载到原型对象上
Vue.prototype.$request = request

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App,
  store
})
app.$mount()
