// pages/message-detail/message-detail.js

const networkp = require("../../utils/networkp.js");

const pUpdateMsgStatus = networkp.get;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg:{}
  },

  updateMsgStatus:function(){
    pUpdateMsgStatus({
      url:"/u/msg/update",
      data:{
        id:this.data.msg.id
      }
    })
  },
  
  back: function(e) {
    wx.switchTab({
      url: "/pages/message/message"
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      msg:JSON.parse(options.item)
    })
    this.updateMsgStatus();
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})