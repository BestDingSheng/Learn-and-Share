//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    obj: {

    },
    show: false
  },
  onShareAppMessage: function (e) {
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length - 1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    var options = currentPage.options
    var id = options.id
    var routerUrl = `/${url}?id=${id}`;
    return {
      title: `${this.data.obj.title}--电影详情`,
      path: routerUrl,
      imageUrl: this.data.obj.src
    }
  },
  //事件处理函数
  bindViewTap: function () {
    var listimg = [];
      let casts = this.data.obj.casts;
      for (let i = 0; i < casts.length; i++) {
        listimg.push(casts[i].avatars.large);
      }
    
    wx.previewImage({
      current: this.data.obj.src, // 当前显示图片的http链接
      urls: [this.data.obj.src].concat(listimg)
    })
  },
  lala(e) {

    let id = e.target.id;
    wx.navigateTo({
      url: `/pages/yingren/index?id=${id}`
    })
  },
  onReady: function () {

    wx.setNavigationBarTitle({
      title: '电影详情'
    })


  },
  onLoad: function (option) {
    let id = option.id;
    let url = "https://api.douban.com/v2/movie/subject/" + id
    console.log(url)
    let me = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        let data = res.data;
        me.setData({
          "obj": {
            "title": data.title,
            "summary": data.summary,
            "src": data.images.large,
            "diqu": data.countries[0],
            "genres": data.genres,
            "casts": data.casts,
            "xiangkan": data.collect_count,
            "kanguo": data.comments_cout,
            "daoyan": data.directors[0].name,
          },
          'show': true
        })
        console.log(data);

      }
    })

  }
})
