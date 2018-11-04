<template>
  <div class="chat-text-wrapper" :class="{slef: data.me}">
    <div class="chat-text-time">{{_format(data.time)}}</div>
    <div class="chat-text-content">
      <div class="chat-msg-portrait">
        <img :src="data.portrait">
      </div>
      <div class="chat-msg-content">
        <div class="chat-msg-content-body">
          <div class="zdy-wrapper">
            <h3  class="zdy-content-title">{{zdyData.title}}</h3>
            <div v-for="(item,index) in zdyData.data" :key="index">
              <h3  class="zdy-content-subtitle" v-if="item.title">{{item.title}}</h3>
              <div class="zdy-content-item" v-for="(d, i) in item.data" :key="i" :class="hasZdyClass(d)">
                <span class="zdy-content-item-left">{{d.left}} </span>
                <span class="zdy-content-item-right">{{d.right}} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { chatMixin } from 'common/js/mixin'
import { formatCurrency } from 'common/js/util'

const COMPONENTS_NAME = 'chat-other'

export default {
  name: COMPONENTS_NAME,
  mixins: [chatMixin],
  computed: {
    zdyData () {+``
      const { data, orderStatus, payment } = this
      let zdyData = {}
      zdyData.data = []
      const message = data.content
      let objectName
      if (data.content) {
        objectName = JSON.parse(message).type
      }
      if (!message) return {}
      switch (objectName) {
        case 1:
          zdyData.title = '[订单消息]'
          let d = JSON.parse(message).data
          let _d = {
            title: '订单详情',
            data: [{
              left: `订单号: ${d.orderNum ? d.orderNum : ''}`
            }, {
              left: `订单状态: ${d.orderStatus ? orderStatus(d.orderStatus) : ''}`
            }, {
              left: `订单名称: ${d.orderName ? d.orderName : ''}`
            }, {
              left: `订单金额: ${d.orderPrice ? formatCurrency(d.orderPrice / 100) : ''}`
            }, {
              left: `下订单时间: ${d.orderDate ? d.orderDate : ''}`
            }]
          }
          zdyData.data = [_d]
          break
        case 3:
          zdyData.title = '[预约申请]'
          zdyData.data = JSON.parse(message).data.appointmentMessage
          break
        case 2:
          zdyData.title = '[效果反馈]'
          zdyData.data = JSON.parse(message).data.effectFeedbackMessage
          break
        case 5:
          console.log(JSON.parse(message).data)
          zdyData.title = '[定金支付]'
          let f = JSON.parse(message).data
          let _f = {
            title: '',
            data: [{
              left: `支付金额: ${f.paymentPrice ? formatCurrency(f.paymentPrice / 100) : ''}`
            }, {
              left: `预付款单号: ${f.paymentNum ? f.paymentNum : ''}`
            }, {
              left: `支付方式: ${f.paymentMethod ? payment(f.paymentMethod) : ''}`
            }, {
              left: `支付时间: ${f.paymentTime ? f.paymentTime : ''}`
            }]
          }
          zdyData.data = [_f]
          break
        default:
          break
      }
      return zdyData
    }
  },
  methods: {
    orderStatus (e) {
      if (typeof e === 'string') {
        // APP发送有时候数字有时候字符串， 我强制为数字
        e = Number(e)
      }
      if (e < 0) {
        return '已取消'
      }
      switch (e) {
        case -1:
          return '已取消'
        case 100:
          return '待支付'
        case 200:
          return '待发货'
        case 300:
          return '待收货'
        case 400:
          return '已签收'
        default:
          return e
      }
    },
    payment (e) {
      if (e === 1) {
        return '微信'
      } else {
        return '支付宝'
      }
    },
    hasZdyClass (d, type) {
      return {
        'zdy-content-item-lang': !(d.left && d.right)
      }
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"
@import "~common/css/chat"

.zdy-wrapper
  padding 5px 10px
  background-color #fff
  text-align left
  border-radius 5px
.zdy-content-title
  width 240px
  height 35px
  line-height 35px
  color #436EEE
  font-size $font-size-md
.zdy-content-subtitle
  width 240px
  height 35px
  line-height 35px
  color #404040
  font-size $font-size-sm
  font-weight 500
.zdy-content-item
  width 240px
  font-size 0
  .zdy-content-item-left,.zdy-content-item-right
    width 50%
    line-height 2
    color #404040
    font-size $font-size-sm
    inline-block-top()
  .zdy-content-item-right
    text-align right
  &.zdy-content-item-lang
    .zdy-content-item-left,.zdy-content-item-right
      width 100%
</style>
