// pages/uploadResult.js
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading:false,
    uploadState: false, //上传图片的返回结果
    starId: '', //明星id
    starName: '', //明星名字
    statusBarHeight: 0 //状态栏的高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this
    self.setData({
      uploadState: options.uploadState,
      starId: options.star_id,
      starName: options.star_name
    })
    publicFu.setDom(self) //做手机适配
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
    // getApp().globalData.musicPlayer.pause() //暂停音乐
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

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


  goStarIndexPage() {
    let self = this
    // wx.redirectTo({
    //   url: '../starIndex/starIndex?star_id=' + self.data.starId + "&goUploadPhotoPagetar_name=" + self.data.starName
    // })
    wx.navigateBack({//返回
      delta: 1
    })
  },
  goUploadPhotoPage(data) {
    let self = this
    setTimeout(() => {
      wx.redirectTo({
        url: '../uploadPhoto/uploadPhoto?star_id=' + self.data.starId + "&star_name=" + self.data.starName + "&data=" + data
      })
    }, 200)

  },
  continueUpload() {
    let self = this
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
})