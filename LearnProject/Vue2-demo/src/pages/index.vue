<template>
  <div class="contianer">
    <header class="bar bar-nav">
      <h1 class='title'>{{msg}}</h1>
    </header>
    <div class="content">

      <div class="buttons-tab">
        <a href="#tab1" class="tab-link active button">人物</a>
        <a href="#tab2" class="tab-link button">美食</a>
        <a href="#tab3" class="tab-link button">背景</a>
      </div>
      <div class="content-block">
        <div class="tabs">
          <div id="tab1" class="tab active">
            <div class="content-block">
              <div class="card" v-for="item in people">
                <div class="card-content">
                  <div class="card-content-inner">                    
                    <img v-lazy="item.webformatURL">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="tab2" class="tab">
            <div class="content-block">
              <div class="card" v-for="item in food">
                <div class="card-content" >
                  <div class="card-content-inner">                    
                    <img v-lazy="item.webformatURL" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div id="tab3" class="tab">
            <div class="content-block">
              <div class="card" v-for="item in backgrounds">
                <div class="card-content" >
                  <div class="card-content-inner">                    
                    <img v-lazy="item.webformatURL" alt="">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
    // ajax 使用官方推荐的 axios
    import axios from 'axios';
    import $ from '../js/jquery-3.1.1.min.js';

    export default{
      data(){
        return{
          msg:'vue2.0-test-demo',
          otherData: '测试',
          people:[],
          food:[],
          backgrounds:[],
          texts:[]
        }
      },
      created () {

      },
      mounted () {
       // this.$nextTick(function(){
       //   this.imgAjax("people");             
       //    })
       this.loadImg()
       // this.isinit();
       // console.log(location.pathname)
     },
     updated(){
     },
     methods: {
      imgAjax:function(type){
        var that = this;//that等于vue实例;
        axios.get('https://pixabay.com/api/?key=4574249-ede2e5d6c2d1c569308666968&image_type=photo&category='+type)
        .then(function(response){
          that[type]=response.data.hits;
        }).catch(function(){
          console.log('请求失败')
        })
      },
      loadImg:function(){
        var arry = ['people','food','backgrounds']
        var that = this;
        for(var i = 0;i<arry.length;i++){
          // console.log(arry[i]);
          that.imgAjax(arry[i]);
        }
      },
      isinit:function(){
        console.log(location.pathname)
        if (location.pathname!=="/home") {
           location.pathname="/home"
        }
      }
    }
  }



          //   var me = this;// 用me储存 vue实例
      //   axios.get('https://pixabay.com/api/?key=4574249-ede2e5d6c2d1c569308666968&image_type=photo&category=people')
      //   .then(function(response){    
      //    me.items=response.data.hits;     

      //  }).catch(function(){
      //   console.log('请求失败')
      // });
    </script>

    <style>
      .content-block{
        margin: 0;
        padding: 0;
      }
      .bar-nav~.content{
        padding-bottom: 50px;
      }
      img{
        width: 100%;
        display: block;
      }
      h1.title{
        background: #26a2ff;
        color: #fff;
      }


      img[lazy=loading] {
        /*your style here*/
        background: black;
      }
      img[lazy=error] {
        /*your style here*/
        background: black;
      },
      img[lazy=loaded] {
        /*your style here*/
        background: black;
      }
    </style>

