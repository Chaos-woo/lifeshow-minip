// pages/report/report.js
const app = getApp();
const networkp = require("../../utils/networkp.js");

const pPostReporter = networkp.post;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    reporter:-1,
    videoId:-1,
    videoTitle:""
  },

  back: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 上传信息
  uploadReporter: function(e) {
    let value = e.detail.value;
    if (value.description == "") {
      wx.showToast({
        title: "请填写反馈信息~",
        icon: "none",
        duration: 2000
      });
      return;
    }
    let _data = this.data;
    pPostReporter({
      url:"/u/video/report",
      data:{
        createdBy:_data.reporter,
        videoId:_data.videoId,
        reportContent:value.description
      }
    }).then(res=>{
      wx.navigateBack({
        delta: 1
      });
      wx.showToast({
        title: "感谢您的反馈~",
        icon: "none",
        duration: 2000,
        mask: false
      });
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      reporter:options.id,
      videoId:options.video,
      videoTitle:options.title
    })
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {}
});
