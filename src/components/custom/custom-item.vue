<template>
  <c-dialog :title="title" @close="goBack" class="element-dialog">
    <div class="layer-wrapper">
      <el-tabs tab-position="left" type="border-card" style="height: 100%;" v-model="title">
        <el-tab-pane name="基本资料" label="基本资料">
          <custom-info v-if="components.info"></custom-info>
        </el-tab-pane>
        <el-tab-pane name="用药安排" label="用药安排">
          <custom-arrange v-if="components.arrange"></custom-arrange>
        </el-tab-pane>
        <el-tab-pane name="跟进记录" label="跟进记录">
          <custom-follow v-if="components.follow"></custom-follow>
        </el-tab-pane>
        <el-tab-pane name="效果反馈" label="效果反馈">
          <custom-feedback v-if="components.feedback"></custom-feedback>
        </el-tab-pane>
        <el-tab-pane name="收货地址" label="收货地址">
          <custom-address v-if="components.address"></custom-address>
        </el-tab-pane>
        <el-tab-pane name="服务提醒" label="服务提醒">
          <custom-task v-if="components.task"></custom-task>
        </el-tab-pane>
        <el-tab-pane name="历史订单" label="历史订单">
          <custom-order-history v-if="components.history"></custom-order-history>
        </el-tab-pane>
        <el-tab-pane name="健康评测" label="健康评测">
          <custom-order-health v-if="components.health"></custom-order-health>
        </el-tab-pane>
      </el-tabs>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import cDialog from 'base/c-dialog/c-dialog'
import {Tabs, TabPane} from 'element-ui'

const component = {
  customArrange: resolve => require(['components/custom/custom-arrange'], resolve),
  customInfo: resolve => require(['components/custom/custom-info'], resolve),
  customFollow: resolve => require(['components/custom/custom-follow'], resolve),
  customFeedback: resolve => require(['components/custom/custom-feedback'], resolve),
  customAddress: resolve => require(['components/custom/custom-address'], resolve),
  customTask: resolve => require(['components/custom/custom-task'], resolve),
  customOrderHistory: resolve => require(['components/custom/custom-order-history'], resolve),
  customOrderHealth: resolve => require(['components/custom/custom-order-health'], resolve)
}

export default {
  data () {
    return {
      title: '基本资料',
      components: {
        info: true,
        arrange: false,
        follow: false,
        feedback: false,
        address: false,
        task: false,
        history: false,
        health: false
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    init () {
      const { type } = this.$route.query
      if (type === 'f' || type === 'fa') {
        this.title = '跟进记录'
        this.components.follow = true
      }
    }
  },
  watch: {
    title () {
      const title = this.title
      switch (title) {
        case '基本资料':
          this.components.info = true
          break
        case '用药安排':
          this.components.arrange = true
          break
        case '跟进记录':
          this.components.follow = true
          break
        case '效果反馈':
          this.components.feedback = true
          break
        case '收货地址':
          this.components.address = true
          break
        case '服务提醒':
          this.components.task = true
          break
        case '历史订单':
          this.components.history = true
          break
        case '健康评测':
          this.components.health = true
          break
        default:
          break
      }
    }
  },
  components: {
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    cDialog,
    ...component
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.layer-wrapper
    width 1060px
    height 460px
    box-sizing border-box
</style>
