// components/HeaderNav2/headerNav2.js
var publicFu = require('../../utils/public.js')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titleNameProp: { // 顶部导航标题名称
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    targetPageProp: { // 目标页面
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    arrowLeftShowProp: { // 左箭头是否显示
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: true // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    arrowLeftIsFixedProp: { // 左箭头是否为固定定位
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    navTitleColorProp: { // 顶部导航标题名称字体颜色
      type: String, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: '#fff' // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    isIphoneXProp: { // 是否为isIphoneX高度的设备
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    homeIconShowProp: { // 屋子图标是否显示的标志
      type: Boolean, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    // isIphoneXProp: wx.getStorageSync('isIphoneX'), //是否为iphoneX的设备
    navHeaderHeight: wx.getStorageSync('navHeaderHeight'), //顶部title的高度
    statusBarHeight: wx.getStorageSync('statusBarHeight'), //状态栏的高度
  },
  attached: function() {
    // var query = wx.createSelectorQuery()
    // query.select('.container').boundingClientRect()
    // query.exec(function (res) {
    //   console.log('res', res)
    //   getApp().globalData.navHeaderHeight = res[0].height
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    formIdCollect: function(e) { //formId收集的方法
      publicFu.sendFormIdParamsObj(e)
    },
    goIndexPage(){
      wx.switchTab({
        url: '/pages/home/home'
      })
    },
    goPage: function(e) {
      let self = this
      let pages = getCurrentPages() //获取加载的页面
      let currentPage = pages[pages.length - 1] //获取当前页面的对象
      let prevPage = pages[pages.length - 2]//上一个页面的对象
      if (prevPage == undefined){ //如果是分享过来的页面，统一返回首页
        wx.switchTab({
          url: '/pages/home/home'
        })
        return
      }
      let url = prevPage.route //上一个页面url
      // if (url != "pages/starIndex/starIndex" && url != "pages/search/search"){ //若返回的是明星详情页和搜索页，不执行onload
      //   if (Object.keys(prevPage.options).length > 0) { //如果上一个页面有带过来参数option，返回的时候给上一个页面设置option
      //     prevPage.onLoad(prevPage.options)
      //   } else {//如果上一个页面没有过来参数option，则不设置option
      //     prevPage.onLoad()
      //   }
      // }
      // if (url != "pages/starIndex/starIndex") { ////若返回的不是明星详情页，暂停播放音乐
      //   getApp().globalData.isPause = false
      //   getApp().globalData.currentMusicObj.pause()
      // }else{ //明显主页
      //   getApp().globalData.isPause = true
      // }
      wx.navigateBack({//返回
        delta: 1,
      })
    },
  }
})