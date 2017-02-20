<template>
  <div class>
      <bar v-if="isIndex">
          <bar-item path="/home"  label="首页" icon="home"></bar-item>
          <bar-item path="/search" label="发现" icon="search"></bar-item>
          <bar-item path="/message" label="消息" icon="message"></bar-item>
          <bar-item path="/me" label="我" icon="me"></bar-item>
      </bar> 

      <transition name="fade">
          <router-view keep-alive></router-view>
      </transition>
    
  </div>
</template>
<script>
  import Bar from './components/Bar.vue';
  import BarItem from './components/BarItem.vue';
  import './css/sm.css';
  import $ from './js/jquery-3.1.1.min.js';
  // import $ from './js/zepto.min.js';
  export default{
    data(){
      return{
        isIndex:true
      }
    },
    created(){
      // console.log(this.$root);
    },
    components:{
      Bar,
      BarItem
    }
  }
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
</style>