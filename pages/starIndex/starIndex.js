// pages/starIndex/starIndex.js
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var api = require('../../utils/api.js')
var hotListPage = 1 //hotlist要传的当前页数
var newListPage = 1 //newList要传的当前页数
// var anima
var col1H = 0;
var col2H = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadBtnShow: false,
    addShare: false, //是否可以加人气的标志    
    addPopularNumberShow: false,
    addPopularNumber: "", //增加的人气数
    showLoading: false,
    shareTitleList: [{
      message: '你最喜欢哪个我？进来看看吧！'
    }, {
      message: '上传我的图片，让别人知道我是你的'
    }, {
      message: '我又变了！今天你来看我了吗？'
    }, {
      message: '照片不独享，爱豆人气涨！'
    }, {
      message: '草得一手好数据，拿得一身好资源'
    }, {
      message: '别落后！最新照片必须要有！'
    }, {
      message: '我们的约定，今天不见不散！'
    }, {
      message: '进来，现在是你跟我的独处时间'
    }, {
      message: '为我拿下榜首，好吗？'
    }],
    scrollTop: '', //页面滚动的位置
    leftList: [],
    rightList: [],
    images: [],
    loadingCount: 0,
    options: {},
    anima: '',
    musicFooterShow: false,
    musicPlayAm: '', //控制音乐播放列表的出现和消失
    toView: 'a0',
    isPaused: false, //音乐是否暂停的标志
    musicIndex: 0, //当前播放音乐的索引
    bchange: 2, //变化值，可自定义设置
    bspeed: 100, //速度，可自定义设置
    bw: 508, //容器宽度
    bh: 53, //容器高度
    bl: 0, //容器位置 left
    bt: 0, //容器位置 top
    musicNameArr: [], //滚动内容，可自定义设置
    noMore: false,
    cueShow: false,
    shareType: 0, //0：默认分享，1路过分享
    starName: '', //明星的名字
    is_share: false, //是否是分享出去的页面
    currentTab: 0, //（0:精选，1：广场）
    starId: '', //明显id
    allList: {}, //最热或最新的数据
    hotListCurrentPage: 1, //"最热"数据的当前页数
    hotListTotalPage: 1, //"最热"数据的总页数
    newListCurrentPage: 1, //"最新"数据的当前页数
    newListTotalPage: 1, //"最新"数据的总页数
    statusBarHeight: 0, //状态栏的高度uplodadPhotoList
    isIphoneX: false,
    cloneMusicNameArr: [], //无缝衔接容器
    animationData: {},
    musicList: [],
    isOnload: false, //onload周期是否加载了
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("明星主页页面参数", options)
    let self = this
    self.getUploadPhotoBtnStatus() //控制上传照片按钮的显示与隐藏
    self.setData({
      options: options,
      isOnload: true
    })
    if (options.video_id){
      var video_id = options.video_id;
      var star_id = options.star_id;
      wx.navigateTo({
        url: "../video/video?video_id=" + video_id + '&star_id=' + star_id
      })
    } else if (options.emoji){
      var star_id = 11;
      if (options.star_id){
        star_id = options.star_id;
      }
      wx.navigateTo({
        url: "../emoji/emoji?star_id=" + star_id
      })
    }
    if (!!getApp().globalData.cueShow) {
      setTimeout(() => {
        self.setData({
          cueShow: true //5秒后出现
        })
      }, 5000)
      setTimeout(() => {
        self.setData({
          cueShow: false //8秒后消失
        })
      }, 12000)
    }

    publicFu.setDom(self) //做手机适配
    self.setData({
      photoType: options.scene == undefined ? options.photo_type == undefined ? "" : options.photo_type : options.scene.split("_")[2], //最热或是最新
      picId: options.scene == undefined ? options.pic_id == undefined ? "" : options.pic_id : options.scene.split("_")[1],
      starId: options.scene == undefined ? options.star_id == undefined ? "" : options.star_id : options.scene.split("_")[0],
      go_page: options.scene == undefined ? "" : options.scene.split("_")[3], //是否跳转到明星详情页
      starName: options.star_name == undefined ? "" : options.star_name,
      musicIndex: self.data.options.music_index == undefined ? self.data.musicIndex : self.data.options.music_index,
      toView: self.data.options.music_index == undefined ? 'a' + self.data.musicIndex : 'a' + self.data.options.music_index,
    })
    wx.setStorageSync("musicStarName", self.data.starName)
    if (self.data.options.is_share) {
      self.setData({
        is_share: self.data.options.is_share == 1 ? true : false,
      })
    }
    if (getApp().globalData.isNew == 0) { //老用户跳“广场”Tab
      self.setData({
        currentTab: 1
      })
    } else if (getApp().globalData.isNew == 1) { //新用户保持跳“精选”Tab
      self.setData({
        currentTab: 0
      })
      getApp().globalData.isNew = 0
    }
    if (self.data.currentTab == 0) {
      self.getHotList()
    } else if (self.data.currentTab == 1) {
      self.getNewList()
    }
    if (!options.video_id && !options.emoji) {
      self.getMusicList()
    }
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
    let self = this
    console.log(self.data.isOnload, "isOnload")
    if (!self.data.isOnload) {
      console.log("returnPageOnLoad")
      self.returnPageOnLoad()
    }
    if (getApp().globalData.musicIndex !== '') { //把记录的音乐索引赋值
      self.setData({
        musicIndex: getApp().globalData.musicIndex,
        toView: "a" + getApp().globalData.musicIndex
      })
    }
    if (getApp().globalData.playMusic==1){
      self.getMusicList()
      getApp().globalData.playMusic = 0;
    }
    console.log("starIndex执行onshow")
    // if (!self.data.isOnload) {
    //   if (self.data.musicList.length > 0) {
    //     let arr = []
    //     arr.push(self.data.musicList[self.data.musicIndex].music_name)
    //     arr.push(self.data.musicList[self.data.musicIndex].music_name)
    //     arr.push(self.data.musicList[self.data.musicIndex].music_name)
    //     arr.push(self.data.musicList[self.data.musicIndex].music_name)
    //     self.setData({
    //       musicNameArr: arr
    //     })
    //     if (getApp().globalData.musicPlayer.paused == undefined) { //未开始播放状态
    //       console.log("未开始播放状态")
    //       getApp().musicPlay(self.data.musicList, self.data.musicIndex, self)
    //     } else if (getApp().globalData.musicPlayer.paused === true) { //暂停或停止状态
    //       console.log("暂停或停止状态")
    //       getApp().musicPause(self.data.musicList, self.data.musicIndex, self)
    //     } else if (getApp().globalData.musicPlayer.paused === false) { //正在播放状态
    //       console.log("正在播放状态")
    //       getApp().musicContinuePlay(self.data.musicList, self.data.musicIndex, self)
    //     }
    //   }
    // }
    self.setData({
      isOnload: false
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let self = this

    if (self.data.musicPlayAm == 'show-music-playlist-am') {
      self.hidePlayList()
    }
    clearInterval(self.data.anima) //清除计时器
    getApp().globalData.cueShow = false
    if (self.data.shareType == 1) {
      return
    }
    getApp().globalData.setSrc = true
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("监听页面卸载")
    let self = this
    // getApp().globalData.musicIndex = self.data.musicIndex
    if (self.data.musicPlayAm == 'show-music-playlist-am') {
      self.hidePlayList()
    }
    clearInterval(self.data.anima) //清除计时器
    getApp().globalData.cueShow = false
    getApp().globalData.setSrc = true
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
    let self = this
    console.log("hotListCurrentPage", self.data.hotListCurrentPage)
    console.log("hotListTotalPage", self.data.hotListTotalPage)
    console.log("newListCurrentPage", self.data.newListCurrentPage)
    console.log("newListCurrentPage", self.data.newListCurrentPage)
    if (self.data.currentTab == 0) { //最热
      if (self.data.hotListCurrentPage < self.data.hotListTotalPage) { //当前页面小于总页数的时候开始上拉加载数据
        self.setData({
          noMore: false
        })
        hotListPage = self.data.hotListCurrentPage + 1 //当前页面加一
        self.getHotList("上拉")
      } else { //无更多数据
        self.setData({
          noMore: true
        })
        // setTimeout(() => {
        //   self.setData({
        //     noMore: false
        //   })
        // }, 1500)
      }
    } else if (self.data.currentTab == 1) { //最新
      if (self.data.newListCurrentPage < self.data.newListTotalPage) { //当前页面小于总页数的时候开始上拉加载数据
        self.setData({
          noMore: false
        })
        newListPage = self.data.newListCurrentPage + 1 //当前页面加一
        self.getNewList("上拉")
      } else { //无更多数据
        self.setData({
          noMore: true
        })
        // setTimeout(() => {
        //   self.setData({
        //     noMore: false
        //   })
        // }, 1500)
      }
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let self = this
    // if (res.from === 'button') {
    //   // 来自页面内转发按钮
    //   self.shareAddPopular() //分享加人气
    // }

    let randomNum = Math.floor(Math.random() * self.data.shareTitleList.length)
    let randomNum2 = Math.floor(Math.random() * self.data.sharePicList.length)
    console.log("randomNum", randomNum)
    self.setData({
      addShare: true
    })
    self.shareAddPopular() //分享加人气
    return {
      title: self.data.shareTitleList[randomNum].message,
      imageUrl: self.data.sharePicList[randomNum2].pic_share,
      path: '/pages/starIndex/starIndex?star_id=' + self.data.starId + '&current_tab=' + self.data.currentTab + '&is_share=1' + '&star_name=' + self.data.starName,
      success: function(res) {
        // self.shareAddPopular() //分享加人气
      }
    }
  },
  formIdCollect: function(e) { //formId收集的方法
    publicFu.sendFormIdParamsObj(e)
  },
  tabNavClick: function(e) {
    let self = this
    if (self.data.currentTab == e.currentTarget.dataset.current) {
      return
    }
    col1H = 0
    col2H = 0
    self.data.leftList.splice(0, self.data.leftList.length)
    self.data.rightList.splice(0, self.data.rightList.length)
    self.setData({
      leftList: self.data.leftList,
      rightList: self.data.rightList
    })

    self.setData({
      currentTab: e.currentTarget.dataset.current
    })
    // self.setData({
    //   hotListCurrentPage: 1, //"最热"数据的当前页数
    //   newListCurrentPage: 1, //"最新"数据的当前页数
    // })
    self.setData({ //隐藏底部的提示文字
      noMore: false
    })
    if (self.data.currentTab == 0) { //点击精选
      self.getHotList()
    } else if (self.data.currentTab == 1) { //点击广场
      self.getNewList()
    }
  },
  onPageScroll: function(e) {
    let self = this
    self.setData({
      scrollTop: e.scrollTop
    })
  },
  goUploadPhotoPage: function(data) {
    let self = this
    getApp().globalData.musicIndex = self.data.musicIndex
    wx.navigateTo({
      url: '../uploadPhoto/uploadPhoto?star_id=' + self.data.starId + '&star_name=' + self.data.starName + "&data=" + data
    })
  },
  goPhotoDetailPage: function(e) {
    let self = this
    // if (e.currentTarget.dataset.flag == "playVideo") {
    //   wx.navigateTo({
    //     url: "../video/video"
    //   })
    //   return
    // }
    getApp().globalData.musicIndex = self.data.musicIndex
    wx.navigateTo({
      url: '../photoDetail/photoDetail?pic_id=' + e.currentTarget.dataset.picid + '&star_id=' + e.currentTarget.dataset.starid + "&photo_type=" + self.data.currentTab + '&star_name=' + self.data.starName + '&from_page=starIndexPage' + '&music_index=' + self.data.musicIndex
    })
  },
  showPlayList() {
    let self = this
    console.log("musicPlayAm", self.data.musicPlayAm)
    if (self.data.musicPlayAm == 'hide-music-playlist-am' || self.data.musicPlayAm === '') {
      if (getApp().globalData.musicPlayer.paused === true) {
        self.setData({
          isPaused: true,
        })
      }
      self.setData({
        musicPlayAm: 'show-music-playlist-am',
        toView: self.data.toView,
        banScroll: true
      })
    } else if (self.data.musicPlayAm == 'show-music-playlist-am') {
      self.setData({
        musicPlayAm: 'hide-music-playlist-am',
        toView: self.data.toView,
        banScroll: false
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
        clearInterval(self.data.anima)
        // self.setData({
        //   isPaused: true
        // })
      } else { //继续播放
        if (getApp().globalData.musicStaus == 'stop') { //如果是停止了
          getApp().globalData.musicStaus = '' //重置
          getApp().cutSong(self.data.musicList, e.currentTarget.dataset.index, self)
        } else {
          getApp().globalData.pauseType = 0
          getApp().globalData.musicPlayer.play()
        }
        self.musicNameAm() //执行歌名的无缝滚动
        self.setData({
          isPaused: false
        })
      }
    } else if (self.data.musicIndex != e.currentTarget.dataset.index) { //切换歌曲
      getApp().cutSong(self.data.musicList, e.currentTarget.dataset.index, self)
      let arr = []
      arr.push(self.data.musicList[e.currentTarget.dataset.index].music_name)
      arr.push(self.data.musicList[e.currentTarget.dataset.index].music_name)
      arr.push(self.data.musicList[e.currentTarget.dataset.index].music_name)
      arr.push(self.data.musicList[e.currentTarget.dataset.index].music_name)
      self.setData({
        isPaused: false,
        musicNameArr: arr,
        toView: 'a' + e.currentTarget.dataset.index //自动定位到tab
      })
      console.log(self.data.musicNameArr)
      self.musicNameAm() //执行歌名的无缝滚动

    }
    self.setData({
      musicIndex: e.currentTarget.dataset.index
    })
  },
  getUploadPhotoBtnStatus() {
    let self = this
    req.postRequest('api/version_control/show', {}).then(res => {
      console.log("api/version_control/show", res)
      res.data.data.lists.upload_status && self.setData({
        uploadBtnShow: !!parseInt(res.data.data.lists.upload_status)
      })
    })
  },
  musicNameAm() {
    // 无缝滚动的动画
    let self = this
    if (self.data.musicNameArr[0].length < 10) { //歌曲名称没有超过宽度不会滚动
      self.setData({
        bl: 0, //重置滚动的位置
      })
      clearInterval(self.data.anima)
      return
    }
    var anima = setInterval(function() {
      if (self.data.bl - self.data.bchange <= -self.data.bw * self.data.musicNameArr.length) {
        self.setData({
          bl: 0
        })
      } else {
        self.setData({
          bl: self.data.bl - self.data.bchange
        })
      };
    }, self.data.bspeed)
    self.setData({
      anima: anima
    })
    // 无缝滚动的动画
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
        if (getApp().globalData.musicPlayer.paused === undefined || self.data.options.star_name != getApp().globalData.starName) {
          let index = Math.floor(Math.random() * res.data.data.banner.music_list.length)
          self.setData({
            musicIndex: index
          })
        }
        let arr = []
        for (let i = 0; i < 4; i++) {
          arr.push(res.data.data.banner.music_list[self.data.musicIndex].music_name)
        }
        self.setData({
          musicList: res.data.data.banner.music_list,
          musicNameArr: arr,
        })
        console.log(self.data.musicNameArr)
        console.log("self.data.musicList", self.data.musicList)

        if (getApp().globalData.musicPlayer.paused == undefined) { //未开始播放状态
          console.log("未开始播放状态")
          getApp().musicPlay(self.data.musicList, self.data.musicIndex, self)
        } else if (getApp().globalData.musicPlayer.paused === true) { //暂停或停止状态
          console.log("暂停或停止状态")
          getApp().musicPause(self.data.musicList, self.data.musicIndex, self)
        } else if (getApp().globalData.musicPlayer.paused === false) { //正在播放状态
          console.log("正在播放状态")
          if (self.data.options.star_name != getApp().globalData.starName) { //切换了明星
            getApp().musicPlay(self.data.musicList, self.data.musicIndex, self)
          } else {
            getApp().musicContinuePlay(self.data.musicList, self.data.musicIndex, self)
          }
        }
        getApp().globalData.starName = self.data.options.star_name //存储明星名字
        self.musicNameAm() //执行歌名的无缝滚动
      } else { //无音乐的情况
        getApp().globalData.musicPlayer.pause()
      }
      if (self.data.options.go_page != undefined || self.data.go_page == "photoDetail") { //点击分享图片详情页进入先路过明星主页，则该页返回时到明星主页
        if (self.data.options.is_share) {
          self.setData({
            is_share: self.data.options.is_share == 1 ? true : false,
            shareType: 1,
          })
        }
        wx.navigateTo({
          url: '../photoDetail/photoDetail?star_id=' + self.data.starId + '&pic_id=' + self.data.picId + "&is_share=1" + "&photo_type=" + self.data.photoType + '&star_name=' + self.data.starName + '&from_page=starIndexPage' + '&music_index=' + self.data.musicIndex
        })
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
  onImageLoad(e) {
    let self = this
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = 360; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算
    let imgHeight = oImgH * scale; //自适应高度
    let imageObj = null
    for (const v of self.data.images) {
      if (v.id == imageId) {
        imageObj = v
        break
      }
    }
    imageObj.calculateHeight = imgHeight;
    let loadingCount = self.data.loadingCount - 1;
    if (col1H <= col2H) {
      col1H += imgHeight + 60;
      self.data.leftList.push(imageObj);
    } else {
      col2H += imgHeight + 60;
      self.data.rightList.push(imageObj);
    }
    let data = {
      loadingCount: loadingCount,
      leftList: self.data.leftList,
      rightList: self.data.rightList
    };
    if (!loadingCount) {
      data.images = [];
    }
    self.setData(data);
    console.log("left", self.data.leftList)
    console.log("right", self.data.rightList)
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
        self.goUploadPhotoPage(tempFilePaths)
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
      if (wx.getSystemInfoSync().system.toUpperCase().indexOf("IOS") < 0) {
        wx.showActionSheet({
          itemList: ['选择上传爱豆照片', '取消'],
          success: function(res) {
            if (res.tapIndex == 0) {
              self.uploadImage()
            }
          }
        });
      } else {
        wx.showActionSheet({
          itemList: ['选择上传爱豆照片'],
          success: function(res) {
            if (res.tapIndex == 0) {
              self.uploadImage()
            }
          }
        });
      }

    }
  },
  returnPageOnLoad() { //刷新点赞数和人气数
    console.log("刷新点赞数和人气数")
    let self = this
    //不刷新页面的情况下加载数据的点赞数和人气数
    let params = {
      star_id: self.data.starId,
      // page: self.data.currentTab == 0 ? hotListPage : newListPage
      page: wx.getStorageSync("currentPage") == '' ? 1 : wx.getStorageSync("currentPage")
    }
    let url = self.data.currentTab == 0 ? "api/star/list" : "api/star/new_list"
    console.log(self.data.addShare, "addShare")
    req.postRequest(url, params).then(res => {
      console.log("后台返回的人气", res.data.data.banner.popularity_num)
      if (self.data.allList.banner.popularity_num != res.data.data.banner.popularity_num) {
        if (self.data.addShare) { //点击分享按钮才执行的操作
          console.log("123456")
          self.setData({
            addPopularNumberShow: true
          })
          setTimeout(() => {
            self.setData({
              addPopularNumberShow: false,
              ['allList.banner.popularity_num']: res.data.data.banner.popularity_num
            })
          }, 3000)
        } else { //从图片详情页返回
          console.log("56789")
          self.setData({
            ['allList.banner.popularity_num']: res.data.data.banner.popularity_num
          })
        }
      }
      if (self.data.allList.banner.hot_pic.pic_top != res.data.data.banner.hot_pic.pic_top) {
        self.setData({
          ['allList.banner.hot_pic.pic_top']: res.data.data.banner.hot_pic.pic_top
        })
      }
      self.setData({
        addShare: false
      })
      for (let i = 0; i < self.data.leftList.length; i++) {
        for (const v of res.data.data.lists) {
          if (v.id == self.data.leftList[i].id) {
            self.setData({
              ['leftList[' + i + '].thumbs']: v.thumbs,
              ['leftList[' + i + '].is_thumbs']: v.is_thumbs
            })
            break
          }
        }
      }
      for (let j = 0; j < self.data.rightList.length; j++) {
        for (const v of res.data.data.lists) {
          if (v.id == self.data.rightList[j].id) {

            self.setData({
              ['rightList[' + j + '].thumbs']: v.thumbs,
              ['rightList[' + j + '].is_thumbs']: v.is_thumbs
            })
            break
          }
        }
      }
    })

  },
  getHotList(e) {
    let self = this
    self.setData({
      showLoading: true
    })
    if (e == undefined) { //不是下拉刷新请求 初始化页数
      hotListPage = 1
    }
    let params = {
      star_id: self.data.starId,
      page: hotListPage
    }
    req.postRequest('api/star/list', params).then(res => {
      if (res.data.code == 10104) { //明星下架
        wx.reLaunch({
          url: '/pages/home/home'
        })
        return
      }
      res.data.data.banner.hot_pic.pic_top = api.baseUrlCompress + res.data.data.banner.hot_pic.pic_top.split('/')[4] + "?imageView2/q/60"
      for (const v of res.data.data.lists) {
        if (v.detail.pic_artwork.indexOf("webp") != -1) {
          v.detail.pic_artwork = v.detail.pic_artwork + "|imageView2/q/60"
        } else {
          v.detail.pic_artwork = api.baseUrlCompress + v.detail.pic_artwork.split('/')[4] + "?imageView2/q/60" //改变图片质量
        }
        if (v.nickname != undefined) {
          if (v.nickname.length > 6) {
            v.nickname = v.nickname.slice(0, 6) + '...'
          }
        }
      }

      if (e) { //上拉加载数据
        self.setData({
          ['allList.lists']: [...self.data.allList.lists, ...res.data.data.lists],
        })
      } else {
        self.setData({
          allList: res.data.data
        })
      }
      // if (self.data.starName == "易烊千玺") {
      //   self.setData({
      //     leftList: [{
      //       avatar: "/assets/images/avatar.png",
      //       is_thumbs: 0,
      //       nickname: "小易加油",
      //       thumbs: 6437,
      //       flag: "playVideo",
      //       detail: {
      //         avatar: "/assets/images/avatar.png",
      //         nickname: "小易加油",
      //         width: 360,
      //         height: 500,
      //         star_id: "10",
      //         pic_artwork: "https://idols.heywoodsminiprogram.com/images/photo1.png"
      //       }
      //     }]
      //   })
      // } else {
      //   self.setData({
      //     leftList: []
      //   })
      // }
      self.setData({
        loadingCount: res.data.data.lists.length,
        images: res.data.data.lists.sort((a, b) => {
          return b.thumbs - a.thumbs
        }),
        shareTitleList: res.data.data.banner.starShareMessages.length == 0 ? self.data.shareTitleList : res.data.data.banner.starShareMessages,
        sharePicList: res.data.data.banner.picShareAddress,
        hotListCurrentPage: res.data.data.paper.current_page,
        hotListTotalPage: res.data.data.paper.total_page
      })
      self.setData({
        showLoading: false
      })
    })
  },
  shareAddPopular() {
    let self = this
    let params = {
      star_id: self.data.starId,
    }
    req.postRequest('/api/share/add_popular', params).then(res => {
      console.log("add_popular_res", res)
      self.setData({
        // addPopularNumberShow: true,
        addPopularNumber: res.data.data.popular,
      })
      // setTimeout(() => {
      //   self.setData({
      //     addPopularNumberShow: false
      //   })
      // }, 3000)
    })
  },
  getNewList(e) {
    let self = this
    self.setData({
      showLoading: true
    })
    if (e == undefined) { //不是下拉刷新请求 初始化页数
      newListPage = 1
    }
    let params = {
      star_id: self.data.starId,
      page: newListPage
    }
    req.postRequest('api/star/new_list', params).then(res => {
      if (res.data.code == 10104) { //明星下架
        wx.reLaunch({
          url: '/pages/home/home'
        })
        return
      }
      console.log("newList", res.data.data)
      res.data.data.banner.hot_pic.pic_top = api.baseUrlCompress + res.data.data.banner.hot_pic.pic_top.split('/')[4] + "?imageView2/q/60"
      for (const v of res.data.data.lists) {
        if (v.detail.pic_artwork.indexOf("webp") != -1) {
          v.detail.pic_artwork = v.detail.pic_artwork + "|imageView2/q/60"
        } else {
          v.detail.pic_artwork = api.baseUrlCompress + v.detail.pic_artwork.split('/')[4] + "?imageView2/q/60" //改变图片质量
        }
        if (v.nickname != undefined) {
          if (v.nickname.length > 6) {
            v.nickname = v.nickname.slice(0, 6) + '...'
          }
        }
      }
      if (e) { //上拉加载数据
        self.setData({
          ['allList.lists']: [...self.data.allList.lists, ...res.data.data.lists],
        })
      } else {
        self.setData({
          allList: res.data.data
        })
      }
      self.setData({
        loadingCount: res.data.data.lists.length,
        images: res.data.data.lists.sort((a, b) => {
          return b.thumbs - a.thumbs
        }),
        shareTitleList: res.data.data.banner.starShareMessages.length == 0 ? self.data.shareTitleList : res.data.data.banner.starShareMessages,
        sharePicList: res.data.data.banner.picShareAddress,
        newListCurrentPage: res.data.data.paper.current_page,
        newListTotalPage: res.data.data.paper.total_page
      })
      self.setData({
        showLoading: false
      })
    })
  }
})