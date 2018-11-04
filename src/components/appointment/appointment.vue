<template>
  <c-table-scroll :data="tableData">
    <div class="appointment-list-table-wrapper">
      <div class="appointment-tabs">
        <div class="appointment-tabs-wraapper">
          <ul class="appointment-tabs-list">
            <li class="appointment-tabs-item"
              :class="{active: tabIndex === 0}"
              @click="e => this.tabIndex = 0">预约排班表</li>
            <li class="appointment-tabs-item"
              :class="{active: tabIndex === 1}"
              @click="e => this.tabIndex = 1">预约待确认
              <span class="notice-number" v-if="appointmentNum > 0">
                <c-sup :num="appointmentNum" ></c-sup>
              </span>
            </li>
          </ul>
        </div>
        <div v-if="tabIndex === 0">
          <scheduling-table ref="schedulingTable"></scheduling-table>
          <router-link class="addAppointment" :to="{ path: '/appointment/addAppointment' }">+ 新增预约</router-link>
          <list-table title="预约列表" style="box-shadow: none;">
            <slot slot="query">
              <div class="appointment-query-item element-appointment-radio">
                <span>预约状态：</span>
                <el-radio-group v-model="statusText" size="mini" style="margin-right: 41px;">
                  <el-radio-button label="全部" value=""></el-radio-button>
                  <el-radio-button label="预约成功" value="1"></el-radio-button>
                  <el-radio-button label="预约取消" value="-1"></el-radio-button>
                  <el-radio-button label="已结束" value="2"></el-radio-button>
                </el-radio-group>
              </div>
              <div>
                <span>精准查询：</span>
                <el-input placeholder="请输入客户编号" v-model="brmid" size="mini" style="width: auto;margin-right: 10px;">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-input placeholder="请输入客户姓名" v-model="name" size="mini" style="width: auto;margin-right: 10px;">
                  <i slot="prefix" class="el-input__icon el-icon-search"></i>
                </el-input>
                <el-button size="mini" class="element-button" style="margin-left: 10px;" @click="queryList">查询</el-button>
              </div>
            </slot>
            <div class="appointment-table">
              <el-table style="width: 100%"
                        v-loading="loading"
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
                <el-table-column label="预约日期" align="center" porp="reserveTime">
                  <template slot-scope="scope">
                    <span>{{tableData[scope.$index].reserveDate}} </span>
                  </template>
                </el-table-column>
                <el-table-column label="预约时间" align="center" porp="reserveTime">
                  <template slot-scope="scope">
                    <span>{{timeFormt(tableData[scope.$index].reserveTime)}} </span>
                  </template>
                </el-table-column>
                <el-table-column label="预约状态" align="center" porp="reserveState">
                  <template slot-scope="scope">
                    <span>{{ _reserveStateFormat(tableData[scope.$index].reserveState)}} </span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="150">
                  <template slot-scope="scope">
                    <el-button
                      @click.native.prevent="rowAction('subData', scope.$index, tableData)"
                      class="appointment-columnButton"
                      type="text"
                      size="small"
                    >
                      <span>消息</span>
                    </el-button>
                    <el-button
                      @click.native.prevent="rowAction('cancellation', scope.$index, tableData)"
                      class="appointment-columnButton"
                      type="text"
                      size="small"
                      :class="{active:tableData[scope.$index].reserveState == -1}"
                      :disabled="tableData[scope.$index].reserveState == -1 || tableData[scope.$index].reserveState == 2"
                    >
                    <span>取消预约
                      </span>
                    </el-button>

                    <el-button
                      @click.native.prevent="rowAction('change', scope.$index, tableData)"
                      class="appointment-columnButton"
                      type="text"
                      size="small"
                      :class="{active:tableData[scope.$index].reserveState == -1}"
                      :disabled="tableData[scope.$index].reserveState == -1 || tableData[scope.$index].reserveState == 2"
                    >
                      <span>改约</span>
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="appointment-pagination">
              <div class="appointment-pagination-content">
                  <el-pagination
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="pageSize"
                    :current-page="pageNum"
                    layout="total, sizes, prev, pager, next, jumper"
                    @current-change="(n)=> this.changePage('pageNum', n)"
                    @size-change="(n)=> this.changePage('pageSize', n)"
                    @next-click="(n)=> this.changePage('pageNum', n)"
                    @prev-click="(n)=> this.changePage('pageNum', n)"
                    :total="total">
                  </el-pagination>
              </div>
            </div>
          </list-table>
        </div>
        <scheduling-list v-else></scheduling-list>
      </div>

    </div>
  </c-table-scroll>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations } from 'vuex'
import {
  RadioGroup, RadioButton, Button, Table, TableColumn, Pagination, Input, MessageBox, Message
} from 'element-ui'
import cTableScroll from 'base/c-table-scroll/c-table-scroll'
import listTable from 'base/list-table/list-table'
import { ERR_SUCCESS } from 'api/config'
import schedulingTable from 'components/appointment/scheduling-table'
import schedulingList from 'components/appointment/scheduling-list'
import cSup from 'base/c-sup/c-sup'
import { getBillList } from 'api/reservation'
import { reserveStateFormat } from 'common/js/util'
import {appointMixin} from 'common/js/mixin'

export default {
  data () {
    return {
      loading: false,
      newNotice: false,
      tabIndex: 0,
      active: '',
      pageSize: 10,
      pageNum: 1,
      total: 0,
      status: '',
      statusText: '全部',
      name: '',
      brmid: '',
      cancellationArray: [],
      reserveState: -1,
      id: 0,
      columnData: [
        {prop: 'brmid', label: '客户编号', align: 'center'},
        {prop: 'userName', label: '客户姓名', width: '79', align: 'center'},
        {prop: 'levelShortname', label: '会员等级', width: '79', align: 'center'},
        {prop: 'userType', label: '客户类型', align: 'center'},
        {prop: 'consultantNickName', label: '预约顾问', align: 'center'}
      ],
      tableData: []
    }
  },
  mixins: [appointMixin],
  computed: {
    ...mapGetters([
      'appointmentNum'
    ])
  },
  created () {
    const {add} = this.$route.query
    if (add === '1') {
      this.tabIndex = 1
    }
    this._getBillList('reset')
  },
  methods: {
    changePage (key, num) {
      switch (key) {
        case 'pageSize':
          this.pageSize = num
          this._getBillList()
          break
        case 'pageNum':
          this.pageNum = num
          this._getBillList()
          break
        default:
          break
      }
    },
    _getBillList (type) { // 获取列表数据
      let targetObj
      if (type === 'reset') {
        this.pageNum = 1
        targetObj = this
      } else {
        targetObj = this.targetObj ? this.targetObj : this
      }
      let { status, name, brmid } = targetObj
      const { pageNum, pageSize } = this
      const postObj = { status, name, brmid, pageNum, pageSize }
      this.loading = true
      getBillList({pageNum, pageSize, status, name, brmid}).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.targetObj = postObj
          this.tableData = res.data.dataList
          this.total = res.data.total
        } else {
          Message.error(res.msg)
        }
        this.loading = false
      })
    },
    queryList () {
      this._getBillList('reset')
    },
    _reserveStateFormat (e) {
      return reserveStateFormat(e)
    },
    rowAction (type, rowIndex, row) {
      const appUserId = row[rowIndex].appUserId
      const id = row[rowIndex].resevationId
      switch (type) {
        case 'subData':
          // this.$router.push({path: '/appointment/item', query: {tid: appUserId}})
          this.$router.push({name: 'chatwindow', params: {tid: 'a' + appUserId}})
          break
        case 'cancellation': // 取消预约
          this.$router.push({path: '/appointment/cancel', query: {id: id}})
          break
        case 'change':
          this.$router.push({
            path: '/appointment/edit',
            query: { id }
          })
          break
        default:
          break
      }
    },
    timeFormt (i) {
      i = Number(i)
      return `${i}:00-${i + 1}:00`
    },
    ...mapMutations({setAppointmentNum: 'SET_APPOINTMENTNUM'})
  },
  watch: {
    brmid (value) {
      this.brmid = value.replace(' ', '')
    },
    name (value) {
      this.name = value.replace(' ', '')
    },
    $route () {
      const { path } = this.$route
      if (path === '/appointment') {
        this._getBillList()
        this.$refs.schedulingTable && this.$refs.schedulingTable._getReservationList()
      }
    },
    statusText (e) {
      const s = this.statusText
      switch (s) {
        case '预约成功':
          this.status = 1
          break
        case '预约取消':
          this.status = -1
          break
        case '已结束':
          this.status = 2
          break
        default:
          this.status = ''
          break
      }
      this.queryList()
    },
    appointmentNum () {
      if (this.appointmentNum > 1) {
        this._getBillList()
      }
    }
  },
  components: {
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton,
    [Button.name]: Button,
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [Pagination.name]: Pagination,
    [Input.name]: Input,
    cTableScroll,
    MessageBox,
    Message,
    listTable,
    schedulingTable,
    schedulingList,
    cSup
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.appointment-list-table-wrapper
  position relative
  bg-box-shadow()
  .addAppointment
    position absolute
    top 54px
    right 20px
    height 50px
    line-height 50px
    color $color-theme
    font-size $font-size-sm
.appointment-query-item
  padding-bottom 10px
  .el-radio-button__inner
    padding-top 5px
    padding-bottom 5px
.appointment-table
  margin-top 10px
  padding 0 15px
  .authorize-no
    color #ff3333
.appointment-pagination
  margin 21px 0
  text-align right
  .appointment-pagination-content
    margin-right 20px
    inline-block-top()
.appointment-columnButton.el-button+.el-button
  position relative
  margin-left 0
  &::before
    content ''
    margin 0 4px
    width 1px
    height 12px
    background-color #898989
    inline-block-top(middle)
.appointment-tabs
  position relative
  width 100%
  background-color $color-background
  overflow hidden
  .appointment-tabs-wraapper
    margin 0 20px
    border-bottom 1px solid #ccc
  .appointment-tabs-list
    margin 20px 0 0 20px
    width 242px
    height 34px
    font-size 0
    border-top 1px solid #ccc
    border-right 1px solid #ccc
    .appointment-tabs-item
      position relative
      width 120px
      height 34px
      line-height 34px
      color $color-text
      font-size $font-size-sm
      text-align center
      border-left 1px solid #ccc
      background-color $color-background
      inline-block-top()
      cursor pointer
      .notice-number{
        position absolute
        top 2px
      }
      &.active
        padding-bottom 1px
</style>
