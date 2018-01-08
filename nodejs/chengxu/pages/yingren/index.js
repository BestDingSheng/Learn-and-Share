//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    obj: {

    },
    show: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.previewImage({
      current: this.data.obj.src, // 当前显示图片的http链接
      urls: [this.data.obj.src]
    })
  },
  lala(e){
    let id = e.target.id;
    wx.navigateTo({
      url:`/pages/details/index?id=${id}`
    })
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '影人信息'
    })
  },
  onLoad: function (option) {
    let me = this;
    let id = option.id || 1339594
    let url = `https://api.douban.com/v2/movie/celebrity/${id}?apikey=0b2bdeda43b5688921839c8ecb20399b`
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success:function(res){
        me.setData({
          'obj':res.data,
          show:true
        })
      }
    })
  }
})
