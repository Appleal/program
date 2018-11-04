import axios from 'axios'

// ===>提交下定金
export function payDeposit (userInfo) {
  const url = '/yjk-consult/pay/payDeposit'
  return axios.post(url,
    userInfo
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 下定金获取APP用户基本信息
export function getAppUserInfoByUserNo (userInfo) {
  const url = '/yjk-consult/appUser/getAppUserInfoByUserNo'
  return axios.post(url,
    userInfo
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// ===>订单列表
export function getOrder (userInfo) {
  const url = '/yjk-consult/order/getOrder'
  return axios.post(url, userInfo).then((res) => {
    return Promise.resolve(res.data)
  })
}

// ===> 账单详情用户信息
export function getOrderdetail (userInfo) {
  const url = '/yjk-consult/order/getOrderdetail'
  return axios.post(url, userInfo).then((res) => {
    return Promise.resolve(res.data)
  })
}

// ===>订金单列表
export function getDownPayment (userInfo) {
  const url = '/yjk-consult/pay/getDownPayment'
  return axios.post(url, userInfo).then((res) => {
    return Promise.resolve(res.data)
  })
}

// ===> 取消定金
export function unPayDeposit (userInfo) {
  const url = '/yjk-consult/pay/unPayDeposit'
  return axios.post(url, userInfo).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 销售数据table
export function getSalesOrders (userInfo) {
  const url = '/yjk-consult/consultant/getSalesOrders'
  return axios.get(url, {
    params: userInfo
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 销售数据图表
export function getInfo (userInfo) {
  const url = '/yjk-consult/consultant/getInfo'
  return axios.get(url, {
    params: userInfo
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 销售统计业绩统计
export function getCompare (userInfo) {
  const url = '/yjk-consult/consultant/getCompare'
  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取用户信息
export function getAppUserInfo ({ userid }) {
  const url = '/yjk-consult/appUser/getAppUserInfo'
  return axios.post(url, {
    userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 设置app客户在顾问显示的备注名
export function updateconsultDisplayName (consultDisplayName) {
  const url = '/yjk-consult/appUser/updateconsultDisplayName'
  return axios.post(url, consultDisplayName).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取APP客户未使用订金
export function getUnPayDeposit ({ userid }) {
  const url = '/yjk-consult/pay/getUnPayDeposit'
  return axios.post(url, {
    userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取中西药产品信息  废弃
export function getGoods () {
  const url = '/yjk-consult/goods/getGoods'
  return axios.post(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 更新用户信息  废弃
export function updataAppUserInfo (userInfo) {
  const url = '/yjk-consult/appUser/updataAppUserInfo'
  return axios.post(url, userInfo).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户量表信息接口  废弃
export function getAppUserGauge ({ userid }) {
  const url = '/yjk-consult/order/getAppUserGauge'
  return axios.post(url, { userid }
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 异常订单列表查询接口
export function getAbnormalOrder (userInfo) {
  const url = '/yjk-consult/order/getAbnormalOrder'
  return axios.post(url, userInfo
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取历史订单信息接口
export function getHistoryOrder (id) {
  const url = '/yjk-consult/order/getHistoryOrder'
  return axios.post(url, id).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取历史订单信息接口
export function msgtempList () {
  const url = '/yjk-consult/msgtemp/list'
  return axios.post(url).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 健康评测
export function getHealthyEvaluation (userInfo) {
  const url = '/yjk-consult/order/getHealthyEvaluation'
  return axios.post(url,
    userInfo
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 取消任务
export function deleteAppUserTask (userInfo) {
  const url = '/yjk-consult/appUser/deleteAppUserTask'
  return axios.post(url, userInfo).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 云信聊天客户列表（按客户名称，昵称，备注）模糊查询
export function searchAccountRelation (userInfo) {
  const url = '/yjk-consult/message/searchAccountRelation'
  return axios.post(url, userInfo).then((res) => {
    return Promise.resolve(res.data)
  })
}
