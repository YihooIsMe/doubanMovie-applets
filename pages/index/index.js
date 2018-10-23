//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    dataSource: [],
    searchVal:"周星驰",
    showInput:false,
    httpData: {
      kw: "周星驰",
      apikey: "YPaTFbZMjcpYHVIST0aie2e22gYo9TrWLo7tSvqQI0rEXTqyYpJ4PXy4neKJJEju"
    },
    searchValueRandom: ["成龙", "李连杰", "甄子丹", "黄渤", "舒淇", "刘亦菲", "关之琳", "尼古拉斯凯奇", "高圆圆", "贾静雯", "徐峥", "王宝强","张国荣","梅艳芳","陈坤","王祖贤","刘德华","周润发","赵文卓","张敏"]
  },
  //事件处理函数
  onLoad: function() {
    wx.showLoading({
      title: '正在加载中',
    })
    var that = this;
    var dataSource = this.data.dataSource
    app.httpRequest.get("http://120.76.205.241:8000/movie/douban", this.data.httpData)
      .then(res => {
        that.setData({
          showInput: true
        });
        app.handleData(res, dataSource, that);
        wx.hideLoading();
      })
      .catch(res => {
        console.log(res, that)
      })

      


  },

  searchResult: function(e) {
    if (e.detail.value === "" || this.data.httpData.kw === e.detail.value) {
      return;
    } else {
      wx.showLoading({
        title: '正在加载中',
      })
      this.setData({
        httpData: {
          kw: e.detail.value,
          apikey: "YPaTFbZMjcpYHVIST0aie2e22gYo9TrWLo7tSvqQI0rEXTqyYpJ4PXy4neKJJEju"
        },
        showInput: false,
        dataSource: [],
        searchVal: e.detail.value
      })
      var that = this;
      var dataSource = this.data.dataSource;
      app.httpRequest.get("http://120.76.205.241:8000/movie/douban", this.data.httpData)
        .then(res => {
          that.setData({
            showInput: true
          });
          app.handleData(res, dataSource, that);
          wx.hideLoading();
        })
        .catch(res => {
          console.log(res, that)
        })
    }
  },

  loadMovieDetail: function(e) {
    app.movieId = e.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movieDetail/movieDetail',
    });
  },

  onPullDownRefresh() {
    var max = this.data.searchValueRandom.length,
      min = 0,
      kwVal = this.data.searchValueRandom[this.getRandomNum(min, max)];
    this.setData({
      httpData: {
        kw: kwVal,
        apikey: "YPaTFbZMjcpYHVIST0aie2e22gYo9TrWLo7tSvqQI0rEXTqyYpJ4PXy4neKJJEju"
      },
      dataSource: [],
      showInput:false,
      searchVal: kwVal
    });

    var that = this;
    var dataSource = this.data.dataSource;
    app.httpRequest.get("http://120.76.205.241:8000/movie/douban", this.data.httpData)
      .then(res => {
        that.setData({
          showInput: true
        })
        app.handleData(res, dataSource, that);
        wx.stopPullDownRefresh();
      })
      .catch(res => {
        console.log(res, that)
      })

  },

  getRandomNum(min, max) {
    return Math.floor(min + Math.random() * (max - min));
  }
})