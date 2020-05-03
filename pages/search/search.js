// pages/search/search.js
var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: false,
    starName: '', //明星的名字
    searchList: {}, //搜索到的列表
    searchHotListShow: true, //热搜列表是否显示
    searchListCurrentPage: 1, //搜索结果列表数据的当前页数
    searchListTotalPages: 1, //搜索结果列表的总页数
    statusBarHeight: 0, //状态栏的高度
    isIphoneX: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let self = this
    self.getSearchHot()
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
    // getApp().globalData.musicPlayer.pause()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

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
    let self = this
    console.log("searchListCurrentPage", self.data.searchListCurrentPage)
    console.log("searchListTotalPages", self.data.searchListTotalPages)
    if (self.data.currentTab == 0) { //HOME

    } else if (self.data.currentTab == 1) { //我
      if (self.data.searchListCurrentPage <= self.data.searchListCurrentPage) { //当前页面小于总页数的时候开始上拉加载数据
        self.data.searchListCurrentPage++ //请求成功后当前页面加一
          self.search("上拉")
      } else {
        self.setData({
          searchListCurrentPage: 1, //初始化
          searchListCurrentPage: 1
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  goStarIndexPage: function(e) {
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
  clearInput() {
    let self = this
    self.setData({
      starName: ''
    })
  },
  inputBlur: function(e) {
    let self = this
    self.setData({
      starName: e.detail.value
    })
    if (self.data.starName != '') {
      self.search()
    }
  },
  getSearchHot() {
    let self = this
    req.getRequest('api/home/search_hot', {}).then(res => {
      console.log("searchHotList", res.data.data)
      self.setData({
        searchHotList: res.data.data
      })
    })
  },
  search(e) {
    let self = this
    self.setData({
      showLoading: true
    })
    let params = {
      name: self.data.starName,
      page: self.data.searchListCurrentPage
    }
    req.postRequest('api/home/search', params).then(res => {
      console.log("searchList", res.data.data)
      if (res.data.data.length == 0) {
        self.setData({
          showLoading: false,
          searchList: res.data.data,
          searchHotListShow: false
        })
        return
      }
      if (e) { //上拉加载数据
        self.setData({
          ['searchList.lists']: [...self.data.searchList.lists, ...res.data.data.lists],
          searchHotListShow: false
        })
      } else {
        if (res.data.data) {
          self.setData({
            searchList: res.data.data,
            searchHotListShow: false
          })
        }
      }
      self.setData({
        searchListTotalPages: res.data.data.paper.total_page
      })
      self.setData({
        showLoading: false
      })
    })
  }
})