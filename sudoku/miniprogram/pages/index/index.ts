// index.ts
// 获取应用实例

import {sysLocalGet, formatTime, getlevel} from "../../utils/libs";

// const app = getApp<IAppOption>()
// const defaultAvatarUrl: string= 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    isPop: false,
    level_str: '',
    formattedTime: '',
    isOld: false,
  },

  onLoad(){
    let old = sysLocalGet('curr_ques_status');
    // console.log('old data: ', old);
    if(old !== '' && old !== false){
      // console.log('old data run herer');
      this.setData({
        isOld: true,
        formattedTime: formatTime(old.use_seconds),
        level_str: getlevel(Number(old.level)),
      });
    }
    // console.log('old this data isole: ', this.data.isOld);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    console.log('go on hide...');

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  continueGame(){
    wx.redirectTo({
      url: '../games/games?level=10',
    })
  },
  
  linkToGame(e: any) {
    var level = e.currentTarget.dataset.level;
    console.log('game level: ', level);
    wx.redirectTo({
      url: '../games/games?level='+level,
    })
  },

  showPop(e: any) {
    this.setData({
      isPop: true
    }
    );
  },
  onVisibleChange(e: any) {
    this.setData({
      isPop: e.detail.visible,
    });
  },

  linktosucc() {
    wx.redirectTo({
      url: '../succ/succ?level=1&play_id=1&seconds=125',
    });
  },

  gotoskill(){
    console.log('go to skill')
    wx.redirectTo({
      url: '../skill/skill',
    });
  },


})
