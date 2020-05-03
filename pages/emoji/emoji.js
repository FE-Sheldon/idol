var app = getApp()
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var api = require('../../utils/api.js')
var emojiCount = 16;
var expressionAll = 16000;
var isScrollTop = true;
var unlockedIcon = 'https://idols.heywoodsminiprogram.com/images/emoji/unlockedIcon.png';
var emojiShelvesImg = 'https://idols.heywoodsminiprogram.com/images/emoji/emojiShelvesImg.png'
Page({
  temp: {
    emojiPartHeight: 116,
    emojiPartHeightFinal:260,
    isLast:false,
    imageUrls:[],
    star_id:11
  },
  data: {
    arrowLeftShowProp: true,
    scrollTop:90,
    // pageCenter:false,
    btnType:null,
    contactTitle: '扫描下方二维码，解锁朱一龙表情包！',
    contactPath: '/pages/starIndex/starIndex?emoji=1&star_id=11',
    contactImg: '/assets/images/emojicontactImg.png',
    starName: '',
    expressionThumbs:'',
    nextThumbsCount: '',
    percent:0,
    dataList:[],
  },
  onLoad: function (options) {
    var self = this;
    // publicFu.setDom(self) //做手机适配
    console.log("emoji_onLoad", options)
    if (getApp().globalData.musicPlayer){
      getApp().globalData.musicPlayer.pause()
    }
    if (options.btnType && options.btnType ==3){
      self.supporIdol();
    }
    if (options.star_id){
      self.temp.star_id = options.star_id;
    }
    wx.getSystemInfo({
      success: function (res) {
        var windowWidth = res.windowWidth;
        var emojiPartHeight = 233/(750/windowWidth);
        var emojiPartHeightFinal = 520 / (750 / windowWidth);
        self.temp.emojiPartHeight = emojiPartHeight;
        self.temp.emojiPartHeightFinal = emojiPartHeightFinal;
        console.log("emojiPartHeight", emojiPartHeight,"emojiPartHeightFinal", emojiPartHeightFinal)
      }
    })
    getApp().globalData.playMusic = 1;
    wx.setStorageSync("musicStarName", '朱一龙')
  },
  onShow: function (options) {
    var self = this;
    console.log("emoji_onShow")
    self.showData();
    self.checkStatus();
  },
  onHide: function () {
  },
  showData(){
    var self = this;
    var params = {
      star_id: 11,
    };
    req.postRequest('api/expression/show', params).then(res => {
      console.log("expression/show", res)
      if (res.data.code == 1 && res.data.data) {
        if (res.data.data.lists) {
          var lists = res.data.data.lists.star_expression || [];
          var newIndex = 0;
          var imageUrls = [];
          // lists = [];
          var dataList = JSON.parse(JSON.stringify(lists));
          for (var i = 0; i < emojiCount; i++) {
            if (dataList[i]) {//已解锁
              dataList[i].id = i + 1;
              if (!dataList[i].img_url || lists[i].img_url == "") {//即将上架
                dataList[i].img_url = emojiShelvesImg;
                dataList[i].unShelves = true;
              } else {//已上架
                newIndex = i;
                if (dataList.length == emojiCount && i == emojiCount - 1) {
                  dataList[i].isLast = true;
                  self.temp.isLast = true;
                }
                imageUrls.unshift(dataList[i].img_url);
              }
            } else {//未解锁
              dataList[i] = {
                "img_url": unlockedIcon,
                "id": dataList.length + 1,
              };
              if (lists.length == i) {
                dataList[i].unlocked = 1;
              } else {
                dataList[i].unlocked = 2;
              }
            }
          }
          if (lists.length > 0){
            dataList[newIndex].isNew = true;
          }
          self.temp.imageUrls = imageUrls;
          dataList = dataList.reverse();
          var starName = res.data.data.lists.star_name || '';
          var expressionThumbs = Number(res.data.data.lists.expression_thumbs);
          var nextThumbsCount = res.data.data.lists.next_thumbs_count;
          var dataList_h = dataList.length * 233;
          var percent = expressionThumbs / expressionAll * 100 || 0;
          console.log("dataList=", dataList, "newIndex=", newIndex, "dataList_h=", dataList_h, "percent=", percent)
          // var pageCenter = false;
          var scrollTop = self.data.scrollTop;
          if (wx.createSelectorQuery){
            const emojiConKQuery = wx.createSelectorQuery()
            emojiConKQuery.select('#emojiConK').boundingClientRect()
            emojiConKQuery.exec(function (res) {
              var height = res[0].height;
              var dataList_l = dataList.length || 0;
              var emojiPartHeight = self.temp.emojiPartHeight;
              scrollTop = emojiPartHeight * (dataList_l - newIndex) - height / 2 - emojiPartHeight / 2;
              console.log(res, "height=", height,"scrollTop=", scrollTop)
              // var emojiPartHeightAll = emojiPartHeight * dataList_l;
              // if (self.temp.isLast){
              //   var emojiPartHeightFinal = self.temp.emojiPartHeightFinal;
              //   emojiPartHeightAll = emojiPartHeightAll + (emojiPartHeightFinal - emojiPartHeight);
              // }
              // if (height > emojiPartHeightAll + 25) {
              //   pageCenter = true;
              // }
              self.setData({
                // pageCenter: pageCenter,
                dataList: dataList,
                starName: starName,
                expressionThumbs: expressionThumbs,
                nextThumbsCount: nextThumbsCount,
                percent: percent,
                
              })
              if (isScrollTop) {
                self.setData({ scrollTop: scrollTop})
              }
              isScrollTop = true;
            })
          }else{
            console.log("无法识别wx.createSelectorQuery")
            self.setData({
              // pageCenter: pageCenter,
              dataList: dataList,
              starName: starName,
              expressionThumbs: expressionThumbs,
              nextThumbsCount: nextThumbsCount,
              percent: percent,
              scrollTop: scrollTop
            })
          }
        }
      }
    })
  },
  checkStatus(e) {
    var self = this;
    var params = {
      star_id: 11
    };
    req.postRequest('api/expression/check_status', params).then(res => {
      console.log("expression/check_status", res)
      var btnType = 5;
      if (res.data.code == 10203) {//未授权
        btnType = 1;
        app.globalData.shouldUpdate = 1;
      }
      else if (res.data.code == 10302) {//未关注未支持(客服)
        btnType = 2;
      }
      else if (res.data.code == 10303) {//已关注未支持（支持）
        btnType = 3;
      }
      else if (res.data.code == 10305) {//已关注未支持（支持）第二次
        btnType = 4;
      }
      else if (res.data.code == 10301) {//已支持（分享）
        btnType = 5;
      }
      self.setData({
        btnType: btnType
      })
    })
  },
  getUserInfo(e) {
    let self = this;
    if (e.detail.userInfo == undefined) { //
      console.log("拒绝授权")
      wx.showModal({
        title: '提示',
        content: '允许授权才能支持爱豆',
        confirmText: '马上授权',
        success: function (e) {
          if (e.confirm) { //点击确认按钮
            wx.openSetting({
              success: (res) => {
                res.authSetting = {
                  "scope.userInfo": true,
                }
                console.log("二次允许授权")
                self.setUserInfo(e)
                self.supporIdol();
              }
            })
          }
        }
      })
    } else { //允许授权
      console.log("允许授权")
      self.setUserInfo(e)
      self.supporIdol();
    }
  },
  setUserInfo(e){
    console.log("setUserInfo参数", e)
    let self = this
    let params = {}
    console.log("app.globalData.shouldUpdate",app.globalData.shouldUpdate)
    if (app.globalData.shouldUpdate == 1) {
      if (e.detail.userInfo) {
        params = e.detail.userInfo
      } else {
        params = e.detail.detail.userInfo
      }
      params.sessionId = app.globalData.sessionId
      params.nickname = params.nickName
      params.avatar = params.avatarUrl
      params.encryptedData = e.detail.encryptedData
      params.iv = e.detail.iv
      console.log("set_user_info_params", params)
      req.postRequest('api/user/set_user_info', params).then(res => { //更新用户信息
        console.log("set_user_info", res)
        app.globalData.shouldUpdate = 0
        self.checkStatus();
      })
    }
  },
  collectFormId(e){
    if (e) {
      publicFu.sendFormIdParamsObj(e)
    }
  },
  supporIdol(e){
    console.log("supporIdol")
    var self = this;
    if (e){
      publicFu.sendFormIdParamsObj(e)
    }
    var params = {
      star_id: 11,
    };
    req.postRequest('api/expression/add', params).then(res => {
      console.log("expression/add", res)
      if (res.data.code == 1) {
        wx.showToast({
          title: '支持成功',
          icon: 'success',
          duration: 2000
        })
        self.showData();
        self.checkStatus();
      } else if (res.data.code == 10301){
        wx.showToast({
          title: '已支持过',
          icon: 'success',
          duration: 2000
        })
        console.log("已支持过")
        self.setData({
          btnType:5
        })
      }
    })
  },
  previewImg(e){
    var self = this;
    isScrollTop = false;
    var item = e.target.dataset.item;
    if (item.unShelves || item.unlocked){
      var title;
      if (item.unlocked==1){
        title = '还差' + self.data.nextThumbsCount + '支持可解锁';
      } else if (item.unlocked == 2){
        title = '未完成解锁目标';
      }
      else{
        title = '表情即将上架';
      }
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var nowImgUrl = item.img_url;
    wx.previewImage({
      current: nowImgUrl, // 当前显示图片的http链接
      urls: self.temp.imageUrls, // 需要预览的图片http链接列表
    })
  },
  onShareAppMessage: function (res) {
    var self = this;
    // var star_id = self.temp.star_id;
    if (res.from === 'button'){}
    var title = '快来支持朱一龙，解锁最新表情包~';
    var path = '/pages/starIndex/starIndex?emoji=1&star_id=11';
    return {
      title: title,
      imageUrl: '/assets/images/emojiShareImg.png',
      path: path,
      success: function (res) {
        //统计转发
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
