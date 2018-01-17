//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userinfo: {},
    latitude: 0,
    longitude: 0,
    winHeight: "",//窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    expertList: [{ //假数据
      img: "avatar.png",
      name: "欢顔",
      tag: "知名情感博主",
      answer: 134,
      listen: 2234
    }],
    jingdian: [],
    gaofen: [],
    lengmen: [],
    xiju: [],
    aiqing: [],
    search:[]
  },

  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;

    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 4) {

      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  //事件处理函数
  onReady: function () {
    let me = this;
    wx.login({
      success: function () {
        wx.getUserInfo({
          success: function (res) {
            me.setData({
              userinfo: res.userInfo
            })
          }
        });
      }
    });

  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: '我的'
    })
    var that = this;
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 390;

        that.setData({
          winHeight: calc
        });
      }
    });

    that.autodata('喜剧','xiju')
    that.autodata('经典', 'jingdian')
    that.autodata('豆瓣高分', 'gaofen')
    that.autodata('冷门佳作', 'lengmen')
    that.autodata('爱情', 'aiqing')


  },
  // 自定义事件

  autodata(type, shuju) {
    let that = this;
    that.api(type).then(function (res) {
      that.setData({
        [shuju]: res.data.subjects
      })
    })
  },
  fnn(e) {
    let that = this;
    let value = this.trim(e.detail.value)
    if (value.length === 0) {
      wx.showToast({
        title: '请输入电影',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 2000
    })
    wx.request({
      url: `https://api.douban.com/v2/movie/search?q=${value}`,
      method: 'GET',
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.setData({
          search: res.data.subjects
        })
        console.log(res.data.subjects);

      }
    })

  },
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '');
  },

  api(type) {
    let url = `https://api.douban.com/v2/movie/search?tag=${type}`;
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        method: 'GET',
        data: {
          "start": 0,
          "count": 10,
        },
        header: {
          "Content-Type": "json"
        },
        success: function (res) {
          resolve(res);
        }
      })

    });
  }

})
