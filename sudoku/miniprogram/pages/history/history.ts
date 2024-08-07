import { formatTime, getPageUrl, sysLocalSet, sysWxReqPost } from "../../utils/libs";
import { MyHistory } from "../../utils/types";
import { Toast } from 'tdesign-miniprogram';

let ends: boolean[] = [false, false, false, false, false];
let pages: number[] = [1,1,1,1,1];
let all: MyHistory[][] = [[], [], [], [], []];
// pages/history/history.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currPage: 1,
    currL: 1,
    list: new Array<MyHistory>(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    let level: number = Number(options?.level ?? 1);
    console.log('history levelllll: ', level);

    this.setData({
      currL: level,
    });
    
    ends = [false, false, false, false, false];
    pages = [1,1,1,1,1];
    all = [[], [], [], [], []];
    // 获取榜单
    this.getList(level);
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
    if(pages[this.data.currL - 1] >= 10){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '只显示最新150条记录',
      });
      return;
    }

    if(ends[this.data.currL - 1]){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '没有更多数据啦',
      });
      return;
    }
    pages[this.data.currL - 1] += 1;

    // let len: number = all[this.data.currL - 1].length;
    // let p: number = Math.ceil(len/15);
    // p = p == 0 ? 1 : p;
    
    // if(p >= pages[this.data.currL - 1]){
    //   return;
    // }

    this.getList(this.data.currL);

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 切换标签
  switchTab(e: any){
    this.setData({
      currPage: 1,
    });
    let val = Number(e.detail.value);
    this.setData({
      currL: val,
    });
    // 重置为空页
    all[val-1] = [];
    // 从头开始算
    pages[val-1] = 1;
    ends[val-1] = false;

    // let len: number = all[val - 1].length;
    // let p: number = Math.ceil(len/10);
    // p = p == 0 ? 1 : p;
    
    // if(p >= this.data.currPage){
    //   return;
    // }
   
    this.getList(val);
  },

  // 去详情
  gotoDetail(e: any){
    let detail: MyHistory = {}
    
    let id: number = e.currentTarget.dataset.playid;
    for(let i=0; i<all[this.data.currL - 1].length; i++){
      if(all[this.data.currL-1][i].id == id){
        detail = all[this.data.currL-1][i];
        break;
      }
    }
    // 保存到本地
    sysLocalSet('curr_history_detail', detail);
    
    wx.redirectTo({
      url: '../detail/detail',
    });
  },

  getList(level: number){
    // 获取榜单
    sysWxReqPost('/v1/sudoku/myhistory', {'level': level, "page": pages[level - 1],})
    .then((data: any) => {
      // console.log('reponse data: ', data);
      if(data?.code == 0){
        let list = data.data.list?.length > 0 ? data.data.list : new Array<MyHistory>();

        if(list.length > 0) {
          for(let i=0; i<list.length; i++){
            all[level-1].push({
              id: list[i].id,
              answer: list[i].answer,
              question: list[i].question,
              level: list[i].level,
              use_time: formatTime(Number(list[i].use_time)),
              err_ct: list[i].err_ct,
              tip_ct: list[i].tip_ct,
              create_at: list[i].create_at,
            });
          }
          // console.log('all data: ', all[level-1]);
          
        }else{
          ends[level-1]= true;
        }
        this.setData({
          list: all[level - 1],
        });
      }        
    })
    .catch((err: any) => {
      console.log('request api fail: ', err);
    });
  },

  gotoPage(e: any){
    let t: string = e.detail.value;
    let url = getPageUrl(t);    
    if(url == ''){
      return;
    }
    wx.redirectTo({
      url: url,
    });
  },

  gotoMy(){
    wx.redirectTo({
      url: '../my/my',
    });
  },
})