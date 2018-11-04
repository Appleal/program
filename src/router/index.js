import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const Login = () => import('components/login/login') // 登录
const Home = () => import('components/home/home') // 首页
const batchMessage = () => import('components/home/batch-message') // 批量发送消息
const batchTask = () => import('components/home/batch-task') // 批量发送任务

const Achievement = () => import('components/achievement/achievement') // 业绩统计

const Custom = () => import('components/custom/custom') // 客人管理
const CustomItem = () => import('components/custom/custom-item') // 客人详细
const customAuthorize = () => import('components/custom/custom-authorize') // 客人授权

const Order = () => import('components/order/order') // 订单管理 ==> 订单列表
const Payment = () => import('components/order/order-Pay-Ment') // 订单管理 ==> 定金
const Abnormal = () => import('components/order/abnormal-order') // 订单管理 ==> 异常订单
const OrderPay = () => import('components/order/order-pay') // 下定金
const OrderInfo = () => import('components/order/order-info') // 订单管理列表 详情页

const Details = () => import('components/orderLayer/order-layer') // 订单详情

const OrderStep = () => import('components/orderPay/step') // 订单步骤
const FindUser = () => import('components/orderPay/find-user') // 查找用户
const AuditList = () => import('components/orderPay/audit-list') // 审核量表
const PlaceOrder = () => import('components/orderPay/place-order.vue') // 下订单
const MedicationArrange = () => import('components/orderPay/medication-arrange') // 用药安排

const Appointment = () => import('components/appointment/appointment') // 我的预约
const AddAppointment = () => import('components/appointment/add-appointment') // 新增 我的预约
const InfoAppointment = () => import('components/appointment/info-appointment') // 详情 我的预约
const EditAppointment = () => import('components/appointment/edit-appointment') // 新增 我的预约
const CancelAppointment = () => import('components/appointment/cancel-appointment') // 取消 我的预约
const RejectAppointment = () => import('components/appointment/reject-appointment') // 不安排 我的预约
const MakeAppointment = () => import('components/appointment/make-appointment') // 安排 我的预约

const Chatwindow = () => import('components/chat-window/chat-window') // 聊天窗口

const Notice = () => import('components/notice/notice') // 通知消息
const Setting = () => import('components/setting/setting') // 通知消息
const Sculpture = () => import('components/sculpture/sculpture') // 修改头像
const achieveRank = () => import('components/achieve-rank/achieve-rank') // 业绩排名
const NotFound = () => import('components/not-found/not-found') // 404

const Management = () => import('components/management/management.vue') // 账单管理
const ManagementInfo = () => import('components/management/management-info') // 账单详细

const Calling = () => import('components/calling/calling') // 未接来电

export default new VueRouter({ /* eslint-disable-line no-undef */
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [{
        path: 'pay',
        component: OrderPay
      }, {
        path: 'message',
        component: batchMessage
      }, {
        path: 'task',
        component: batchTask
      }, {
        path: 'authorize',
        component: customAuthorize
      }]
    },
    {
      path: '/custom',
      name: 'custom',
      component: Custom,
      children: [{
        path: 'item',
        component: CustomItem,
        children: []
      }, {
        path: 'authorize',
        component: customAuthorize,
        children: []
      }]
    },
    {
      path: '/order',
      name: 'order',
      component: Order,
      children: [{
        path: 'pay',
        component: OrderPay
      }, {
        path: 'info',
        component: OrderInfo
      }, {
        path: 'details',
        component: Details,
        children: []
      }]
    },
    {
      path: '/payment',
      name: 'Payment',
      component: Payment,
      children: [{
        path: 'pay',
        component: OrderPay
      }, {
        path: 'info',
        component: OrderInfo
      }, {
        path: 'details',
        component: Details,
        children: []
      }]
    },
    {
      path: '/abnormal',
      name: 'abnormal',
      component: Abnormal,
      children: [{
        path: 'info',
        component: OrderInfo
      }]
    },
    {
      path: '/orderstep',
      component: OrderStep,
      children: [{
        path: '/',
        redirect: 'finduser'
      }, {
        path: 'finduser',
        component: FindUser,
        children: []
      }, {
        path: 'auditlist',
        component: AuditList,
        children: []
      }, {
        path: 'placeorder',
        component: PlaceOrder,
        children: []
      }, {
        path: 'medicationarrange',
        component: MedicationArrange,
        children: []
      }]
    },
    {
      path: '/appointment',
      name: 'appointment',
      component: Appointment,
      children: [{
        path: 'addAppointment',
        component: AddAppointment
      }, {
        path: 'item',
        component: CustomItem
      }, {
        path: 'reject',
        component: RejectAppointment
      }, {
        path: 'make',
        component: MakeAppointment
      }, {
        path: 'edit',
        component: EditAppointment
      }, {
        path: 'info',
        component: InfoAppointment
      }, {
        path: 'cancel',
        component: CancelAppointment
      }]
    },
    {
      path: '/achievement',
      name: 'achievement',
      component: Achievement,
      children: []
    },
    {
      path: '/chatwindow/:tid',
      name: 'chatwindow',
      component: Chatwindow,
      children: [{
        path: 'item',
        component: CustomItem,
        children: []
      }, {
        path: 'pay',
        component: OrderPay
      }, {
        path: 'authorize',
        component: customAuthorize,
        children: []
      }, {
        path: 'task',
        component: batchTask
      }, {
        path: 'oInfo',
        component: OrderInfo,
        children: []
      }]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      children: []
    },
    {
      path: '/setting',
      name: 'setting',
      component: Setting,
      children: [{
        path: 'sculpture',
        component: Sculpture
      }]
    },
    {
      path: '/management',
      name: 'management',
      component: Management,
      children: [{
        path: 'info',
        component: ManagementInfo
      }]
    },
    {
      path: '/notice',
      name: 'notice',
      component: Notice,
      children: []
    },
    {
      path: '/achieveRank',
      name: 'achieveRank',
      component: achieveRank,
      children: []
    },
    {
      path: '/calling',
      name: 'calling',
      component: Calling,
      children: []
    },
    {
      path: '/404',
      component: NotFound,
      children: []
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})
