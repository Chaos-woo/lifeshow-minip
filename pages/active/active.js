// pages/active/active.js
const app = getApp();

const networkp = require("../../utils/networkp.js");

const pGetActivList = networkp.get;
const pGetActivByKeyword = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activList: [],
    current: -1,
    total: -1,
    // 页面总高度
    windowHeight: 0,
    // scroll-view的高度
    scrollViewHeight: 0
  },

  // 根据关键词查询
  onSearch: function(e) {
    let keyword = e.detail;
    pGetActivByKeyword({
      url: "/u/activ/key",
      data: {
        keyword: keyword
      }
    }).then(res => {
      if (res.success) {
        let _data = res.data;
        this.setData({
          activList: _data.records,
          current: _data.current,
          total: _data.pages
        });
      }
    });
  },

  // 清空关键词并列出所有活动
  onCancel: function() {
    this.getActivList(1, false);
  },

  // 获取活动列表
  getActivList: function(page, type) {
    pGetActivList({
      url: "/u/activ",
      data: {
        page: page
      }
    }).then(res => {
      if (res.success) {
        let _data = res.data;
        if (type) {
          this.setData({
            activList: this.data.activList.concat(_data.records),
            current: _data.current,
            total: _data.pages
          });
        } else {
          this.setData({
            activList: _data.records,
            current: _data.current,
            total: _data.pages
          });
        }
      }
    });
  },

  // 监听活动面板滑动到最底部
  onScrollToLower: function() {
    let _data = this.data;
    if (_data.current == _data.total) {
      return;
    }
    this.getActivList(_data.current + 1, true);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.identity != "0") {
      wx.getSystemInfo({
        success: res => {
          this.setData({
            windowHeight: res.windowHeight
          });
        }
      });

      let query = wx.createSelectorQuery().in(this);
      query.select("#navbar").boundingClientRect();
      query.select("#searchBar").boundingClientRect();

      query.exec(res => {
        // 取出navbar的高度
        let navbarHeight = res[0].height;
        let searchBarHeight = res[1].height;

        let scrollViewHeight =
          this.data.windowHeight - navbarHeight - searchBarHeight;

        // 算出来之后存到data对象里面
        this.setData({
          scrollViewHeight: scrollViewHeight
        });
      });

      this.getActivList(1, false);
    } else {
      app.navigateToLogin();
    }
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
