var Promise = require('./es6-promise.js')

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        // 成功
        resolve(res)
      }
      obj.fail = function (res) {
        // 失败
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
/**
 * 微信用户登录,获取code
 */
function wxLogin() {
  var wxLogin=wxPromisify(wx.login);
  return wxLogin();
}
/**
 * 获取微信用户信息
 * 注意:须在登录之后调用
 */
function wxGetUserInfo() {
  var wxGetUserInfo=wxPromisify(wx.getUserInfo);
  return wxGetUserInfo();
}

/**
 * 检查登陆是否过期
 */
function wxcheckSession(){
  return  wxPromisify(wx.checkSession)
}
/**
 * 获取系统信息
 */
function wxGetSystemInfo() {
  return wxPromisify(wx.getSystemInfo)
}

/**
 * 保留当前页面，跳转到应用内的某个页面
 * url:'../index/index'
 * params:{key:value1}
 */
function wxNavigateTo(url, params) {
  var wxNavigateTo = wxPromisify(wx.navigateTo)
  const serializedParams = this.paramSerializer(params)
  if (serializedParams.length > 0) {
    url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams
  }
  return wxNavigateTo({
    url: url
  })
}

/**
 * 获取页面分享券信息
 */
function wxGetShareInfo(shareTicket) {
  var wxGetShareInfo = wxPromisify(wx.getShareInfo)
  return wxGetShareInfo({
    shareTicket: shareTicket
  })
}
module.exports = {
  wxPromisify: wxPromisify,
  wxLogin: wxLogin,
  wxGetUserInfo: wxGetUserInfo,
  wxGetSystemInfo: wxGetSystemInfo,
  wxGetShareInfo:wxGetShareInfo,
  wxcheckSession:wxcheckSession
}
