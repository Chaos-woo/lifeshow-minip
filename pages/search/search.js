// pages/search/search.js
const app = getApp();
const networkp = require("../../utils/networkp.js");

const pGetSearchWorks = networkp.get;
const pGetSearchUsers = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activ: "",
    curKeyword: "",
    worksVideoObject: {},
    userListObject: {},
    // 页面总高度
    windowHeight: app.globalData.windowHeight,
    // scroll-view的高度
    scrollViewHeight: 0,
  },

  back: function (e) {
    wx.navigateBack({
      delta: 1,
    });
  },

  onSearch(e) {
    this.setData({
      curKeyword: e.detail,
    });
    this.getWorks(1, false);
    this.getUsers(1, false);
  },

  onCancel(e) {
    this.setData({
      curKeyword: "",
    });
  },

  // 获取搜索作品
  getWorks: function (pages, type) {
    pGetSearchWorks({
      url: "/u/video/search",
      data: {
        keyword: this.data.curKeyword,
        pages: pages,
      },
    }).then((res) => {
      if (res.success) {
        if (type) {
          let _curWorks = this.data.worksVideoObject;
          let _newWorks = res.data;
          _curWorks.records = _curWorks.records.concat(_newWorks.records);
          _curWorks.current = _newWorks.current;
          _curWorks.pages = _newWorks.pages;
          this.setData({
            worksVideoObject: _curWorks,
          });
        } else {
          this.setData({
            worksVideoObject: res.data,
          });
        }
      }
    });
  },

  // 监听作品滚动面板到底时触发
  onWorksScrollToLower: function () {
    let obj = this.data.worksVideoObject;
    if (obj.current != obj.pages) {
      this.getWorks(obj.current + 1, true);
    }
  },

  getUsers: function (pages, type) {
    pGetSearchUsers({
      url: "/u/user/search",
      data: {
        keyword: this.data.curKeyword,
        pages: pages,
      },
    }).then((res) => {
      if (res.success) {
        if (type) {
          let _curUser = this.data.userListObject;
          let _newUser = res.data;
          _curUser.records = _curUser.records.concat(_newUser.records);
          _curUser.current = _newUser.current;
          _curUser.pages = _newUser.pages;
          this.setData({
            userListObject: _curUser,
          });
        } else {
          this.setData({
            userListObject: res.data,
          });
        }
      }
    });
  },

  onUserScrollToLower: function () {
    let obj = this.data.userListObject;
    if (obj.current != obj.pages) {
      this.getUsers(obj.current + 1, true);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let query = wx.createSelectorQuery().in(this);
    query.select("#navbar").boundingClientRect();
    query.select("#searchBar").boundingClientRect();

    query.exec((res) => {
      // 取出navbar的高度
      let navbarHeight = res[0].height;
      let searchBarHeight = res[1].height;

      let scrollViewHeight =
        this.data.windowHeight - navbarHeight - searchBarHeight;

      // 算出来之后存到data对象里面
      this.setData({
        scrollViewHeight: scrollViewHeight,
      });
    });
    this.setData({
      activ: "works",
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
  onShow: function () {},

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
