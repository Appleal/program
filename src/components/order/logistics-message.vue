<template>
    <div class="logistics">
      <div v-if="!logisticsList" style="color: #999">暂无物流数据</div>
      <div v-else="">
        <ul class="change">
          <li v-if="allData.length > 0" :class="{active: selectItem === index}" v-for="(item, index) in allData" @click="addData(index)" :key="item.orderNo">
            物流单号{{item.orderNo}}
          </li>
        </ul>
        <div class="logisticsList">
          <p class="message">
            <span class="title">快递单号：{{ logistics.logisticNo }}</span>
            <span class="details">快递公司：{{ logistics.logisticCompanyName }}</span>
          </p>
          <p class="message">
            <span class="title">收货人：{{ logisticsList.receiver }}</span>
            <span class="details">收货地址：{{ logisticsList.receiverAddress }}</span>
          </p>
          <p class="order">
            <span>物流详情</span>
          </p>
          <div>
            <ul class="transportMessage">
              <li class="">
                <div class="util-item-li" :class='{active: 200 <= logisticsList.state }'>
                  <i class="util-icon icon-collectMaterials"></i>
                  <p>待揽件</p>
                  <ul class="omit">
                    <li v-for="item in 12" :key="item">
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div class="util-item-li" :class='{active: 300 <= logisticsList.state}'>
                  <i class="util-icon icon-trident"></i>
                  <p class="">运输中</p>
                  <ul class="omit">
                    <li v-for="item in 12" :key="item">
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div class="util-item-li" :class='{active: 300 <= logisticsList.state}'>
                  <i class="util-icon icon-delivery"></i>
                  <p>派送中</p>
                  <ul class="omit">
                    <li v-for="item in 12" :key="item">
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <div class="util-item-li" :class='{active:  400 <= logisticsList.state}'>
                  <i class="util-icon gray icon-signFor"></i>
                  <p>签收</p>
                </div>
              </li>
            </ul>
            <div class="logisticsMessage" v-if="logisticTraceList.length > 0">
              <p class="logisticsTitle">运输中</p>
              <div class="messageState">
                <li v-for="(item, index) in logistics.logisticTraceList.length" class="round" :key="index">
                </li>
              </div>
              <ul class="messageContent">
                <li
                  class="messageContent-item"
                  v-for="(logisticTrace, index) in logistics.logisticTraceList"
                  :key="index">
                <span class="messageContent-time" style="width: 65px;">
                  <em v-if="isShow(index, logistics.logisticTraceList)">
                   {{`${_format(logisticTrace.traceTime, '$1-$2-$3')}`}}
                  </em>
                </span>
                  <span class="messageContent-time" style="width: 35px;">
                  <em v-if="isShow(index, logistics.logisticTraceList)">
                    {{`${_formatWeek(logisticTrace.traceTime)}`}}
                  </em>
                </span>
                  <span class="messageContent-time" >
                  {{`${_format(logisticTrace.traceTime, '$4:$5:$6')}`}}
                </span>
                  <span class="messageContent-text" :title="logisticTrace.location + logisticTrace.status">
                  {{`${logisticTrace.location} ${logisticTrace.status}`}}
                </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
import { getOrderdetail } from 'api/placeOrder'
import { ERR_SUCCESS } from 'api/config'
import { isNull, format } from 'common/js/util'

const WEEK_ARR = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export default {
  name: 'payMessage',
  data () {
    return {
      logisticsList: [],
      allData: [],
      logistics: {},
      logisticTraceList: [],
      selectItem: 0
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      getOrderdetail({id: tid}).then((res) => { // 获取账单详情用户信息
        if (res.code === ERR_SUCCESS) {
          this.allData = res.data
          this._change(0)
        }
      })
    })
  },
  methods: {
    isShow (index, data) {
      if (data.length === 1) return true
      if (index === data.length - 1) return true
      const { _format } = this
      const item = data[index]
      const lastItem = data[index + 1]
      if (_format(item.traceTime, '$1-$2-$3') === _format(lastItem.traceTime, '$1-$2-$3')) {
        return false
      }
      return true
    },
    _format (e, rg) {
      return format(e, rg)
    },
    _formatWeek (e) {
      let d = new Date(e).getDay()
      return WEEK_ARR[d]
    },
    _change (num) {
      this.logisticsList = this.allData[num] // 第一条物流信息
      this.logistics = this.logisticsList.logistics // 第一条物流信息
      this.logisticTraceList = this.logistics.logisticTraceList
    },
    addData (index) {
      this.selectItem = index
      this._change(index)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .listtitle
    height 30px
    line-height 30px
    margin-bottom 10px
    border-bottom 1px solid #c2c2c2
  .order
    height 30px
    line-height 30px
    border-bottom 1px solid #c2c2c2
    margin-bottom 10px
    margin-top 20px
    span
      width 100px
      border 1px solid #c2c2c2
      display block
      border-bottom none
      height 30px
      text-align center
      font-size 12px
      background-color #FFFFFF
  .message
      height 30px
      span
        display block
        float left
        height 30px
        line-height 30px
        font-size 12px
      .title
        width 300px
  .change
    height 30px
    line-height 30px
    margin-bottom 20px
    li
      padding 0 10px
      float left
      border 1px solid #c2c2c2
      margin-right 20px
      font-size 12px
      cursor pointer
    .active
      background #00bafa
      border-color #00bafa
      color #fff
  .messageState
    width 40px;
    float left
    margin-top 30px
    li
      width 32px
      height 30px
      position relative
      &::after
        content:''
        width 7px
        height 7px
        background-color #999
        border-radius 50%
        display block
        left 16px
        top 0px
        position absolute
      &::before
        content:''
        width 1px
        height 30px
        background-color #999
        display block
        position absolute
        left 19px
        top 8px
      &:last-child
        &::after
          background-color #4897f9
      &:last-child
        &::before
          background-color #e6ecf2
  .logisticsMessage
      width 100%
      margin 0 auto
      margin-bottom 20px
      background-color #e6ecf2
      overflow hidden
  .logisticsTitle
      height 50px
      line-height 50px
      font-size 14px
      padding-left 20px
      border-bottom 1px solid #c2c2c2
  .messageContent
      li
        height 30px
        line-height 30px
        font-size 12px
        span
          display inline-block
          float left
          height 30px
          line-height 30px
          &.messageContent-time
            margin-right 10px
            color #18191a
          &.messageContent-text
            width 670px
            overflow hidden
            text-overflow ellipsis
            white-space nowrap
            color #616366
  .gray
    &::before
      color #999999
  .util-icon
    font-size 60px
  .transportMessage
      height 80px
      margin:20px 0 20px 0px
      width 92%
      margin-left 8%
      li
        float left
        width 25%
        p
          margin-top 10px
        &:nth-child(3)
          p
            text-indent 3px
        &:nth-child(4)
          p
            text-indent 14px
      .active
        i
          color #4897f9
          &::before
            color #4897f9
        p
          color #4897f9
        ul
          li
            background-color #4897f9

  .util-item-li
      position relative
      .omit
        position absolute
        right 13px
        top 30px
        li
          width 6px
          height 6px
          border-radius 50%
          background-color #999999
          float left
          margin-left 5px
  .messageContent
    overflow hidden
    margin-left 40px
    margin-top 20px
    .messageContent-item
      display block
  </style>
