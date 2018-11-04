<template>
  <c-table-scroll>
    <div class="home-page-left-content">
      <work-table title="销售数据" class="home-page-left-item" style="margin-top: 0;height: 209px">
        <el-row :gutter="10">
          <el-col :span="12">
            <work-data>
              <el-row slot="header">
                <el-col :span="12">
                  <!--<span class="work-data-header-l">今日目标：{{ _formatCurrency(targetAmount) }}（元）</span>-->
                </el-col>
                <el-col :span="12" style="float: right">
                  <div class="work-data-header-r">
                    <router-link to="achievement" class="work-data-header-r">历史数据</router-link>
                  </div>
                </el-col>
              </el-row>
              <div class="work-data-content-c">
                <span class="work-data-icon">
                  <img src="./moneybag.png" alt="订单金额" class="moneybag">
                </span>
                <span>
                  {{ _formatCurrency(totalAmount) }}
                  <strong>元</strong>
                </span>
              </div>
              <div slot="footer">
                <span class="work-data-footer-text">销售订单业绩</span>
              </div>
            </work-data>
          </el-col>
          <el-col :span="12">
            <work-data>
              <el-row slot="header">
                <el-col>
                  <!--<span class="work-data-header-l">今日目标：{{_formatCurrency(targetMinute)}}（分钟）</span>-->
                </el-col>
              </el-row>
              <div class="work-data-content-c">
                <span class="work-data-icon">
                  <img src="./phone.png" alt="通话时长" class="phone">
                </span>
                <span class="phone-num">
                  {{_formatCurrency(realMinute)}}
                  <strong>分钟</strong>
                </span>
              </div>
              <div slot="footer">
                <span class="work-data-footer-text">今日通话时长</span>
              </div>
            </work-data>
          </el-col>
        </el-row>
      </work-table>
      <work-table title="待处理事项"  class="home-page-left-item">
        <el-row :gutter="15" style="margin-top: -10px">
          <el-col :span="8" v-for="item in homeUnfinishWork" :key="item.title">
            <div class="handle-item-li">
              <router-link :to="{path: item.path, query: item.query}" class="handle-item-link">
                {{item.title}}
                <span class="handle-item-num" :class="{ active: item.num }">({{item.num}})</span>
              </router-link>
            </div>
          </el-col>
        </el-row>
      </work-table>
      <work-table title="小工具"  class="home-page-left-item">
        <el-row :gutter="9">
          <el-col v-for="item in utils" :key="item.title" style="width:20%;">
            <div class="util-item-li" @click="homeUtilLinkClick(item)">
              <i class="util-icon" :class="item.class"></i>
              <span>{{item.title}}</span>
            </div>
          </el-col>
        </el-row>
      </work-table>
    </div>
    <div slot="right" style="width: 100%;height: 100%;">
      <ranking class="home-ranking"></ranking>
      <div class="home-message-list">
        <message-list></message-list>
      </div>
    </div>
  </c-table-scroll>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import {Row, Col} from 'element-ui'
import workTable from 'base/work-table/work-table'
import workData from 'base/work-data/work-data'
import cTableScroll from 'base/c-table-scroll/c-table-scroll'
import messageList from 'base/message-list/message-list'
import ranking from 'components/ranking/ranking'
import { formatCurrency } from 'common/js/util'
import { ERR_SUCCESS } from 'api/config'
import { brmOrderGoUrl } from 'api/brm'
import { getDayOrder, getCallTimeToday, getFirstPageUnfinishWork } from 'api/user'

const COMPONENTS_NAME = 'home-page'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      utils: [
        {title: '下定金', class: 'icon-purse', path: '/home/pay'},
        {title: '下订单', class: 'icon-order'},
        {title: '电话授权', class: 'icon-permission', path: '/home/authorize'},
        {title: '批量推送消息', class: 'icon-msg', path: '/home/message'},
        {title: '批量推送任务', class: 'icon-task', path: '/home/task'}
      ],
      targetAmount: '0',
      totalAmount: '0',
      targetMinute: '0',
      realMinute: '0'
    }
  },
  computed: {
    ...mapGetters(['user', 'homeUnfinishWork'])
  },
  created () {
    this.$nextTick(() => {
      this.homeInit()
      // this.getQueryList()
    })
  },
  beforeDestroy () {
    this.queryTimer && clearTimeout(this.queryTimer)
  },
  methods: {
    // getQueryList () {
    //   this.queryTimer = setTimeout(() => {
    //     this.homeInit()
    //     this.getQueryList()
    //   }, 10000)
    // },
    homeInit () {
      this.getDayOrder()
      this._getCallTimeToday()
      this._getFirstPageUnfinishWork()
    },
    homeUtilLinkClick ({title, path}) {
      if (path) {
        this.$router.push({path})
      }
      if (title === '下订单') {
        const brmToken = this.user.brmToken
        brmOrderGoUrl({
          token: brmToken
        })
      }
    },
    _formatCurrency (e) {
      return formatCurrency(e, true)
    },
    getDayOrder () {
      getDayOrder().then(res => {
        if (res.code === ERR_SUCCESS) {
          const Amount = res.data
          this.targetAmount = Amount.targetAmount
          this.totalAmount = Amount.totalAmount
        }
      })
    },
    _getFirstPageUnfinishWork () {
      getFirstPageUnfinishWork().then(res => {
        if (res.code === ERR_SUCCESS && res.data) {
          let homeitems = this.homeUnfinishWork.map(e => {
            return {...e}
          })
          homeitems[0].num = res.data.newAppUser
          homeitems[1].num = res.data.noAnswerTel
          homeitems[2].num = res.data.backOrder
          homeitems[3].num = res.data.payOrder
          homeitems[4].num = res.data.sendOrder
          homeitems[5].num = res.data.incomeOrder
          // homeitems[6].num = res.data.consultantReservationCount
          homeitems[7].num = res.data.todayReservation
          // this.setAppointmentNum(res.data.consultantReservationCount) 赋值给我的预约页面
          // console.log(homeitems)
          this.setHomeUnfinishWork(homeitems) // 复制给首页统计
        }
      })
    },
    _getCallTimeToday () {
      getCallTimeToday().then(res => {
        if (res.code === ERR_SUCCESS) {
          const Amount = res.data
          this.targetMinute = Amount.targetMinute
          this.realMinute = Amount.realMinute
        }
      })
    },
    ...mapMutations({
      setHomeUnfinishWork: 'SET_HOME_UNFINISHWORK'
    })
  },
  components: {
    [Row.name]: Row,
    [Col.name]: Col,
    workTable,
    cTableScroll,
    workData,
    messageList,
    ranking
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.work-data-header-l
  color #808080
.work-data-header-r
  color #7bb0f1
  text-align right
.work-data-content-c
  margin-top 12px
  padding 8px 0
  height 30px
  line-height 30px
  color #b3b3b3
  font-size 30px
  text-align center
  box-sizing content-box
  .work-data-icon
    inline-block-top(middle)
    margin-right 10px
    height 30px
    line-height 30px
    font-size 0
  .moneybag
    width 23px
    height 25px
  .phone
    margin-top -5px
    width 22px
    height 30px
  .phone-num
    color $color-theme
  strong
    font-size $font-size-sm
    color $color-text
.work-data-footer-text
  display block
  padding 9px 0 15px 0
  font-size $font-size-sm
  text-align center
.handle-item-li
  display block
  margin-top 10px
  padding 0 15px
  height 40px
  line-height 40px
  background-color #f2f2f2
  transition background-color 300ms
  &:hover
    background-color #DBDBDB
    .handle-item-link
      color $color-theme
  .handle-item-link
    color #666
    height 100%
    width 100%
    display inline-block
    font-size $font-size-sm
  .handle-item-num
    float right
    font-size $font-size-sm
    color #999
    inline-block-top(middle)
  .handle-item-num.active
    color #e55c5c
.util-item-li
  margin-bottom 9px
  width 100%
  height 100%
  background-color #f2f2f2
  color #757575
  cursor pointer
  &:hover
    color $color-theme
    background-color #DBDBDB
  .util-icon
    display block
    width 100%
    height 74px
    line-height 74px
    font-size 44px
    text-align center
  span
    display block
    padding-bottom 15px
    font-size $font-size-sm
    text-align center
.home-message-list
  position absolute
  padding-left 20px
  top 219px
  right 0
  left 0
  bottom 0
  box-sizing border-box
.home-ranking
  position absolute
  padding-left 20px
  top 0
  right 0
  width 25%
  height 209px
  box-sizing border-box
.home-page-left-item
  margin-bottom 10px
</style>
