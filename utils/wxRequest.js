var Promise = require('./es6-promise.js')
var api = require('./api.js')
var sign = require('./sign.js')
var util = require('./util.js')

function wxPromisify(fn) {
  return function(obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function(res) {
        // 成功
        resolve(res)
      }
      obj.fail = function(error) {
        // 失败
        reject(error)
        console.log('error', error)
      }
      fn(obj)
    })
  }
}
// 无论promise对象最后状态如何都会执行
Promise.prototype.finally = function(callback) {
  let P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  )
}
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */

function uploadPhotoRequest(url, data) {
  var getRequest = wxPromisify(wx.request)
  return getRequest({
    url: api.baseUrl + url,
    method: 'GET',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

// function getRequest(url, data) {
//   var getRequest = wxPromisify(wx.request)
//   data.client_version = api.client_version //增加版本号
//   data.timestamp = new Date().getTime()
//   data.session_id = wx.getStorageSync("sessionId")
//   return getRequest({
//     url: api.baseUrl + url,
//     method: 'GET',
//     data: data,
//     header: {
//       'content-type': 'application/x-www-form-urlencoded'
//     }
//   })
// }
function getRequest(url, data) {
  return new Promise((resolve, reject) => {
    data.client_version = api.client_version //增加版本号
    data.timestamp = new Date().getTime();
    // data.session_id = wx.getStorageSync("sessionId")
    data.app_id = getApp().globalData.appid
    data.session_id = getApp().globalData.sessionId
    data.sessionId = getApp().globalData.sessionId
    if (!data.session_id) {
      getApp().login(function (res) {
        getRequest(url, data).then(res => { resolve(res), reject(res) })
      })
      return
    }
    wx.request({
      url: api.baseUrl + url,
      method: 'GET',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // 成功
        if (res.data.code == 10002 || res.data.code == 10000) { //sessionId为空或者过期的情况下
          getApp().login(function (res) {
            getRequest(url, data).then(res => { resolve(res), reject(res) })
          })
        } else {
          resolve(res)
        }
      },
      fail: function (res) {
        reject(error)
        console.log('error', error)
      }
    })
  })
}
/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data) {
  return new Promise((resolve, reject) => {
    data.client_version = api.client_version //增加版本号
    data.timestamp = new Date().getTime();
    // data.session_id = wx.getStorageSync("sessionId")
    data.app_id = getApp().globalData.appid
    data.session_id = getApp().globalData.sessionId
    data.sessionId = getApp().globalData.sessionId
    if (!data.session_id) {
      getApp().login(function (res) {
        postRequest(url, data).then(res => { resolve(res), reject(res) })
      })
      return
    }
    wx.request({
      url: api.baseUrl + url,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        // 成功
        if (res.data.code == 10002 || res.data.code == 10000) { //sessionId为空或者过期的情况下
          getApp().login(function (res){
            postRequest(url, data).then(res=>{resolve(res),reject(res)})
          })
        }else{
          resolve(res)
        }
      },
      fail: function(res) {
        reject(error)
        console.log('error', error)
      }
    })
  })
}

function makesessionPostRequest(url, data) {
  var getReq = wxPromisify(wx.request)
  data.client_version = api.client_version //增加版本号
  return getReq({
    url: api.baseUrl + url,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    }
  })
}

// function getReq(url, data) {
//   var getReq = wxPromisify(wx.request)
//   data.client_version = api.client_version //增加版本号
//   data.timestamp = new Date().getTime();
//   data.session_id = wx.getStorageSync("sessionId")
//   return getReq({
//     url: api.baseUrl + url,
//     method: 'GET',
//     data: data,
//     header: {
//       'Content-Type': 'application/json'
//     }
//   })
// }
function getReq(url, data) {
  return new Promise((resolve, reject) => {
    data.client_version = api.client_version //增加版本号
    data.timestamp = new Date().getTime();
    // data.session_id = wx.getStorageSync("sessionId")
    data.session_id = getApp().globalData.sessionId
    data.appid = getApp().globalData.appid
    if (!data.session_id) {
      getApp().login(function (res) {
        getReq(url, data).then(res => { resolve(res), reject(res) })
      })
      return
    }
    wx.request({
      url: api.baseUrl + url,
      method: 'GET',
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 成功
        if (res.data.code == 10002 || res.data.code == 10000) { //sessionId为空或者过期的情况下
          getApp().login(function (res) {
            getReq(url, data).then(res => { resolve(res), reject(res) })
          })
        } else {
          resolve(res)
        }
      },
      fail: function (res) {
        reject(error)
        console.log('error', error)
      }
    })
  })
}
// function postReq(url, data) {
//   var postReq = wxPromisify(wx.request)
//   data.client_version = api.client_version //增加版本号
//   data.timestamp = new Date().getTime();
//   data.session_id = wx.getStorageSync("sessionId")
//   return postReq({
//     url: api.baseUrl + url,
//     method: 'POST',
//     data: data,
//     header: {
//       'Content-Type': 'application/json'
//     }
//   })
// }
function postReq(url, data) {
  return new Promise((resolve, reject) => {
    data.client_version = api.client_version //增加版本号
    data.timestamp = new Date().getTime();
    // data.session_id = wx.getStorageSync("sessionId")
    data.appid = getApp().globalData.appid
    data.session_id = getApp().globalData.sessionId
    if (!data.session_id) {
      getApp().login(function (res) {
        postReq(url, data).then(res => { resolve(res), reject(res) })
      })
      return
    }
    wx.request({
      url: api.baseUrl + url,
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        // 成功
        if (res.data.code == 10002 || res.data.code == 10000) { //sessionId为空或者过期的情况下
          getApp().login(function (res) {
            postReq(url, data).then(res => { resolve(res), reject(res) })
          })
        } else {
          resolve(res)
        }
      },
      fail: function (res) {
        reject(error)
        console.log('error', error)
      }
    })
  })
}
// function formIdReq(url, data) {
//   var postReq = wxPromisify(wx.request)
//   return postReq({
//     url: url,
//     method: 'POST',
//     data: data,
//     header: {
//       'content-type': 'application/x-www-form-urlencoded'
//     }
//   })
// }
function formIdReq(url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // 成功
        if (res.data.code == 10002 || res.data.code == 10000) { //sessionId为空或者过期的情况下
          getApp().login(function (res) {
            formIdReq(url, data).then(res => { resolve(res), reject(res) })
          })
        } else {
          resolve(res)
        }
      },
      fail: function (res) {
        reject(error)
        console.log('error', error)
      }
    })
  })
}
module.exports = {
  postRequest: postRequest,
  getRequest: getRequest,
  makesessionPostRequest:makesessionPostRequest,
  // sendStatic: sendStatic,
  // login: login,
  // collectFormId: collectFormId,
  // statistics: statistics,
  getReq: getReq,
  postReq: postReq,
  uploadPhotoRequest: uploadPhotoRequest,
  formIdReq: formIdReq
}