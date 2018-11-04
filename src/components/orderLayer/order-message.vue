<template>
  <div>
    <p class="order"><span>基本信息</span></p>
    <div>
      <ul class="basicMessage">
        <li v-for="item in basicMessage" :key="item.message">
          {{ item.message }}
        </li>
      </ul>
    </div>
    <p class="order"><span>产品信息</span></p>
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
      <p class="combined">
        <span>产品总价：￥{{ combined }}</span>
      </p>
    </div>
  <div>
  <p class="order" style="margin-top: 20px" ><span>订单轨迹</span></p>
    <el-table style="width: 100%"
              :data="track"
              border
              stripe
              size="mini"
              header-row-class-name="element-headerRowClassName">
      <el-table-column v-for="column in columnTrack"
                       :label="column.label"
                       :width="column.width"
                       :align="column.align"
                       :prop="column.prop"
                       :key="column.prop">
      </el-table-column>
    </el-table>
  </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button, Table, TableColumn} from 'element-ui'

export default {
  name: 'orderMessage',
  data () {
    return {
      combined: '100000',
      basicMessage: [
        {'message': '订单编号：Y007548790'},
        {'message': '订单金额：￥3164.00'},
        {'message': '订单状态：已签收'},
        {'message': '关联订单：-'},
        {'message': '下单时间：2018-03-02 15:00:21'},
        {'message': '下单客户：王望'},
        {'message': '方案名称：补肾强身方案'},
        {'message': '已支付：￥2665.00'},
        {'message': '资料所有人：林雪峰'}
      ],
      columnData: [
        {prop: 'productMsg', label: '产品信息', width: '200', align: 'center'},
        {prop: 'productPrice', label: '单价', width: '200', align: 'center'},
        {prop: 'productNum', label: '数量', width: '190', align: 'center'},
        {prop: 'productType', label: '产品类型', width: '190', align: 'center'}
      ],
      tableData: [{
        productMsg: '必邦牌必邦胶囊',
        productPrice: '￥533.00',
        productNum: 'x3 [盒]',
        productType: '保健品'
      }, {
        productMsg: '玛卡片',
        productPrice: '￥533.00',
        productNum: 'x3 [盒]',
        productType: '保健品'

      }, {
        productMsg: '桑娃补肾丸',
        productPrice: '￥533.00',
        productNum: 'x1 [盒]',
        productType: 'OTC药品'
      }, {
        productMsg: '松露酒',
        productPrice: '￥0.00',
        productNum: 'x1 [盒]',
        productType: '赠品'
      }],
      columnTrack: [
        {prop: 'trackNum', label: 'No', width: '50', align: 'center'},
        {prop: 'orderNum', label: '订单编号', width: '100', align: 'center'},
        {prop: 'orderType', label: '订单状态', width: '100', align: 'center'},
        {prop: 'handleBranch', label: '处理部门', width: '100', align: 'center'},
        {prop: 'handlePeople', label: '处理人员', width: '140', align: 'center'},
        {prop: 'productDate', label: '处理日期', width: '164', align: 'center'},
        {prop: 'productType', label: '产品类型', width: '120', align: 'center'}
      ],
      track: [{
        trackNum: 'No',
        orderNum: 'Y007548790',
        orderType: '待支付',
        handleBranch: '壹健康推广部',
        handlePeople: '刘兵[LJK02000]',
        productDate: '2018-03-02 17:00:00',
        productType: '新开订单'
      }, {
        trackNum: 'No',
        orderNum: 'Y007548790',
        orderType: '待支付',
        handleBranch: '壹健康推广部',
        handlePeople: '刘兵[LJK02000]',
        productDate: '2018-03-02 17:00:00',
        productType: '新开订单'
      }]
    }
  },
  methods: {
    rowAuthorizing (index, row) {
      row[index].authorize = !row[index].authorize
    },
    rowAction (index, bottoms, rowIndex, row) {
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
      width 33.3%
      float left
      height 40px
      line-height 40px
      border-bottom 1px solid #FFFFFF
      font-size 12px
      text-align center
      background-color #e6ecf2
      &:nth-child(3n-1)
        background-color #dae5f2
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
