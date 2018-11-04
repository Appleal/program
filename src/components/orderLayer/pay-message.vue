<template>
  <div>
    <div>
      <el-table style="width: 100%"
                :data="tableData"
                border
                stripe
                size="mini"
                header-row-class-name="element-headerRowClassName">
        <el-table-column v-for="column in columnData"
                         :label="column.label"
                         :width="column.width"
                         :align="column.align"
                         :prop="column.prop"
                         :key="column.prop">
        </el-table-column>
      </el-table>
      <ul class="orderPrice">
        <li>已支付金额：￥{{ payHave }}</li>
        <li>待支付金额：￥{{ paid }}</li>
        <li>订单总金额：￥{{ totalPrice }}</li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button, Table, TableColumn} from 'element-ui'

export default {
  name: 'payMessage',
  data () {
    return {
      payHave: '3164.00',
      paid: '0.00',
      totalPrice: '3164.00',
      columnData: [
        {prop: 'payNum', label: '支付单号', width: '100', align: 'center'},
        {prop: 'payAssociated', label: '关联预付款单号', width: '120', align: 'center'},
        {prop: 'payName', label: '支付名称', width: '70', align: 'center'},
        {prop: 'payWay', label: '支付方式', width: '70', align: 'center'},
        {prop: 'payTime', label: '支付时间', width: '140', align: 'center'},
        {prop: 'payPrice', label: '金额', width: '90', align: 'center'},
        {prop: 'payater', label: '交易流水号', width: '190', align: 'center'}
      ],
      tableData: [{
        payNum: 'DJ007548522',
        payAssociated: '180114143405',
        payName: '定金',
        payWay: '支付宝',
        payTime: '2018-03-02 09:00:40',
        payPrice: '￥300.00',
        payater: '20180331321654875238'
      }, {
        payNum: 'DJ007548522',
        payAssociated: '180114143405',
        payName: '定金',
        payWay: '支付宝',
        payTime: '2018-03-02 09:00:40',
        payPrice: '￥300.00',
        payater: '20180331321654875238'
      }, {
        payNum: 'DJ007548522',
        payAssociated: '180114143405',
        payName: '定金',
        payWay: '支付宝',
        payTime: '2018-03-02 09:00:40',
        payPrice: '￥300.00',
        payater: '20180331321654875238'
      }]
    }
  },
  methods: {
  },
  components: {
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .orderPrice
    height 40px
    line-height 40px
    li
      width 33.33%
      font-size 14px
      float left
      text-indent: 20px
      color #4c4c4c
  </style>
