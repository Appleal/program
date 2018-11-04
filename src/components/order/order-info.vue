<template>
  <c-dialog :title="title" @close="goBack" class="element-dialog">
    <div class="layer-wrapper">
      <el-tabs tab-position="left" type="border-card" style="height: 100%;" v-model="title">
        <el-tab-pane label="订单信息" name="订单信息" style="height: 430px; overflow-y: auto">
          <order-message></order-message>
        </el-tab-pane>
        <!--<el-tab-pane label="客户量表" name="客户量表" style="height: 430px; overflow-y: auto">-->
          <!--<order-scale></order-scale>-->
        <!--</el-tab-pane>-->
        <el-tab-pane label="物流信息" name="物流信息" style="height: 430px; overflow-y: auto">
          <logistics-message></logistics-message>
        </el-tab-pane>
      </el-tabs>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import cDialog from 'base/c-dialog/c-dialog'
import {Tabs, TabPane, Button} from 'element-ui'
import orderMessage from './order-message.vue'
import orderScale from './order-scale.vue'
import logisticsMessage from './logistics-message.vue'

export default {
  data () {
    return {
      title: '订单信息'
    }
  },
  created () {
    const {state} = this.$route.query
    if (state === 'w') {
      this.title = '物流信息'
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
    [Button.name]: Button,
    cDialog,
    orderMessage,
    orderScale,
    logisticsMessage
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
