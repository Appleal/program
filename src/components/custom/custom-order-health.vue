<template>
  <div class="custom-feedback-dialog">
    <div class="feedback-header">
      <c-title>
        <p slot="title">健康评测</p>
      </c-title>
    </div>
    <div style="height: 390px; overflow-y: auto">
      <c-scroll :data="goodList">
        <div v-if="goodList.length > 0">
          <div class="health-wapper" :class="{fisrtG: index === 0}" v-loading="loading" v-for="(list, index) in goodList" :key="index">
            <div class="health-item">
              <ul>
                <li>
                  <label>测评症状：</label> {{list.labelName}}
                </li>
                <li>
                  <label>测评结果：</label> {{list.grade}}{{list.labelName}}
                </li>
                <li>
                  <label>测评时间：</label> {{list.createTime}}
                </li>
              </ul>
            </div>
            <div class="health-details">
              <div class="details">评测详情：</div>
              <ul>
                <li v-for="item in list.resultDetail" :key="item.subject">
                  <label>{{item.subject}}</label>
                  <span>{{item.answer}}</span>
                </li>
              </ul>
            </div>
            <div class="health-price" >
              <div class="shop">推荐标品：</div>
              <div class="has-goods" v-if="list.goodStandard.name">
                <div class="goods">
                  <div>
                    <span>{{list.goodStandard.name}}</span>
                    <label>¥{{_formatCurrency(list.goodStandard.price)}}</label>
                  </div>
                  <ul>
                    <li v-for="(goods, index) in list.goodStandard.goodsList" :key="index">
                      <div><img :src="goods.picUrl"/></div>
                      <div class="text" :title="goods.goodsName">{{goods.goodsName}}</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-else style="margin-top: 8px; float: left">
                暂无数据
              </div>
            </div>
          </div>
        </div>
        <div class="noData" v-else>暂无数据</div>
      </c-scroll>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Input, Button, RadioButton, RadioGroup, Cascader, DatePicker, Pagination, Table, TableColumn } from 'element-ui'
import cScroll from 'base/c-scroll/c-scroll'
import cTitle from 'base/c-title/c-title'
import {formatCurrency} from 'common/js/util'
import { ERR_SUCCESS } from 'api/config'
import { getHealthyEvaluation } from 'api/placeOrder.js'
export default {
  data () {
    return {
      loading: true,
      goodList: []
    }
  },
  created () {
    const {tid} = this.$route.query
    this._getOrder(tid)
  },
  computed: {
  },
  methods: {
    _formatCurrency (e) {
      return formatCurrency(e)
    },
    _getOrder (aid) {
      getHealthyEvaluation({aid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.goodList = res.data
          this.loading = false
        }
      })
    }
  },
  components: {
    [Table.name]: Table,
    [DatePicker.name]: DatePicker,
    [RadioButton.name]: RadioButton,
    [RadioGroup.name]: RadioGroup,
    [Pagination.name]: Pagination,
    [TableColumn.name]: TableColumn,
    [Input.name]: Input,
    [Cascader.name]: Cascader,
    [Button.name]: Button,
    cScroll,
    cTitle
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.custom-feedback-dialog
  position relative
  width 100%
  height 430px
  .noData
    font-size 14px
    line-height 340px
    text-align center
  .health-wapper
    background #f2f2f2
    padding 6px 10px
    margin-top 20px
    overflow hidden
  .fisrtG
    margin-top 0px
  &:last-child
    margin-bottom 0
  .health-item
    height 40px
    line-height 40px
    li
      height 40px
      line-height 40px
      float left
      width 200px
      font-size 14px
      font-weight bold
      label
        width 70px
        display inline-block
        font-size 14px
        font-weight bold
      &:first-child
        width 380px
      &:last-child
        width 300px
        text-align right
  .health-details
    .details
      font-size 14px
      font-weight bold
      line-height 24px
      width 70px
      float left
    ul
      margin-left 70px
      font-size 14px
      color #999
      li
        height 26px
        line-height 26px
      label
        width 60%
        float left
        line-height 24px
        color #333
      span
        width 40%
        float left
        color #999
        line-height 24px
  .health-price
    font-size 14px
    .shop
      font-weight bold
      line-height 30px
      width 70px
      float left
    .no-goods
      font-weight bold
      margin-left 70px
      line-height 30px
    .has-goods
      margin-left 70px
      margin-top 10px
      .goods
        overflow hidden
        padding 4px
        padding-top 0px
        display inline-block
        background #ffffff
        border 1px solid #c2c2c2
        span
          float left
        label
          float right
        &>div
          height 30px
          line-height 30px
          padding 0 13px
        li
          img
            height 80px
            display inline-block
            width 120px
          text-align center
          width 150px
          float left
          font-size 12px
        .text
          line-height 20px
          height 20px
          overflow hidden
          white-space nowrap
          text-overflow ellipsis
          width 120px
          margin 0 auto
          text-align center
  .task-list
    font-size 14px
    margin 20px 0px
  .address-item
    padding 4px 0
    width 100%
    font-size 0
    .address-item-label
      padding-right 10px
      width 140px
      height 35px
      line-height 35px
      color $color-text
      font-size $font-size-sm
      text-align right
      inline-block-top()
      strong
        color #ff8d8d
    .address-item-input
      width 460px
      inline-block-top()
  .address-button
    padding 10px 0
    width 600px
    text-align right
  .custom-address-button-wrapper
    width 100%
    font-size 0
    .custom-address-button
      margin-right 5px
      padding 0 5px
      height 30px
      line-height 30px
      color $color-theme
      font-size $font-size-sm
      cursor pointer
      inline-block-top()
      &:hover
        color #1776ea
      &:active
        color #558acc

</style>
