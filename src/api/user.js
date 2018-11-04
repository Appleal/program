import axios from 'axios'

// 登录
export function login ({userName, password}) {
  const url = '/yjk-consult/consultant/login'
  return axios.post(url, {
    username: userName,
    pwd: password
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取融云客户端好友用户列表
export function getAccountRelation ({userid}) {
  const url = '/yjk-consult/message/getAccountRelation'
  return axios.post(url, {
    userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 修改顾问端昵称（融云)
export function updateConsultant ({nickName}) {
  const url = '/yjk-consult/consultant/updateConsultant'
  return axios.post(url, {
    nickName
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户类型列表接口
export function getAppUserType () {
  const url = '/yjk-consult/appUser/getAppUserType'
  return axios.post(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取数据管理客户数据列表
export function getAppUser ({userType, aNo, aName, userGrade, relationType, startTime, endTime, pageNum, pageSize}) {
  const url = '/yjk-consult/appUser/getAppUser'
  return axios.post(url, {
    user: {
      userType, aNo, aName, userGrade, relationType, startTime, endTime, pageNum, pageSize
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户被授权顾问列表接口
export function getAppUserAuthorizeList ({userid}) {
  const url = '/yjk-consult/appUser/getAppUserAuthorizeList'
  return axios.post(url, {
    userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 客户授权顾问接口
export function appUserAuthorize ({userid, consName}) {
  const url = '/yjk-consult/appUser/appUserAuthorize'
  return axios.post(url, {
    userid, consName
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 客户取消授权顾问接口
export function appUserUnAuthorize ({id}) {
  const url = '/yjk-consult/appUser/appUserUnAuthorize'
  return axios.post(url, {
    id
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 客户统计信息接口
export function getAppUserCountInfo ({userid}) {
  const url = '/yjk-consult/appUser/getAppUserCountInfo'
  return axios.post(url, {
    userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户体检报告列表接口
export function getAppUserExamReportList ({userid}) {
  const url = '/yjk-consult/appUser/getAppUserExamReportList'
  return axios.post(url, {
    userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 主顾问取消客户跟进接口
export function consultantAppUserUnAuthorize ({userid}) {
  const url = '/yjk-consult/appUser/consultantAppUserUnAuthorize'
  return axios.post(url, {
    userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户所有收货地址接口
export function getAppUserAddressList ({userid}) {
  const url = '/yjk-consult/appUser/getAppUserAddressList'
  return axios.post(url, {
    userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 设置客户默认收货地址接口
export function setDefaultAppUserAddress ({userid, id}) {
  const url = '/yjk-consult/appUser/setDefaultAppUserAddress'
  return axios.post(url, {
    userid, id
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 删除客户收货地址接口
export function delAppUserAddress ({id}) {
  const url = '/yjk-consult/appUser/delAppUserAddress'
  return axios.post(url, {
    id
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 修改客户收货地址
export function updateAppUserAddress ({id, appUserid, receiver, area, address}) {
  const url = '/yjk-consult/appUser/updateAppUserAddress'
  return axios.post(url, {
    userAddress: {
      id, appUserid, receiver, area, address
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户药品列表
export function getAppUserGoods (id) {
  const url = '/yjk-consult/drugPlan/getAppUserGoods'
  return axios.post(url,
    id
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户药品列表
export function getAppUserHistoryDrugPlan (id) {
  const url = '/yjk-consult/drugPlan/getAppUserHistoryDrugPlan'
  return axios.post(url,
    id
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 请求新增用药的接口
export function getAppUserDrugPlan (id) {
  const url = '/yjk-consult/drugPlan/getAppUserDrugPlan'
  return axios.post(url,
    id
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 提交新增用药
export function addAppUserDrugPlan (id) {
  const url = '/yjk-consult/drugPlan/addAppUserDrugPlan'
  return axios.post(url,
    id
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 取消用药
export function cancelAppUserDrugPlan (id) {
  const url = '/yjk-consult/drugPlan/cancelAppUserDrugPlan'
  return axios.post(url,
    id
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 修改用药
export function updateAppUserDrugPlan (id) {
  const url = '/yjk-consult/drugPlan/updateAppUserDrugPlan'
  return axios.post(url,
    id
  ).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户管理主治症状跟频次
export function getPlanInitInfo () {
  const url = '/yjk-consult/drugPlan/getPlanInitInfo'
  return axios.post(url, {
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获得今日销售数据
export function getDayOrder () {
  const url = '/yjk-consult/consultant/getDayOrder'
  return axios.get(url, {
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取通话时长
export function getCallTimeToday () {
  const url = '/yjk-consult/consultant/getCallTimeToday'
  return axios.get(url, {
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 排行榜
export function getSaleSort ({ type, pageNum, pageSize }) {
  const url = '/yjk-consult/consultant/getSaleSort'
  return axios.get(url, {
    params: {
      type, pageNum, pageSize
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 未接电话
export function getNoAnswerTel () {
  const url = '/yjk-consult/consultant/getNoAnswerTel'
  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取通话CIT
export function getTciInfo () {
  const url = '/yjk-consult/consultant/getTciInfo'
  return axios.post(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 手机号码归属地查询接口
export function getMobileArea ({mobile}) {
  const url = '/yjk-consult/mobile/getMobileArea'
  return axios.get(url, {
    params: {
      mobile
    }
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取客户手机号码
export function getAppMobile ({userid}) {
  const url = '/yjk-consult/consultant/getAppMobile'
  return axios.post(url, {userid}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 根据手机号获取客户信息
export function getAppUserInfoByMobile ({mobile}) {
  const url = '/yjk-consult/appUser/getAppUserInfoByMobile'
  return axios.post(url, {mobile}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取首页统计
export function getFirstPageUnfinishWork () {
  const url = '/yjk-consult/consultant/getFirstPageUnfinishWork'
  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取首页统计之预约申请
export function getReservationCount () {
  const url = '/yjk-consult/consultant/getReservationCount'
  return axios.get(url, {}).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 查询客户专线
export function getCallDedicatedLine ({userid}) {
  const url = '/yjk-consult/appUser/getCallDedicatedLine'
  return axios.post(url, {userid}).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 设置客户专线
export function setCallDedicatedLine ({ userid, callable }) {
  const url = '/yjk-consult/appUser/setCallDedicatedLine'
  return axios.post(url, { userid, callable }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 获取历史任务
export function getAppUserTask (userid) {
  const url = '/yjk-consult/appUser/getAppUserTask'
  return axios.get(url, {
    params: userid
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

// 查询客户专线
export function updateTelStatus (userId) {
  const url = '/yjk-consult/consultant/updateTelStatus'
  return axios.post(url, userId).then((res) => {
    return Promise.resolve(res.data)
  })
}
