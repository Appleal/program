<template>
  <c-dialog :title="title" @close="goBack" class="element-dialog">
    <div class="layer-wrapper">
      <el-tabs tab-position="left" type="border-card" style="height: 100%;" v-model="title">
        <el-tab-pane name="基本资料" label="基本资料">
          <custom-info></custom-info>
        </el-tab-pane>
        <el-tab-pane name="用药安排" label="用药安排">
          <custom-arrange></custom-arrange>
        </el-tab-pane>
        <el-tab-pane name="跟进记录" label="跟进记录">
          <custom-follow></custom-follow>
        </el-tab-pane>
        <el-tab-pane name="效果反馈" label="效果反馈">
          <custom-feedback></custom-feedback>
        </el-tab-pane>
        <el-tab-pane name="收货地址" label="收货地址">
          <custom-address></custom-address>
        </el-tab-pane>
      </el-tabs>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import cDialog from 'base/c-dialog/c-dialog'
import {Tabs, TabPane} from 'element-ui'
import customInfo from 'components/custom/custom-info'
import customFollow from 'components/custom/custom-follow'
import customFeedback from 'components/custom/custom-feedback'
import customAddress from 'components/custom/custom-address'
import customArrange from 'components/custom/custom-arrange'
export default {
  data () {
    return {
      title: '基本资料'
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    }
  },
  components: {
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    customInfo,
    customFollow,
    customFeedback,
    customAddress,
    cDialog,
    customArrange
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
