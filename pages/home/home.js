//index.js
//获取应用实例
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var api = require('../../utils/api.js')
const app = getApp()

Page({
  hotListIds: [],//剩余未加载的明星id
  search_hot:[],
  data: {
    openPhotoSrc: "",
    showLoading: false,
    headerChange: false, //header是否开始转变的标志
    homeList: {
      hot_list: []
    },
    yearMonth: "", //年月
    currentDate: '', //日期
  },

  //事件处理函数
  onPageScroll: function(e) {
    let self = this
    if (e.scrollTop <= 250) {
      self.setData({
        headerChange: false
      })
      return
    }
    if (e.scrollTop >= 308) {
      self.setData({
        headerChange: true
      })
    }
    // console.log(e)
  },
  getTime() {
    let self = this
    let currentTime = new Date()
    let year = currentTime.getFullYear()
    let month = currentTime.getMonth() + 1
    let date = currentTime.getDate()
    self.setData({
      yearMonth: month < 10 ? year + '/0' + month : year + '/' + month,
      currentDate: date < 10 ? "0" + date : date
    })
  },
  goSearchPage: function() {
    let self = this
    wx.navigateTo({
      url: '../search/search'
    })
  },
  formIdCollect: function(e) { //formId收集的方法
    publicFu.sendFormIdParamsObj(e)
  },
  goStarIndexPage(e) {
    let self = this
    if (wx.getStorageSync("starName") != e.currentTarget.dataset.starname) {
      getApp().globalData.musicIndex = ''
      getApp().globalData.pauseType = 0
    }
    wx.setStorageSync("starName", e.currentTarget.dataset.starname)
    wx.navigateTo({
      url: '../starIndex/starIndex?star_id=' + e.currentTarget.dataset.starid + '&star_name=' + e.currentTarget.dataset.starname
    })
  },
  goPhotoDetailPage: function(e) {
    let self = this
    if (e.currentTarget.dataset.status == 1) {
      wx.navigateTo({
        url: '../photoDetail/photoDetail?star_id=' + e.currentTarget.dataset.starid + '&pic_id=' + e.currentTarget.dataset.picid
      })
    }
  },
  hideModal: function() {
    console.log('hide')
    let self = this
    // wx.showTabBar({
    //   animation: true
    // })
    self.setData({
      showModalStatus: false
    })
  },
  showModal: function() {
    let self = this
    // wx.hideTabBar({
    //   animation:true
    // })
    if (!!self.showModalStatus) {
      return
    }
    self.setData({
      showModalStatus: true
    })
  },
  onReachBottom: function() {
    let self = this
    self.hotListIds.length ==  0 && self.setData({
      footTextShow: true
    })
    self.hotListIds.length > 0 && self.setData({
      footTextShow: false
    })
    self.hotListIds.length > 0 && self.getHotlist(self.hotListIds.splice(0, 10))
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    let self = this
    return {
      title: "爱豆高清图集，点击欣赏",
      path: '/pages/home/home?is_share=1',
      imageUrl: '/assets/images/indexPageShareImg.jpg'
    }
  },
  onLoad(options) {
    let self = this
    // getApp().version_switch();
    publicFu.setDom() //做手机适配
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
    self.getTime() //获取当前时间
    self.getHomeLists()
  },
  onShow() {
    // let self = this
    // if (Object.keys(getApp().globalData.musicPlayer).length !== 0 || getApp().globalData.pauseType == 1) {
    //   getApp().globalData.musicPlayer.pause() //暂停播放
    // }
  },
  onHide() {
    let self = this
    getApp().globalData.cueShow = false
  },
  onUnload() {
    let self = this;
    getApp().globalData.cueShow = false

  },
  getUserInfo: function(e) {
    let self = this
    publicFu.checkAuthorize(e, self)
  },
  getHotlist(idArr= []){
    let self = this
    let params = []
    if (idArr.length > 0) {
      params = {
        star_ids: JSON.stringify(idArr)
      }
    }
    self.setData({
      showLoading: true
    })
    req.postRequest('api/home/get_hotlist', params).then(res => {
      console.log("get_hotlistRes", res.data.data.hot_list)
      for (const v of res.data.data.hot_list) {
        if (v.pic_list != undefined) {
          for (const v1 of v.pic_list) {
            v1.pic_small = api.baseUrlCompress + v1.pic_small.split('/')[4] + "?imageView2/q/30" //改变图片质量
          }
        }
      }
      self.setData({
        homeList: res.data.data,
        // ['homeList.hot_list']: res.data.data.hot_list,
        ['homeList.hot_list']: [...self.data.homeList.hot_list, ...res.data.data.hot_list]
      })
      self.setData({
        showLoading: false
      })
    })
  },
  getHomeLists() {
    let self = this
    self.setData({
      showLoading: true
    })
    req.getRequest('api/home/list', {}).then(res => {
      console.log("homeList", res.data.data)
      for (const v of res.data.data.hot_list) {
        if (v.pic_list != undefined) {
          for (const v1 of v.pic_list) {
            v1.pic_small = api.baseUrlCompress + v1.pic_small.split('/')[4] + "?imageView2/q/30" //改变图片质量
          }
        }
      }
      self.hotListIds = res.data.data.banner.hotListIds
      self.setData({
        homeList: res.data.data,
        search_hot: res.data.data.banner.search_hot,
        ['homeList.hot_list']: [...self.data.homeList.hot_list, ...res.data.data.hot_list]
      })
      self.setData({
        showLoading: false
      })
      self.hotListIds.length == 0 && self.setData({
        footTextShow: true
      })
    })
  },
  // test(){
  //   wx.reLaunch({
  //     url: '/pages/starIndex/starIndex?star_id=9&video_id=4'
  //   })
  // },
})