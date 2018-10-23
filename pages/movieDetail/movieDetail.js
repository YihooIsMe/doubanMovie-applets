const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movieDetailArgs: {
      id: "",
      apikey: "YPaTFbZMjcpYHVIST0aie2e22gYo9TrWLo7tSvqQI0rEXTqyYpJ4PXy4neKJJEju"
    },
    movieCommentsArgs: {
      id: "",
      parent: 'movie',
      apikey: "YPaTFbZMjcpYHVIST0aie2e22gYo9TrWLo7tSvqQI0rEXTqyYpJ4PXy4neKJJEju"
    },
    movieDetailContent: {},
    movieCommentsContent: [],
    transformImgUr: "",
    countriesAndGenres: '',
    titleAliasesStr: "",
    publishDateStr: "",
    descriptionDisplay: "-webkit-box",
    descriptionBtn: "展开",
    actors: "",
    directors: "",
    imageUrls: [],
    backgroundPosotion: "",
    showContainer: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '数据正在加载',
    });
    var that = this;
    this.setData({
      movieDetailArgs: {
        id: app.movieId,
        // id: 1292213,
        apikey: "YPaTFbZMjcpYHVIST0aie2e22gYo9TrWLo7tSvqQI0rEXTqyYpJ4PXy4neKJJEju"
      },
      movieCommentsArgs: {
        id: app.movieId,
        // id: 1292213,
        parent: 'movie',
        apikey: "YPaTFbZMjcpYHVIST0aie2e22gYo9TrWLo7tSvqQI0rEXTqyYpJ4PXy4neKJJEju"
      }
    })
    app.httpRequest.get("http://120.76.205.241:8000/movie/douban", this.data.movieDetailArgs)
      .then(res => {
        var responseUsefulData = res.data.data[0];
        that.setData({
          movieDetailContent: responseUsefulData,
          transformImgUr: "http://img3." + responseUsefulData.coverUrl.substr(12),
        });

        var countries = "",
          titleAliases = "",
          countriesArray = responseUsefulData.countries,
          genresArray = responseUsefulData.genres,
          titleAliasesArray = responseUsefulData.titleAliases;

        countries = that.repeatAdd(countries, countriesArray) + that.repeatAdd(countries, genresArray);
        titleAliases = that.repeatAdd(titleAliases, titleAliasesArray);
        that.setData({
          countriesAndGenres: countries.substr(0, countries.length - 1),
          titleAliasesStr: titleAliases.substr(0, titleAliases.length - 1),
          actors: that.getActorsAndDirectors(responseUsefulData.actors),
          directors: that.getActorsAndDirectors(responseUsefulData.directors),
          imageUrls: that.changeImgUrl(responseUsefulData.imageUrls)
        })

        if (responseUsefulData.publishDateStr !== undefined) {
          that.setData({
            publishDateStr: responseUsefulData.publishDateStr.substr(0, 10)
          })
        }

        var rating = that.data.movieDetailContent.rating
        switch (true) {
          case rating >= 9.5:
            that.setData({
              backgroundPosotion: "center 0px"
            })
            break;
          case rating >= 8.5:
            that.setData({
              backgroundPosotion: "center -11px"
            })
            break;
          case rating >= 7.5:
            that.setData({
              backgroundPosotion: "center -22px"
            })
            break;
          case rating >= 6:
            that.setData({
              backgroundPosotion: "center -33px"
            })
            break;
          case rating >= 5.5:
            that.setData({
              backgroundPosotion: "center -44px"
            })
            break;
          case rating >= 4.5:
            that.setData({
              backgroundPosotion: "center -55px"
            })
            break;
          case rating >= 3.5:
            that.setData({
              backgroundPosotion: "center -66px"
            })
            break;
          case rating >= 2.5:
            that.setData({
              backgroundPosotion: "center -77px"
            })
            break;
          case rating >= 1.5:
            that.setData({
              backgroundPosotion: "center -88px"
            })
            break;
          case rating > 0:
            that.setData({
              backgroundPosotion: "center -99px"
            })
            break;
          case rating === null:
            that.setData({
              backgroundPosotion: "center -110px"
            })
            break;
        }
        that.setData({
          showContainer: true
        })
        wx.setNavigationBarTitle({
          title: that.data.movieDetailContent.title,
        });
        wx.hideLoading();
      })
      .catch(err => {
        console.log(err)
        wx.showToast({
          title: '当前网络不稳定',
        })
      })
    app.httpRequest.get("http://120.76.205.241:8000/comment/douban", this.data.movieCommentsArgs)
      .then(res => {
        var responseCommentsData = res.data.data;
        if (responseCommentsData !== undefined) {
          that.setData({
            movieCommentsContent: responseCommentsData
          })
        }
      })
      .catch(err => {
        console.log(err)
      })

  },

  repeatAdd: function(exportData, dataArray) {
    for (var i = 0; i < dataArray.length; i++) {
      exportData += dataArray[i] + "/";
    }
    return exportData;
  },

  toggleDescription: function() {
    if (this.data.descriptionDisplay === "-webkit-box") {
      this.setData({
        descriptionDisplay: "block",
        descriptionBtn: "收起"
      })
    } else {
      this.setData({
        descriptionDisplay: "-webkit-box",
        descriptionBtn: "展开"
      })
    }
  },

  getActorsAndDirectors(arrayData) {
    if (arrayData !== null) {
      var arr = [];
      for (var i = 0; i < arrayData.length; i++) {
        arr.push(arrayData[i].name);
      }
      return arr.join("/");
    } else {
      return "暂无"
    }
  },

  changeImgUrl(imgArray) {
    var transImgUrl = [];
    for (var i = 0; i < imgArray.length; i++) {
      transImgUrl.push("http://img3." + imgArray[i].substr(12));
    }
    return transImgUrl;
  },

  getCommentsData(arr) {
    var commentsData = [];
    for (var i = 0; i < arr.length; i++) {
      commentsData.push(arr[i].publishDateStr.substr(0, 10));
    }
    return commentsData;
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {


  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})