// pages/fans/fans.js
const app = getApp();
const networkp = require("../../utils/networkp.js");

const pGetList = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    userList: [],
    current: -1,
    total: -1,
    // 页面总高度
    windowHeight: 0,
    // scroll-view的高度
    scrollViewHeight: 0
  },

  back: function(e) {
    wx.switchTab({
      url: "/pages/message/message"
    });
  },

  // 获取粉丝列表
  getFansList(page) {
    pGetList({
      url: "/u/user/fans",
      data: {
        id: this.data.id,
        pages: page
      }
    }).then(res => {
      if (res.success) {
        let _data = res.data;
        this.setData({
          userList: this.data.userList.concat(_data.records),
          current: _data.current,
          total: _data.pages
        });
      }
    });
  },

  // 监听滚动面板的滚动操作
  onScrollToLower: function() {
    let _data = this.data;
    if (_data.current == _data.total) {
      return;
    }
    this.getList(_data.current + 1);
  },

  // 监听滑动单元的关闭操作
  onClose: function(e) {
    const { position, instance } = e.detail;
    switch (position) {
      case "left":
        instance.close();
        break;
      case "cell":
        instance.close();
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: res => {
        this.setData({
          windowHeight: res.windowHeight
        })
      }
    });

    let query = wx.createSelectorQuery().in(this);
    query.select("#navbar").boundingClientRect();

    query.exec(res => {
      // 取出navbar的高度
      let navbarHeight = res[0].height;

      let scrollViewHeight = this.data.windowHeight - navbarHeight;

      // 算出来之后存到data对象里面
      this.setData({
        scrollViewHeight: scrollViewHeight
      });
    });

    this.setData({
      id: app.globalData.id
    });
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      userList: []
    });
    this.getFansList(1);
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
