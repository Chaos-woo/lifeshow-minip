// pages/camera/camera.js
const app = getApp();
const networkp = require("../../utils/networkp.js");
const regeneratorRuntime = require("../../libs/runtime");
const utils = require("../../utils/util.js");

const serverUrl = utils.localServerUrl;
const pGetActivList = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cameraHeight: 0,
    navbarHeight: 0,
    videoSrc: "",
    coverSrc: "",
    bgmId: -1,
    bgmName:"",
    devicePosition: true,
    canSwitch: true,
    upload: false,
    activPicker: [],
    pickerValue: "",
    coverList: [],
    pickerShow: false,
    windowHeight: app.globalData.windowHeight,
    shootImgSrc: "/images/icon/shooting_start.png",
    tips: "点击开始拍摄q['o ']P",
    shootingStatus: false,
    remainTime: 0,
    timeData: { seconds: 0 },
    videoDuration: 0,
    toolShow: false,
    statusBarHeight: app.globalData.statusBarHeight,
    radio: '1',
    album: false,
  },

  onRadioChange:function(e){
    this.setData({
      radio: e.detail
    });
  },

  back: function () {
    wx.navigateBack({
      delta: 1,
    });
  },

  showTools: function () {
    this.setData({
      toolShow: !this.data.toolShow,
    });
  },

  afterRead: function (e) {
    const { file } = e.detail;
    this.setData({
      coverList: [{ url: file.path, name: "cover" }],
    });
  },

  onPicker: function () {
    this.setData({
      pickerShow: true,
    });
  },

  onPickerClose: function () {
    this.setData({
      pickerShow: false,
    });
  },

  onDeleteCover: function (e) {
    this.setData({
      coverList: [],
    });
  },

  onReturn: function () {
    this.setData({
      videoSrc: "",
      upload: false,
    });
    const countDown = this.selectComponent(".timer-control");
    countDown.reset();
  },

  // picker活动组件确认
  onConfirm: function (e) {
    const { picker, value, index } = e.detail;
    this.setData({
      pickerValue: value,
      pickerShow: false,
    });
  },

  // picker活动组件取消
  onCancel: function () {
    this.onPickerClose();
  },

  // 确认上传
  confirmUpload: function () {
    // 设置活动picker
    pGetActivList({
      url: "/u/activ/all",
    }).then((res) => {
      if (res.success) {
        this.setData({
          activPicker: res.data,
        });
      }
    });
    this.setData({
      upload: true,
    });
  },

  // 真实上传事件
  uploadFile: function (e) {
    let value = e.detail.value;
    if (value.activ == "" || value.description == "" || value.title == "") {
      wx.showToast({
        title: "所有信息都需要填写!",
        icon: "none",
        duration: 2000,
      });
      return;
    }
    if (this.data.coverList.length != 0) {
      this.setData({
        coverSrc: this.data.coverList[0].url,
      });
    }
    wx.showLoading({
      title: "正在上传...",
      mask: true,
    });
    this.upload(value);
  },

  async upload(value) {
    await this.uploadVideo(value).then((res) => {
      let json = JSON.parse(res);
      let videoId = json.data;
      if (videoId != -1 && this.data.coverSrc == "") {
        wx.hideLoading();
        wx.showToast({
          title: "上传完成",
          icon: "none",
          duration: 2000,
        });
        wx.switchTab({
          url: "/pages/music/music",
        });
        return;
      } else if (videoId == -1 && this.data.coverSrc == "") {
        wx.hideLoading();
        wx.showToast({
          title: "上传失败",
          icon: "none",
          duration: 2000,
        });
      } else {
        this.uploadCover(videoId).then((res) => {
          if (res) {
            wx.hideLoading();
            wx.showToast({
              title: "上传完成",
              icon: "none",
              duration: 2000,
            });
            wx.switchTab({
              url: "/pages/music/music",
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: "上传失败",
              icon: "none",
              duration: 2000,
            });
          }
        });
      }
    });
  },

  uploadVideo: function (value) {
    return new Promise((resolve) => {
      wx.uploadFile({
        url: serverUrl + "/u/video/video",
        filePath: this.data.videoSrc,
        name: "file",
        header: {
          "content-type": "multipart/form-data",
        },
        dataType: "json",
        formData: {
          videoTitle: value.title,
          videoDesc: value.description,
          createdBy: app.globalData.id,
          bgmId: this.data.radio==1?this.data.bgmId:(-1),
          videoSeconds: this.data.videoDuration * 1000,
          activName: this.data.pickerValue,
        },
        success: (res) => {
          resolve(res.data);
        },
      });
    });
  },

  uploadCover: function (videoId) {
    return new Promise((resolve) => {
      if (videoId != -1) {
        wx.uploadFile({
          url: serverUrl + "/u/video/cover",
          filePath: this.data.coverSrc,
          name: "file",
          header: {
            "content-type": "multipart/form-data",
          },
          formData: {
            videoId: videoId,
          },
          success: (res) => {
            resolve(true);
          },
        });
      } else {
        resolve(false);
      }
    });
  },

  // 转换前后置摄像头
  switchDevicePosition: function () {
    this.setData({
      devicePosition: !this.data.devicePosition,
    });
  },

  /**
   * 获取系统信息 设置相机的大小适应屏幕
   */
  setCameraHeight: function () {
    let query = wx.createSelectorQuery().in(this);
    query.select("#navbar").boundingClientRect();

    query.exec((res) => {
      // 取出navbar的高度
      let navbarHeight = res[0].height;

      let cameraHeight = this.data.windowHeight - navbarHeight;

      // 算出来之后存到data对象里面
      this.setData({
        cameraHeight: cameraHeight,
        navbarHeight: navbarHeight,
      });
    });
  },

  shootVideo: function () {
    let _data = this.data;
    if (!_data.shootingStatus) {
      this.startShootVideo();
    } else {
      this.stopShootVideo();
    }
  },

  timerFinished: function () {
    this.stopShootVideo();
  },

  onChange(e) {
    this.setData({
      timeData: e.detail,
    });
  },

  chooseVideo: function () {
    wx.chooseVideo({
      sourceType: ["album"],
      compressed: true,
      success: (res) => {
        if (res.size > 15 * 1024 * 1024) {
          wx.showModal({
            content:
              "请上传压缩后小于15M的视频文件，您当前要上传的文件大小为" +
              (res.size / (1024 * 1024)).toFixed(2) +
              "M",
            showCancel: false,
          });
          return;
        }
        this.confirmUpload();
        this.setData({
          videoSrc: res.tempFilePath,
          coverSrc: "",
          upload:true,
          canSwitch: true,
          videoDuration: parseInt(res.duration),
          album: true,
          radio: '2',
        });
      },
      fail: () => {
        wx.showToast({
          title: "选取视频失败",
          icon: "none",
          image: "",
          duration: 2000,
          mask: false,
        });
      },
    });
  },

  startShootVideo: function () {
    let _data = this.data;
    this.setData({
      shootImgSrc: "/images/icon/shooting.png",
      shootingStatus: !_data.shootingStatus,
      canSwitch: false,
      tips: "点击停止拍摄q['o ']P",
    });
    this.ctx.startRecord({
      success: (res) => {},
      fail() {
        wx.showToast({
          title: "拍摄失败",
          icon: "none",
          image: "",
          duration: 1500,
          mask: false,
        });
      },
    });
    const countDown = this.selectComponent(".timer-control");
    countDown.start();
  },

  stopShootVideo: function () {
    const countDown = this.selectComponent(".timer-control");
    countDown.pause();
    let _data = this.data;
    this.setData({
      shootImgSrc: "/images/icon/shooting_start.png",
      shootingStatus: !_data.shootingStatus,
    });
    this.ctx.stopRecord({
      compressed: true,
      success: (res) => {
        this.setData({
          videoSrc: res.tempVideoPath,
          coverSrc: res.tempThumbPath,
          canSwitch: true,
          tips: "点击开始拍摄q['o ']P",
          videoDuration:
            this.data.remainTime / 1000 - this.data.timeData.seconds,
        });
      },
      fail() {
        wx.showToast({
          title: "拍摄失败",
          icon: "none",
          image: "",
          duration: 1500,
          mask: false,
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting["scope.record"]) {
          wx.authorize({
            scope: "scope.record",
            fail() {
              wx.navigateBack({
                delta: 1,
              });
            },
          });
        }
      },
    });
    this.setCameraHeight();
    this.ctx = wx.createCameraContext();
    this.setData({
      bgmId: options.songId,
      bgmName:options.songName,
      remainTime: options.duration * 1000,
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
