import { getlevel, sysLocalGet, sysLocalSet } from "../../utils/libs"
import { MyHistory } from "../../utils/types"

// pages/detail/detail.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 最大错误数
    level: 0,
    maxErrCt: 3,
    level_str: '入门',
    nine: [0, 1, 2, 3, 4, 5, 6, 7, 8], 
    eighty: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80],

    formattedTime: '00:00:00',
    
    // 错误次数
    errCt: 0,

    base: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // 问题
    ques: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // 答案
    answer: [0],
    done: [0],
    
    // 使用提示次数
   tipCt: 0,

   isShowAnswer: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let detail: MyHistory = sysLocalGet('curr_history_detail');
    let ques   = detail.question?.split(',').map(Number);
    let answer = detail.answer?.split(',').map(Number);
    let level = Number(detail?.level ?? 1);

    this.setData({
      level: level,
      ques: ques,
      done: answer,
      level_str: getlevel(Number(detail?.level)),
      formattedTime: detail?.use_time,
      errCt: detail?.err_ct,
      tipCt: detail?.tip_ct,
    });

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

     // 清空
     sysLocalSet('curr_history_detail', '');
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

  switchAnswer(){
    if(this.data.isShowAnswer) {
      this.setData({
        isShowAnswer: false,
        answer: this.data.base,
      });
    }else{
      this.setData({
        isShowAnswer: true,
        answer:this.data.done,
      });
    }

  },

  gotoMyhistory(){
    wx.redirectTo({
      url: '../history/history?level='+this.data.level,
    });
  },
})