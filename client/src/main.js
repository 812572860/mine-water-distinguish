import Vue from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import commonComponents from './components/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import axios from './utils/axios'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.use(Antd)
Vue.use(ElementUI)
Vue.use(commonComponents)

axios.get('/data/config.json').then(res => {
  window.sysConfig = res
  document.title = res.sysName
  store.commit('setSysConfig', res)
}).catch(err => {
  console.log(err)
}).finally(() => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})
