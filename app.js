const promise = require("./utils/promise.js");
const networkp = require("./utils/networkp.js");

const checkUserPasswordCache = promise(wx.getStorage);
const getUserId = networkp.get;
App({
  globalData: {
    userInfo: null,
    auth: null,
    id: -1,
    statusBarHeight: wx.getSystemInfoSync()["statusBarHeight"],
    windowHeight: 0,
  },

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.windowHeight = res.windowHeight;
      },
    });
    wx.getStorage({
      key: 'auth',
      success: (res)=>{
        this.globalData.auth = res.data;
        getUserId({
          url: "/u/user/id",
          data: { auth: res.data },
        }).then((res) => {
          if (res.success) {
            this.globalData.id = res.data.id;

            if (this.appReadyCallback) {
              this.appReadyCallback();
            }
          }else{
            wx.showToast({
              title: '登录失败，请重新登录~',
              icon: 'none',
              image: '',
              duration: 4000,
              mask: false
            });
          }
        }).catch(err=>{
        });
      },
      fail: ()=>{
        // 没有登录口令缓存
      },
      complete: ()=>{}
    });
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {},

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {},

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {},
});
