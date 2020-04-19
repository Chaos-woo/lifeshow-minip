// pages/my/my.js
var app = getApp();

const networkp = require("../../utils/networkp.js");

const pGetUserStat = networkp.get;
const pGetUserInfo = networkp.get;
const pHandleFollowed = networkp.post;
const pHandleBlacklist = networkp.post;
const pGetUserWorks = networkp.get;
const pGetUserCollectedWorks = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    avtiv: "works",
    otherUserInfo: {},
    collectedVideoObject: {},
    worksVideoObject:{},
    stat: {},
    id: -1,
    otherId: -1,
    isFollowed: false,
    disabled: false,
    actionSheetShow: false,
    actions: [
      {
        name: "分享主页",
        color: "#E00101",
        openType:"share"
      },
      {
        name: "拉黑"
      }
    ],
    // 页面总高度
    windowHeight: app.globalData.windowHeight,
    // scroll-view的高度
    scrollViewHeight: 0
  },

  // 关注用户和取消关注
  handleFollowUser: function() {
    let _data = this.data;
    pHandleFollowed({
      url: "/u/user/follow",
      data: {
        otherId: _data.otherId,
        id: _data.id,
        isFollowed: _data.isFollowed
      }
    }).then(res => {
      if (res.success) {
        this.setData({
          isFollowed: !this.data.isFollowed
        });
      }
    });
  },

  // 获取用户信息
  getUserInfo: function() {
    pGetUserInfo({
      url: "/u/user/info",
      data: {
        otherId: this.data.otherId,
        id: this.data.id
      }
    }).then(res => {
      if (res.success) {
        this.setData({
          otherUserInfo: res.data,
          isFollowed: res.data.external.isFollowed,
          disabled: res.data.external.disabled
        });
      }
    });
  },

  // 获取用户数据
  getUserStat: function() {
    pGetUserStat({
      url: "/u/user/stat",
      data: { id: this.data.otherId }
    }).then(res => {
      if (res.success) {
        this.setData({
          stat: res.data
        });
      }
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
        id: this.data.otherId,
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
    onLikedScrollToLower: function() {
      let _worksStat = this.data.collectedVideoObject;
      if (_worksStat.current != _worksStat.pages) {
        this.getCollectedWorks(_worksStat.current + 1, true);
      }
    },
  
    // 获取用户收藏作品
    getCollectedWorks: function(pages, type) {
      pGetUserCollectedWorks({
        url: "/u/video/collectedworks",
        data: {
          id: this.data.otherId,
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

  back: function(e) {
    wx.navigateBack({
      delta: 1
    });
  },

  onChange: function(e) {
    let index = e.detail.index;
    if (index == 0) {
      this.getWorks(1, false);
    } else if (index == 1) {
      this.getCollectedWorks(1,false);
    }
  },

  onClose: function() {
    this.setData({ actionSheetShow: false });
  },

  // 处理更多操作
  onSelect: function(e) {
    let listName = e.detail.name;
    let _data = this.data;
    if(listName == "拉黑"){
      if(_data.isFollowed){
        wx.showToast({
          title: '已关注用户不能拉黑噢~',
          icon: 'none'
        });
      }else if(!_data.isFollowed && !_data.disabled){
        pHandleBlacklist({
          url:"/u/user/blacklist",
          data:{
            id:this.data.id,
            otherId:this.data.otherId
          }
        }).then(res=>{
          this.setData({
            disabled:!_data.disabled
          })
        })
      }
    }
  },

  showMoreOptions: function(e) {
    this.setData({
      actionSheetShow: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: app.globalData.id,
      otherId: options.id
    });

    let _data = this.data;
    setTimeout(function () {
      if(_data.id == _data.otherId){
        wx.switchTab({
          url: '/pages/my/my'
        });
      }
    }, 1000);

    let query = wx.createSelectorQuery().in(this);
    query.select("#navbar").boundingClientRect();
    query.select("#user-info").boundingClientRect();
    query.select("#divider").boundingClientRect();
    query.select("#user-stat").boundingClientRect();

    query.exec(res => {
      // 取出navbar的高度
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
        scrollViewHeight: scrollViewHeight,
        activ: "works"
      });
    });
    this.getUserInfo();
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
    this.getWorks(1,false);
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
      imageUrl: this.data.otherUserInfo.avatarUrl
    };
  }
});
