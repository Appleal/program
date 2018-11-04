<template>
  <div class="ranking-wrapper">
    <work-table style="height: 209px">
      <div class="ranking-title-wrapper" slot="title">
        <h3 >排行榜</h3>
        <div class="ranking-title-type">
          <span @click="typeChange('week')" :class="{active: type ==='week'}">周</span>
          <strong>|</strong>
          <span @click="typeChange('month')" :class="{active: type ==='month'}">月</span>
        </div>
      </div>
      <ul class="ranking-ul" v-if="havaInfo">
        <li v-for="(item, index) in rankings.slice(0, 3)" :key="index" :class="`rankings-index-${index}`">
          <span class="ranking-no">NO.{{ index+1 }}</span>
          <div class="ranking-user">
            <span class="ranking-name">{{item.name}}</span>
          </div>
          <span class="ranking-performance">¥ {{_formatCurrency(item.amount)}}</span>
        </li>
      </ul>
      <div v-else class="notData">暂无数据</div>
      <a class="ranking-more" @click="watchMore" v-if="havaInfo">查看更多 >></a>
    </work-table>
  </div>
</template>

<script type="text/ecmascript-6">
import {formatCurrency} from 'common/js/util'
import workTable from 'base/work-table/work-table'
import { ERR_SUCCESS } from 'api/config'
import { getSaleSort } from 'api/user.js'
export default {
  data () {
    return {
      type: 'week',
      userType: '1',
      havaInfo: false,
      rankings: []
    }
  },
  created () {
    this._getSaleSort('1')
  },
  methods: {
    watchMore () {
      const { userType } = this
      this.$router.push({path: 'achieveRank', query: {userType: userType}})
    },
    typeChange (e) {
      this.type = e
      this.rankings = []
      if (e === 'week') {
        this.userType = '1'
        this._getSaleSort(this.userType)
      } else {
        this.userType = '2'
        this._getSaleSort(this.userType)
      }
    },
    _formatCurrency (e) {
      return formatCurrency(e, true)
    },
    _getSaleSort (number) {
      getSaleSort({type: number}).then(res => {
        if (res.code === ERR_SUCCESS) {
          if (res.data.data.length > 0) {
            this.rankings = res.data.data.slice(0, 3)
            this.havaInfo = true
          } else {
            this.havaInfo = false
          }
        }
      })
    }
  },
  components: {
    workTable
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.ranking-wrapper
  margin-bottom 10px
  width 100%
  height 209px
  inline-block-top()
  .ranking-title-wrapper
    position relative
    padding 21px 16px 0 16px
    h3
      padding 0
    .ranking-title-type
      position absolute
      top 21px
      right 10px
      width 120px
      height 21px
      line-height 21px
      text-align right
      font-size 0
      span
        margin 0 5px
        height 21px
        font-size $font-size-sm
        cursor pointer
        inline-block-top()
      strong
        font-size $font-size-sm
      .active
        color $color-theme
    &::after
      content ''
      display block
      margin-top 10px
      border-top 1px solid #e6e6e6
  .ranking-ul
    margin -10px 0 -19px 0
    padding 0
    height 123px
    font-size $font-board-nav-text
    li
      padding 2px 0
      height 36px
      line-height 36px
      border-bottom 1px solid #e6e6e6
      font-size 0
      no-wrap()
      &:nth-child(1)
        .ranking-no
          color #c2850f
          background-color #ffc600
        .ranking-performance
          color #cd8700
      &:nth-child(2)
        .ranking-no
          color #797c80
          background-color #ccd2d9
        .ranking-performance
          color #7d858f
    .ranking-no
      margin-right 10px
      width 46px
      height 20px
      line-height 20px
      border-radius 0px 10px 10px 0px
      font-size $font-size-sm
      text-align center
      color #a74418
      background-color #e68e73
      inline-block-top(middle)
    .ranking-user
      height 32px
      font-size $font-size-sm
      inline-block-top(middle)
      .ranking-name
        display block
        height 32px
        line-height 32px
      .ranking-iphone
        display block
        height 16px
        line-height 16px
        color #999
    .ranking-performance
      float right
      font-size $font-size-sm
      color #e07f61
      font-weight 500
      inline-block-top()
  .ranking-more
    display inline-block
    float right
    margin-top 20px
    padding 10px 0
    height 12px
    font-size $font-size-sm
    color $color-theme
    cursor pointer
  .notData
    color: #999999
    font-size: 18px
    text-align: center
    line-height: 130px
</style>
