// pages/games/games.ts
import {sysWxReqPost, sysLocalSet, formatTime, getlevel, sysLocalGet} from "../../utils/libs";
import { sysTimeStamp } from '../../utils/util';
import { Toast } from 'tdesign-miniprogram';
import { init81False, sameNumCellIndexs, connectCellIndexs, leftUndoCell, checkCells, sleepAt } from "./games_func";
import { Step } from "../../utils/types";

let timerInterval: number = 0;
let steps: Step[] = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 最大错误数
    maxErrCt: 3,
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
    //选中的cell
    selectCell: [false],
    // 关联的cell
    connectCell: [false],
    // 相同数字的cell
    sameNumCell: [false],
    // 当前索引
    currCellIndex: -1,
    // 当前提示索引
    currTipIndex: -1,
    // 是否铅笔
    isPencil: false,
    
    // 错误次数
    errCt: 0,

    // 问题
    ques: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    // 答案
    answer: [],
    // 处理答案
    doAnswer: [0],
    // 剩余数字
    leftCellNum: [0],
    // 检测cell是否成功
    checkCells:[false],
    // 是否正确
    isCollects:[false],
    //
    tipItems: Array(81),
    isDone: false,
    // 展示最大错误弹出框
    isShowMaxErr: false,
    // 展示跳转性游戏选择弹出框
    isPop: false,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {

    let level = options.level;

    if(level == 10){
      let old = sysLocalGet('curr_ques_status');
      if(old !== '' && old !== false){
        let index = Number(old.curr_cell_index);
        let sels: boolean[] = init81False();
        sels[index] = true;
        let sames = sameNumCellIndexs(this.data.doAnswer, this.data.doAnswer[index]);
        let conns = connectCellIndexs(index);
        this.setData({
          level:old.level,
          level_str: getlevel(Number(old.level)),
          formattedTime: formatTime(old.use_seconds),
          useSeconds: Number(old.use_seconds),
          playId: Number(old.play_id),
          ques: old.ques,
          answer: old.answer,
          doAnswer: old.do_answer,
          errCt: Number(old.errCt),
          isCollects: old.is_collects,
          currCellIndex: index,
          adCt: Number(old.ad_ct),
          leftCellNum: old.left_cell_num,
          sameNumCell: sames,
          connectCell: conns,
          selectCell: sels,
          tipItems: old.tip_items,
          currTipIndex: Number(old.curr_cell_index),
          isPencil: Boolean(old.is_pencil),
        });
        this.startTimer();
        return;
      }else{
        level = 1;
      }
    }

    this.setData({
      level: level,
      level_str : getlevel(Number(options.level)),
    });
    // console.log('game level link get: ', this.data.level_str);

    // 获取问题
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    sysWxReqPost('/v1/sudoku/question/get', {'level': this.data.level})
    .then((data: any) => {
      // console.log('reponse data: ', data);
      if(data?.code == 0){
        let now = sysTimeStamp();
        let ques   = data.data.question.split(',').map(Number);
        let answer = data.data.answer.split(',').map(Number);
        let doAnswer   = data.data.question.split(',').map(Number);
        // let left   = data.data.question.split(',').map(Number);
        let checks: boolean[] = init81False();
        let isCollects: boolean[] = init81False();
        // 设置本地数据
        this.setData({
          ques: ques,
          answer: answer,
          doAnswer: doAnswer,
          playId: data.data.play_id,
          doBeginAt: now,
          leftCellNum: leftUndoCell(doAnswer),
          checkCells: checks,
          isCollects: isCollects,
          tipItems: this.initTipItem(),
        });
        this.startTimer();
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
    console.log('go on hide...');

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    console.log('go on unload...');
    steps = [];
    timerInterval = 0;
    if(this.data.isDone === false){
      this.stopTimer();
      this.saveQues();

      if(this.data.errCt >= this.data.maxErrCt){
        sysLocalSet('curr_ques_status', '');
      }

      // 记录未完成的游戏
      sysWxReqPost('/v1/sudoku/question/done', {
        'play_id': this.data.playId,
        'use_time': this.data.playId,
        'use_ad':0,
        'is_pass': this.data.isDone ? 1 : 2,
      })
      .then((data:any) =>{})
      .catch((err: any) =>{});
    }else{
      sysLocalSet('curr_ques_status', '');
    }

    
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
  

  startTimer() {
    timerInterval = setInterval(() => {
      this.setData({
        useSeconds: this.data.useSeconds + 1,
        formattedTime: formatTime(this.data.useSeconds + 1)
      });
      console.log("use seconds: ", this.data.useSeconds);

    }, 1000);
  },

  stopTimer() {
    clearInterval(timerInterval);
  },  

  // 处理未填写的
  getUnfill(e: any){
    let index: number = Number(e.currentTarget.dataset.index);
    let sels: boolean[] = init81False();
    sels[index] = true;
    let sames = sameNumCellIndexs(this.data.doAnswer, this.data.doAnswer[index]);
    let conns = connectCellIndexs(index);
    this.setData({
      selectCell: sels,
      sameNumCell: sames,
      connectCell: conns,
      currCellIndex: index,
      currTipIndex:-1,
    });

  },

  // 展示不可操作提示
  showFillTip(e: any){
    let index: number = Number(e.currentTarget.dataset.index);
    let sels: boolean[] = init81False();
    sels[index] = true;
    let sames = sameNumCellIndexs(this.data.doAnswer, this.data.doAnswer[index]);
    let conns = connectCellIndexs(index);
    this.setData({
      selectCell: sels,
      sameNumCell: sames,
      connectCell: conns,
      currCellIndex: index,
      currTipIndex:-1,
    });
  },

  doUnfill(e: any){
    let idx: number = Number(e.currentTarget.dataset.idxfill);
    let index: number = this.data.currCellIndex;

    // 预填
    if(index < 0){
      Toast({
          context: this,
          selector: '#t-toast',
          message: '请选择要填写的方格',
      });
      return;
    }

    // 预填
    if(this.data.ques[index] > 0){
      Toast({
          context: this,
          selector: '#t-toast',
          message: '预填充数不可写',
      });
      return;
    }
    // 判断选项是否填完
    if(this.data.leftCellNum[idx] <= 0){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '选项已填完',
      });
      return;
    }
    // 写入doAnswer数组
    let doArr: number[] = this.data.doAnswer;
    doArr[index] = idx+1;

    // 添加步骤队列
    let step: Step = {
      index:index,
      val: doArr[index],
      optType: this.data.isPencil ? 1 : 2
    };
    steps.push(step);
    // console.log("do steps do: ", steps);
    // 判断是否正确
    let isCollect: boolean = this.data.answer[index] == (idx+1);
    let errCt: number = this.data.errCt;
    if(isCollect == false){
        errCt += 1;
    }
    if(errCt > this.data.maxErrCt){
      this.stopTimer();
      // Toast({
      //   context: this,
      //   selector: '#t-toast',
      //   message: '错误已超过'+this.data.maxErrCt+'次，请重新开始游戏',
      // });
      this.setData({
        isShowMaxErr:true,
      })
      return;
    }
    // 判断行列方格是否正确
    // let chCells:number[] = checkCells(doArr, index);
    // console.log('do check chcells: ', chCells);
    // if(chCells.length > 0 && isCollect){
    //   for(let k=0; k<chCells.length; k++){
    //     let checks: boolean[] = init81False();
    //     checks[chCells[k]] = true;
    //     this.setData({
    //       checkCells: checks,
    //     });
    //     sleepAt(); 
    //   }
    // }

    let isCollects = this.data.isCollects;
    isCollects[index] = isCollect;

    // 判断是否完成
    let isFinish = true;
    for(let a=0; a<doArr.length; a++){
      if(doArr[a] <= 0){
        isFinish = false;
      }
    }
    

    // 重刷页面所有数据
    let checks: boolean[] = init81False();
    // 重新计算left cell
    let left = leftUndoCell(doArr);
    this.setData({
      errCt:         errCt,
      currCellIndex: index,
      currTipIndex:  idx,
      leftCellNum:   left,
      doAnswer:      doArr,
      isCollects:    isCollects,
      checkCells:    checks,
    });

    if(isFinish){
      // 上传结果
      // 弹窗
      this.setData({
        isDone: true,
      });
      // 清空数据
      this.stopTimer();
      steps = [];
      sysLocalSet('curr_ques_status', '');
      sleepAt();
      wx.redirectTo({
        url: '../succ/succ?level='+this.data.level+'&id='+this.data.playId+'&seconds='+this.data.useSeconds,
      });
    }
  },

  isPencilCheck(){
    let isPencil :boolean = this.data.isPencil;
    isPencil = isPencil ? false : true;
    this.setData({
      isPencil: isPencil,
    });
    console.log('is pencil : ', this.data.isPencil);
  },
  // 回退
  withdraw(){
    console.log('do step withdraw: ', steps);
    if(steps.length <= 0){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '已没有回退步骤',
      });
      return;
    }
    let doAnswer = this.data.doAnswer
    let pop = steps.pop();
    doAnswer[Number(pop?.index)] = 0;
    
    let last:Step = {index:0, val:0, optType:2};
    if(steps.length > 0){
      last = steps[steps.length - 1];
    }else{
      last.index = Number(pop?.index);
    }    
    console.log('do step last: ', last);

    let index: number = Number(last?.index);
    let idx: number = Number(last?.val) - 1;
    let sels: boolean[] = init81False();
    sels[index] = true;
    
    doAnswer[index] = Number(last?.val);
    let sames = sameNumCellIndexs(doAnswer, doAnswer[index]);
    let conns = connectCellIndexs(index);
    // 重新计算left cell
    let left = leftUndoCell(doAnswer);

    // 判断是否正确
    let isCollect: boolean = this.data.answer[index] == doAnswer[index];
    let isCollects = this.data.isCollects;
    isCollects[index] = isCollect;

    this.setData({
      selectCell: sels,
      sameNumCell: sames,
      connectCell: conns,
      currCellIndex: index,
      doAnswer: doAnswer,
      leftCellNum:   left,
      currTipIndex:  idx,
      isCollects: isCollects,
    });
  },

  doTip(){
    let index: number = this.data.currCellIndex;
    if(isNaN(index)){
      return;
    }
    let ct: number = this.data.adCt;
    if(ct <= 0){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '提示已用完',
      });
      return;
    }

    if(this.data.ques[index] > 0){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '已有预填数字',
      });
      return;
    }

    
    let doArr = this.data.doAnswer;

    if(doArr[index] > 0){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '已填数字',
      });
      return;
    }

    ct = ct-1;
    let isCollects = this.data.isCollects;
    doArr[index] = this.data.answer[index];
    isCollects[index] = true;

    // 添加步骤队列
    let step: Step = {
      index:index,
      val: doArr[index],
      optType: 2
    };
    steps.push(step);
    console.log('do step dotip: ', steps);
    let idx: number = 0;
    let sels: boolean[] = init81False();
    sels[index] = true;
    let sames = sameNumCellIndexs(doArr, doArr[index]);
    let conns = connectCellIndexs(index);
    // 重新计算left cell
    let left = leftUndoCell(doArr);
    this.setData({
      selectCell: sels,
      sameNumCell: sames,
      connectCell: conns,
      currCellIndex: index,
      doAnswer: doArr,
      leftCellNum:   left,
      currTipIndex:  idx,
      adCt: ct,
      isCollects: isCollects,
    });
  },

  clean(){
    let index: number = this.data.currCellIndex;
    let ques = this.data.ques;

    if(ques[index] > 0){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '已有预填数字',
      });
      return;
    }
    
    let doArr = this.data.doAnswer;
    if(doArr[index] <= 0){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '还没填写数字',
      });
      return;
    }
    doArr[index] = 0;
    let isCollects = this.data.isCollects;
    // isCollects[index] = true;

    // 添加步骤队列
    let step: Step = {
      index:index,
      val: 0,
      optType: 2
    };
    steps.push(step);
    // console.log('do step clean: ', steps);
    let idx: number = 0;
    let sels: boolean[] = init81False();
    sels[index] = true;
    let sames = sameNumCellIndexs(doArr, doArr[index]);
    let conns = connectCellIndexs(index);
    // 重新计算left cell
    let left = leftUndoCell(doArr);
    
    this.setData({
      selectCell: sels,
      sameNumCell: sames,
      connectCell: conns,
      currCellIndex: index,
      doAnswer: doArr,
      leftCellNum:   left,
      currTipIndex:  idx,
      isCollects: isCollects,
    });
  },

  doPencil(e: any){
    let idx: number = Number(e.currentTarget.dataset.idxfill);
    let index: number = this.data.currCellIndex;
    let items = this.data.tipItems;

    if(items[index][idx] > 0){
      items[index][idx] = 0;
    }else{
      this.data.tipItems[index][idx] = idx+1;
    }
    this.setData({
      tipItems: items,
      currTipIndex:idx,
    });
  },

  initTipItem():number[][]{
    let rst: number[][] = new Array(81);
    for(let i=0; i<81; i++){
      rst[i] = new Array(9);
      for(let j=0; j<9; j++){
        rst[i][j] = 0;
      }
    }
    // console.log('item tip init: ', rst);
    return rst;
  }, 


  gotoindex(){
    if(this.data.isDone === false){
      this.stopTimer();
      this.saveQues();
    }else{
      sysLocalSet('curr_ques_status', '');
    }

    wx.redirectTo({
      url: '../index/index',
    });
  },


  saveQues(){
    sysLocalSet('curr_ques_status',{
      play_id: this.data.playId,
      ques: this.data.ques,
      answer: this.data.answer,
      do_answer: this.data.doAnswer,
      errCt: this.data.errCt,
      level: this.data.level,
      is_collects: this.data.isCollects,
      curr_cell_index: this.data.currCellIndex,
      left_cell_num: this.data.leftCellNum,
      use_seconds: this.data.useSeconds,
      ad_ct: this.data.adCt,
      tip_items: this.data.tipItems,
      curr_tip_index: this.data.currTipIndex,
      is_pencil: this.data.isPencil,
    });
  },

  showGobackPop(){
    this.setData({
      isShowMaxErr: true
    });
  },
  onVisibleChange(e:any) {
    this.setData({
      isShowMaxErr: e.detail.visible,
    });
  },
  onClose() {
    this.setData({
      isShowMaxErr: false,
    });
  },

  linktoindex(){
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

  // 弹出新游戏选择
  showPop(e: any) {
    this.setData({
        isPop: true
      }
    );
  },
  onVisibleChangeToNewGame(e: any) {
    this.setData({
      isPop: e.detail.visible,
    });
  },

})