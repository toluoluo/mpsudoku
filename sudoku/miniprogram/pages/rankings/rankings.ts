import { globalAvatar } from "../../utils/global";
import { formatTime, getPageUrl, sysWxReqPost } from "../../utils/libs";
import { RankingsList } from "../../utils/types";


// pages/rankings/rankings.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currLevel: 1,
    list: new Array<RankingsList>(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options: any) {
    let level: number = options?.level ?? 1;
    this.setData({
      currLevel: level,
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  // 切换标签
  switchTab(e: any){
    let val = Number(e.detail.value);
    this.setData({
      currLevel: val,
    });
    // 获取榜单
    this.getList(val);
  },

  // 去挑战
  gotoChallenge(e: any){
    let play_id: number = e.currentTarget.dataset.playid;
    console.log("play id : ", play_id);
    wx.redirectTo({
      url: '../games/games?level='+this.data.currLevel+'&from=1&pid='+play_id,
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

  getList(level: number){
    // 获取榜单
    sysWxReqPost('/v1/sudoku/question/rankings', {'level': level})
    .then((data: any) => {
      // console.log('reponse data: ', data);
      if(data?.code == 0){
        let list = data.data.list?.length > 0 ? data.data.list : new Array<RankingsList>();
        if(list.length > 0) {
          for(let i=0; i<list.length; i++){
            if(list[i].avatar == ''){
              list[i].avatar = globalAvatar;
            }
            if(list[i].name == ''){
              if(list[i].nick_name == ''){
                list[i].name = '匿名用户';
              }else{
                list[i].name = list[i].nick_name;
              }
            }
            list[i].format_time = formatTime(list[i].use_time);
          }
        }
        this.setData({
          list: list,
        });
      }        
    })
    .catch((err: any) => {
      console.log('request api fail: ', err);
    });
  }

})