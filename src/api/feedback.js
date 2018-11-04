import axios from 'axios'

// 根据客户编号获取所有用药反馈记录接口
export function getAppUserDrugFeed ({ userid }) {
  const url = '/yjk-consult/feedback/getAppUserDrugFeed'
  return axios.post(url, {
    userid
  }
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}
