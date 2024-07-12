import { sysLocalGet,sysLocalSet, sysWxReqPost} from "./utils/libs";
import {globalAvatar} from "./utils/global";
import { GlobalUser } from "./utils/types";
import { sysTimeStamp } from './utils/util';

// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {
    const token = sysLocalGet('login_user_token');
    const expire = sysLocalGet('login_user_token_expire_at');
    const now_t = sysTimeStamp();

    if(token == undefined || token == '' || (token && now_t > expire)){
      // 登录
      wx.login({
        success: res => {
          console.log('running here');
          console.log(res.code)
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          sysWxReqPost('/v1/wxlogin/auth', {'js_code': res.code})
          .then((data: any) => {
            console.log('reponse data: ', data);
            if(data?.code == 0){
              // 设置本地数据
              sysLocalSet('login_user_token', data.data.token);
              sysLocalSet('login_user_token_expire_at', sysTimeStamp() + 30 * 24 * 3600);
              const user: GlobalUser = {
                user_id: data.data?.user_id ?? 0,
                nick_name: data.data.nick_name,
                avatar: data.data.avatar ? data.data.avatar : globalAvatar,
                level: data.data.level,
              }
              sysLocalSet('login_user', user);
            }
          })
          .catch(err => {
            console.log('request api fail: ', err);
            
          })
          
        },
      })
    }    
  },
})