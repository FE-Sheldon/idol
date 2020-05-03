//index.js
//获取应用实例
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var api = require('../../utils/api.js')
const app = getApp()
var col1H = 0;
var col2H = 0;
Page({
  data: {
    isPass:0,//模板消息是否通过的标志(0：未通过，1：通过)
    starName:'',//明星的名字
    popular:0,//人气
    showModalStatus:false,
    myFavoritePhotoNum: 0, // 我家爱豆照片数量
    uploadPhotoPhotoNum: 0,//上传的照片数量
    showLoading:false,
    myFavoriteListNoData:false,
    uploadPhotoListNoData:false,
    leftList: [],
    rightList: [],
    images: [],
    loadingCount: 0,
    noMore: false, //是否有更多数据
    currentTab: 0, //（0:我家爱豆，1：上传的照片）
    starNameIndex: 0, //当前选中的是那个明星
    headerChange: false, //header是否开始转变的标志
    myFavoriteList: { //点击我家爱豆要显示的列表
      lists: []
    },
    uploadPhotoList: { //点击上传的照片要显示的列表
      lists: []
    },
    isLogin: getApp().globalData.isLogin, //是否授权用户信息
    userInfoAvataSrc: getApp().globalData.userInfo.avatarUrl, //已授权后的微信头像src
    userInfoNickName: getApp().globalData.userInfo.nickName, //已授权后的微信昵称
    toView: 'a',
    oneStarPicListIsNext: false, //oneStarPicList是否有下一页的标志
    uploadPhotoListIsNext: false, // uploadPhotoList是否有下一页的标志
    myFavoriteListIsNext: false, // myFavoriteList是否有下一页的标志
    myFavoriteListCurrentPage: 1, // myFavoriteList当前页数
    myFavoriteListTotalPage: 1, // myFavoriteList的总页数
    oneStarPicListCurrentPage: 1, //单个明星照片list的当前页数
    oneStarPicListTotalPage: 1, //单个明星照片照片list的总页数
    uploadPhotoListCurrentPage: 1, //全部明星照片list的当前页数
    uploadPhotoListTotalPage: 1, //全部明星照片list的当前页数
    currentStarId: 'all', // 当前选择的是哪个明星tab，all代表选择全部
  },
  formIdCollect: function(e) { //formId收集的方法
    // getApp().checkSessionId({
    //   suc: publicFu.sendFormIdParamsObj,
    //   e: e
    // })
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
        url: '../photoDetail/photoDetail?star_id=' + e.currentTarget.dataset.starid + '&pic_id=' + e.currentTarget.dataset.picid + "&photo_type=1" + "&star_name=" + e.currentTarget.dataset.starname
      })
    }
  },

  starNameClick: function(e) {
    let self = this
    if (self.data.currentStarId == e.currentTarget.dataset.starid) {
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
      currentStarId: e.currentTarget.dataset.starid,
      starNameIndex: e.currentTarget.dataset.index,
      toView: 'a' + e.currentTarget.dataset.starid //自动定位到tab
    })
    self.data.uploadPhotoList.lists.splice(0, self.data.uploadPhotoList.lists.length)
    self.setData({
      uploadPhotoList: self.data.uploadPhotoList
    })
    if (e.currentTarget.dataset.starid == 'all') { //点击全部
      // getApp().checkSessionId({
      //   suc: self.getUploadPhotoLists,
      //   e: {
      //     currentPage: 1,
      //     length: 10
      //   }
      // })
      let e = {
        currentPage: 1,
        length: 10
      }
      self.getUploadPhotoLists(e)
    } else {
      let e = {
        currentPage: 1,
        length: 10
      }
      self.getOneStarPicLists(e)
      // getApp().checkSessionId({
      //   suc: self.getOneStarPicLists,
      //   e: {
      //     currentPage: 1,
      //     length: 10
      //   }
      // })
    }
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
    self.data.uploadPhotoList.lists.splice(0, self.data.uploadPhotoList.lists.length) //清空我上传的照片数据
    self.data.myFavoriteList.lists.splice(0, self.data.myFavoriteList.lists.length) //清空我家爱豆数据
    self.setData({
      uploadPhotoList: self.data.uploadPhotoList,
      myFavoriteList: self.data.myFavoriteList,
    })
    if (self.data.currentTab == 0) { //点击我家爱豆
      // getApp().checkSessionId({
      //   suc: self.getMyFavoriteLists,
      //   e: {
      //     currentPage: 1,
      //     length: 10
      //   }
      // })
      let e = {
        currentPage: 1,
        length: 10
      }
      self.getMyFavoriteLists(e)
    } else if (self.data.currentTab == 1) { //点击上传的照片

      // getApp().checkSessionId({
      //   suc: self.getUploadPhotoLists,
      //   e: {
      //     currentPage: 1,
      //     length: 10
      //   }
      // })
      let e = {
        currentPage: 1,
        length: 10
      }
      self.getUploadPhotoLists(e)
    }
  },
  hideModal: function() {
    console.log('hide')
    let self = this
    self.setData({
      showModalStatus: false
    })
  },
  showModal: function() {
    let self = this;
    if (!!self.showModalStatus) {
      return
    }
    self.setData({
      showModalStatus: true
    })
  },
  onReachBottom: function() {
    let self = this
    console.log("uploadPhotoListCurrentPage", self.data.uploadPhotoListCurrentPage)
    console.log("uploadPhotoListTotalPage", self.data.uploadPhotoListTotalPage)
    if (self.data.currentTab == 0) { //我家爱豆
      if (self.data.myFavoriteListIsNext) { //有下一页数据
        //触底操作，追加一页
        let addpage = self.data.myFavoriteListCurrentPage + 1;
        // getApp().checkSessionId({
        //   suc: self.getMyFavoriteLists,
        //   e: {
        //     currentPage: addpage,
        //     length: 10
        //   }
        // })
        let e = {
          currentPage: addpage,
          length: 10
        }
        self.getMyFavoriteLists(e)
      }
    } else if (self.data.currentTab == 1) { //上传的照片
      if (self.data.currentStarId == 'all') { //点击全部
        if (self.data.uploadPhotoListIsNext) { //有下一页数据
          //触底操作，追加一页
          let addpage = self.data.uploadPhotoListCurrentPage + 1;
          // getApp().checkSessionId({
          //   suc: self.getUploadPhotoLists,
          //   e: {
          //     currentPage: addpage,
          //     length: 10
          //   }
          // })
          let e = {
            currentPage: addpage,
            length: 10
          }
          self.getUploadPhotoLists(e)
        }
      } else { //点击单个明星
        if (self.data.oneStarPicListIsNext) { //有下一页数据
          //触底操作，追加一页
          let addpage = self.data.oneStarPicListCurrentPage + 1;
          // getApp().checkSessionId({
          //   suc: self.getOneStarPicLists,
          //   e: {
          //     currentPage: addpage,
          //     length: 10
          //   }
          // })
          let e = {
            currentPage: addpage,
            length: 10
          }
          self.getOneStarPicLists(e)
        }
      }
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(e) {
    let self = this
    return {
      title: "爱豆高清图集，点击欣赏",
      path: '/pages/personal/personal?current_tab=' + self.data.currentTab + '&is_share=1',
      imageUrl: '/assets/images/indexPageShareImg.jpg'
    }
  },
  onLoad: function(options) {
    let self = this
    console.log("我的页面参数",options)
    col1H = 0
    col2H = 0
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
    self.setData({
      currentTab: options.current_tab == undefined ? '' : options.current_tab,
      starName: options.star_name == undefined ? '' : options.star_name,
      popular: options.popular == undefined ? '' : options.popular,
      isPass: options.is_pass == undefined ? '' : options.is_pass
    })
    if (getApp().globalData.scene == 1014 && self.data.isPass ==1) { //入口为小程序模板消息和审核通过的情况
      self.setData({
        showModalStatus: true //显示弹窗
      })
    }
    if (self.data.currentTab == 0) {
      // getApp().checkSessionId({
      //   suc: self.getMyFavoriteLists,
      //   e: {
      //     currentPage: 1,
      //     length: 10
      //   }
      // })
      let e = {
        currentPage: 1,
        length: 10
      }
      self.getMyFavoriteLists(e)
    } else if (self.data.currentTab == 1) {
      // getApp().checkSessionId({
      //   suc: self.getUploadPhotoLists,
      //   e: {
      //     currentPage: 1,
      //     length: 10
      //   }
      // })
      let e = {
        currentPage: 1,
        length: 10
      }
      self.getUploadPhotoLists(e)
    }



  },
  onShow() {
    // let self = this
    // if (Object.keys(getApp().globalData.musicPlayer).length !== 0 || getApp().globalData.pauseType == 1) {
    //   getApp().globalData.musicPlayer.pause() //暂停播放
    // }
  },
  onHide() {
    let self = this;
    getApp().globalData.cueShow = false
  },
  onUnload() {
    getApp().globalData.cueShow = false
  },
  getUserInfo: function(e) {
    let self = this
    publicFu.checkAuthorize(e, self)
  },
  hideModal: function () {
    console.log('hide')
    let self = this
    self.setData({
      showModalStatus: false
    })
  },
  showModal: function () {
    let self = this
    if (!!self.showModalStatus) {
      return
    }
    self.setData({
      showModalStatus: true
    })
  },
  getMyFavoriteLists(e) {
    let self = this
    self.setData({
      showLoading: true
    })
    let params = {
      page: e.currentPage,
      length: e.length
    }
    req.postRequest('api/me/my_favorite', params).then(res => {
      console.log("myFavoriteList", res.data.data)
      if (res.data.data.lists.length == 0) { //无数据的情况
        self.setData({
          ['myFavoriteList.lists']: res.data.data.lists,
          myFavoriteListNoData:true
        })
        self.setData({
          showLoading: false
        })
        return
      }
      for (const v of res.data.data.lists) {
        v.pic_small = api.baseUrlCompress + v.pic_small.split('/')[4] + "?imageView2/q/40" //改变图片质量
      }
      self.setData({
        myFavoriteList: res.data.data,
        myFavoritePhotoNum: res.data.data.banner.my_favorite,
        uploadPhotoPhotoNum: res.data.data.banner.my_upload,
        ['myFavoriteList.lists']: [...self.data.myFavoriteList.lists, ...res.data.data.lists],
        myFavoriteListTotalPage: res.data.data.paper.total_page,
        myFavoriteListCurrentPage: res.data.data.paper.current_page,
        myFavoriteListIsNext: res.data.data.paper.total_page > res.data.data.paper.current_page ? true : false
      })
      self.setData({
        showLoading: false
      })
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
    if (col1H <= col2H) {
      col1H += imgHeight + 60;
      self.data.leftList.push(imageObj);
    } else {
      console.log("col1H", col1H)
      console.log("col2H", col2H)
      col2H += imgHeight + 60;
      self.data.rightList.push(imageObj);
    }
    let loadingCount = self.data.loadingCount - 1;
    let data = {
      loadingCount: loadingCount,
      leftList: self.data.leftList,
      rightList: self.data.rightList
    };
    console.log("loadingCount",loadingCount)
    if (!loadingCount) {
      data.images = [];
    }
    self.setData(data);
    // console.log("left", self.data.leftList)
    // console.log("right", self.data.rightList)
  },
  getUploadPhotoLists(e) {
    let self = this
    self.setData({
      showLoading: true
    })
    let params = {
      page: e.currentPage,
      length: e.length
    }
    req.postRequest('api/me/my_uploads', params).then(res => {
      console.log("uploadPhotoList", res.data.data)
      res.data.data.banner.banner_star.unshift({
        "star_id": "all",
        "star_name": "全部"
      })
      if (res.data.data.lists.length == 0) {
        self.setData({
          ['uploadPhotoList.lists']: res.data.data.lists,
          uploadPhotoListNoData:true
        })
        self.setData({
          showLoading: false
        })
        return
      }
      for (let i = 0; i < res.data.data.lists.length; i++) {
        res.data.data.lists[i].pic_artwork = api.baseUrlCompress + res.data.data.lists[i].pic_artwork.split('/')[4] + "?imageView2/q/40" //改变图片质量
      }

      self.setData({
        loadingCount: res.data.data.lists.length,
        images: res.data.data.lists,
        uploadPhotoList: res.data.data,
        myFavoritePhotoNum: res.data.data.banner.my_favorite,
        uploadPhotoPhotoNum: res.data.data.banner.my_upload,
        ['uploadPhotoList.lists']: [...self.data.uploadPhotoList.lists, ...res.data.data.lists],
        uploadPhotoListTotalPage: res.data.data.paper.total_page,
        uploadPhotoListCurrentPage: res.data.data.paper.current_page,
        uploadPhotoListIsNext: res.data.data.paper.total_page > res.data.data.paper.current_page ? true : false
      })
      self.setData({
        showLoading: false
      })
    })
  },
  getOneStarPicLists(e) {
    let self = this
    self.setData({
      showLoading: true
    })
    let params = {
      star_id: self.data.currentStarId,
      page: e.currentPage,
      length: e.length
    }
    req.postRequest('api/me/one_star_pic', params).then(res => {
      console.log('one_star_pic', res.data.data)

      for (const v of res.data.data.lists) {
        v.pic_artwork = api.baseUrlCompress + v.pic_artwork.split('/')[4] + "?imageView2/q/40" //改变图片质量
      }
      self.setData({
        loadingCount: res.data.data.lists.length,
        images: res.data.data.lists,
        ['uploadPhotoList.lists']: [...self.data.uploadPhotoList.lists, ...res.data.data.lists],
        oneStarPicListTotalPage: res.data.data.paper.total_page,
        oneStarPicListCurrentPage: res.data.data.paper.current_page,
        oneStarPicListIsNext: res.data.data.paper.total_page > res.data.data.paper.current_page ? true : false
      })
      self.setData({
        showLoading: false
      })
    })
  }
})