// pages/games/games.ts
import {sysWxReqPost, sysLocalSet} from "../../utils/libs";
import { sysTimeStamp } from '../../utils/util';
import { Toast } from 'tdesign-miniprogram';
import { getlevel, formatTime, init81False, sameNumCellIndexs, connectCellIndexs, leftUndoCell, checkCells } from "./games_func";

let timerInterval: number = 0;
let steps: object[] = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 最大错误数
    maxErrCt: 5,
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
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    var that = this;
    that.setData({
      level: options.level,
      level_str : getlevel(options.level),
    });
    console.log('game level link get: ', this.data.level);

    // 获取问题
    // 发送 res.code 到后台换取 openId, sessionKey, unionId
    sysWxReqPost('/v1/sudoku/question/get', {'level': this.data.level})
    .then((data: any) => {
      console.log('reponse data: ', data);
      if(data?.code == 0){
        let now = sysTimeStamp();
        let ques   = data.data.question.split(',').map(Number);
        let answer = data.data.answer.split(',').map(Number);
        let doAnswer   = data.data.question.split(',').map(Number);
        let left   = data.data.question.split(',').map(Number);
        let checks: boolean[] = init81False();
        let isCollects: boolean[] = init81False();
        // 设置本地数据
        that.setData({
          ques: ques,
          answer: answer,
          doAnswer: doAnswer,
          playId: data.data.play_id,
          doBeginAt: now,
          leftCellNum: leftUndoCell(answer, left),
          checkCells: checks,
          isCollects: isCollects,
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
    });
  },

  doUnfill(e: any){
    let idx: number = Number(e.currentTarget.dataset.idxfill);
    let index: number = this.data.currCellIndex;

    console.log('do unfill idx: ', idx);
    console.log('do unfill index: ', index);
    console.log('do unfill ques : ', this.data.ques);

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
    // leftCellNum 减一
    let leftCell: number[] = this.data.leftCellNum;
    leftCell[idx] = leftCell[idx] - 1;

    // 添加步骤队列
    steps.push({"index":index, "val":idx+1, "type": this.data.isPencil ? 1 : 2});

    // 判断是否正确
    let isCollect: boolean = this.data.answer[index] == (idx+1)
    let errCt: number = this.data.errCt;
    if(isCollect == false){
        errCt += 1;
        if(errCt > this.data.maxErrCt){
          Toast({
            context: this,
            selector: '#t-toast',
            message: '错误已超过5次，恢复或重玩',
          });
          return;
        }
    }
    // 判断行列方格是否正确
    let chCells:number[] = checkCells(doArr, index);
    if(chCells.length > 0 && isCollect){
      for(let k=0; k<chCells.length; k++){
        let checks: boolean[] = init81False();
        checks[chCells[k]] = true;
        this.setData({
          checkCells: checks,
        });
      }
    }

    let isCollects = this.data.isCollects;
    isCollects[index] = isCollect;

    // 判断是否完成
    let isFinish = true;
    for(let a=0; a<doArr.length; a++){
      if(doArr[a] <= 0){
        isFinish = false;
      }
    }
    if(isFinish){
      // 上传结果
      // 弹窗
      Toast({
        context: this,
        selector: '#t-toast',
        message: '恭喜，您已成功闯关',
      });
      return;
    }

    console.log('do unfill answer: ', doArr);

    // 重刷页面所有数据
    let checks: boolean[] = init81False();
    this.setData({
      errCt:         errCt,
      currCellIndex: index,
      currTipIndex:  idx,
      leftCellNum:   leftCell,
      doAnswer:      doArr,
      isCollects:    isCollects,
      checkCells:    checks,
    });
  },

})