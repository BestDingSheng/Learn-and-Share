/* 项目启动 */
import Vue from 'vue'
import App from './App'
import router from './router'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueLazyload from 'vue-lazyload'

Vue.use(VueLazyload, {
  error: '../static/img/deflaut.png',
  loading: '../static/img/loading.png',
  try: 3 // default 1
});

 Vue.use(MintUI) //饿了么的移动端UI框架这样没用到

new Vue({
   router: router,
  render: h => h(App)
  // components: { firstcomponent, secondcomponent }
}).$mount('#app')
