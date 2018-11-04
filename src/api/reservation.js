import axios from 'axios'

// 获取预约排班表
export function getReservationList (time) {
  const url = '/yjk-consult/consultantReservation/getReservationList'
  return axios.get(url, {
    params: time
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取预约的客户
export function getReservationInfo () {
  const url = '/yjk-consult/consultantReservation/getReservationInfo'
  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取预约的顾问
export function getConsultantInfoByAppUserId (appUserId) {
  const url = '/yjk-consult/consultantReservation/getConsultantInfoByAppUserId'
  return axios.get(url, {
    params: {
      appUserId
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 添加预约
export function addReservation (screening) {
  const url = '/yjk-consult/consultantReservation/addReservation'
  return axios.post(url, screening).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取列表数据 lw
export function getBillList (screening) {
  const url = '/yjk-consult/consultantReservation/getList'
  return axios.get(url, {
    params: screening
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 取消预约 lw
export function updateReservation (screening) {
  const url = '/yjk-consult/consultantReservation/updateReservation'
  return axios.post(url,
    screening
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 预约详情
export function getReservation ({ id }) {
  const url = '/yjk-consult/consultantReservation/getReservation'
  return axios.get(url, {
    params: {
      id
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 预约待确认列表
export function getUnreservationInfo (params) {
  const url = '/yjk-consult/consultantReservation/getUnreservationInfo'
  return axios.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 提交不安排预约说明
export function submitNoReservation ({ id, userid, rejectReason }) {
  const url = '/yjk-consult/consultantReservation/submitNoReservation'
  return axios.post(url, {
    id, userid, rejectReason
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 添加预约-文本输入
export function getConsultantInfoByBrmId (params) {
  const url = '/yjk-consult/consultantReservation/getConsultantInfoByBrmId'
  return axios.get(url, {
    params
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 添加预约，顾问主动添加预约
export function saveReservation (params) {
  const url = '/yjk-consult/consultantReservation/saveReservation'
  return axios.post(url, params).then((res) => {
    return Promise.resolve(res.data)
  })
}
