// pages/index/index.js
const app = getApp();

const regeneratorRuntime = require("../../libs/runtime.js");

const networkp = require("../../utils/networkp.js");

const pGetVideoDetail = networkp.get;
const pPostComment = networkp.post;
const pGetComment = networkp.get;
const pHandleLiked = networkp.get;
const pHandleCollected = networkp.get;
const pPostDanmaku = networkp.post;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    curVideoId:-1,
    curVideoInfo: {},
    currentVideoComment: {},
    hasChanged: 0,
    dmData: [],
    commentInputValue: "",
    danmakuInputValue: "",
    lineShiftDistance: wx.getSystemInfoSync().windowWidth / 750,
    statusBarHeight: app.globalData.statusBarHeight,
    popShow: false,
    moreOptionsShow: false,
    // scroll-view的高度
    scrollViewHeight: 0,
  },

  /***************视频组件监听方法 start************************/
  // 开始/继续播放时触发
  onPlay(e) {
  
  },

  // 暂停播放时触发
  onPause(e) {
    //  console.log('pause', e.detail.activeId)
  },

  // 播放到末尾时触发
  onEnded(e) {
   
  },

  // 加载视频元数据完成时触发
  onLoadedmetadata: function (e) {
    this.setDM(this.data.curVideoInfo.external.danmaku, false);
  },

  // 视频播放出错时触发
  onError(e) {
    wx.showToast({
      title: "当前视频出错啦~无法播放噢~",
      icon: "none",
      image: "",
      duration: 2000,
    });
    this.setDM(this.data.curVideoInfo.external.danmaku, false);
  },

  /***************视频组件监听方法 end************************/

  // 展示更多操作按钮
  moreOptions: function () {
    this.setData({
      moreOptionsShow: true,
    });
  },

  /***************视频工具组件监听方法 start************************/
  // 处理用户点击喜欢的操作
  onLiked: function () {
    let obj = this.data.curVideoInfo;
    pHandleLiked({
      url: "/u/video/liked",
      data: {
        videoId: obj.videoId,
        id: this.data.id,
        isLiked: obj.isLiked,
      },
    }).then((res) => {
      obj.isLiked = !obj.isLiked;
      this.setData({
        curVideoInfo: obj,
      });
    });
  },

  onCollected: function () {
    let obj = this.data.curVideoInfo;
    pHandleCollected({
      url: "/u/video/collected",
      data: {
        videoId: obj.videoId,
        id: this.data.id,
        isCollected: obj.isCollected,
      },
    }).then((res) => {
      obj.isCollected = !obj.isCollected;
      this.setData({
        curVideoInfo: obj,
      });
    });
  },

  // 展示留言模块
  onComment: function () {
    this.setData({
      commentPopupShow: true,
    });
    this.getComment(1);
  },

  // 加载对应短视频留言
  getComment: function (pages) {
    let _data = this.data;
    pGetComment({
      url: "/u/video/comment",
      data: {
        id: _data.curVideoInfo.videoId,
        pages: pages,
      },
    }).then((res) => {
      if (res.success) {
        this.setData({
          currentVideoComment: res.data,
        });
      }
    });
  },

  onCommentScrollToLower: function () {
    let obj = this.data.currentVideoComment;
    if (obj.current == obj.total) {
      return;
    }
    this.getComment(obj.current + 1);
  },

  onClickUserAvatar: function (e) {
    let userId = e.detail.userId;
    if (userId == app.globalData.id) {
      wx.switchTab({
        url: "/pages/my/my",
      });
    } else {
      wx.navigateTo({
        url: "/pages/user/user?id=" + userId,
      });
    }
  },

  onReport: function (e) {
    let _data = this.data.curVideoInfo;
    let videoId = _data.videoId;
    let videoTitle = _data.title;
    let reporterId = this.data.id;
    wx.navigateTo({
      url:
        "/pages/report/report?video=" +
        videoId +
        "&title=" +
        videoTitle +
        "&id=" +
        reporterId,
    });
  },
  /***************视频工具组件监听方法 end************************/

  confirmSendDanmaku: function (e) {
    let content = e.detail.value;
    pPostDanmaku({
      url: "/u/video/danmaku",
      data: {
        videoId: this.data.curVideoInfo.videoId,
        createdBy: app.globalData.id,
        content: content,
      },
    }).then((res) => {
      this.setData({
        danmakuInputValue: "",
      });
      let _p = { id: Math.round(Math.random() * 400 + 400), content: content };
      let _arr = [];
      _arr.push(_p);
      this.setDM(_arr, true);
    });
  },

  // 处理弹幕位置
  setDM: function (danmakuData, type) {
    if (danmakuData == undefined || danmakuData.length == 0) {
      this.setData({
        dmData: [],
      });
      return;
    }
    // 处理弹幕参数
    let dmArr = [];
    let _b = danmakuData;
    for (let i = 0; i < _b.length; i++) {
      const time = Math.floor(Math.random() * 10);
      const _time = time < 6 ? 6 + i : time + i;
      const top = Math.floor(Math.random() * 80) + 2;
      const _p = {
        id: _b[i].id,
        content: _b[i].content,
        top,
        time: _time,
      };
      dmArr.push(_p);
    }
    if (type) {
      this.setData({
        dmData: this.data.dmData.concat(dmArr),
      });
    } else {
      this.setData({
        dmData: dmArr,
      });
    }
  },

  // 发送留言
  confirmSendComment: function (e) {
    let content = e.detail.value;
    pPostComment({
      url: "/u/video/comment",
      data: {
        videoId: this.data.curVideoInfo.videoId,
        createdBy: app.globalData.id,
        content: content,
      },
    }).then((res) => {
      this.getComment(1);
      this.setData({
        commentInputValue: "",
      });
    });
  },

  // 关闭留言和更多操作弹窗
  onClose: function () {
    this.setData({
      commentPopupShow: false,
      moreOptionsShow: false,
    });
  },

  // 返回
  back: function () {
    wx.navigateBack({
      delta: 1,
    });
  },

  // 获取短视频详情
  getVideoDetail: function () {
    let _data = this.data;
    pGetVideoDetail({
      url: "/u/video/detail",
      data: {
        id: _data.id,
        videoId: _data.curVideoId,
      },
    })
      .then((res) => {
        if (res.success) {
          this.setData({
            curVideoInfo:res.data
          })
        }else{
          wx.navigateBack({
            delta: 1,
          });
          wx.showToast({
            title: res.msg,
            icon: "none",
            duration: 2000,
            mask: false,
          });
        }
      });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          scrollViewHeight: res.windowHeight * 0.65 - 90,
        });
      },
    });
    this.setData({
      id: app.globalData.id,
      curVideoId: options.video,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getVideoDetail();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      commentPopupShow: false,
      moreOptionsShow: false,
    });
  },

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

  onShareAppMessage: function () {
    let cur = this.data.curVideoInfo;
    return {
      title: cur.title,
      path: "/pages/active/active",
      imageUrl: cur.cover,
    };
  },
});
