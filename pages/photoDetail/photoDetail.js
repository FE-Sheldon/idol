// pages/photoDetail/photoDetail.js
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var api = require('../../utils/api.js')
var clickNumber = 0
var clickNextNumber = 0
var handleTime1 //操作按钮的动画计时器
var handleTime2 //操作按钮的动画计时器

// 获取显示区域长宽
const device = wx.getSystemInfoSync()
const W = device.windowWidth
const H = device.windowHeight - 50
Page({

  /**
   * 页面的初始数据
   */
  num1: 0,
  num: 0,
  len: 0,
  clickStatus: 'stop', //舔屏的状态
  animationList: [],
  dialogueAnimationList: [],
  index1: 0, //点击没有停止的时候继续这个index赋值
  index: 0,
  effectWordList: [{
      img_url: {
        img_url: "../../assets/images/text/1.png",
        width: 170,
        height: 44,
      }
    },
    {
      img_url: {
        img_url: "../../assets/images/text/2.png",
        width: 170,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/3.png",
        width: 170,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/4.png",
        width: 170,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/5.png",
        width: 170,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/6.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/7.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/8.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/9.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/10.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/11.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/12.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/13.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/14.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/15.png",
        width: 220,
        height: 44,
      }
    }, {
      img_url: {
        img_url: "../../assets/images/text/16.png",
        width: 220,
        height: 44,
      }
    },
  ],
  arrIndex: 0,
  locks: false,
  data: {
    groupPhotoBtnShow:false,
    loadingText: '保存中...',
    openType: '',
    effectWordObj: {},
    showLoading: false,
    addShare: false, //是否可以加人气的标志
    isOnload: false, //onload周期是否加载了
    sharePopularShow: false,
    sharePopularIcon1: '',
    sharePopularIcon2: "",
    sharePopular: [], //分享人气的数字
    sharePopularShow: false,
    welCropperShow: false,
    starPhotoSrc: '', //合照的明星照片src
    shareTitleList: [{
      message: '今天的我，你喜欢么？'
    }, {
      message: '我想你了，怎么你还不来找我？'
    }, {
      message: '今天也要为我加油点赞哦！'
    }, {
      message: '这周能让我登榜首么？'
    }, {
      message: '记得常来看我哦！'
    }, {
      message: '今天你更新我的美图了吗？'
    }, {
      message: '看我可爱冲击波~~~~~~~~~'
    }, {
      message: '喜欢我就把我转走吧！'
    }, {
      message: '上传你手中的图片让更多粉丝认识我吧！'
    }, {
      message: '检验真爱粉时刻：这些图你都有吗？'
    }, {
      message: '检验真爱粉时刻：今天你点赞了没？'
    }],
    musicPlayAm: '', //控制音乐播放列表的出现和消失
    toView: "a0",
    isPaused: false, //音乐是否暂停的标志
    musicIndex: '', //当前播放音乐的索引
    // guideAnimationShow:false,
    loading: true,
    // handleLocks: false, //控制操作按钮显示隐藏的锁
    handleShow: true, //操作按钮是否显示
    from_page: '', //来自哪个页面
    imgUrls: [
      'https://idols.heywoodsminiprogram.com/images/photo3.png',
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    starName: '', //明星的名字
    is_share: 0, //是否是分享出去的页面
    indicatorDots: false,
    statusBarHeight: 0, //状态栏的高度
    isIphoneX: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    deg: 0,
    musicList: [],
    animationList: [], //爱心动画数据
    popularAnimationList: [], //人气动画数据
    dialogueAnimationList: [], //效果字动画数据
    index: 0,
    picId: '', //照片id
    starId: '', //明星id
    swiperHeight: 150, //swiper的高度
    downloadTime: 0, //图片下载次数
    thumbsTime: 0, //点赞数
    isThumbs: 0, // 是否点赞 1：点赞、0：未点赞
    popularTime: 0, //人气
    detailPic: {}, //页面全部数据
    locks: false, //防止舔屏时重复调用点赞接口
    currentPhotoSrc: '', //当前显示的照片的src
    currentIndex: 0, //当前所在滑块的 index,默认为0
    popularNumShow: false, //人气出现的标识
    addPopularLocks: false, //加人气的请求锁
    addPopularClickNumber: 0, //加人气的点击次数
    currentPage: 1, //当前页码
    totalPage: 1, //总页数
    nickName: '', //上传图片的用户昵称
    likeAnimationShow: false, //点赞按钮是否执行动画
    shareAnimationShow: false, //分享按钮是否执行动画
    photoType: 0, //最热或是最新的标志
    windowHeight: '',
    windowWidth: '',
    handShow: false,
    handSwiperShow: false,
    options: {}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    let self = this
    let randomNum = Math.floor(Math.random() * self.data.shareTitleList.length)
    if(e.from == 'button'){
      e.target.dataset.buttontype == "download" && self.setData({ //点击下载按钮
        addShare: false
      })
      e.target.dataset.buttontype == "share" && self.setData({ //点击分享按钮
        addShare: true
      })
    }
    return {
      title: self.data.shareTitleList[randomNum].message,
      imageUrl: self.data.detailPic.lists[self.data.currentIndex].detail.pic_share,
      path: '/pages/starIndex/starIndex?star_id=' + self.data.starId + '&pic_id=' + self.data.picId + "&is_share=1" + "&photo_type=" + self.data.photoType + '&star_name=' + self.data.starName + '&go_page=photoDetail',
      success: function(res) {
        // self.shareAddPopular() //分享加人气
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    getApp().globalData.formIdCollectLocks = false
    console.log("明星详情页页面参数", options)
    let self = this
    self.getUploadPhotoBtnStatus()//控制合照入口按钮的显示与隐藏
    console.log("wx.getStorageSync", wx.getStorageSync("isAuthorizeWritePhotosAlbum") === true)
    wx.getStorageSync("isAuthorizeWritePhotosAlbum") === true && self.setData({ //若已授权
      openType: "share"
    })
    self.setData({
      options: options
    })
    wx.getSystemInfo({
      success: function(res) {
        self.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    // if (options.is_share != undefined) { //如果是分享过来的页面
    //   self.setData({
    //     is_share: options.is_share == 1 ? true : false
    //   })
    // }
    publicFu.setDom(self) //做手机适配

    self.setData({
      photoType: options.scene == undefined ? options.photo_type == undefined ? "" : options.photo_type : options.scene.split("_")[2], //最热或是最新
      picId: options.scene == undefined ? options.pic_id == undefined ? "" : options.pic_id : options.scene.split("_")[1],
      starId: options.scene == undefined ? options.star_id == undefined ? "" : options.star_id : options.scene.split("_")[0],
      starName: options.star_name == undefined ? '' : options.star_name,
      from_page: options.from_page == undefined ? '' : options.from_page,

      musicIndex: options.music_index == undefined ? self.data.musicIndex : options.music_index,
      toView: options.music_index == undefined ? 'a' + self.data.musicIndex : 'a' + options.music_index,
      // currentIndex: options.current_index == undefined ? 0 : options.current_index,
    })
    wx.setStorageSync("musicStarName", self.data.starName)
    self.getEffectWordList()
    console.log("toview", self.data.toView)
    self.getRank() //拿图片索引

    self.getMusicList() //获取音乐列表
    self.setData({
      isOnload: true
    })
  },
  onPageScroll() {
    let self = this
    self.hidePlayList() //滑动时隐藏播放列表
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("photoDetail执行onshow")
    let self = this
   
    // console.log("播放状态 1: 播放中 2: 停止 0: 暂停", getApp().globalData.musicPlayer.data())
    // if (getApp().globalData.musicPlayer.data().audio == null) {
    //   getApp().musicPlay(self.data.starName) //重新设置src
    //   getApp().globalData.musicPlayer.start()
    // } else {
    //   if (getApp().globalData.musicPlayer.data().audio.dataUrl != getApp().getMusicSrc(self.data.starName)) {
    //     getApp().globalData.musicPlayer.list.clear() //清空播放列表
    //     getApp().musicPlay(self.data.starName) //重新设置src
    //     getApp().globalData.musicPlayer.start()
    //   } else {
    //     if (self.data.from_page == 'starIndexPage') {
    //       return
    //     }
    //     getApp().globalData.musicPlayer.start()
    //   }
    // }
    // if (self.data.from_page == 'starIndexPage') {
    //   self.data.from_page = ''
    //   return
    // }
    // getApp().checkSessionId({
    //   suc: self.getMusicList //加载音乐列表
    // })
    if (self.data.addShare) {
      self.shareAddPopular()
    }
    // if (!self.data.isOnload) {
    //   if (getApp().globalData.musicPlayer.paused == undefined) { //未开始播放状态
    //     getApp().musicPlay(self.data.musicList, self.data.musicIndex, self)
    //   } else if (getApp().globalData.musicPlayer.paused === true) { //暂停或停止状态
    //     getApp().musicPause(self.data.musicList, self.data.musicIndex, self)
    //   } else if (getApp().globalData.musicPlayer.paused === false) { //正在播放状态

    //   }
    // }
    self.setData({
      isOnload: false
    })
    // getApp().globalData.musicPlayer.play()
    
    // getApp().musicPlay(self.data.starName)
    // getApp().globalData.musicPlayer.play()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let self = this

    getApp().globalData.musicIndex = self.data.musicIndex //记录下离开时音乐索引
    if (getApp().globalData.handShow) {
      getApp().globalData.handShow = false
    }
    if (getApp().globalData.handSwiperShow) {
      getApp().globalData.handSwiperShow = false
    }
    self.setData({
      locks: false //离开页面时解锁
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    let self = this
    getApp().globalData.musicIndex = self.data.musicIndex //记录下离开时音乐索引
    if (getApp().globalData.handShow) {
      getApp().globalData.handShow = false
    }
    if (getApp().globalData.handSwiperShow) {
      getApp().globalData.handSwiperShow = false
    }
    self.setData({
      locks: false //离开页面时解锁
    })
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
  imgScroll() {
    let self = this
    self.hidePlayList()
  },
  swiperChange: function(e) {
    //左右滑开始清空数组
    let self = this
    self.hidePlayList()
    // clearTimeout(handleTime1) //清空计时器
    // clearTimeout(handleTime2) //清空计时器
    // if (e.detail.source == 'touch') {
    //   // 解决swiper组件卡死问题
    //   if (e.detail.current == 0 && self.data.currentIndex > 1) { //卡死时，重置current为正确索引
    //     // wx.showModal({
    //     //   title: '提示',
    //     //   content: '卡死',
    //     // })
    //     console.log("卡死的e.detail.current", e.detail.current)
    //     console.log("卡死的index", self.data.currentIndex)
    //     self.setData({
    //       currentIndex: self.data.currentIndex
    //     })
    //   } else {
    //     //正常滑动时，跟踪正确索引
    //     self.setData({
    //       currentIndex: e.detail.current
    //     })
    //   }
    // }
    self.data.animationList.splice(0, self.data.animationList.length) //清空所有动画
    // let currentIndex = e.detail.current
    getApp().globalData.handSwiperShow = false //滑动后不再出现左右滑动手指动画
    self.setData({
      handSwiperShow: false,
      // guideAnimationShow:false,
      // handleLocks: false, //解锁
      handleShow: true, //滑动是显示操作按钮
      currentIndex: e.detail.current,
      animationList: self.data.animationList,
      //左右滑动切换数据
      thumbsTime: self.data.detailPic.lists[e.detail.current].thumbs,
      downloadTime: self.data.detailPic.lists[e.detail.current].download_time,
      isThumbs: self.data.detailPic.lists[e.detail.current].is_thumbs,
      currentPhotoSrc: self.data.detailPic.lists[e.detail.current].detail.pic_artwork, //原图的地址
      starPhotoSrc: self.data.detailPic.lists[e.detail.current].detail.pic_small, //列表小图的地址
      // ['detailPic.lists[' + currentIndex + '].detail.pic_artwork']: "http://idols-1253404514.picgz.myqcloud.com/" + self.data.detailPic.lists[e.detail.current].detail.pic_artwork.split('/')[4] + "?imageView2/q/85",
      picId: self.data.detailPic.lists[e.detail.current].id,
      nickName: self.data.detailPic.lists[e.detail.current].nickname,
      locks: false, //滑动时解锁
      likeAnimationShow: false, //左右滑动时清除动画
      shareAnimationShow: false, //左右滑动时清除动画
    })
    console.log("currentIndex", e.detail.current)
    console.log("currentPage", self.data.currentPage)
    console.log("totalPage", self.data.totalPage)
    // console.log(self.data.currentIndex % 9 == 0 && self.data.currentIndex != 0)
    if (self.data.currentIndex % 8 == 0 && self.data.currentIndex != 0) { //滑动第8张开始加载下一页数据
      if (self.data.currentPage < self.data.totalPage) {
        self.data.currentPage++
          self.getDetailPic("开始加载数据")
      }
    }
    publicFu.mongoCollect("", self, 10002) //明星图片曝光
  },
  addPopular: function(e) {
    let self = this
    self.hidePlayList() //隐藏播放列表
    self.setData({
      handShow: false, // 一旦开始舔屏就不执行手指动画
    })
    getApp().globalData.handShow = false //点击后不再出现手指动画
    wx.vibrateShort({
      success(e) {
        // console.log('震动成功', e)
      },
      fail(e) {
        // console.log('震动失败', e)
      }
    })

    if (getApp().globalData.handSwiperShow) {
      getApp().globalData.handSwiperShow = false
      if (!self.data.locks) {
        setTimeout(() => {
          self.setData({
            handSwiperShow: true
          })
        }, 3000)
        setTimeout(() => {
          self.setData({
            handSwiperShow: false
          })
        }, 8000)
      }
    }

    // if (!self.data.handleLocks) {

    //   handleTime1 = setTimeout(() => {
    //     self.setData({
    //       handleShow: false
    //     })
    //   }, 3000)
    //   handleTime2 = setTimeout(() => {
    //     self.setData({
    //       handleShow: true,
    //       handleLocks: false, //解锁
    //       shareAnimationShow: false,
    //       likeAnimationShow: false
    //     })
    //   }, 5000)
    // }
    // self.setData({
    //   handleLocks: true //上锁
    // })
    let degArr = [-40, -35, -30, -25, -20, -15, 0, 15, 20, 25, 30, 35, 40]
    let params = {
      pageX: e.touches[0].pageX - 45,
      pageY: e.touches[0].pageY - 45,
      deg: degArr[Math.floor(Math.random() * 12)],
      show: true
    }
    let len = self.data.animationList.length
    self.data.animationList.push(params)
    self.setData({
      animationList: self.data.animationList
    })
    setTimeout(() => {
      self.setData({
        ['animationList[' + len + '].show']: false
      })
    }, 1300)
    self.getPopularTime(e)
    if (!self.data.locks && self.data.isThumbs == 0) {
      self.getThumbsTime("one")
    }
  },
  getPopularTime(e) {
    let self = this
    clickNumber++ //记录点击的次数
    if (self.data.addPopularLocks) {
      clickNextNumber++ //记录下一次点击的次数
      return
    }
    self.setData({
      addPopularLocks: true //上锁,
    })
    let params = {
      click_time: clickNumber, //用户点击的次数
      pic_id: self.data.picId,
      star_id: self.data.starId
    }
    req.postRequest('api/star/popular', params).then(res => {
      console.log("popularTime", res.data.data.popular_num)
      if (res.data.data.popular_num === null) { //加文字效果
        if (!self.locks) {
          self.index = Math.floor(Math.random() * self.effectWordList.length)
        }
        // let params = {
        //   dialoguePageX: e.touches[0].pageX - 35,
        //   dialoguePageY: e.touches[0].pageY - 100,
        //   show: true,
        // }
        // let len = self.data.dialogueAnimationList.length
        // self.data.dialogueAnimationList.push(params)
        // self.setData({
        //   dialogueAnimationList: self.data.dialogueAnimationList
        // })
        let params1 = ""
        if (Array.isArray(self.effectWordList[self.index].img_url)) { //组
          self.locks = true
          self.index1 = self.index
          console.log("组")
          params1 = {
            dialoguePageX: e.touches[0].pageX - 35,
            dialoguePageY: e.touches[0].pageY - 100,
            img_url: self.effectWordList[self.index1].img_url[self.arrIndex].img_url,
            width: self.effectWordList[self.index1].img_url[self.arrIndex].width,
            height: self.effectWordList[self.index1].img_url[self.arrIndex].height,
            show: true
          }
          // self.setData({
          //   effectWordObj: self.effectWordList[self.index1].img_url[self.arrIndex]
          // })
          self.arrIndex++;
          if (self.arrIndex == self.effectWordList[self.index1].img_url.length) {
            self.index = Math.floor(Math.random() * self.effectWordList.length) //大于组数组的长度后重新获取随机数
            self.arrIndex = 0
          }
        } else if (!Array.isArray(self.effectWordList[self.index].img_url)) { //单
          self.locks = false
          console.log("单")
          params1 = {
            dialoguePageX: e.touches[0].pageX - 35,
            dialoguePageY: e.touches[0].pageY - 100,
            img_url: self.effectWordList[self.index].img_url.img_url,
            width: self.effectWordList[self.index].img_url.width,
            height: self.effectWordList[self.index].img_url.height,
            show: true
          }

          // self.setData({
          //   effectWordObj: self.effectWordList[self.index].img_url
          // })

        }
        let len = self.data.dialogueAnimationList.length
        self.data.dialogueAnimationList.push(params1)
        self.setData({
          dialogueAnimationList: self.data.dialogueAnimationList
        })
        console.log("dialogueAnimationList", self.data.dialogueAnimationList)
        setTimeout(() => {
          self.setData({
            ['dialogueAnimationList[' + len + '].show']: false
          })
        }, 1300)
      } else {
        self.setData({
          popularNumShow: true
        })
        self.setData({
          popularTime: res.data.data.popular_num
        })
        let params = {
          dialoguePageX: e.touches[0].pageX - 35,
          dialoguePageY: e.touches[0].pageY - 100,
          pageX: e.touches[0].pageX - 25,
          pageY: e.touches[0].pageY - 75,
          popularTime: res.data.data.popular_num,
          show: true
        }
        let len = self.data.popularAnimationList.length
        self.data.popularAnimationList.push(params)
        self.setData({
          popularAnimationList: self.data.popularAnimationList
        })
        setTimeout(() => {
          self.setData({
            ['popularAnimationList[' + len + '].show']: false
          })
        }, 1300)
      }
      setTimeout(() => { //一秒后解请求锁
        clickNumber = clickNextNumber //把下一次点击的次数赋给要传的参数
        clickNextNumber = 0 //下一次点击清0
        self.setData({
          addPopularLocks: false, //解锁
        })
      }, 1000)
    })
  },
  downloadPhoto: function(e) {
    let self = this
    self.formIdCollect(e)
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          //用户未授权
          console.log("进来authorize")
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              // 用户已经同意小程序使用保存到相册功能，后续调用 wx.saveImageToPhotosAlbum 接口不会弹窗询问
              // wx.saveImageToPhotosAlbum()
              console.log("用户已经同意小程序使用保存到相册功能")
              wx.setStorageSync("isAuthorizeWritePhotosAlbum", true)
              self.setData({
                openType: "share"
              })
              self.savePhoto()
            },
            fail() {
              //引导用户授权
              console.log('引导用户授权')
              self.setData({
                openType: "openSetting"
              })
              // wx.openSetting({
              //   success: (res) => {
              //     res.authSetting = {
              //       "scope.writePhotosAlbum": true
              //     }
              //   }
              // })
            }
          })
        } else {
          console.log('用户已授权相册')
          wx.setStorageSync("isAuthorizeWritePhotosAlbum", true)
          self.setData({
            openType: "share"
          })
          self.savePhoto()
          //用户已授权
        }
      },
      fail(error){
        console.log("引导授权失败原因",error)
      }
    })
  },
  musicContact() { //添加音乐客服
    let self = this
    getApp().globalData.musicStaus = 'stop' //打开客服时音乐停止
    self.setData({ //切换按钮状态
      isPaused: true,
    })
  },
  shareAddPopular() {
    let self = this
    let params = {
      star_id: self.data.starId,
    }
    req.postRequest('api/share/add_popular', params).then(res => {
      console.log("add_popular_res", res.data.data)
      let sharePopularIcon1 = res.data.data.popular + ''
      sharePopularIcon1 = sharePopularIcon1.split('')[0]
      self.setData({
        sharePopularShow: true,
        sharePopularIcon1: sharePopularIcon1,
        addShare: false
      })
      if (res.data.data.popular > 9) {
        let sharePopularIcon2 = res.data.data.popular + ''
        sharePopularIcon2 = sharePopularIcon2.split('')[1]
        self.setData({
          sharePopularIcon2: sharePopularIcon2
        })
      }
      setTimeout(() => {
        self.setData({
          sharePopularShow: false,
        })
      }, 3200)
    })
  },
  getUploadPhotoBtnStatus() {
    let self = this
    req.postRequest('api/version_control/show', {}).then(res => {
      console.log("api/version_control/show", res)
      res.data.data.lists.generate_status && self.setData({
        groupPhotoBtnShow: !!parseInt(res.data.data.lists.generate_status)
      })
    })
  },
  savePhoto: function() {
    let self = this
    self.setData({
      showLoading: true
    })
    let savePhotoSrc = api.baseUrlP + self.data.currentPhotoSrc.split('?')[0].split('/')[4] //原图地址
    wx.downloadFile({
      url: savePhotoSrc,
      success: function(res) {
        console.log("tempFilePath", res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function(res) {
            console.log("保存成功", res)
            self.setData({
              showLoading: false
            })
            setTimeout(() => {
              wx.showToast({
                title: '已保存到相册',
              })
            }, 1000)
            self.getDownloadTime()
            publicFu.mongoCollect("", self, 10001) //收集下载次数
          },
          fail: function(error) {
            console.log('保存失败', error)
            setTimeout(() => {
              wx.showToast({
                title: '保存失败',
              })
            }, 1000)
            self.setData({
              showLoading: false
            })
          }
        })

      },
      fail: function() {
        console.log('fail')
      }
    })
  },
  showPlayList() {
    let self = this
    if (self.data.musicPlayAm == 'hide-music-playlist-am' || self.data.musicPlayAm === '') {
      self.setData({
        musicPlayAm: 'show-music-playlist-am',
        toView: self.data.toView,
        banScroll: true
      })
    }
    // var animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // self.animation = animation
    // animation.translateY(-380).step()
    // self.setData({
    //   animationData: animation.export(),
    //   playList: true
    // })
  },
  hidePlayList() {
    let self = this
    if (self.data.musicPlayAm == 'show-music-playlist-am') {
      self.setData({
        musicPlayAm: 'hide-music-playlist-am',
        banScroll: false
      })
    }
    // var animation = wx.createAnimation({
    //   duration: 1000,
    //   timingFunction: 'ease',
    // })
    // self.animation = animation
    // animation.translateY(0).step()
    // self.setData({
    //   animationData: animation.export(),
    // })
  },
  handlePlay(e) {
    let self = this
    if (self.data.musicIndex == e.currentTarget.dataset.index) { //点击同一首歌曲
      if (getApp().globalData.musicPlayer.paused === false) { //如果音乐在播放中，点击后暂停播放
        getApp().globalData.pauseType = 1
        getApp().musicPause(self.data.musicList, e.currentTarget.dataset.index, self)
        self.setData({
          isPaused: true
        })
      } else { //继续播放
        if (getApp().globalData.musicStaus == 'stop') { //如果是停止了
          getApp().globalData.musicStaus = '' //重置
          getApp().cutSong(self.data.musicList, e.currentTarget.dataset.index, self)
        } else {
          getApp().globalData.pauseType = 0
          getApp().globalData.musicPlayer.play()
        }
        self.setData({
          isPaused: false
        })
      }
    } else if (self.data.musicIndex != e.currentTarget.dataset.index) { //切换歌曲
      getApp().cutSong(self.data.musicList, e.currentTarget.dataset.index, self)
      // let arr = []
      // arr.push(self.data.musicList[e.currentTarget.dataset.index].music_name)
      // arr.push(self.data.musicList[e.currentTarget.dataset.index].music_name)
      // arr.push(self.data.musicList[e.currentTarget.dataset.index].music_name)
      // arr.push(self.data.musicList[e.currentTarget.dataset.index].music_name)
      self.setData({
        isPaused: false,
        toView: 'a' + e.currentTarget.dataset.index //自动定位到tab
      })
    }
    self.setData({
      musicIndex: e.currentTarget.dataset.index
    })
  },
  uploadImage(e) {
    let self = this
    wx.chooseImage({
      count: 1,
      sourceType: [e],
      success: function(res) {
        let tempFilePaths = res.tempFilePaths[0]
        wx.navigateTo({
          url: '/pages/groupPhoto/groupPhoto?star_id=' + self.data.starId + '&pic_id=' + self.data.picId + "&star_name=" + self.data.starName + "&photo_type=" + self.data.photoType + "&user_photo_src=" + tempFilePaths + '&star_photo_src=' + self.data.currentPhotoSrc
        })
      },
      fail: function() {

      }
    })
  },
  groupPhoto() {
    let self = this
    if (wx.getSystemInfoSync().system.toUpperCase().indexOf("IOS") < 0) {
      wx.showActionSheet({
        itemList: ['相册', '拍照', '取消'],
        success: function(res) {
          if (res.tapIndex == 0) {
            self.uploadImage("album")
          } else if (res.tapIndex == 1) {
            self.uploadImage("camera")
          }
        }
      });
    } else {
      wx.showActionSheet({
        itemList: ['相册', '拍照'],
        success: function(res) {
          if (res.tapIndex == 0) {
            self.uploadImage("album")
          } else if (res.tapIndex == 1) {
            self.uploadImage("camera")
          }
        }
      });
    }
  },
  // uploadImage(e) {
  //   let self = this
  //   wx.chooseImage({
  //     count: 1,
  //     sourceType: [e],
  //     success(res) {
  //       const tempFilePath = res.tempFilePaths[0]
  //       console.log(tempFilePath)

  //       // 将选取图片传入cropper，并显示cropper
  //       // mode=rectangle 返回图片path
  //       // mode=quadrangle 返回4个点的坐标，并不返回图片。这个模式需要配合后台使用，用于perspective correction
  //       // let modes = ["rectangle", "quadrangle"]
  //       // let mode = modes[0]   //rectangle, quadrangle
  //       self.showCropper({
  //         src: tempFilePath,
  //         mode: "rectangle",
  //         sizeType: ['original', 'compressed'],   //'original'(default) | 'compressed'
  //         callback: (res) => {
  //           console.log("crop callback:" + res)
  //           // wx.previewImage({
  //           //   current: '',
  //           //   urls: [res]
  //           // })
  //           wx.navigateTo({
  //             url: '/pages/groupPhoto/groupPhoto?user_photo_src=' + res + '&star_photo_src=' + self.data.starPhotoSrc + '&star_id=' + self.data.starId + '&pic_id=' + self.data.picId
  //           })


  //           // self.hideCropper() //隐藏，我在项目里是点击完成就上传，所以如果回调是上传，那么隐藏掉就行了，不用previewImage
  //         }
  //       })
  //     }
  //   })
  // },
  openSettingCallback(e){
    //进入引导页后出来执行的操作
    let self = this
    if (e.detail.authSetting['scope.writePhotosAlbum']){
      //用户已授权
      console.log('openSettingCallback用户已授权相册')
      wx.setStorageSync("isAuthorizeWritePhotosAlbum", true)
      self.setData({
        openType: "share"
      })
    }else{
      console.log("用户关掉授权")
      wx.setStorageSync("isAuthorizeWritePhotosAlbum", false)
      self.setData({
        openType: "openSetting"
      })
    }
  },
  getMusicList() {
    let self = this
    let params = {
      star_id: self.data.starId,
      page: 1
    }
    req.postRequest('api/star/list', params).then(res => {
      console.log("musicList", res.data.data.banner.music_list)
      if (res.data.data.banner.music_list.length > 0) {
        self.setData({
          musicList: res.data.data.banner.music_list,
        })
        if (!self.data.options.from_page) {
          let index = Math.floor(Math.random() * res.data.data.banner.music_list.length)
          self.setData({
            musicIndex: index
          })
        }
        if (getApp().globalData.musicPlayer.paused == undefined) { //没有歌曲播放的状态
          getApp().musicPlay(self.data.musicList, self.data.musicIndex, self)
        } else if (getApp().globalData.musicPlayer.paused === true) { //暂停或停止状态
          getApp().musicPause(self.data.musicList, self.data.musicIndex, self)
        } else if (getApp().globalData.musicPlayer.paused === false) { //正在播放状态
          if (self.data.options.star_name != getApp().globalData.starName) { //切换了明星
            getApp().musicPlay(self.data.musicList, self.data.musicIndex, self)
          } else {
            getApp().musicContinuePlay(self.data.musicList, self.data.musicIndex, self)
          }
        }
      } else { //无音乐的情况
        getApp().globalData.musicPlayer.pause()
        self.setData({
          isPaused: true
        })
      }
      getApp().globalData.starName = self.data.options.star_name //存储明星名字
    })
  },
  getDownloadTime() {
    let self = this
    let params = {
      pic_id: self.data.picId,
    }
    let index = self.data.currentIndex
    req.postRequest('api/star/download_time', params).then(res => {
      console.log("downloadTime", res.data.data.download_time)
      self.setData({
        downloadTime: res.data.data.download_time,
        ['detailPic.lists[' + index + '].download_time']: res.data.data.download_time
      })
    })
  },
  getThumbsTime(e) {
    let self = this

    if (e) {
      self.setData({
        locks: true //上锁
      })
    }

    let params = {
      pic_id: self.data.picId,
    }
    console.log("click")
    req.postRequest('api/star/thumbs', params).then(res => {
      console.log("thumbsTime", res.data.data.thumbs)
      let index = self.data.currentIndex
      self.setData({
        thumbsTime: res.data.data.thumbs,
        ['detailPic.lists[' + index + '].thumbs']: res.data.data.thumbs,
        ['detailPic.lists[' + index + '].is_thumbs']: res.data.data.is_thumbs,
        // isThumbs: self.data.isThumbs == 0 ? 1 : 0, //点赞或取消点赞，切换状态
        isThumbs: res.data.data.is_thumbs, //点赞或取消点赞，切换状态
        likeAnimationShow: self.data.isThumbs == 0 ? true : false,
        // shareAnimationShow: self.data.isThumbs == 0 ? true : false,
      })
      setTimeout(() => {
        self.setData({
          // likeAnimationShow: self.data.isThumbs == 0 ? true : false,
          shareAnimationShow: self.data.isThumbs == 1 ? true : false,
          // shareAnimationShow: true
        })
      }, 1000)
    })
  },
  getRank() {
    let self = this
    let params = {
      star_id: self.data.starId,
      pic_id: self.data.picId,
      type: self.data.photoType == 0 ? 'hot_list' : 'new_list'
    }
    req.postRequest('api/star/share_detail', params).then(res => {
      console.log("share_detail_res", res)
      if (res.data.code == 10103) { //图片不存在
        wx.reLaunch({
          url: '/pages/starIndex/starIndex?star_id=' + self.data.starId + "&current_tab=" + self.data.photoType + "&star_name=" + self.data.starName
        })
        return
      } else if (res.data.code == 10104) { //明星下架
        wx.reLaunch({
          url: '/pages/home/home'
        })
        return
      }
      console.log("share_detail_params", params)
      console.log("rank", res.data.data.rank)
      self.setData({
        currentPage: Math.ceil((res.data.data.rank + 1) / 10), //当前页数
        currentIndex: res.data.data.rank % 10
      })
      wx.setStorageSync("currentPage", self.data.currentPage) //当前页数
      console.log("currentPage", self.data.currentPage)
      console.log("current_index", self.data.currentIndex)
      self.getDetailPic()
    })
  },
  formIdCollect: function(e) { //formId收集的方法
    publicFu.sendFormIdParamsObj(e)
  },
  heartFormIdCollect(e) {
    let self = this
    if (!getApp().globalData.formIdCollectLocks) {
      publicFu.sendFormIdParamsObj(e)
    }
  },
  getEffectWordList() {
    let self = this
    let params = {
      star_id: self.data.starId
    }
    req.postRequest('api/font/get', params).then(res => {
      console.log('api/font/get', res)
      console.log(res.data.data.lists.length, "res.data.data.lists.length")
      if (res.data.data.lists.length != 0) {
        console.log("后台配置")
        self.effectWordList = res.data.data.lists
      }
      self.index = Math.floor(Math.random() * self.effectWordList.length) //获取随机数   
    })
  },
  getDetailPic(e) {
    let self = this
    self.setData({
      loading: true
    })
    let url = ''
    if (self.data.photoType == 0) { //最热 
      url = "api/star/list"
    } else if (self.data.photoType == 1) { //最新
      url = "api/star/new_list"
    }
    let params = {
      // pic_id: self.data.picId,
      star_id: self.data.starId,
      page: self.data.currentPage
    }
    req.postRequest(url, params).then(res => {
      console.log("detail_pic_time_params", params)
      console.log("detail_pic_time", res.data.data)
      if (e) { //右滑加载数据
        self.setData({
          ['detailPic.lists']: [...self.data.detailPic.lists, ...res.data.data.lists],
        })
      } else {
        self.setData({
          detailPic: res.data.data,
          // 初始化点赞数和下载数
          thumbsTime: res.data.data.lists[self.data.currentIndex].thumbs,
          currentPhotoSrc: res.data.data.lists[self.data.currentIndex].detail.pic_artwork,
          starPhotoSrc: res.data.data.lists[self.data.currentIndex].detail.pic_small,
          downloadTime: res.data.data.lists[self.data.currentIndex].download_time,
          isThumbs: res.data.data.lists[self.data.currentIndex].is_thumbs,
          picId: res.data.data.lists[self.data.currentIndex].id,
          nickName: res.data.data.lists[self.data.currentIndex].nickname,
        })
      }
      self.setData({
        loading: false,
        shareTitleList: res.data.data.banner.picShareMessages.length == 0 ? self.data.shareTitleList : res.data.data.banner.picShareMessages,
        currentPage: res.data.data.paper.current_page,
        totalPage: res.data.data.paper.total_page
      })
      publicFu.mongoCollect("", self, 10002) //明星图片曝光

      if (getApp().globalData.handShow) {
        setTimeout(() => {
          self.setData({
            handShow: getApp().globalData.handShow,
          })
        }, 2000)
        setTimeout(() => {
          self.setData({
            handShow: false,
          })
          getApp().globalData.handShow = false
        }, 10000)
      }

      // for (const v of res.data.data.lists) {
      //   v.detail.pic_artwork = api.baseUrlCompress + v.detail.pic_artwork.split('/')[4] + "?imageView2/q/60" //改变图片质量
      // }
    })
  },
})
