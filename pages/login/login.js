// pages/login/login.js
const app = getApp();
const promise = require("../../utils/promise.js");
const networkp = require("../../utils/networkp.js");

const checkUserPasswordCache = promise(wx.getStorage);
const removePasswordCache = promise(wx.removeStorage);
const getUserId = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    logoSrc: "/images/logo_vs_slogan.png",
  },

  getUserInfoAuth: function (e) {
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          checkUserPasswordCache({ key: "auth" })
            .then((res) => {
              app.globalData.auth = res.data;
              getUserId({
                url: "/u/user/id",
                data: { auth: res.data },
              })
                .then((res) => {
                  if (res.success) {
                    app.globalData.id = res.data.id;

                    setTimeout(function () {
                      wx.switchTab({
                        url: "/pages/index/index",
                      });
                    }, 10);
                  }else{
                    wx.showToast({
                      title: '登录失败，请重新登录~',
                      icon: 'none',
                      image: '',
                      duration: 2000,
                      mask: false
                    });
                    wx.removeStorage({
                      key: "auth",
                    });
                  }
                })
                .catch((err) => {
                  app.globalData.id = -1;
                  wx.removeStorage({
                    key: "auth",
                  });
                  wx.showToast({
                    title: "登录出错，请重新登录~",
                    icon: "none",
                    duration: 3000,
                    mask: false,
                  });
                });
            })
            .catch((err) => {
              wx.switchTab({
                url: "/pages/index/index",
              });
            });
        } else {
          wx.showToast({
            title: "同意才能使用微信注册噢~",
            icon: "none",
            duration: 3000,
            mask: false,
          });
        }
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    if (app.globalData.id != -1) {
      setTimeout(function () {
        wx.switchTab({
          url: "/pages/index/index",
        });
      }, 100);
    } else {
      app.appReadyCallback = () => {
        setTimeout(function () {
          wx.switchTab({
            url: "/pages/index/index",
          });
        }, 100);
      };
    }
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
