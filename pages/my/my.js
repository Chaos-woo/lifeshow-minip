// pages/my/my.js
const app = getApp();
const networkp = require("../../utils/networkp.js");

const pGetUserStat = networkp.get;
const pGetUserWorks = networkp.get;
const pGetUserColletedWorks = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    avtiv: "works",
    worksVideoObject: {},
    collectedVideoObject: {},
    userInfo: {},
    stat: {},
    actionSheetShow: false,
    actions: [
      {
        name: "关注列表",
        color: "#E00101"
      },
      {
        name: "黑名单"
      }
    ],
    // 页面总高度
    windowHeight: 0,
    // scroll-view的高度
    scrollViewHeight: 0
  },

  // 获取用户数据
  getUserStat: function() {
    this.setData({
      id: app.globalData.id
    });
    pGetUserStat({
      url: "/u/user/stat",
      data: { id: this.data.id }
    }).then(res => {
      if (res.success) {
        this.setData({
          stat: res.data
        });
      }
    });
  },

  // 更多操作跳转操作附带参数
  navigateToList: function(index) {
    if (index) {
      wx.navigateTo({
        url: "/pages/follow/follow?list=1"
      });
    } else {
      wx.navigateTo({
        url: "/pages/follow/follow?list=0"
      });
    }
  },

  onChange: function(e) {
    let index = e.detail.index;
    if (index == 0) {
      this.getWorks(1, false);
    } else if (index == 1) {
      this.getCollectedWorks(1,false);
    }
  },

  // 将更多操作面板隐藏
  onClose: function() {
    this.setData({ actionSheetShow: false });
  },

  // 监听更多操作中选择的按钮
  onSelect: function(e) {
    let listName = e.detail.name;
    if (listName == "关注列表") {
      this.navigateToList(0);
    } else {
      this.navigateToList(1);
    }
  },

  // 显示更多操作
  showMoreOptions: function(e) {
    this.setData({
      actionSheetShow: true
    });
  },

  // 作品滚动面板滚动到底部时触发
  onWorksScrollToLower: function() {
    let _worksStat = this.data.worksVideoObject;
    if (_worksStat.current != _worksStat.pages) {
      this.getWorks(_worksStat.current + 1, true);
    }
  },

  // 获取用户作品
  getWorks: function(pages, type) {
    pGetUserWorks({
      url: "/u/video/works",
      data: {
        id: this.data.id,
        pages: pages
      }
    }).then(res => {
      if (res.success) {
        if (type) {
          let _curWorks = this.data.worksVideoObject;
          let _newWorks = res.data;
          _curWorks.records = _curWorks.records.concat(_newWorks.records);
          _curWorks.current = _newWorks.current;
          _curWorks.pages = _newWorks.pages;
          this.setData({
            worksVideoObject: _curWorks
          });
        } else {
          this.setData({
            worksVideoObject: res.data
          });
        }
      }
    });
  },

    // 收藏作品滚动面板滚动到底部时触发
    onCollectedScrollToLower: function() {
      let _worksStat = this.data.collectedVideoObject;
      if (_worksStat.current != _worksStat.pages) {
        this.getCollectedWorks(_worksStat.current + 1, true);
      }
    },
  
    // 收藏用户作品
    getCollectedWorks: function(pages, type) {
      pGetUserColletedWorks({
        url: "/u/video/collectedworks",
        data: {
          id: this.data.id,
          pages: pages
        }
      }).then(res => {
        if (res.success) {
          if (type) {
            let _curWorks = this.data.collectedVideoObject;
            let _newWorks = res.data;
            _curWorks.records = _curWorks.records.concat(_newWorks.records);
            _curWorks.current = _newWorks.current;
            _curWorks.pages = _newWorks.pages;
            this.setData({
              collectedVideoObject: _curWorks
            });
          } else {
            this.setData({
              collectedVideoObject: res.data
            });
          }
        }
      });
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      id: app.globalData.id
    });

    if (app.globalData.identity != "0") {
      wx.getSystemInfo({
        success: res => {
          this.setData({
            windowHeight: res.windowHeight
          });
        }
      });

      // 创建SelectorQuery对象实例
      let query = wx.createSelectorQuery().in(this);
      query.select("#navbar").boundingClientRect();
      query.select("#user-info").boundingClientRect();
      query.select("#divider").boundingClientRect();
      query.select("#user-stat").boundingClientRect();

      query.exec(res => {
        // 取出各部分的高度
        let navbarHeight = res[0].height;
        let infoHeight = res[1].height;
        let dividerHeight = res[2].height;
        let statHeight = res[3].height;

        let scrollViewHeight =
          this.data.windowHeight -
          navbarHeight -
          infoHeight -
          dividerHeight -
          statHeight -
          30;

        // 算出来之后存到data对象里面
        this.setData({
          activ: "works",
          scrollViewHeight: scrollViewHeight
        });
      });
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
  onShow: function() {
    this.getUserStat();
    this.getWorks(1, false);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.setData({
      actionSheetShow: false
    });
  },

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
  onShareAppMessage: function() {
    return {
      title: '快来看看这位有趣的博主~',
      path: "/pages/active/active",
      imageUrl: this.data.userInfo.avatarUrl
    };
  }
});
