<template>
  <div>
    <p class="order"><span>基本信息</span></p>
    <div>
      <ul class="basicMessage message">
        <li>姓名：{{ message.orderNo }}</li>
        <li>性别：{{ message.orderTitle }}</li>
        <li>年龄：{{ message.createDate }}</li>
        <li>订单编号：{{ message.receiver }}</li>
        <li style="width: 100%">身份证号：{{ message.owner }}</li>
      </ul>
    </div>
    <p class="order"><span>健康史</span></p>
    <div>
      <ul class="basicMessage">
        <li>疾病史及手术史：{{ message.orderNo }}</li>
        <li>过敏史：{{ message.orderTitle }}</li>
        <li>痛风：{{ message.createDate }}</li>
        <li>血糖（BS）：{{ message.receiver }}</li>
        <li>高压：{{ message.owner }}</li>
        <li>低压：：{{ message.stateName }}</li>
        <li style="width: 100%">心肝肾功能：￥{{ message.payableAmount }}</li>
        <li style="width: 100%">首卖已解决的问题：￥{{ message.paid }}</li>
        <li>目前存在的问题：{{ message.orderNo }}</li>
        <li>主要症状：{{ message.orderTitle }}</li>
        <li>精液情况：{{ message.createDate }}</li>
        <li>舌苔：{{ message.receiver }}</li>
        <li>头晕、乏力、四肢麻木：{{ message.owner }}</li>
        <li>急躁易怒、失眠多梦：{{ message.stateName }}</li>
        <li>怕冷，手脚冰凉，四肢腰部冷痛：{{ message.receiver }}</li>
        <li>手心发热：{{ message.receiver }}</li>
        <li>口干咽燥，容易上火：{{ message.receiver }}</li>
        <li>备注：{{ message.receiver }}</li>
      </ul>
    </div>
  <div>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button, Table, TableColumn} from 'element-ui'
import { getOrderdetail } from 'api/placeOrder'
import { ERR_SUCCESS } from 'api/config'
import { isNull } from 'common/js/util'
export default {
  name: 'orderMessage',
  data () {
    return {
      combined: 0,
      message: {

      },
      columnData: [
        {prop: 'name', label: '产品信息', align: 'center'},
        {prop: 'price', label: '单价', align: 'center'},
        {prop: 'number', label: '数量', align: 'center'},
        {prop: 'ptypeName', label: '产品类型', align: 'center'}
      ],
      tableData: []
    }
  },
  created () {
    this.$nextTick(() => {
      const {tid} = this.$route.query
      if (isNull(tid)) return
      getOrderdetail({id: tid}).then((res) => { // 获取账单详情用户信息
        if (res.code === ERR_SUCCESS) {
          this.message = res.data
          const { goodsList, logisticsList } = res.data
          this.tableData = goodsList
          this.track = logisticsList
          this.totalPrice(goodsList)
        }
      })
    })
  },
  methods: {
    totalPrice (goodsList) {
      let totalMoney = 0
      goodsList.forEach(e => {
        totalMoney += e['price'] * e['number']
      })
      this.combined = totalMoney
    }
  },
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"
  .order
    height 30px
    line-height 30px
    border-bottom 1px solid #c2c2c2
    margin-bottom 10px
    span
      width 100px
      border 1px solid #c2c2c2
      display block
      border-bottom none
      height 30px
      text-align center
      font-size 12px
      background-color #FFFFFF
  .basicMessage
    background-color #FFFFFF
    overflow hidden
    margin-bottom 20px
    li
      width 50%
      float left
      height 40px
      line-height 40px
      border-bottom 1px solid #FFFFFF
      font-size 12px
      text-align left
      text-indent 30px
  .message
    li
      float left
      width 25%
  .combined
    height 40px
    line-height 40px
    border 1px solid #ebeef5
    boder-top none
    span
      float right
      font-size 12px
      margin-right 20px
</style>
