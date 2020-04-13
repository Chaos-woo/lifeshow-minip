const promise = require("./utils/promise.js");

const checkUserIdentityCache = promise(wx.getStorage);

App({
  globalData: {
    identity: "0",
    userInfo: null,
    auth:null,
    id: -1,
    statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"],
    windowHeight: 0
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    checkUserIdentityCache({
      key: "identity"
    })
      .then(res => {
        this.globalData.identity = res.data;
        if (this.appReadyCallback) {
          this.appReadyCallback();
        }
      })
      .catch(err => {
        // 用户身份缓存不存在
        console.log("identity cache : " + err);
        if (this.appReadyCallback) {
          this.appReadyCallback();
        }
      });

    wx.getSystemInfo({
      success: res => {
        this.globalData.windowHeight = res.windowHeight;
      }
    });
  },

  navigateToLogin: function() {
    wx.reLaunch({
      url: "/pages/login/login"
    });
    wx.showToast({
      title: "需要微信登录才能使用该功能~",
      icon: "none",
      image: "",
      duration: 3000,
      mask: false
    });
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {},

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {},

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {}
});
