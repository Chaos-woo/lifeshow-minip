// pages/list/list.js
const app = getApp();
const networkp = require("../../utils/networkp.js");

import Dialog from "/@vant/weapp/dialog/dialog";

const pGetList = networkp.get;
const pRemoveFromList = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    userList: [],
    id: -1,
    current: -1,
    total: -1,
    // 0:关注列表 1:黑名单
    type: -1,
    // 页面总高度
    windowHeight: 0,
    // scroll-view的高度
    scrollViewHeight: 0
  },

  back: function(e) {
    wx.switchTab({
      url: "/pages/my/my"
    });
  },

  // 从列表中移除关注/黑名单用户
  removeFromList: function(removedId) {
    let list = this.data.userList;
    var newList = list.reduce((total, current) => {
      current.id !== removedId && total.push(current);
      return total;
    }, []);
    this.setData({
      userList: newList
    });
    pRemoveFromList({
      url: "/u/user/delete",
      data: {
        type: this.data.type,
        id: this.data.id,
        removedId: removedId
      }
    });
  },

  // 监听滑动单元的关闭操作（这里用于移除）
  onClose: function(e) {
    const { position, instance } = e.detail;
    let removedId = e.detail.name;
    switch (position) {
      case "left":
        instance.close();
        break;
      case "cell":
        instance.close();
        break;
      case "right":
        Dialog.confirm({
          message: "确定移除吗？"
        })
          .then(() => {
            this.removeFromList(removedId);
          })
          .catch(() => {
            instance.close();
          });
        break;
    }
  },

  // 获取关注列表/黑名单类表
  getList: function(page, type) {
    let url;
    if (!this.data.type) {
      url = "/u/user/follow";
    } else {
      url = "/u/user/blacklist";
    }
    pGetList({
      url: url,
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
          total: _data.pages,
          type: type
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
    this.getList(_data.current + 1, _data.type);
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

    let listIndex = options.list;
    if (listIndex == "0") {
      this.setData({
        title: "关注列表",
        type: 0,
        id: app.globalData.id
      });
      
    } else {
      this.setData({
        title: "黑名单",
        type: 1,
        id: app.globalData.id
      });
    }

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
    let type = this.data.type;
    this.setData({
      userList: []
    });
    if(type){
      this.getList(1, 1);
    }else{
      this.getList(1, 0);
    }
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
