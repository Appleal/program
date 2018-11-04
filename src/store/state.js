const USER_PORTRAITURL = require('../common/image/user.png')
const CUSTOM_PORTRAITURL = require('../common/image/custom.png')

const state = {
  config: {
    userPortraitUrl: USER_PORTRAITURL,
    customPortraitUrl: CUSTOM_PORTRAITURL
  },
  isLogin: false, // 判断是否已经登录的标识
  isConnect: false, //  判断融云IM是否已经连接的标识
  connectype: -1, // 融云-1初始化 0断开连接  1正在连接  2已经连接
  user: {}, // 当前登录的用户
  conversationUserList: [], // 消息聊天用户列表
  conversationList: [], // 消息聊天信息列表
  custom: {}, // 当前客户
  call: {}, // 弹屏的电话信息
  callvoice: {}, // 弹屏的语音电话信息
  telephone: {},
  homeUnfinishWork: [ // 首页报表数据
    {title: '新增客户', num: 0, path: 'custom', query: {isNew: 'new'}},
    {title: '未接来电', num: 0, path: 'calling', query: {}},
    {title: '异常订单', num: 0, path: 'abnormal', query: {}},
    {title: '待支付订单', num: 0, path: 'order', query: {state: '100'}},
    {title: '待发货订单', num: 0, path: 'order', query: {state: '200'}},
    {title: '已发货订单', num: 0, path: 'order', query: {state: '300'}},
    {title: '预约申请', num: 0, path: 'appointment', query: {add: '1'}},
    {title: '我的预约', num: 0, path: 'appointment', query: {}}
  ],
  appointmentNum: 0 // 我的待确认预约数量
}

export default state
