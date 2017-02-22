/* 路由配置全写这里 */
import Vue from 'vue'
import VueRouter from 'vue-router'

/* 开启debug模式 */
Vue.config.debug = true
Vue.use(VueRouter);

import Index from '../pages/index.vue'
import second from '../pages/secod.vue'
import third from '../pages/thirdly.vue'
import four from '../pages/fourthly.vue'
// import secondcomponent from '../pages/otherPages.vue'
// import thirdcomponent from '../pages/otherPages2.vue'

export default new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
  {
    path:'/',
    component:Index
  },
  {
    path:'/home',
    component:Index
  },
  {
    path:'/search',
    component:second
  },
  {
    path:'/message',
    component:third
  },
  {
    path:'/me',
    component:four
  },
    {
    path:'*',
    component:Index
  }
    // {
    //   path: '/index',
    //   component: Index
    // },
    // {
    //   path: '/news',
    //   component: News
    // },
    // {
    //   path: '/second',
    //   component: secondcomponent
    // },
    // {
    //   path: '/third',
    //   component: thirdcomponent
    // }
    ]
  })
