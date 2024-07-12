import * as crypto from 'crypto-js';
import {sysEncryptStr, reqUrl} from './global';

export const sysLocalSet = function (key: string, val: any){
  wx.setStorageSync(key, val);
}

export const sysLocalGet = function (key: string) {
  return wx.getStorageSync(key);
}

// 生成请求参数
const buildReqParam = function(arr:  Record<string, any>){

  const token = sysLocalGet("login_user_token");
  console.log('login user token: ', token);
  if(token){
    arr.token = token;
  }

  arr.timestamp = Date.now();
  const sortedArray = Object.entries(arr)
  .sort(([key1,], [key2,]) => key1.localeCompare(key2))
  .map(([key, value]) => `${key}=${value}`)
  .join('&');

  // 使用 crypto-js 生成 MD5
  const md5Hash = crypto.MD5(sortedArray + "&" + sysEncryptStr).toString(crypto.enc.Hex);
  arr.sign = md5Hash;

  return arr;
}

// 系统统一post请求函数
export const sysWxReqPost = function(uri: string, data: Record<string, any>){
  const param = buildReqParam(data);
  return new Promise((resolve, reject) => {
    wx.request({
      url: reqUrl+uri,
      data: param,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",    
      success: function(res){
        if(res.statusCode === 200){
          resolve(res.data);
        }else{
          reject(res);
        }
      },
      fail: function(err){
        reject(err);
      }
    });
  })
}