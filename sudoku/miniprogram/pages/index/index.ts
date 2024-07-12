// index.ts
// 获取应用实例
const app = getApp<IAppOption>()
const defaultAvatarUrl: string= 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Component({
  data: {
    visible: false
  },
  methods: {
    // 事件处理函数
   
    linkToGame(e: any) {
      var level = e.currentTarget.dataset.level;
      console.log('game level: ', level);
      wx.navigateTo({
        url: '../games/games?level='+level,
      })
    },

    handlePopup(e: any) {
      this.setData({
        visible: true
      }
      );
    },
    onVisibleChange(e: any) {
      this.setData({
        visible: e.detail.visible,
      });
    },
  },
})
