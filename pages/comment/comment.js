// pages/comment/comment.js
const app = getApp();
const networkp = require("../../utils/networkp.js");

const pGetComment = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: true,
    id: -1,
    currentVideoComment: { records: [] },
    // 页面总高度
    windowHeight: app.globalData.windowHeight,
    // scroll-view的高度
    scrollViewHeight: 0,
  },

  back: function (e) {
    wx.switchTab({
      url: "/pages/message/message",
    });
  },

  getComment: function (pages) {
    pGetComment({
      url: "/u/user/comment",
      data: {
        id: this.data.id,
        pages: pages,
      },
    }).then((res) => {
      if (res.success) {
        let _curComment = this.data.currentVideoComment;
        let _newComment = res.data;
        _curComment.records = _curComment.records.concat(_newComment.records);
        _curComment.current = _newComment.current;
        _curComment.pages = _newComment.pages;
        this.setData({
          currentVideoComment: _curComment,
        });
      }
    });
  },

  onCommentScrollToLower: function () {
    let obj = this.data.currentVideoComment;
    if (obj.current != obj.pages) {
      this.getComment(obj.current + 1);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = wx.createSelectorQuery().in(this);
    query.select("#navbar").boundingClientRect();

    query.exec((res) => {
      // 取出navbar的高度
      let navbarHeight = res[0].height;

      let scrollViewHeight = this.data.windowHeight - navbarHeight;

      // 算出来之后存到data对象里面
      this.setData({
        scrollViewHeight: scrollViewHeight,
      });
    });
    this.setData({
      id: app.globalData.id,
    });
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getComment(1);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
