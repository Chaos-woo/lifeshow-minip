// components/videoTools/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    videoInfo: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    like: "/images/icon/like.png",
    liked: "/images/icon/liked.png"
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onComment: function() {
      this.triggerEvent("comment");
    },

    onUserInfoClick: function(e) {
      let id = e.currentTarget.dataset.id;
      this.triggerEvent("toUserInfo", { userId: id });
    },

    onLiked:function(){
      this.triggerEvent("liked");
    }
  }
});
