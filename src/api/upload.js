import axios from 'axios'

/* eslint-disable standard/no-callback-literal */
// 上传图像
export function uploadPicture (file, callback) {
  const url = '/yjk-consult/consultant/uploadPicture'
  let param = new FormData()
  param.append('file', file)
  return axios.post(url,
    param,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: function (progressEvent) {
        const { loaded, total } = progressEvent
        callback && callback(loaded / total)
      }
    }
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 上传头像图像
export function uploadPersonPicture (file) {
  const url = '/yjk-consult/consultant/uploadPersonPicture'
  let param = new FormData()
  param.append('file', file)
  return axios.post(url,
    param,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}
