//app.js
App({
  httpRequest:{
    request: function (method, url, data){
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          data: data,
          mehtod: method,
          success: function (res) {
            resolve(res)
          },
          fail: function (res) {
            reject(res);
          },
          complete: function () {
            console.log('complete');
          }
        })
      })
    },
    //get方法：用来获取数据
    get: function (url,data) {
      return this.request('GET', url,data);
    },
    //post方法：用来更新数据
    post: function (url, data) {
      return this.request('POST', url, data);
    }
  },

  handleData(res, dataSource,that){
    var movieDatas = res.data.data;
    if(movieDatas===undefined){
      wx.navigateTo({
        url: '../notFound/notFound',
      })
    }else{
      for (var i = 0; i < movieDatas.length; i++) {
        var movieDataObj = {};
        movieDataObj.title = movieDatas[i].title;
        movieDataObj.coverUrl = "http://img3." + movieDatas[i].coverUrl.substr(12);
        // movieDataObj.rating = movieDatas[i].rating === null ? "暂无评分" : movieDatas[i].rating;
        movieDataObj.rating = movieDatas[i].rating;
        movieDataObj.id = movieDatas[i].id;
        // movieDataObj.directors=[];
        // for (var j = 0; j < movieDatas[i].directors.length;j++){
        //   movieDataObj.directors.push(movieDatas[i].directors[j].name)
        // }
        dataSource.push(movieDataObj);
        that.setData({ dataSource: dataSource });
      }
    }

  },

  movieId:""
})