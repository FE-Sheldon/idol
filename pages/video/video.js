var req = require('../../utils/wxRequest.js')
var publicFu = require('../../utils/public.js')
var app = getApp();
var dataList = [
  {
    starName: "易烊千玺",
    title: '易烊千玺·生贺群舞踩点燃向混剪',
    unitId: 'adunit-ec5c247421bfde5c',
    src: 'https://idols.heywoodsminiprogram.com/video/1.mp4'
  },
  {
    starName: "朱一龙",
    title: '朱一龙·Like系列影像',
    unitId: 'adunit-86a6e18fa1d58ac4',
    src: 'https://idols.heywoodsminiprogram.com/video/2.mp4',
  },
  {
    starName: "白宇",
    title: '白宇·角色燃向混剪',
    unitId: 'adunit-5553ddd7f371f1fc',
    src: 'https://idols.heywoodsminiprogram.com/video/3.mp4',
  },
  {
    starName: "蔡徐坤",
    title: '蔡徐坤·色气向踩点混剪安利',
    unitId: 'adunit-ccc477f44be4a2b3',
    src: 'https://idols.heywoodsminiprogram.com/video/4.mp4',
  },
];

Page({
  temp:{
    video_id:1,
    star_id:null,
    shareTitle:null
  },
  data: {
    arrowLeftShowProp:true,
    statusBarHeight: 0, //状态栏的高度
    isIphoneX: false,
    dataPart:{
      starName: "易烊千玺",
      unitId: 'adunit-ec5c247421bfde5c',
      src: 'https://idols.heywoodsminiprogram.com/video/1.mp4'
    }
  },
  onLoad: function(options) {
    let self = this
    publicFu.setDom(self) //做手机适配
    console.log(options)
    var index;
    if (options.video_id){
      self.temp.video_id = Number(options.video_id);
      self.temp.star_id = Number(options.star_id);
      index = Number(options.video_id)-1;
    }else{
      index = 0;
      self.temp.video_id = 1;
      self.temp.star_id = 10;
    }
    var arrowLeftShowProp = true;
    if (options.upload_status && options.upload_status==0){
      arrowLeftShowProp = false;
    }
    console.log("arrowLeftShowProp", arrowLeftShowProp)
    self.setData({
      dataPart: dataList[index],
      arrowLeftShowProp
    })
    getApp().globalData.playMusic = 1;
    wx.setStorageSync("musicStarName", dataList[index].starName)
  },
  onShow: function() {
    if (getApp().globalData.musicPlayer){
      getApp().globalData.musicPlayer.pause()
    }
  },
  onHide: function() {

  },
  // getStarData(){
  //   let self = this;
  //   if (self.temp.star_id){
  //     var params = {
  //       star_id: self.temp.star_id,
  //       page: 1
  //     }
  //     req.postRequest('api/star/new_list', params).then(res => {
  //       console.log("new_list", res)
  //       if (res.data.code == 1) {
  //         var shareTitle = res.data.data.banner.picShareMessages[0].message;
  //         self.temp.shareTitle = shareTitle;
  //       }
  //     })
  //   }
  // },
  formIdCollect(e) { //formId收集的方法
    console.log(111,e)
    publicFu.sendFormIdParamsObj(e)
  },
  goStarIndexPage(e) {
    console.log(222, e)
    wx.navigateBack({//返回
      delta: 1
    })
    publicFu.sendFormIdParamsObj(e)
  },
  onShareAppMessage: function (res) {
    var self = this;
    if (res.from === 'button') { }
    var video_id = self.temp.video_id;
    var star_id = self.temp.star_id;
    var shareTitle = dataList[video_id-1].title || '快来欣赏爱豆的精彩瞬间！';
    var imageUrl = 'https://idols.heywoodsminiprogram.com/images/videoShareImg/' + video_id + '.png';
    // var imageUrl = '/assets/images/videoShareImg/' + video_id + '.png';
    var path = '/pages/home/home';
    
    if (video_id){
      path = '/pages/starIndex/starIndex?star_id=' + star_id + '&video_id=' + video_id;
    }
    console.log(shareTitle, path, imageUrl)
    return {
      title: shareTitle,
      imageUrl: imageUrl,
      path: path,
      success: function (res) {
        //统计转发
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})