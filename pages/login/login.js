// pages/login/login.js
const app = getApp();
const promise = require("../../utils/promise.js");
const networkp = require("../../utils/networkp.js");

const setUserIdentityCache = promise(wx.setStorage);
const checkUserPasswordCache = promise(wx.getStorage);
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
          let identity = app.globalData.identity;
          if (identity == "1") {
            checkUserPasswordCache({ key: "auth" })
              .then((res) => {
                app.globalData.auth = res.data;
                getUserId({
                  url: "/u/user/id",
                  data: { auth: app.globalData.auth },
                })
                  .then((res) => {
                    if (res.success) {
                      app.globalData.id = res.data.id;
                      setTimeout(function () {
                        wx.switchTab({
                          url: "/pages/index/index",
                        });
                      }, 1000);
                    }
                  })
                  .catch((err) => {
                    console.log("id err");
                  });
              })
              .catch((err) => {
                wx.switchTab({
                  url: "/pages/index/index",
                });
              });
          }
        } else {
          wx.showToast({
            title: "同意才能使用微信注册噢~",
            icon: "none",
            duration: 2000,
            mask: false,
          });
        }
      },
    });
  },

  setUserIdentity: function (e) {
    // 设置用户身份和请求获取用户信息的权限
    let identity = e.currentTarget.dataset.identity;
    setUserIdentityCache({
      key: "identity",
      data: identity,
    }).then((res) => {
      app.globalData.identity = identity;
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo) {
      let identity = app.globalData.identity;
      if (identity == "1") {
        checkUserPasswordCache({ key: "auth" })
          .then((res) => {
            app.globalData.auth = res.data;
            getUserId({
              url: "/u/user/id",
              data: { auth: app.globalData.auth },
            }).then((res) => {
              if (res.success) {
                app.globalData.id = res.data.id;
                wx.switchTab({
                  url: "/pages/index/index",
                });
              }
            });
          })
          .catch((err) => {
            // 没有登录口令缓存
            console.log("password cache : " + err);
          });
      } else {
        // 用户身份为0：游客，什么都不做
      }
    } else {
      app.appReadyCallback = () => {
        let identity = app.globalData.identity;
        if (identity == "1") {
          checkUserPasswordCache({ key: "auth" })
            .then((res) => {
              app.globalData.auth = res.data;
              getUserId({
                url: "/u/user/id",
                data: { auth: app.globalData.auth },
              }).then((res) => {
                if (res.success) {
                  app.globalData.id = res.data.id;
                  wx.switchTab({
                    url: "/pages/index/index",
                  });
                }
              });
            })
            .catch((err) => {
              // 没有登录口令缓存
              console.log("password cache : " + err);
            });
        } else {
          // 用户身份为0：游客，什么都不做
        }
      };
    }
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
