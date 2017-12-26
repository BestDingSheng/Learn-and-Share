//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userinfo:{},
    latitude:0,
    longitude:0,
    
  },
  //事件处理函数
  onReady:function(){
    this.setData({
      userinfo: app.globalData.userInfo
    })
    console.log(app.globalData.userInfo)
    let me = this;
    wx.getLocation({
      success:function(res){
        console.log(res);
        let latitude = res.latitude;
        let longitude = res.longitude;
        me.setData({
          longitude,
          latitude
        })

      }
    })


  },
  onLoad: function () {

    wx.setNavigationBarTitle({
      title: '我的'
    })
    
    console.log(this);
  }
})
