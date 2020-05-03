// pages/uploadPhoto/uploadPhoto.js
var COS = require('../../utils/cos-wx-sdk-v5.js')
var api = require('../../utils/api.js')
var Bucket = 'idols-1253404514';
var Region = 'ap-guangzhou';
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var TaskId;

var getAuthorization = function(options, callback) {
  // 方法一、后端通过获取临时密钥给到前端，前端计算签名
  wx.request({
    method: 'GET',
    url: api.baseUrl + 'miniGetAuth/getAuthSign', // 服务端签名，参考 server 目录下的两个签名例子
    dataType: 'json',
    success: function(result) {
      console.log(result)
      var data = result.data.data;
      callback({
        TmpSecretId: data.credentials && data.credentials.tmpSecretId,
        TmpSecretKey: data.credentials && data.credentials.tmpSecretKey,
        XCosSecurityToken: data.credentials && data.credentials.sessionToken,
        ExpiredTime: data.expiredTime,
      });
    }
  });
};
var cos = new COS({
  getAuthorization: getAuthorization,
  // FileParallelLimit: 1,
  // ChunkParallelLimit: 1,
  // ProgressInterval: 1000
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    showLoading1: false,
    uploadPercent:'',//上传进度
    starId: '', //明星id
    sendLocks: false, //防止重复点击发送按钮的锁(false：开锁，true:上锁)
    uploadTime: '',
    imagesLists: [],
    sumbitText: '确认上传',
    imagesList: [],
    statusBarHeight: 0 //状态栏的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this
    
    self.setData({
      starId: options.star_id,
      starName: options.star_name
    })
    for (const v of options.data.split(",")) {
      let randomNum = Math.ceil(Math.random() * 100)
      let key = api.cdn + self.GetTimeString() + options.data.split(",").indexOf(v) + randomNum + '.png'
      console.log(key)
      cos.postObject({
        Bucket: Bucket,
        Region: Region,
        Key: key,
        FilePath: v,
        TaskReady: function (taskId) {
          TaskId = taskId
        },
        onProgress: function (info) {
          var percent = parseInt(info.percent * 10000) / 100;
          var speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
          // let params = {
          //   uploadPercent: percent
          // }
          // self.data.imagesLists.push(params)
          console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
          console.log(JSON.stringify(info),"infp");
        }
      }, self.requestCallback);
    }
    publicFu.setDom(self) //做手机适配
    // self.getAuthorization()
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
  // onShareAppMessage: function() {

  // },
  getUserInfo(e) {
    let self = this
    if (e.detail.userInfo == undefined) { //拒绝授权
      wx.showModal({
        title: '提示',
        content: '允许授权才能上传爱豆照片',
        confirmText: '马上授权',
        success: function(e) {
          if (e.confirm) { //点击确认按钮
            wx.openSetting({
              success: (res) => {
                res.authSetting = {
                  "scope.userInfo": true,
                }
              }
            })
          }
        }
      })
    } else { //允许授权
      getApp().setUserInfo(e) //更新用户信息
      self.uploadImage()
      // if (wx.getSystemInfoSync().system.toUpperCase().indexOf("IOS") < 0) {
      //   wx.showActionSheet({
      //     itemList: ['选择上传爱豆照片', '取消'],
      //     success: function(res) {
      //       if (res.tapIndex == 0) {
      //         self.uploadImage()
      //       }
      //     }
      //   });
      // } else {
      //   wx.showActionSheet({
      //     itemList: ['选择上传爱豆照片'],
      //     success: function(res) {
      //       if (res.tapIndex == 0) {
      //         self.uploadImage()
      //       }
      //     }
      //   });
      // }

    }
  },
  clickPhoto: function(e) {
    let arr = []
    arr.splice(0, arr.length)
    for (const v of e.currentTarget.dataset.srcarr.splice(0, e.currentTarget.dataset.srcarr.length)) {
      arr.push(v.src)
    }
    wx.previewImage({
      current: arr[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: arr // 需要预览的图片http链接列表
    })
  },
  submit: function() {
    let self = this
    if (!self.data.sendLocks) {
      self.setData({
        sendLocks: true //上锁
      })
      self.createThreads()
    } else {
      wx.showModal({
        title: '提示',
        content: '请勿重复点击',
        showCancel: false
      })
    }
  },
  GetTimeString() {
    var date = new Date();
    var yy = date.getFullYear().toString();
    var mm = (date.getMonth() + 1).toString();
    var dd = date.getDate().toString();
    var hh = date.getHours().toString();
    var nn = date.getMinutes().toString();
    var ss = date.getSeconds().toString();
    var mi = date.getMilliseconds().toString();
    var ret = yy + mm + dd + hh + nn + ss + mi;
    return ret;
  },
  requestCallback(err, data) {
    let self = this
    console.log(err || data);
    if (err && err.error) {
      console.log('请求失败：' + (err.error.Message || err.error) + '；状态码：' + err.statusCode)
    } else if (err) {
      console.log('请求出错：' + err + '；状态码：' + err.statusCode)
    } else {
      let params = {
        src: data.Location,
      }
      self.data.imagesList.push(params)
      self.setData({
        imagesLists: [...self.data.imagesList, ...self.data.imagesLists]
      })
      if (self.data.imagesLists.length > 9) { //上传的照片超过9张的话，只取最先上传的9张
        wx.showModal({
          title: '提示',
          content: '一次只能上传9张图片',
          showCancel: false
        })
        self.setData({
          imagesLists: self.data.imagesLists.splice(-9, 9)
        })
      }
      console.log("上传的图片数组", self.data.imagesLists)
      self.data.imagesList.splice(0, self.data.imagesList.length)
    }
  },
  deletePhoto: function(e) {
    let self = this
    for (const v of self.data.imagesLists) {
      if (v.src == e.currentTarget.dataset.imgsrc) {
        let index = self.data.imagesLists.indexOf(v)
        self.data.imagesLists.splice(index, 1)
        self.setData({
          imagesLists: self.data.imagesLists
        })
        break
      }
    }
  },
  uploadImage: function() {
    let self = this
    self.setData({
      showLoading: true
    })
    wx.chooseImage({
      sourceType: ["album"],
      success: function(res) {
        let tempFilePaths = res.tempFilePaths
        for (const v of tempFilePaths) {
          let randomNum = Math.ceil(Math.random() * 100)
          let key = api.cdn + self.GetTimeString() + tempFilePaths.indexOf(v) + randomNum + '.png'
          console.log(key)
          cos.postObject({
            Bucket: Bucket,
            Region: Region,
            Key: key,
            FilePath: v,
            TaskReady: function(taskId) {
              TaskId = taskId
            },
            onProgress: function(info) {
              var percent = parseInt(info.percent * 10000) / 100;
              var speed = parseInt(info.speed / 1024 / 1024 * 100) / 100;
              // let params = {
              //   uploadPercent: percent
              // }
              // self.data.imagesLists.push(params)
              console.log('进度：' + percent + '%; 速度：' + speed + 'Mb/s;');
              console.log(JSON.stringify(info));
            }
          }, self.requestCallback);
        }
        self.setData({
          showLoading: false
        })
      },
      fail: function() {
        self.setData({
          showLoading: false
        })
      }
    })
  },
  sumbit() {
    let self = this
    if (self.data.imagesLists.length == 0) {
      wx.showModal({
        title: '提示',
        content: '请选择图片',
        showCancel: false
      })
      return
    }
    // getApp().checkSessionId({
    //   suc: self.sumbitUpload
    // })
    self.sumbitUpload()
  },
  sumbitUpload() {
    let self = this
    self.setData({
      showLoading: true
    })
    self.setData({
      sumbitText: '正在上传...'
    })
    let imagesArr = []
    for (const v of self.data.imagesLists) {
      if (!v.id) {
        imagesArr.push({
          pic_artwork: api.baseUrlP + v.src.split('/')[4]
        })
      }
    }
    let params = {
      star_id: self.data.starId,
      pic: imagesArr
    }
    req.postReq('api/pic/upload', params).then(res => {
      self.setData({
        showLoading: false
      })
      if (res.data.state == 'false') {
        wx.showModal({
          title: '提示',
          content: '上传失败，请稍后再试',
          showCancel: false
        })
        return
      }
      wx.redirectTo({
        url: '../uploadResult/uploadResult?uploadState=true' + '&star_id=' + self.data.starId + '&star_name=' + self.data.starName,
      })
      console.log("执行第一个then")
    }).catch(e => {
      console.log("执行catch")
      wx.redirectTo({
        url: '../uploadResult/uploadResult?uploadState=false' + '&star_id=' + self.data.starId + '&star_name=' + self.data.starName,
      })
    })
  },
})