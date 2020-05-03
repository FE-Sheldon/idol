var req = require('../utils/wxRequest.js')
var formIdSignJs = require('../utils/getFormIdSign.js')
var check = require('../utils/index.js')
var wxApi = require('../utils/wxApi.js')
var api = require('../utils/api.js')
const app = getApp()
export function sendFormIdParamsObj(e) { //收集formid
  let params = {
    formid: e.detail.formId,
    openid: wx.getStorageSync("openid"),
    appid: app.globalData.appid,
    timestamp: new Date().getTime(),
  }
  params.sign = formIdSignJs.getFormIdSign(params)
  // sendOpenIdParamsObj() //在收集formId的时候顺便收集openId
  let url = api.baseUrlFormId + "api/collection/send"
  req.formIdReq(url, params).then(data => {
    if (data.data.data.code == 40000) {
      console.log("收集fromid成功")
      console.log("params", params)
      console.log(data)
      console.log('formId:', params.formid)
      getApp().globalData.formIdCollectLocks = true
    } else {
      console.log("收集fromid失败Params", params)
      console.log("收集fromid失败")
    }

  })
}
export function sendOpenIdParamsObj() { //收集openid
  let params = {
    openid: app.globalData.openid,
    appid: app.globalData.appid,
  }
  req.postRequest('sub/col', params).then(data => {
    console.log("params", params)
    console.log(data)
  })
}
export function dataReport(e) { //数据上报方法
  let params = {
    key: e.key,
    openid: app.globalData.openid,
    appid: app.globalData.appid,
  }
  app.globalData.sdk.statistics.sendkv(params)
  console.log(params)
}
export function mongoCollect(e,self,key) { //mongo埋点上报
  let params = {
    uid: wx.getStorageSync("uid"),
    pic_id: self.data.picId,
    star_id: self.data.starId
  }
  if(e){
    params.nickname = e.detail.userInfo.nickName
  }
  req.postRequest("api/mongo_collect/" + key, params).then(res => {
    console.log("mongo_collect", res)
  })
}
export function checkOpenid(fn, e) {
  if (!app.globalData.openid) {
    app.globalData.sdk.user.login({
      suc: function() {
        if (e) {
          fn(e)
        } else {
          fn()
        }

      }
    })
  } else {
    if (e) {
      fn(e)
    } else {
      fn()
    }

  }
}

export function checkAuthorize(e, self) {
  if (e.detail.userInfo == undefined) { //拒绝授权

  } else { //允许授权
    self.setData({
      isLogin: 1,
      userInfoAvataSrc: e.detail.userInfo.avatarUrl,
      userInfoNickName: e.detail.userInfo.nickName
    })
    getApp().globalData.isLogin = 1
    getApp().globalData.userInfo.nickName = e.detail.userInfo.nickName
    getApp().globalData.userInfo.avatarUrl = e.detail.userInfo.avatarUrl
  }
}
export function setDom(self) {
  wx.getSystemInfo({
    success: function(res) {
      console.log(res)
      getApp().globalData.windowHeight = res.windowHeight
      getApp().globalData.windowWidth = res.windowWidth
      // var query = wx.createSelectorQuery()
      // query.select('#HeaderNav').boundingClientRect()
      // query.select('#FooterNav').boundingClientRect()
      // self.setData({
      //   windowHeight: res.windowHeight,
      //   windowWidth: res.windowWidth
      // })
      if (res.model.indexOf('iPhone X') != -1) {
        self.setData({
          statusBarHeight: res.statusBarHeight,
          isIphoneX: true
        })
        wx.setStorageSync('isIphoneX', true)
      } else {
        wx.setStorageSync('isIphoneX', false)
      }

      // query.exec(function(res) {
      //   console.log('res', res)
      //   if (res[1] != null) {
      //     var navFooterHeight = res[1].height
      //     self.setData({
      //       navFooterHeight: navFooterHeight,
      //     })
      //   }
      //   let navHeaderHeight = res[0].height
      //   self.setData({
      //     navHeaderHeight: navHeaderHeight,
      //     videoContainerHeight: self.data.windowHeight - navHeaderHeight - navFooterHeight
      //   })
      //   console.log(self.data.videoContainerHeight)
      // })

    }
  })
}
/*获取当前页url*/
export function getCurrentPageUrl() {
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象
  let url = currentPage.route //当前页面url
  return url
}
export function returnPage() {
  let pages = getCurrentPages() //获取加载的页面
  let currentPage = pages[pages.length - 1] //获取当前页面的对象
  let prevPage = pages[pages.length - 2] //上一个页面的对象
  if (prevPage == undefined) { //如果是分享过来的页面，统一返回首页
    wx.redirectTo({
      url: '../index/index'
    })
    return
  }
  if (Object.keys(prevPage.options).length > 0) { //如果上一个页面有带过来参数option，返回的时候给上一个页面设置option
    prevPage.onLoad(prevPage.options)
  } else { //如果上一个页面没有过来参数option，则返回首页
    prevPage.onLoad()
  }
  wx.navigateBack({ //返回
    delta: 1
  })
}