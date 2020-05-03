//app.js
// var sdk = require('/utils/xhw_v0.1.3.js')
var sign = require('/utils/sign.js')
var wxApi = require('/utils/wxApi.js')
var req = require('/utils/wxRequest.js')
var Player = require('/utils/player.js');
App({
  onLaunch: function () {
    let self = this
    wx.loadFontFace({
      family: 'WenYue XinQingNianTi W8',
      source: "url('https://res.heywoodsminiprogram.com/WenYue-XinQingNianTi-W8.woff')"
    })
    // self.makesessionid()
  },
  onShow: function (options) {
    let self = this
    self.globalData.scene = options.scene
    console.log("onShow", options)
    //创建一个播放器实例
    self.globalData.musicPlayer = wx.getBackgroundAudioManager()
  },
  onHide: function () { },
  /** 判断对象为空 */
  isNullOrEmpty(obj) {
    if (typeof obj === 'undefined') {
      return true
    }
    if (obj == 'undefined') {
      return true
    }
    if (obj == null) {
      return true
    }
    if (obj === '') {
      return true
    }
    if (Object.keys(obj).length == 0) {
      return true
    }
    return false
  },
  // checkSessionId: function(obj = {}) {
  //   let self = this
  //   if (!self.isNullOrEmpty(wx.getStorageSync("sessionId"))) {
  //     if (!self.isNullOrEmpty(obj.e)) {
  //       obj.suc(obj.e)
  //     } else {
  //       obj.suc()
  //     }
  //     self.globalData.requestlocks = false //开锁
  //   } else {
  //     if (!self.isNullOrEmpty(obj)) {
  //       self.login(obj)
  //     } else {
  //       self.login()
  //     }
  //   }
  // },
  makesessionid: function (fn) {
    let self = this
    wx.login({
      success: function (loginres) {
        let url = 'api/user/make_session'
        let params = {
          code: loginres.code
        }
        req.makesessionPostRequest(url, params).then(res => {
          console.log('make_sessionRes', res)
          self.globalData.sessionId = res.data.data.mixData.sessionid
          // wx.setStorageSync("sessionId", res.data.data.mixData.sessionid)
          wx.setStorageSync("openid", res.data.data.mixData.openid)
          wx.setStorageSync("uid", res.data.data.mixData.uid)
          // self.globalData.openid = res.data.data.mixData.openid
          self.globalData.shouldUpdate = res.data.data.mixData.shouldUpdate
          self.globalData.isNew = res.data.data.mixData.isNew
          self.version_switch()
          if (typeof fn == "function") {
            fn()
          }
          if (self.globalData.requestQueue.length > 0) {
            let cb = '';
            while (cb = self.globalData.requestQueue.shift()) {
              cb()
            }
          }
          self.globalData.requestlocks = false //开锁
        })
      },
      fail: function (res) {

      },
      complete: function (res) {
        // self.globalData.requestlocks = false //开锁
      },
    })
  },

  login: function (fn) {
    let self = this
    if (self.globalData.requestlocks) { //存在锁的时候
      //在锁，说明makesessionid方法正在被调用，将成功回调方法放入队列
      self.globalData.requestQueue.push(fn)
    } else { //不存在锁的时候 //直接发起makesession请求
      self.globalData.requestlocks = true //上锁
      self.makesessionid(fn)
    }
  },
  setUserInfo(e) {
    console.log("setUserInfo参数", e)
    let self = this
    let params = {}
    console.log("进来这里，证明已授权的情况也可执行到这一步", self.globalData.shouldUpdate)
    if (self.globalData.shouldUpdate == 1) {
      console.log("shouldUpdate判断是否为1或0")
      if (e.detail.userInfo) {
        params = e.detail.userInfo
      } else {
        params = e.detail.detail.userInfo
      }
      params.sessionId = self.globalData.sessionId
      params.nickname = params.nickName
      params.avatar = params.avatarUrl
      params.encryptedData = e.detail.encryptedData
      params.iv = e.detail.iv
      req.postRequest('api/user/set_user_info', params).then(res => { //更新用户信息
        console.log("set_user_info", res)
        console.log("set_user_info_params", params)
        self.globalData.shouldUpdate = 0
        // if (res.code == 10000 || res.code == 10002) {
        //   self.makesessionid()
        // }
      })
    }
  },
  cutMusicName(musicName) {
    let pages = getCurrentPages() //获取加载的页面( 页面栈 )
    let currentPage = pages[pages.length - 1] // 获取当前页面
    let prevPage = pages[pages.length - 2] //获取上一个页面
    console.log("prevPage", prevPage)
    // 设置上一个页面的数据（可以修改，也可以新增）
    let arr = []
    for (let i = 0; i < 4; i++) {
      arr.push(musicName)
    }
    if (prevPage.route == "pages/starIndex/starIndex") {
      prevPage.setData({
        musicNameArr: arr
      })
    }
  },
  cutPlayBtn(){
    let that = this
    let pages = getCurrentPages() //获取加载的页面( 页面栈 )
    let currentPage = pages[pages.length - 1] // 获取当前页面
    let prevPage = pages[pages.length - 2] //获取上一个页面
    if (prevPage.route == "pages/starIndex/starIndex") {
      if (that.globalDatamusicPlayer.paused === true) { //暂停或停止状态
        console.log("暂停或停止状态")
        prevPage.setData({
          isPaused: true
        })
      } else if (that.globalData.musicPlayer.paused === false) { //正在播放状态
        prevPage.setData({
          isPaused: false
        })
      }
    }
  },
  musicContinuePlay(musicUrlArr, index, self) { //继续播放
    console.log("继续播放")
    let that = this
    that.globalData.musicPlayer.play()
    self.setData({
      isPaused: false,
      musicIndex: index,
      toView: "a" + index //自动定位即将要播放的歌曲
    })
    that.globalData.musicPlayer.onEnded(() => {
      console.log("歌曲end3")
      var i = parseInt(index) + 1
      if (i == musicUrlArr.length) {
        i = 0
      }
      console.log(i)
      getApp().globalData.musicIndex = i //自然结束后切歌的时候记录下音乐的索引
      let arr = []
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      self.setData({
        musicNameArr: arr, //切换正在滚动的歌名
        musicIndex: i,
        toView: "a" + i //自动定位即将要播放的歌曲
      })
      console.log(self.data)
      that.globalData.musicPlayer.src = musicUrlArr[i].url
      that.cutMusicName(musicUrlArr[i].music_name)
    })
  },
  cutSong(musicUrlArr, index, self) { //切歌 
    console.log("切歌")
    let that = this
    that.musicPlay(musicUrlArr, index, self)
    that.cutMusicName(musicUrlArr[index].music_name)
    // self.setData({
    //     isPaused: false,
    // })
    // that.globalData.musicPlayer.src = musicUrlArr[index].url
    // that.globalData.musicPlayer.title = '爱豆音乐'
    // // that.globalData.musicPlayer.startTime = 250
    // that.globalData.musicPlayer.onEnded(() => {
    //   // console.log("歌曲end1")
    //   // console.log(musicUrlArr)
    //   // console.log(index)
    //   index++
    //   if (index == musicUrlArr.length) {
    //     index = 0
    //   }
    //   console.log(i)
    //   let arr = []
    //   arr.push(musicUrlArr[index].music_name)
    //   arr.push(musicUrlArr[index].music_name)
    //   arr.push(musicUrlArr[index].music_name)
    //   arr.push(musicUrlArr[index].music_name)
    //   self.setData({
    //     musicNameArr: arr, //切换正在滚动的歌名
    //     musicIndex: index,
    //     toView: "a" + index //自动定位即将要播放的歌曲
    //   })
    //   that.globalData.musicPlayer.src = musicUrlArr[index].url
    // })
  },
  musicPause(musicUrlArr, index, self) {
    let that = this
    that.cutPlayBtn()//切换明星主页的按钮状态
    if (that.globalData.pauseType == 1) {
      that.globalData.musicPlayer.pause()
      self.setData({
        isPaused: true,
      })
    } else {
      that.musicPlay(musicUrlArr, index, self)
      self.setData({
        isPaused: false,
      })
    }
    self.setData({
      musicIndex: index,
      toView: "a" + index //自动定位即将要播放的歌曲
    })
    that.globalData.musicPlayer.onEnded(() => {
      console.log("歌曲end9")
      var i = parseInt(index + 1)
      if (i == musicUrlArr.length) {
        i = 0
      }
      console.log(i)
      getApp().globalData.musicIndex = i //自然结束后切歌的时候记录下音乐的索引
      let arr = []
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      self.setData({
        musicNameArr: arr, //切换正在滚动的歌名
        musicIndex: i,
        toView: "a" + i //自动定位即将要播放的歌曲
      })
      console.log(self.data)
      that.globalData.musicPlayer.src = musicUrlArr[i].url
      that.cutMusicName(musicUrlArr[i].music_name)
    })
  },
  musicPlay(musicUrlArr, index, self) {
    console.log("musicUrlArr",musicUrlArr)
    console.log("index",index)
    console.log("播放")
    let that = this
    if (musicUrlArr.length == 0) { //如果明星没有背景音乐
      return
    }
    self.setData({
      isPaused: false,
    })
    that.globalData.musicPlayer.src = musicUrlArr[index].url
    // that.globalData.musicPlayer.title = '爱豆甜品音乐'
    console.log("标题明星", wx.getStorageSync("musicStarName"))
    if (!!wx.getStorageSync("musicStarName")){
      that.globalData.musicPlayer.title = "我是" + wx.getStorageSync("musicStarName") + "，我在小程序“爱豆甜品”等你"
    }else{
      that.globalData.musicPlayer.title = "我在小程序“爱豆甜品”等你"
    }
    // that.globalData.musicPlayer.startTime = 240
    that.globalData.musicPlayer.onEnded(() => {
      
      console.log("歌曲end2")
      var i = parseInt(index + 1)
      if (i == musicUrlArr.length) {
        i = 0
      }
      console.log(i)
      getApp().globalData.musicIndex = i //自然结束后切歌的时候记录下音乐的索引
      let arr = []
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      arr.push(musicUrlArr[i].music_name)
      self.setData({
        musicNameArr: arr, //切换正在滚动的歌名
        musicIndex: i,
        toView: "a" + i //自动定位即将要播放的歌曲
      })
      console.log(self.data)
      that.globalData.musicPlayer.src = musicUrlArr[i].url
      that.cutMusicName(musicUrlArr[i].music_name)
    })
    that.globalData.musicPlayer.onStop(() => {

    })
  },
  version_switch(){
    req.postRequest('api/version_control/show', {}).then(res => {
      console.log("api/version_control/show", res)
      if (res.data.code==1){
        var upload_status = res.data.data.lists.upload_status;
        console.log("upload_status", upload_status)
        if (upload_status==0){
          wx.reLaunch({
            url: '/pages/video/video?upload_status=0'
          })
        }
      }
    })
  },
  globalData: {
    musicStaus: '',
    userInfo: null,
    openid: '',
    appid: 'wx283268f97015f145',
    // sdk: sdk,
    sign: sign,
    requestlocks: false, //true存在锁，false不存在锁
    requestQueue: [], //请求队列
    sessionId: '',
    isLogin: 0, //0:为登陆授权，1：已登陆授权，
    userInfoObj: {},
    userInfo: {
      nickName: '',
      avatarUrl: ''
    },
    starName: '',
    isFirstEntry: true,
    isNewLocks: 0,
    isNew: 0, //是否为新用户的标志（0不是新用户 1是新用户）
    handShow: true,
    handSwiperShow: true,
    cueShow: true,
    formIdCollectLocks: false, //防止重复点击收 集formid
    musicPlayer: {},
    windowWidth: 375, //设备的屏幕宽度 默认为375
    windowHeight: 667, //设备的屏幕高度 默认为667
    navHeaderHeight: 63, //顶部Header的高度
    navFooterHeight: 52, //底部footer的高度
    videoContainerHeight: '', //视频的高度
    statusBarHeight: 0, //状态栏的高度
    isIponeX: false, //是否为iponeX的标志
    currentPagesObj: {
      appid: '',
    },
    scene: '', //
    musicIndex: '', //音乐索引
    isPause: false, //是否暂停播放音乐
    shouldUpdate: 1,
    pauseType: 0, // 0:系统暂停，1用户暂停
    currentMusicObj: '',
    setSrc: false, //是否可以播放应约的src,
    playMusic: null,//判断来源不同控制是否播放音乐
  }
})