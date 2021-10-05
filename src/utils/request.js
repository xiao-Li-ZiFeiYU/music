// 封装请求函数

// 导入请求的服务器地址
import config from './config'

// 因为data可以不传，默认就是空对象   method同理
export default (url, data = {}, method = 'GET') => {
  
  // 因为请求的数据在这边，要用Promise封装导出
  return new Promise((resolve, reject) => {
    uni.request({
      // 请求地址
      url: config.host + url,
      // 请求参数
      data,
      // 请求类型
      method,
      // 成功回调
      success: res => {
        resolve(res)
      },
      // 失败回调
      fail: err => {
        console.log('请求失败'+err);
        reject(err)
      }
    })
  })
}