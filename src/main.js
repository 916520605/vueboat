// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui' //element-ui的全部组件
import 'element-ui/lib/theme-chalk/index.css'//element-ui的css
import axios from 'axios';

Vue.use(ElementUI) //使用elementUI
Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.config.productionTip=false
axios.defaults.baseURL='http://localhost:8080'
/*Vue.prototype.$http=axios*/
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render(h){
    return h(App)
  }
})
