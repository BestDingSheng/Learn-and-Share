
<template>
  <div class="container" id="container">
   <mt-header fixed title="我是小图片"></mt-header>
   <ul class="imglist">
    <li v-for="item in people">
      <img v-lazy="item.webformatURL">
    </li>
  </ul>
</div>
</template>

<script>
  import axios from 'axios';
  import $ from "n-zepto";
  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        people:[],
        list:["1","2","3","4"]
      }
    },
    mounted(){
        alert($)      
       this.imgAjax('people');    },
    methods:{
      imgAjax:function(type){
        var that = this;//that等于vue实例;
        axios.get('https://pixabay.com/api/?key=4574249-ede2e5d6c2d1c569308666968&image_type=photo&category='+type)
        .then(function(response){
          that[type]=response.data.hits;
        }).catch(function(){
          console.log('请求失败')
        })
      },
      show(){
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  li[data-v-ac2f0ece]{
    margin: 5px 10px;
  }
  .imglist img{
    width: 100%;
    display: block;
  }
    image[lazy=loading] {
    width: 40px !important;
    height: 300px;
    margin: auto;
  }

</style>
