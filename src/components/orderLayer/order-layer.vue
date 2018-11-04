<template>
  <c-dialog title="订单详情" @close="goBack">
    <div class="layer-wrapper">
      <el-tabs :tab-position="tabPosition" style="height: 400px;">
        <el-tab-pane label="订单信息" style="height: 400px; overflow-y: auto">
            <order-message></order-message>
        </el-tab-pane>
        <el-tab-pane label="支付信息" style="height: 400px; overflow-y: auto">
          <pay-message></pay-message>
        </el-tab-pane>
        <el-tab-pane label="物流信息" style="height: 400px; overflow-y: auto">
            <logistics-message></logistics-message>
        </el-tab-pane>
        <el-tab-pane label="转售后">
          <after-sale></after-sale>
        </el-tab-pane>
        </el-tabs>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import {Button, Tabs, TabPane, Table, TableColumn, Pagination} from 'element-ui'
import cDialog from 'base/c-dialog/c-dialog'
import orderMessage from './order-message.vue'
import payMessage from './pay-message.vue'
import afterSale from './after-sale.vue'
import logisticsMessage from './logistics-message.vue'

export default {
  data () {
    return {
      tabPosition: 'left'
    }
  },
  mounted () {

  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    change (index) {
      if (index === 0) {
      }
    }
  },
  components: {
    [Button.name]: Button,
    [Tabs.name]: Tabs,
    [TabPane.name]: TabPane,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    cDialog,
    orderMessage,
    payMessage,
    afterSale,
    logisticsMessage
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .layer-wrapper
    width 900px
    padding 20px
    padding-left 0
    box-sizing border-box
    .tab
      width 120px
      float left
      background-color #dadee6
      height 300px
      ul
        padding-top 20px
        li
          height 30px
          text-align center
          line-height 30px
          color #666666
          cursor pointer

        .active
          background-color #ffffff
    .tab-content
      background-color #00bafa
      height 300px

</style>
