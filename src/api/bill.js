import axios from 'axios'

// 获取所有跟进记录
export function getBillList (screening) {
  const url = '/yjk-consult/bill/getBillList'
  return axios.get(url, {
    params: screening
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取所有跟进记录
export function getStatistical () {
  const url = '/yjk-consult/bill/getStatistical'
  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 账单流水详情页
export function getAppUserBill (condition) {
  const url = '/yjk-consult/bill/getAppUserBill?id=' + condition
  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}
