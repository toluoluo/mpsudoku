// pages/games/games.ts
import {sysWxReqPost, sysLocalSet} from "../../utils/libs";
import { sysTimeStamp } from '../../utils/util';
import { Toast } from 'tdesign-miniprogram';

let timerInterval: number = 0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currIndex: -1,
    errCt: 0,
    level: 0,
    level_str: '入门',
    nine: [0, 1, 2, 3, 4, 5, 6, 7, 8], 
    eighty: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80],
    three: [0, 1, 2], 
    keys:[],
    doBeginAt: 0,
    playId: 0,
    useSeconds:0,
    formattedTime: '00:00:00',
    adCt : 3 ,
    active: false,
    viewSels: [false],

    // 步骤
    actS: [],
    // 问题
    ques: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // 答案
    answer: [],
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    var that = this;
    that.setData({
      level: options.level,
      level_str : this.getlevel(options.level),
    });
    console.log('game level link get: ', this.data.level);

    // 获取问题
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    sysWxReqPost('/v1/sudoku/question/get', {'level': this.data.level})
    .then((data: any) => {
      console.log('reponse data: ', data);
      if(data?.code == 0){
        let now = sysTimeStamp();
        let tmp: boolean[] = [];
        for(let i = 0; i < 81; i++){
          tmp.push(false);
        }
        // 设置本地数据
        that.setData({
          ques: data.data.question.split(',').map(Number),
          answer: data.data.answer.split(',').map(Number),
          playId: data.data.play_id,
          doBeginAt: now,
          viewSels: tmp,
        });
        // 保存本地数据
        sysLocalSet('curr_question', data.data);
        sysLocalSet('curr_question_do_begin_at', now);
        // that.startTimer();
      }
    })
    .catch((err: any) => {
      console.log('request api fail: ', err);
    })

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
    clearInterval(timerInterval);

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
  

  startTimer() {
    timerInterval = setInterval(() => {
      this.setData({
        useSeconds: this.data.useSeconds + 1,
        formattedTime: this.formatTime(this.data.useSeconds + 1)
      });
      console.log("use seconds: ", this.data.useSeconds);

    }, 1000);
  },

  stopTimer() {
    clearInterval(timerInterval);
  },

  formatTime(useSeconds: number) {
    const h = this.padTime(Math.floor(useSeconds / 3600));
    const m = this.padTime(Math.floor((useSeconds % 3600) / 60));
    const s = this.padTime(useSeconds % 60);
    return `${h}:${m}:${s}`;
  },

  padTime(time: number) {
    return time < 10 ? `0${time}` : `${time}`;
  },

  getlevel(level: number) :string{
    let rst: string = '入门';
    switch(level){
      case 0:
        rst = '入门';
        break;
      case 1:
        rst = '简单';
        break;
      case 2:
        rst = '中级';
        break;
      case 3:
        rst = '困难';
        break;
      case 4:
        rst = '专家';
        break;
    }
    return rst;
  },

  // 处理未填写的
  getUnfill(e: any){
    let index: number = Number(e.currentTarget.dataset.index);
    let tmp: boolean[] = [];
    for(let i = 0; i < 81; i++){
      tmp.push(false);
    }
    tmp[index] = true;
    this.setData({
      viewSels: tmp
    });

  },

  // 展示不可操作提示
  showFillTip(e: any){
    let index: number = Number(e.currentTarget.dataset.index);

    let tmp: boolean[] = [];
    for(let i = 0; i < 81; i++){
      tmp.push(false);
    }
    tmp[index] = true;
    this.setData({
      viewSels: tmp
    });
    
    Toast({
      context: this,
      selector: '#t-toast',
      message: '预填充数不可写',
    });
  },




})