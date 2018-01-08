//index.js
//获取应用实例
var common = require('api.js')
const app = getApp()
var start = 10;

Page({
  data: {
    list:[],
    show:false,
    load:true,
  },

  onShareAppMessage: function (e) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options
    var id = options.id
    var routerUrl = `/${url}?id=${id}`;
    return {
      title: `快来看看有什么好看的电影吧`,
      path: url,
      imageUrl: this.data.list[0].images.small
    }
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReachBottom(){
    // console.log(this.data.load)
    if (this.data.load){
      this.loadMore()
    }else{
      wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中” 
        title: '没有更多了',
        icon: 'loading',
        duration: 2000
      })  
    }
   
  },
  loadMore(){
    var list = this.data.list
    var me = this;
    wx.showToast({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中” 
      title: '加载中',
      icon: 'loading',
      duration: 1000
    })  
    start+=10;
    common.api(start,3).then(function (res) {
      console.log(res);
      me.setData({
        'list': list.concat(res.data.subjects),
        'show': true,
        'load': res.data.subjects.length>0?true:false
      })
    })

  },
  onReady:function(){
    console.log('我加载完成了')

  },
  onShow: function () {

    wx.setNavigationBarTitle({
      title: '热门电影'
    })
  },
  onLoad: function () {
    var me = this;
    common.api(0,3).then(function(res){
      console.log(res);
          me.setData({
          'list': res.data.subjects,
          'show':true
        })      
    })

  }
})
