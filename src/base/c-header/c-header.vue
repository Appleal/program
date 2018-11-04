<template>
  <header>
    <c-logo></c-logo>
    <nav class="c-nav">
      <el-menu  :default-active="homePath"
                mode="horizontal"
                background-color="#4897f9"
                @select="selectPath"
                text-color="#fff"
                active-text-color="#fff">
        <el-menu-item v-for="navList in navLists"
                      :index="navList.name"
                      :key="navList.name"
                      class="c-menu-item">
          <div class="header-label">
            {{navList.name}}
            <div class="header-sup"
            v-show="navList.name === '我的预约' && appointmentNum > 0">
            </div>
          </div>
        </el-menu-item>
      </el-menu>
    </nav>
    <div class="login-area">
      <div class="user-notice" >
        <div class="user-notice-button">
          <el-button v-popover:notice></el-button>
        </div>
        <span class="icon-notice"></span>
        <c-sup
          v-if="noticeList.length > 0"
          :num="noticeList.length"
          style="top: 8px;left: 45px;background-color: #ffa42e;">
        </c-sup>
      </div>
      <a class="user-sculpture">
        <img width="40" height="40" :src="user.portraitUrl">
        <span class="userName">
          {{user.name}}
          <i class="el-icon-caret-bottom"></i>
        </span>
        <i class="myspace_remind"></i>
        <div class="userName-select">
          <el-select v-model="powerSelect" placeholder="请选择">
            <el-option  v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
            </el-option>
          </el-select>
        </div>
      </a>
    </div>
    <el-popover ref="notice"
                placement="bottom"
                width="280"
                trigger="hover">
      <h3 class="notice-header">通知消息</h3>
      <div class="notice-content">
        <div class="notice-scroll-content">
           <c-scroll :data="noticeList">
              <ul>
                <li v-for="(notice, index) in noticeList"
                  :key="notice.id"
                  class="notice-item"
                  @click="handleClick(notice, index)">
                  <span class="notice-mgs">
                    {{notice.noticeContent}}
                  </span>
                  <span class="notice-mgs-time">
                    {{notice.createDate}}
                  </span>
                </li>
              </ul>
            </c-scroll>
        </div>
      </div>
      <div class="notice-footer">
        <a class="notice-footer-link" @click="clearNotice">忽略全部</a>
        <a class="notice-footer-link" @click="allNotice">查看更多</a>
      </div>
    </el-popover>
    <c-dialog
      @close="handleClose"
      :title="noticePopover.noticeTitle"
      v-if="noticePopover.id"
      class="element-dialog">
      <div class="notice-popover">
        <span class="notice-popover-text">{{noticePopover.noticeContent}}</span>
      </div>
    </c-dialog>
  </header>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex'
import {Button, Menu, MenuItem, Select, Option, Popover} from 'element-ui'
import cLogo from 'base/c-logo/c-logo'
import cScroll from 'base/c-scroll/c-scroll'
import cSup from 'base/c-sup/c-sup'
import cDialog from 'base/c-dialog/c-dialog'
import { ERR_SUCCESS } from 'api/config'
import { getFirstPageUnfinishWork, getReservationCount } from 'api/user'
import { getConsultantNoticeList, updateConsultantNoticeInfo } from 'api/message'

const COMPONENTS_NAME = 'c-header'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      pathDefaultActive: '',
      homePath: '首页',
      navLists: [
        {path: '/home', name: '首页'},
        {path: '/custom', name: '客户管理'},
        {path: '/order', name: '订单列表'},
        {path: '/appointment', name: '我的预约'}
        // {path: '/management', name: '账单管理'}
      ],
      powerSelect: '',
      options: [{
        value: 'setting',
        label: '账号设置'
      }, {
        value: 'out',
        label: '退出'
      }],
      noticeList: [],
      noticePopover: {}
    }
  },
  computed: {
    ...mapGetters([
      'isLogin',
      'homeUnfinishWork',
      'user',
      'appointmentNum'
    ])
  },
  created () {
    if (this.isLogin) {
      // this._getFirstPageUnfinishWork()
      this._getReservationCount()
      // 此处修改
      this.selectRouter()
      this._getConsultantNoticeList()
      this.getQueryList()
    }
  },
  beforeDestroy () {
    this.queryTimer && clearTimeout(this.queryTimer)
  },
  methods: {
    clearNotice () {
      if (this.noticeList.length > 0) {
        this.noticeList = []
        updateConsultantNoticeInfo({id: ''}).then(res => {})
      }
    },
    allNotice () {
      if (this.noticeList.length > 0) {
        this.noticeList = []
        updateConsultantNoticeInfo({id: ''}).then(res => {})
      }
      this.$router.push({ path: '/notice' })
    },
    handleClick (item, index) {
      this.noticePopover = item
      setTimeout(() => {
        this.noticeList.splice(index, 1)
        updateConsultantNoticeInfo({id: item.id}).then(res => {})
      }, 400)
    },
    handleClose () {
      this.noticePopover = {}
    },
    getQueryList () {
      this.queryTimer = setTimeout(() => {
        // this._getFirstPageUnfinishWork()
        this._getReservationCount()
        this._getConsultantNoticeList()
        this.getQueryList()
      }, 15000)
    },
    _getConsultantNoticeList () {
      getConsultantNoticeList({
        noticeType: '',
        isRead: '0',
        pageNum: 1,
        pageSize: 10000
      }).then(res => {
        if (res.code === ERR_SUCCESS && res.data) {
          this.noticeList = res.data.dataList
        }
      })
    },
    _getReservationCount () {
      getReservationCount().then(res => {
        if (res.code === ERR_SUCCESS) {
          let homeitems = this.homeUnfinishWork.map(e => {
            return {...e}
          })
          homeitems[6].num = res.data
          this.setAppointmentNum(res.data)
          this.setHomeUnfinishWork(homeitems)
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
    selectRouter () {
      const {path} = this.$route
      if (this.$homePath === path) return
      if (path.indexOf('/home') > -1) {
        this.homePath = '首页'
      } else if (path.indexOf('/payment') > -1 || path.indexOf('/order') > -1) {
        this.homePath = '订单列表'
      } else if (path.indexOf('/chatwindow') > -1 || path.indexOf('/custom') > -1) {
        this.homePath = '客户管理'
      } else if (path.indexOf('/appointment') > -1) {
        this.homePath = '我的预约'
      } else if (path.indexOf('/management') > -1) {
        this.homePath = '账单管理'
      }
    },
    selectPath (index, indexPath) {
      const navLists = this.navLists
      for (let n of navLists) {
        if (n.name === index) {
          this.$router.push({path: n.path})
        }
      }
    },
    ...mapMutations({
      setHomeUnfinishWork: 'SET_HOME_UNFINISHWORK',
      setAppointmentNum: 'SET_APPOINTMENTNUM'
    }),
    ...mapActions(['userOut'])
  },
  watch: {
    powerSelect (newValue, oldValue) {
      if (newValue === '') return
      switch (newValue) {
        case 'setting':
          this.$router.push('/setting')
          break
        case 'out':
          this.userOut()
          // 融云A用户登录，获取A的会话列表之后，退出登录之后，B用户登录，获取B的会话列表，
          // A的会话列表和B的会话列表一样, 所以改为reload，不是跳login路由，尴尬
          window.location.reload()
          break
        default:
          break
      }
      this.powerSelect = ''
    },
    isLogin () {
      if (this.isLogin) {
        this._getReservationCount()
        // this._getFirstPageUnfinishWork()
        // 修改
        this._getConsultantNoticeList()
        this.getQueryList()
      }
    },
    $route () {
      const {path} = this.$route
      if (this.$homePath === path) return
      if (path.indexOf('/home') > -1) {
        this.homePath = '首页'
      } else if (path.indexOf('/payment') > -1 || path.indexOf('/order') > -1) {
        this.homePath = '订单列表'
      } else if (path.indexOf('/chatwindow') > -1 || path.indexOf('/custom') > -1) {
        this.homePath = '客户管理'
      } else if (path.indexOf('/appointment') > -1) {
        this.homePath = '我的预约'
      } else if (path.indexOf('/management') > -1) {
        this.homePath = '账单管理'
      }
    }
  },
  components: {
    [Button.name]: Button,
    [Menu.name]: Menu,
    [MenuItem.name]: MenuItem,
    [Select.name]: Select,
    [Option.name]: Option,
    [Popover.name]: Popover,
    cLogo,
    cDialog,
    cScroll,
    cSup
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

header
  display block
  margin 0
  padding 0
  width auto
  height 50px
  font-size 0
  background-color $color-nav-background
  .c-nav
    inline-block-top()
    .el-menu--horizontal > .el-menu-item
      position relative
      width 122px
      height 50px
      line-height 50px
      text-align center
      &::before
        display block
        content ''
        position absolute
        left 0
        top 50%
        margin-top -12px
        width 1px
        height 30px
        background-color #3f88e0
  .c-menu-item
    font-size $font-size-lg
  .login-area
    margin-right 21px
    float right
    height 50px
    line-height 50px
    text-align center
  .user-notice
    position relative
    margin-right 20px
    width 80px
    height 50px
    line-height 50px
    font-size $font-size-sg
    color $color-background
    transition background-color .3s
    inline-block-top(middle)
    &:hover
      background-color rgb(58,121,199)
    .user-notice-button
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      opacity 0
      z-index $zIndex-brothers
      button
        width 100%
        height 100%
  .user-sculpture
    position relative
    height 33px
    line-height 33px
    inline-block-top(middle)
    &:hover
      .myspace_remind
        opacity 1
    img
      inline-block-top()
      width 33px
      height 33px
      border-radius 50%
      border 0
    .userName
      margin-left 10px
      font-size $font-size-sm
      color $color-background
      inline-block-top()
    .userName-select
      position absolute
      top 0
      left 0
      z-index $zIndex-brothers
      opacity 0
    .el-icon-caret-bottom
      margin-left 10px
    .myspace_remind
      display block
      position absolute
      top -2px
      left -2px
      width 33px
      height 33px
      border 2px solid #fff
      border-radius 50%
      box-sizing content-box
      transition opacity 200ms
      opacity 0
.notice-header
  margin 0 -12px
  padding 0 13px
  height 24px
  line-height 12px
  font-size $font-size-md
  color $color-text
.notice-content
  margin 0 -12px
.notice-scroll-content
  position relative
  height 270px
  ul
    margin 0
    padding 0
    .notice-item
      position relative
      padding 0 15px 0 10px
      border-bottom 1px solid #e6e6e6
      background-color $color-background
      transition background-color .2s
      cursor pointer
      &:hover
        background-color $color-mark
      .notice-mgs,.notice-mgs-time
        display block
        width 279px
        font-size $font-size-sm
        no-wrap()
      .notice-mgs,.notice-mgs-time
        height 32px
        line-height 32px
        color #4d4d4d
      .notice-mgs-time
        height 24px
        line-height 14px
        color #999
.notice-footer
  height 30px
  line-height 30px
  text-align right
  .notice-footer-link
    margin-right 16px
    font-size $font-size-sm
    color $color-theme
    inline-block-top(middle)
    cursor pointer
    &:hover
      opacity .6

.header-label
  position relative
  width 100%
  height 100%
.header-sup
  position absolute
  top 10px
  right 0px
  width 8px
  height 8px
  background-color red
  border-radius 50%
  overflow hidden
.notice-popover
  padding 10px
  .notice-popover-text
    display block
    width 100%
    font-size $font-size-md
    color $color-text
    line-height 1.6
</style>
