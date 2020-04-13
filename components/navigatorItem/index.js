// components/videoItemNavigator/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 样式类型:user、video-v、video-h
    type: {
      type: String,
      value: "video-v"
    },
    // 视频信息
    videoDetail: {
      type: Object,
      value: {}
    },
    // 用户信息
    userDetail: {
      type: Object,
      value: {}
    },
    // navigate的open-type
    openType: {
      type: String,
      value: "navigate"
    },
    // 跳转链接
    navigateUrl: {
      type: String,
      value: ""
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {}
});
