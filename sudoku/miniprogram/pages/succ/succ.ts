import { formatTime, getlevel, sysWxReqPost } from "../../utils/libs";

// pages/succ/succ.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useSeconds: 0,
    level: 0,
    level_str: '入门',
    useTime : '',
    isPop: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    let level = Number(options.level);
    let play_id = Number(options.id);
    let seconds = Number(options.seconds);

    this.setData({
      level: level,
      level_str: getlevel(level),
      useTime: formatTime(seconds),
    });

    sysWxReqPost('/v1/sudoku/question/done', {
      'play_id': play_id,
      'use_time': seconds,
      'use_ad':0,
      'is_pass':1,
    })
    .then((data:any) =>{})
    .catch((err: any) =>{});

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

  gotoindex(){
    wx.redirectTo({
      url: '../index/index',
    });
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

  adLoad() {
    console.log('视频广告 广告加载成功')
  },
  adError(err:any) {
    console.error('视频广告 广告加载失败', err)
  },
  adClose() {
    console.log('视频广告 广告关闭')
  },

})