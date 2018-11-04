<template>
    <div class="logistics">
     <p class="message"><span class="title">快递单号：{{ orderNum }}</span><span class="details">快递公司：{{ company }}</span></p>
     <p class="message"><span class="title">收货人：{{ people }}</span><span class="details">收货地址：{{ address }}</span></p>
     <p class="order"><span>物流详情</span></p>

      <div>
        <ul class="transportMessage">
          <li class="">
            <div class="util-item-li">
              <i class="util-icon icon-collectMaterials active"></i>
              <p class="active">待揽件</p>
              <ul class="omit active">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="util-item-li">
              <i class="util-icon icon-trident active"></i>
              <p class="active">运输中</p>
              <ul class="omit">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="util-item-li">
              <i class="util-icon icon-delivery"></i>
              <p>派送中</p>
              <ul class="omit">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </li>
          <li>
            <div class="util-item-li">
              <i class="util-icon gray icon-signFor"></i>
              <p>签收</p>
            </div>
          </li>
        </ul>
        <div class="logisticsMessage">
          <p class="logisticsTitle">运输中</p>
          <div class="messageState">
                <li v-for="(item,index) in 6" class="round" :key="index">

                </li>
          </div>
          <ul class="messageContent">
            <li><span class="dayTime"></span><span class="week"></span> <span class="data">19:07:31     广东省广州市天河区东圃公司 已收入</span></li>
            <li><span class="dayTime"></span><span class="week"></span> <span class="data">06:20:31     广州转运中心公司 已发出,下一站 广东省广州市天河区东圃</span></li>
            <li><span class="dayTime">2018-04-03</span><span class="week">周二</span> <span class="data">02:03:00     广州转运中心公司 已收入</span></li>
            <li><span class="dayTime"></span><span class="week"></span> <span class="data">23:32:09     广东省广州市白云区三元里公司 已发出,下一站 广州转运中心</span></li>
            <li><span class="dayTime"></span><span class="week"></span> <span class="data">>23:28:19     广东省广州市白云区三元里公司 已打包</span></li>
            <li><span class="dayTime">2018-04-02</span><span class="week">周一</span> <span class="data">10:23:27     已发货</span></li>
          </ul>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'payMessage',
  data () {
    return {
      orderNum: '98765432',
      company: '顺丰快递',
      people: '王望',
      address: '广东省广州市天河区车陂东路112号'
    }
  },
  methods: {
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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
      .details
        width 400px
  .messageState
    width 40px;
    float left
    margin-top 26px
    li
      width 32px
      height 32px
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
      &:first-child
        &::after
          background-color #4897f9
      &:last-child
        &::before
          background-color #e6ecf2
  .logisticsMessage
      width 760px
      margin 0 auto
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
        float left
        height 30px
        line-height 30px
        font-size 12px
        span
          display inline-block
          float left
          height 30px
          line-height 30px
        .dayTime
          width 100px
          color #18191a
        .week
          width 100px
          color #18191a
        .data
          width 400px
          color #616366
  .active
    color #4897f9
    &::before
      color #4897f9
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
  .util-item-li
      position relative
      .omit
        position absolute
        right 6px
        top 30px
        li
          width 6px
          height 6px
          border-radius 50%
          background-color #999999
          float left
          margin-left 5px
      .active
         li
           background-color #4897f9
  .messageContent
    overflow hidden
    margin-left 40px
    margin-top 20px
  </style>
