// components/audio/index.js

const innerAudioContext = wx.createInnerAudioContext();

Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    audioSrc: "",
    isPlayAudio: false,
    audioSeek: 0,
    audioDuration: 0,
    showTime1: "00:00",
    showTime2: "00:00",
    audioTime: 0,
    disabled: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    pauseMusic:function(){
      this._pauseAudio();
    },

    playMusic: function(object) {
      if (this.data.durationIntval) {
        clearInterval(this.data.durationIntval);
      }
      this.setData({
        audioSrc: object.src,
        isPlayAudio: true,
        disabled: false
      });
      this._init();
      this._loadAudio();
    },

    //初始化播放器，获取duration
    _init: function() {
      //设置src
      innerAudioContext.src = this.data.audioSrc;
      let duration = innerAudioContext.duration;

      let min = parseInt(duration / 60);
      let sec = parseInt(duration % 60);
      if (min.toString().length == 1) {
        min = `0${min}`;
      }
      if (sec.toString().length == 1) {
        sec = `0${sec}`;
      }
      this.setData({
        audioDuration: innerAudioContext.duration,
        showTime2: `${min}:${sec}`,
        audioSeek: 0,
        isPlayAudio: true
      });
      innerAudioContext.seek(this.data.audioSeek);
      innerAudioContext.play();
    },

    //拖动进度条事件
    _sliderChange: function(e) {
      innerAudioContext.src = this.data.audioSrc;
      //获取进度条百分比
      let value = e.detail.value;
      this.setData({ audioTime: value });
      let duration = this.data.audioDuration;
      //根据进度条百分比及歌曲总时间，计算拖动位置的时间
      value = parseInt((value * duration) / 100);
      //更改状态
      this.setData({ audioSeek: value, isPlayAudio: true });
      //调用seek方法跳转歌曲时间
      innerAudioContext.seek(value);
      //播放歌曲
      innerAudioContext.play();
    },

    //播放
    _playAudio: function() {
      //更改播放状态
      this.setData({
        isPlayAudio: !this.data.isPlayAudio
      });
      innerAudioContext.play();
    },

    //暂停按钮
    _pauseAudio: function() {
      innerAudioContext.pause();
      let audioSeek = innerAudioContext.currentTime;
      this.setData({
        isPlayAudio: !this.data.isPlayAudio,
        audioSeek: audioSeek
      });
    },

    _loadAudio: function() {
      let that = this;
      //设置一个计步器
      this.data.durationIntval = setInterval(function() {
        //当歌曲在播放时执行
        if (that.data.isPlayAudio == true) {
          //获取歌曲的播放时间，进度百分比
          let seek = that.data.audioSeek;
          let duration = innerAudioContext.duration;
          let time = that.data.audioTime;
          time = parseInt((100 * seek) / duration);
          //当歌曲在播放时，每隔一秒歌曲播放时间+1，并计算分钟数与秒数
          let min = parseInt((seek + 1) / 60);
          let sec = parseInt((seek + 1) % 60);
          //填充字符串，使3:1这种呈现出 03：01 的样式
          if (min.toString().length == 1) {
            min = `0${min}`;
          }
          if (sec.toString().length == 1) {
            sec = `0${sec}`;
          }
          let min1 = parseInt(duration / 60);
          let sec1 = parseInt(duration % 60);
          if (min1.toString().length == 1) {
            min1 = `0${min1}`;
          }
          if (sec1.toString().length == 1) {
            sec1 = `0${sec1}`;
          }
          //当进度条完成，停止播放，并重设播放时间和进度条
          if (time >= 100) {
            innerAudioContext.stop();
            that.setData({
              audioSeek: 0,
              audioTime: 0,
              audioDuration: duration,
              isPlayAudio: false,
              showTime1: `00:00`,
              isPlayAudio: false
            });
            return false;
          }
          //正常播放，更改进度信息，更改播放时间信息
          that.setData({
            audioSeek: seek + 1,
            audioTime: time,
            audioDuration: duration,
            showTime1: `${min}:${sec}`,
            showTime2: `${min1}:${sec1}`
          });
        }
      }, 1000);
    }
  },

  onUnload: function() {
    //卸载页面，清除计步器
    if (this.data.durationIntval) {
      clearInterval(this.data.durationIntval);
    }
  }
});
