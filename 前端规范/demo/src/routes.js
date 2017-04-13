import Home from './views/home.vue'
import Page1 from './views/Page1.vue'
import Page2 from './views/Page2.vue'
import Page3 from './views/Page3.vue'

export default [
  {
    path: '/',
    component: Home
  }, 
  {
    path: '/page1',
    meta: { 
      title: '二级导航一' 
    },
    component: Page1
  }, 
  {
    path: '/page2',
    meta: { 
      title: '二级导航二'
    },
    component: Page2
  }, 
  {
    path: '/page3',
    meta: { 
      title: '导航二'
    },
    component: Page3
  }
]
