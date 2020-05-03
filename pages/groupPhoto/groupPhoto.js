// pages/groupPhoto/groupPhoto.js
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var api = require('../../utils/api.js')
var temp = {
  a: '',
}
Page({

  /**
   * 页面的初始数据
   */
  lastX: 0,
  lastY: 0,
  userCanvas: {},
  starCanvas: {},
  juxinWidth: 170,
  juxinHeight: 170, //以iphone6为标准
  userTemp: {
    x: '',
    y: '',
    x1: 0,
    y1: 0,
    rate: 1.5,
    distance: 0,
    width: '',
    height: '',
  },
  starTemp: {
    x: '',
    y: '',
    x1: 0,
    y1: 0,
    rate: 1.5,
    distance: 0,
    width: '',
    height: '',
  },
  data: {
    isIphoneX: false,
    locks: false,
    showLoading: false,
    qrSrc: "", //二维码图片
    picId: '', //照片id
    starId: '', //明星id
    starName: '', //明星名字
    canvasWidth: '',
    canvasHeight: '',
    userPhotoSrc: '', //用户上传的个人照片src
    starPhotoSrc: '', //明星照片src
    templetNumber: 1, //样板号
    currentTempletIndex: 0, //当前选中的模板小图
    // templetMiniPhotoList: [{
    //   id: 10,
    //   src: "/assets/images/photoTemplet10.png",
    // }, {
    //   id: 11,
    //   src: "/assets/images/photoTemplet11.png",
    // },{
    //   id: 12,
    //   src: "/assets/images/photoTemplet12.png",
    // }],
    // templetMiniPhotoList: [{
    //   id: 1,
    //   src: "/assets/images/photoTemplet1.png",
    // }, {
    //   id: 2,
    //   src: "/assets/images/photoTemplet2.png",
    // }, {
    //   id: 3,
    //   src: "/assets/images/photoTemplet3.png",
    // }, {
    //   id: 4,
    //   src: "/assets/images/photoTemplet4.png",
    // }, {
    //   id: 5,
    //   src: "/assets/images/photoTemplet5.png",
    // }, {
    //   id: 6,
    //   src: "/assets/images/photoTemplet6.png",
    // }, {
    //   id: 7,
    //   src: "/assets/images/photoTemplet7.png",
    // }, {
    //   id: 8,
    //   src: "/assets/images/photoTemplet8.png",
    // }, {
    //   id: 9,
    //   src: "/assets/images/photoTemplet9.png",
    // }]
    templetMiniPhotoList: [{
        id: 1,
        src: "/assets/images/photoTemplet1.png",
      },
      {
        id: 2,
        src: "/assets/images/photoTemplet2.png",
      }, {
        id: 3,
        src: "/assets/images/photoTemplet3.png",
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("合照页面参数", options)
    let self = this
    wx.getImageInfo({
      src: options.star_photo_src.indexOf("webp") != -1 ? options.star_photo_src + "?imageMogr2/format/png" : options.star_photo_src,
      success(res) {
        self.starTemp.width = res.width;
        self.starTemp.height = res.height;
        console.log("---------------", res)
        self.setData({
          starPhotoSrc: res.path
        })
        self.setCanvas() //绘制用户上传和明星的照片
      }
    })
    self.setData({
      userPhotoSrc: options.user_photo_src,
      picId: options.pic_id, //照片id
      starId: options.star_id, //明星id
      starName: options.star_name, //明星名字
      photoType: options.photo_type, //照片是精选还是广场
      isIphoneX: wx.getStorageSync("isIphoneX")
    })

    self.getQR() //获取二维码

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
  roundRect(ctx, x, y, w, h, r) {
    // 开始绘制
    ctx.beginPath()
    // 因为边缘描边存在锯齿，最好指定使用 transparent 填充
    // 这里是使用 fill 还是 stroke都可以，二选一即可
    ctx.setFillStyle('transparent')
    // ctx.setStrokeStyle('transparent')
    // 左上角
    ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)

    // border-top
    ctx.moveTo(x + r, y)
    ctx.lineTo(x + w - r, y)
    ctx.lineTo(x + w, y + r)
    // 右上角
    ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)

    // border-right
    ctx.lineTo(x + w, y + h - r)
    ctx.lineTo(x + w - r, y + h)
    // 右下角
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)

    // border-bottom
    ctx.lineTo(x + r, y + h)
    ctx.lineTo(x, y + h - r)
    // 左下角
    ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)

    // border-left
    ctx.lineTo(x, y + r)
    ctx.lineTo(x + r, y)

    // 这里是使用 fill 还是 stroke都可以，二选一即可，但是需要与上面对应
    ctx.fill()
    // ctx.stroke()
    ctx.closePath()
    // 剪切
    ctx.clip()
  },
  setCanvas() {
    let self = this;
    var wxSys = wx.getSystemInfoSync();
    // self.setData({
    //   userCanvas: wx.createCanvasContext("userCanvas")
    // })
    let userCanvasId = "userCanvas" + self.data.templetNumber
    let starCanvasId = "starCanvas" + self.data.templetNumber
    self.userCanvas = wx.createCanvasContext(userCanvasId)
    self.userCanvas.clearRect(0, 0, 1000, 1000);
    self.starCanvas = wx.createCanvasContext(starCanvasId)
    self.starCanvas.clearRect(0, 0, 1000, 1000);
    // let left = (self.data.canvasWidth / 2 - self.juxinWidth * 2) / 2
    // let top = (self.data.canvasWidth / 2) * 0.23
    wx.getImageInfo({
      src: self.data.userPhotoSrc,
      success(res) {
        console.log(res);
        self.userTemp.width = res.width;
        self.userTemp.height = res.height;
        // self.userCanvas.save(); // 先保存状态 已便于画完圆再用
        // self.userCanvas.beginPath(); //开始绘制
        // self.userCanvas.arc(85, 85, 85, 0, Math.PI * 0.5, false);
        // self.userCanvas.clip()
        // self.roundRect(self.userCanvas, 0, 0, 170, 170, 85)
        self.userCanvas.drawImage(self.data.userPhotoSrc, 0, 0, self.userTemp.width, self.userTemp.height, self.userTemp.x1, self.userTemp.y1, self.juxinWidth * 2 * self.userTemp.rate, self.juxinWidth * 2 * self.userTemp.rate * (self.userTemp.height / self.userTemp.width))
        self.userCanvas.draw()
      }
    })
    self.starCanvas.drawImage(self.data.starPhotoSrc, 0, 0, self.starTemp.width, self.starTemp.height, self.starTemp.x1, self.starTemp.y1, self.juxinWidth * 2 * self.starTemp.rate, self.juxinWidth * 2 * self.starTemp.rate * (self.starTemp.height / self.starTemp.width))
    self.starCanvas.draw()
  },
  getQR() {
    let self = this
    wx.downloadFile({
      url: api.baseUrl + "api/get_qr_code?star_id=" + self.data.starId + "&pic_id=" + self.data.picId + "&type=" + self.data.photoType,
      success(data) {
        self.setData({
          qrSrc: data.tempFilePath
        })
      },
      fail(data) {

      },
      complete(data) {

      }
    })
  },
  clickTemplet(e) {
    let self = this
    self.userTemp = {
      x: '',
      y: '',
      x1: 0,
      y1: 0,
      rate: 1.5,
      distance: 0,
    }
    self.starTemp = {
      x: '',
      y: '',
      x1: 0,
      y1: 0,
      rate: 1.5,
      distance: 0,
      width: self.starTemp.width,
      height: self.starTemp.height,
    }
    if (self.data.currentTempletIndex != e.currentTarget.dataset.index) {
      self.setData({
        currentTempletIndex: e.currentTarget.dataset.index,
        toView: "t" + e.currentTarget.dataset.index,
        templetNumber: e.currentTarget.dataset.id
      })
      if (self.data.templetNumber == 1) {
        self.juxinWidth = 340 / 2
        self.juxinHeight = 340 / 2
      } else if (self.data.templetNumber == 2) {
        self.juxinWidth = 358 / 2
        self.juxinHeight = 426 / 2
      } else if (self.data.templetNumber == 3) {
        self.juxinWidth = 360 / 2
        self.juxinHeight = 360 / 2
      }
      self.setCanvas()
    }
  },
  moveUserPhoto(res) {
    console.log("moveUserPhotores", res);
    let self = this;
    if (res.touches.length == 1) {
      var x = res.touches[0].pageX;
      var y = res.touches[0].pageY;
      self.moveUser(x, y);
    } else {
      let distance = Math.sqrt(Math.sqrt((res.touches[0].pageX - res.touches[1].pageX) * (res.touches[0].pageX - res.touches[1].pageX) + (res.touches[0].pageY - res.touches[1].pageY) * (res.touches[0].pageY - res.touches[1].pageY)))
      // self.userTemp.rate = distance / self.userTemp.distance;
      console.log(self.userTemp.rate, "rateraterateraterate")
      if (self.userTemp.rate + (distance / self.userTemp.distance - 1) > 0.6) {
        self.userTemp.rate += (distance / self.userTemp.distance - 1);
        self.userTemp.distance = distance;
      }
      self.drawUserImage();
    }
  },
  moveStarPhoto(res) {
    console.log("moveStarPhotores", res);
    let self = this;
    if (res.touches.length == 1) {
      var x = res.touches[0].pageX;
      var y = res.touches[0].pageY;
      self.moveStar(x, y);
    } else {
      let distance = Math.sqrt(Math.sqrt((res.touches[0].pageX - res.touches[1].pageX) * (res.touches[0].pageX - res.touches[1].pageX) + (res.touches[0].pageY - res.touches[1].pageY) * (res.touches[0].pageY - res.touches[1].pageY)))
      // self.starTemp.rate = distance / self.starTemp.distance;

      if (self.starTemp.rate + (distance / self.starTemp.distance - 1) > 0.6) {
        self.starTemp.rate += (distance / self.starTemp.distance - 1);
        self.starTemp.distance = distance;
      }
      self.drawStarImage();
    }
  },
  moveUser: function(x, y) {
    let self = this;
    if (self.userTemp.x) {
      self.userTemp.x1 += x - self.userTemp.x
      self.userTemp.y1 += y - self.userTemp.y
      self.userTemp.x = x;
      self.userTemp.y = y;
      if (self.userTemp.x1 > 0) {
        self.userTemp.x1 = 0
      }
      if (self.userTemp.y1 > 0) {
        self.userTemp.y1 = 0
      }
      if (self.juxinWidth * 2 * self.userTemp.rate + self.userTemp.x1 <= getApp().globalData.windowWidth * self.juxinWidth / 375) {
        console.log("右边有空白")
        self.userTemp.x1 = getApp().globalData.windowWidth * self.juxinWidth / 375 - self.juxinWidth * 2 * self.userTemp.rate
      }

      if (self.juxinWidth * 2 * self.userTemp.rate * (self.userTemp.height / self.userTemp.width) + self.userTemp.y1 <= getApp().globalData.windowWidth * self.juxinHeight / 375) {
        console.log("下边有空白")
        self.userTemp.y1 = (getApp().globalData.windowWidth * self.juxinHeight / 375) - self.juxinWidth * 2 * self.userTemp.rate * (self.userTemp.height / self.userTemp.width)
      }
      self.drawUserImage();
    }
  },
  moveStar: function(x, y) {
    let self = this;
    if (self.starTemp.x) {
      self.starTemp.x1 += x - self.starTemp.x
      self.starTemp.y1 += y - self.starTemp.y
      self.starTemp.x = x;
      self.starTemp.y = y;
      if (self.starTemp.x1 > 0) {
        self.starTemp.x1 = 0
      }
      if (self.starTemp.y1 > 0) {
        self.starTemp.y1 = 0
      }
      if (self.juxinWidth * 2 * self.starTemp.rate + self.starTemp.x1 <= getApp().globalData.windowWidth * self.juxinWidth / 375) {
        console.log("右边有空白")
        self.starTemp.x1 = getApp().globalData.windowWidth * self.juxinWidth / 375 - self.juxinWidth * 2 * self.starTemp.rate
      }
      if (self.juxinWidth * 2 * self.starTemp.rate * (self.starTemp.height / self.starTemp.width) + self.starTemp.y1 <= getApp().globalData.windowWidth * self.juxinHeight / 375) {
        console.log("下边有空白")
        self.starTemp.y1 = (getApp().globalData.windowWidth * self.juxinHeight / 375) - self.juxinWidth * 2 * self.starTemp.rate * (self.starTemp.height / self.starTemp.width)
      }
      self.drawStarImage();
    }
  },
  endMoveUserPhoto: function(res) {
    var self = this;
    delete self.userTemp.x;
    delete self.userTemp.y;
    delete self.userTemp.distance
  },
  endMoveStarPhoto: function(res) {
    var self = this;
    delete self.starTemp.x;
    delete self.starTemp.y;
    delete self.starTemp.distance
  },
  startMoveUserPhoto: function(res) {
    var self = this;
    if (res.touches.length == 1) {
      self.userTemp.x = self.userTemp.x || res.touches[0].pageX;
      self.userTemp.y = self.userTemp.y || res.touches[0].pageY;
    } else {
      self.userTemp.distance = Math.sqrt(Math.sqrt((res.touches[0].pageX - res.touches[1].pageX) * (res.touches[0].pageX - res.touches[1].pageX) + (res.touches[0].pageY - res.touches[1].pageY) * (res.touches[0].pageY - res.touches[1].pageY)))
    }

  },
  startMoveStarPhoto: function(res) {
    var self = this;
    if (res.touches.length == 1) {
      self.starTemp.x = self.starTemp.x || res.touches[0].pageX;
      self.starTemp.y = self.starTemp.y || res.touches[0].pageY;
    } else {
      self.starTemp.distance = Math.sqrt(Math.sqrt((res.touches[0].pageX - res.touches[1].pageX) * (res.touches[0].pageX - res.touches[1].pageX) + (res.touches[0].pageY - res.touches[1].pageY) * (res.touches[0].pageY - res.touches[1].pageY)))
    }

  },
  drawStarImage: function() {
    var self = this;
    self.starCanvas.drawImage(self.data.starPhotoSrc, 0, 0, self.starTemp.width, self.starTemp.height, self.starTemp.x1, self.starTemp.y1, self.juxinWidth * 2 * self.starTemp.rate, self.juxinWidth * 2 * self.starTemp.rate * (self.starTemp.height / self.starTemp.width))
    self.starCanvas.draw()
  },
  drawUserImage: function() {
    var self = this;
    self.userCanvas.drawImage(self.data.userPhotoSrc, 0, 0, self.userTemp.width, self.userTemp.height, self.userTemp.x1, self.userTemp.y1, self.juxinWidth * 2 * self.userTemp.rate, self.juxinWidth * 2 * self.userTemp.rate * (self.userTemp.height / self.userTemp.width))
    self.userCanvas.draw()
  },
  synthesisPhoto(e) {
    let self = this
    if (self.data.locks) {
      return
    }
    self.setData({
      locks: true //上锁
    })
    wx.showLoading({
      title: '正在合成..',
    })
    var ctx = wx.createCanvasContext('myCanvas')
    ctx.clearRect(0, 0, 1000, 1000);
    let getSystemInfoSync = wx.getSystemInfoSync()
    let width = getSystemInfoSync.windowWidth <= 375 ? getSystemInfoSync.windowWidth : 375
    let photoTempletBgLeft = getSystemInfoSync.windowWidth <= 375 ? 0 : (getSystemInfoSync.windowWidth - 375) / 2

    if (self.data.templetNumber == 1) {
      var userPhotoLeft = (width * 14) / 750 + photoTempletBgLeft
      var userPhotoTop = (width * 196) / 751
      var starPhotoLeft = (width * 382) / 750 + photoTempletBgLeft
      var starPhotoTop = (width * 196) / 751
    } else if (self.data.templetNumber == 2) {
      var userPhotoLeft = 0 + photoTempletBgLeft
      var userPhotoTop = (width * 154) / 751
      var starPhotoLeft = (width * 377) / 750 + photoTempletBgLeft
      var starPhotoTop = (width * 154) / 751
    } else if (self.data.templetNumber == 3) {
      var userPhotoLeft = 0 + photoTempletBgLeft
      var userPhotoTop = (width * 375) / 751
      var starPhotoLeft = (width * 376) / 750 + photoTempletBgLeft
      var starPhotoTop = 0
    }



    var textLeft1 = (width * 52) / 750 + photoTempletBgLeft
    var textTop1 = (width * 849) / 751
    var textLeft2 = (width * 52) / 750 + photoTempletBgLeft
    var textTop2 = (width * 898) / 751
    var qrLeft = (width * 537) / 750 + photoTempletBgLeft
    var qrTop = (width * 780) / 751
    var qrwidth = (width * 160) / 750
    console.log(self.data.starPhotoSrc, "starPhotoSrc")
    console.log(self.data.userPhotoSrc, "userPhotoSrc")
    console.log(self.juxinWidth, "juxinWidth")
    console.log(self.juxinHeight, "juxinHeight")
    console.log(userPhotoLeft, "userPhotoLeft")
    console.log(userPhotoTop, "userPhotoTop")
    setTimeout(() => {
      wx.canvasToTempFilePath({
        canvasId: 'userCanvas' + self.data.templetNumber,
        success: function(res) {
          ctx.drawImage(res.tempFilePath, userPhotoLeft, userPhotoTop, self.juxinWidth + 10, self.juxinHeight + 10)
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId: 'starCanvas' + self.data.templetNumber,
              success: function(resp) {
                ctx.drawImage(resp.tempFilePath, starPhotoLeft, starPhotoTop, self.juxinWidth + 8, self.juxinHeight + 10);
                ctx.drawImage("/assets/images/photoTempletBgQR" + self.data.templetNumber + ".png", photoTempletBgLeft, 0, width, width + 100);
                // ctx.font = '17px WenYue-HouXianDaiTi-NC-W2-75'
                ctx.setFontSize(16)
                ctx.fillStyle = '#556070';
                ctx.fillText("长按识别二维码", textLeft1, textTop1)
                ctx.fillText("我也要和“" + self.data.starName + "”合照", textLeft2, textTop2)
                ctx.drawImage(self.data.qrSrc, qrLeft, qrTop, qrwidth, qrwidth);
                ctx.save(); //保存状态
                ctx.draw()
                setTimeout(() => {
                  wx.canvasToTempFilePath({
                    canvasId: 'myCanvas',
                    success: function(res) {
                      console.log('生成图片', res.tempFilePath);
                      publicFu.mongoCollect(e, self, 10003) //mongo埋点上报
                      self.setData({
                        locks: false //解锁
                      })
                      wx.hideLoading()
                      wx.previewImage({
                        urls: [res.tempFilePath],
                        success: function() {
                          console.log('previewImage success');
                        },
                        fail: function() {
                          console.log('previewImage fail');
                        },
                        complete: function() {

                        }
                      })
                    },
                    fail: function(res) {
                      console.log('fail = ', res)
                    }
                  })
                }, 500)
              },
              fail: function(fail) {
                console.log(fail)
              }
            })
          }, 500)
        }
      })
    }, 100)
  },
})