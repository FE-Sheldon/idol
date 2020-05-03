// pages/guide/guide.js
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var api = require('../../utils/api.js')
//引入图片预加载组件
const ImgLoader = require('../../img-loader/img-loader.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  time: '',
  imgLoader: "",
  countDownShow: false,
  valHandle:"",//定时器
  data: {
    stepText: 5, //设置倒计时初始值
    openPhotoSrc: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this
    self.imgLoader = new ImgLoader(self) //初始化图片预加载组件
    publicFu.setDom() //做手机适配
    if (app.globalData.isFirstEntry) { //第一次进来
      self.getStartDiagram() //获取开屏图
    } else {
      wx.switchTab({
        url: "/pages/home/home"
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

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
  _countDown() { //https://www.jianshu.com/p/4ba43973903e 圆环倒计时
    const ctx = wx.createCanvasContext("myCanvas")
    console.log("倒计时动画开始")
    var self = this
    self.data.stepText = 5 //重新设置一遍初始值，防止初始值被改变 倒计时为5秒
    var step = self.data.stepText; //定义倒计时
    var num = -0.5;
    var decNum = 2 / step / 10
    clearInterval(self.valHandle)
    function drawArc(endAngle) {
      ctx.setLineWidth(2 * getApp().globalData.windowWidth / 375)
      ctx.setFontSize(14 * getApp().globalData.windowWidth / 375)
      ctx.setFillStyle('#fff')
      ctx.setTextAlign('center')
      ctx.setTextBaseline('middle')
      ctx.fillText("跳过", 22 * getApp().globalData.windowWidth / 375, 22 * getApp().globalData.windowWidth / 375)
      ctx.arc(22 * getApp().globalData.windowWidth / 375, 22 * getApp().globalData.windowWidth / 375, 20.5 * getApp().globalData.windowWidth / 375, 1.5 * Math.PI, endAngle, true)
      ctx.setStrokeStyle('white')
      ctx.stroke()
      ctx.draw()
    }
    self.valHandle = setInterval(function() {
      step = (step - 0.1).toFixed(1)
      num += decNum
      step > 0 && drawArc(num * Math.PI)
      if (step <= 0) {
        clearInterval(self.valHandle) //销毁定时器
        self.setData({
          countDownShow: false
        })
        wx.switchTab({
          url: "/pages/home/home"
        })
      }
    }, 100)
  },
  countDown() {
    let self = this
    var context = wx.createCanvasContext('myCanvas')
    context.beginPath()
    context.setLineWidth(5 * getApp().globalData.windowWidth / 375)
    context.setFontSize(14 * getApp().globalData.windowWidth / 375)
    context.setFillStyle('#fff')
    context.setTextAlign('center')
    context.setTextBaseline('middle')
    context.fillText("跳过", 22 * getApp().globalData.windowWidth / 375, 22 * getApp().globalData.windowWidth / 375)
    context.font = "bold 16px WenYue-XinQingNianTi-W8";
    context.fill()
    context.closePath()
    context.draw()
    var step = 1, //计数动画次数
      num = 0, //计数倒计时秒数（n - num）
      start = 1.5 * Math.PI, // 开始的弧度
      end = -0.5 * Math.PI; // 结束的弧度
    self.time = null; // 计时器容器

    var animation_interval = 1000, // 每1秒运行一次计时器
      n = 5; // 当前倒计时为5秒
    // 动画函数
    function animation() {

      if (step < n) {
        end = end + 2 * Math.PI / n;
        ringMove(start, end);
        step++;
      } else { //倒计时结束
        wx.switchTab({
          url: "/pages/home/home"
        })
        clearInterval(self.time);
      }
    };
    // 画布绘画函数
    function ringMove(s, e) {
      // 绘制圆环
      context.setStrokeStyle('#fff')
      context.beginPath()
      context.setLineWidth(2)
      context.arc(22 * getApp().globalData.windowWidth / 375, 22 * getApp().globalData.windowWidth / 375, 20.5 * getApp().globalData.windowWidth / 375, s, e, true)
      context.stroke()
      context.closePath()

      // 绘制倒计时文本
      context.beginPath()
      context.setLineWidth(5 * getApp().globalData.windowWidth / 375)
      context.setFontSize(14 * getApp().globalData.windowWidth / 375)
      context.setFillStyle('#fff')
      context.setTextAlign('center')
      context.setTextBaseline('middle')
      // context.fillText(n - num + '', 50, 50, 33)
      context.fillText("跳过", 22 * getApp().globalData.windowWidth / 375, 22 * getApp().globalData.windowWidth / 375)
      context.font = "bold" + 16 * getApp().globalData.windowWidth / 375 + "px WenYue-XinQingNianTi-W8";
      context.fill()
      context.closePath()

      context.draw()

      // 每完成一次全程绘制就+1
      num++;

    }
    // 倒计时前先绘制整圆的圆环
    ringMove(start, end);
    // 创建倒计时m.h987yuitryuioihyhujik[jhgvfbnvnjmnbvbnm,nbvfcgklkjhg545545545u ]
    self.time = setInterval(animation, animation_interval);
  },
  getStartDiagram() {
    let self = this
    req.postRequest('api/start_diagram/list', {}).then(res => {
      console.log('api/start_diagram/list', res)
      if (res.data.data.length == 0) { //后台没有录开屏图
        wx.switchTab({
          url: "/pages/home/home"
        })
        self.setData({
          countDownShow: false
        })
        return
      }
      self.setData({
        openPhotoSrc: res.data.data.lists.img_url
      })
      self.imgLoader.load(res.data.data.lists.img_url, (err, data) => {
        self.setData({
          countDownShow: true
        })
        self._countDown() //开启倒计时
        console.log('图片加载完成', err, data.src) 
      })
      app.globalData.isFirstEntry = false
    })
  },
  jump() { //跳过开屏页
    let self = this
    self.setData({
      countDownShow: false
    })
    wx.switchTab({
      url: "/pages/home/home"
    })
    clearInterval(self.valHandle);
    app.globalData.isFirstEntry = false
  },
})