// pages/capture/capture.js
const app = getApp();
const promise = require("../../utils/promise.js");
const networkp = require("../../utils/networkp.js");

const setCameraTips = promise(wx.setStorage);
const getCameraTips = promise(wx.getStorage);
const pGetSongInfo = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    songList: [],
    current: -1,
    total: -1,
    keyword: "",
    currentSong: "暂时没有播放的歌曲",
    currentSinger: "",
    currentSongId: -1,
    songDuration: 0,
    cover: "/images/songback.jpg",
    // 页面总高度
    windowHeight: 0,
    moveableAreaHeight: 0,
    // scroll-view的高度
    scrollViewHeight: 0,
    inertia: true,
    tipsPopupShow: true,
    tipsIsFirst: false,
    steps: [
      {
        text: "点击音乐播放按键试听",
      },
      {
        text: "选择喜欢的音乐作为背景音乐",
      },
      {
        text: "点击悬浮按钮进入录制界面",
      },
      {
        text: "录制完成后填写相关信息",
      },
      {
        text: "上传短视频完成",
      },
    ],
  },

  showTips: function () {
    this.setData({
      tipsPopupShow: true,
      tipsIsFirst:true
    });
  },

  onClose: function () {
    this.setData({
      tipsPopupShow: false,
    });
    setCameraTips({
      key: "cameratips",
      data: false,
    });
  },

  navigateToCamera: function () {
    if (this.data.currentSongId == -1) {
      wx.showToast({
        title: "需要选择一首歌曲,并且使用当前播放歌曲作为背景音乐",
        icon: "none",
        image: "",
        duration: 1500,
      });
    } else {
      this.player.pauseMusic();
      wx.navigateTo({
        url:
          "/pages/camera/camera?songId=" +
          this.data.currentSongId +
          "&duration=" +
          parseInt(this.data.songDuration / 1000),
      });
    }
  },

  getSongList: function (pages, keyword, type) {
    this.setData({
      keyword: keyword,
    });
    pGetSongInfo({
      url: "/u/bgm/songlist",
      data: {
        pages: pages,
        keyword,
        keyword,
      },
    }).then((res) => {
      if (res.success) {
        let _data = res.data;

        if (type) {
          this.setData({
            songList: this.data.songList.concat(_data.records),
            current: _data.current,
            total: _data.pages,
          });
        } else {
          this.setData({
            songList: _data.records,
            current: _data.current,
            total: _data.pages,
          });
        }
      }
    });
  },

  // 监听活动面板滑动到最底部
  onScrollToLower: function () {
    let _data = this.data;
    if (_data.current == _data.total) {
      return;
    }
    this.getSongList(_data.current + 1, this.data.keyword, true);
  },

  onSearch: function (e) {
    let keyword = e.detail.value;
    this.setData({
      keyword: keyword,
    });
    this.getSongList(1, keyword, false);
  },

  onPlay: function (e) {
    let e_data = e.currentTarget.dataset;
    let path = e_data.path;
    this.setData({
      currentSong: e_data.song,
      currentSinger: e_data.singer,
      cover: e_data.cover,
      currentSongId: e_data.songid,
      songDuration: e_data.duration,
    });
    this.player.playMusic({
      src: path,
    });
    // let e_data = e.currentTarget.dataset;
    // let mid = e_data.mid;
    // let songId = e_data.songid;

    // this.setData({
    //   currentSong: e_data.song,
    //   currentSinger: e_data.singer,
    //   cover: e_data.cover
    // });
    // pGetSongSrc({
    //   url: "/u/bgm/src",
    //   data: {
    //     mid: mid
    //   }
    // }).then(res => {
    //   if (res.success) {
    //     this.player.playMusic({
    //       src: res.data
    //     });
    //     this.setData({
    //       currentSongId: songId
    //     });
    //   } else {
    //     wx.showToast({
    //       title: "该歌曲当前无法播放~",
    //       icon: "none",
    //       duration: 2000
    //     });
    //   }
    // });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
        });
      },
    });

    let query = wx.createSelectorQuery().in(this);
    query.select("#navbar").boundingClientRect();
    query.select("#audio-container").boundingClientRect();
    query.select("#gap").boundingClientRect();

    query.exec((res) => {
      // 取出navbar的高度
      let navbarHeight = res[0].height;
      let audioHeight = res[1].height;
      let gapHeight = res[2].height;

      let scrollViewHeight =
        this.data.windowHeight - navbarHeight - audioHeight - gapHeight;

      let moveable = this.data.windowHeight - navbarHeight;
      // 算出来之后存到data对象里面
      this.setData({
        scrollViewHeight: scrollViewHeight,
        moveableAreaHeight: moveable,
      });
      this.getSongList(1, this.data.keyword, false);
    });
    wx.hideShareMenu();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.player = this.selectComponent("#c-audio");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getCameraTips({ key: "cameratips" }).then((res) => {
      this.setData({
        tipsIsFirst: res.data,
      });
    }).catch(res=>{
      this.setData({
        tipsIsFirst: true,
      });
    });
  },

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
