import axios from 'axios'

// 获取所有跟进记录
export function getAppUserFollow ({ userid }) {
  const url = '/yjk-consult/followup/getAppUserFollow'
  return axios.post(url, {
    userid
  }
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取所有跟进记录
export function addAppUserFollow ({ userid, content }) {
  const url = '/yjk-consult/followup/addAppUserFollow'
  return axios.post(url, {
    userid,
    content
  }
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 删除当前顾问录入的跟进记录接口
export function delAppUserFollow ({ id }) {
  const url = '/yjk-consult/followup/delAppUserFollow'
  return axios.post(url, {
    id
  }
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}
