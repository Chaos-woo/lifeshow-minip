// pages/message/message.js
const app = getApp();

const networkp = require("../../utils/networkp.js");

const pGetAllMsg = networkp.get;
const pUpdateMsgStatus = networkp.get;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    messages: [],
    // 页面总高度
    windowHeight: 0,
    // scroll-view的高度
    scrollViewHeight: 0,
  },

  toMsgDetail:function(e){
    let id = e.currentTarget.dataset.id;
    let msgs = this.data.messages;
    let stringMsg;
    for(let i=0;i<msgs.length;i++){
      if(msgs[i].id==id){
        stringMsg = JSON.stringify(msgs[i]);
        break;
      }
    }
    console.log("ooo=>"+stringMsg);
    
    wx.navigateTo({
      url: '/pages/message-detail/message-detail?item='+stringMsg,
    });
  },

  getAllMsg: function () {
    pGetAllMsg({
      url:"/u/msg/all",
      data:{
        id:this.data.id
      }
    }).then(res=>{
      this.setData({
        messages:res.data
      })
    })
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
    query.select("#toolbar").boundingClientRect();
    query.select("#divider").boundingClientRect();

    query.exec((res) => {
      // 取出navbar的高度
      let navbarHeight = res[0].height;
      let toolBarHeight = res[1].height;
      let dividerHeight = res[2].height;

      let scrollViewHeight =
        this.data.windowHeight - navbarHeight - toolBarHeight - dividerHeight;

      // 算出来之后存到data对象里面
      this.setData({
        scrollViewHeight: scrollViewHeight,
      });
    });
    wx.hideShareMenu();
    this.setData({
      id: app.globalData.id,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getAllMsg();
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
