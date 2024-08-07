import { globalAvatar } from "../../utils/global";
import { formatTime, getlevel, getPageUrl, sysLocalGet, sysLocalSet, sysWxReqPost, sysWxUploadFile } from "../../utils/libs";
import { Toast } from 'tdesign-miniprogram';
import { GlobalUser, MyHonour } from "../../utils/types";

let new_name: string = '';
// pages/users/users.ts
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: globalAvatar,
    name: '游客',
    playTotal: 0,
    succTotal: 0,
    failTotal: 0,
    rate: 0,
    visible: false,
    list: new Array<MyHonour>(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let login_user: GlobalUser = sysLocalGet('login_user');
    this.setData({
      avatar: login_user.avatar,
      name: login_user.name ? login_user.name : '',
    });

    let list: MyHonour[] = [];
    for(let i = 0; i < 5; i++){
      list[i] = {
        level_num: i+1,
        level: getlevel(i+1),
        play_total: 0,
        succ_total: 0,
        fast_time: '',
        total_time: '',
        last_play_at: '',
        rate: '',
      }
    }

    this.setData({
      list: list,
    });

    sysWxReqPost('/v1/sudoku/myhonour', {}) 
    .then((data: any) => {
      if(data?.code == 0){
        let rst = data.data.list;
        console.log('list: ', rst)
        for(let i = 0; i < rst.length; i++){
          let pt: number = Number(rst[i].play_total);
          let st: number = Number(rst[i].succ_total);
          list[i] = {
            level_num: Number(rst[i].level),
            level: getlevel(Number(rst[i].level)),
            play_total: pt,
            succ_total: st,
            fast_time: formatTime(Number(rst[i].fast_time)),
            total_time: formatTime(Number(rst[i].total_time)),
            last_play_at: rst[i].last_play_at,
            rate: pt > 0 ? ((Math.round((st / pt) *100) / 100)*100).toString()+'%' : '0%',
          }
        }
        this.setData({
          list: list,
        });

      }

    }).catch((e: any) => {})

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

  onChooseAvatar(e: any) {
    const { avatarUrl } = e.detail
    console.log('avatar url: ', avatarUrl);
    if(avatarUrl == ''){
      return;
    }

    if(avatarUrl.startsWith('wxfile://tmp') || avatarUrl.startsWith('http://tmp')){
      // 自定义头像
      sysWxUploadFile(avatarUrl)
      .then((data: any) => {
        data = JSON.parse(data);
        if(data?.code == 0){
          let id = data.data?.id ?? 0;
          let path = data.data?.path ?? '';
          if(id > 0){
            this.updateAvatar(id, path);
          }else{
            Toast({
              context: this,
              selector: '#t-toast',
              message: '上传头像失败，请稍后尝试',
            });
            return;
          }
        }        
      })
      .catch((err: any) => {
        console.log('request api fail: ', err);
      });
    }else{
      this.updateAvatar(0, avatarUrl);
    }
  },

  onInputChange(e:any){
    new_name = e.detail.value;
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
  
  updateAvatar(id: number, avatar: string){
    // 更新用户信息
    sysWxReqPost('/v1/user/update', {'field':'avatar', 'val': id > 0 ? id : avatar}) 
    .then((data: any) => {
      if(data?.code == 0){
        this.setData({
          avatar: avatar,
        });

        let user: GlobalUser = sysLocalGet('login_user');
        user.avatar = avatar;
        sysLocalSet('login_user', user);
      }
    }).catch((err: any) => {})
  },

  showPopup(e: any){
    this.setData({
      visible: true,
    });
  },
  hidePopup(e: any){
    this.setData({
      visible: e.detail.visible,
    });
  }, 

  saveName(){
    if(new_name == ''){
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请输入新昵称',
      });
      return;
    }

    sysWxReqPost('/v1/user/update',{'field':'name', 'val':new_name})
    .then((data: any) => {
      if(data?.code == 0){
        this.setData({
          name: new_name,
          visible: false,
        });

        let user: GlobalUser = sysLocalGet('login_user');
        user.name = new_name;
        sysLocalSet('login_user', user);
      }

    }).catch((e: any) =>{})
  },

  linkToHistory(e: any) {
    var level = e.currentTarget.dataset.level;
    console.log('game level: ', level);
    wx.redirectTo({
      url: '../history/history?level='+level,
    })
  },


})