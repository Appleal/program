<template>
  <div class="scheduling-table-wrapper">
    <div class="scheduling-table-header">
      <span class="scheduling-date-prev el-icon-caret-left" @click="handleClick('prev')"></span>
      <div class="scheduling-date-content">
        {{schedulingDate}}
        <div class="scheduling-date-input">
          <el-date-picker :clearable="false"
                          value-format="yyyy-MM-dd"
                          v-model="pickerTime">
          </el-date-picker>
        </div>
      </div>
      <span class="scheduling-date-next el-icon-caret-right" @click="handleClick('next')"></span>
    </div>
    <div class="scheduling-table-content">
      <el-table style="width: 100%"
                :data="tableData"
                border
                size="mini"
                @cell-click="addAppointment"
                header-row-class-name="element-headerRowClassName">
        <el-table-column v-for="column in columnData"
          :class-name="columnClickClass(column)"
          :label="column.label"
          :width="column.width"
          :align="column.align"
          :prop="column.prop"
          :key="column.value"
          :render-header="renderHeader">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Table, TableColumn, DatePicker, Message } from 'element-ui'
import { format, isNull } from 'common/js/util'
import { ERR_SUCCESS } from 'api/config'
import { getReservationList } from 'api/reservation'

const COMPONENTS_NAME = 'scheduling-table'
const TABLE_COLUMN = 'display:block;padding: 0;width:100%;line-height:16px;text-align:center;'
const PROPS_ARR = ['sun', 'mon', 'tue', 'web', 'thu', 'fri', 'sat']
const WEEK_ARR = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      tableData: [],
      time: new Date(),
      pickerTime: new Date()
    }
  },
  computed: {
    schedulingDate: function () {
      return format(this.time, '$1年$2月')
    },
    columnData () {
      let _columnData = []
      let time = new Date(this.time.getTime())
      time.setDate(time.getDate() - time.getDay())
      const title = {prop: 'title', label: '顾问排班表', width: '140', align: 'center'}
      _columnData.push(title)
      for (let i = 0; i < 7; i++) {
        const prop = PROPS_ARR[i]
        const label = `${WEEK_ARR[i]}<br/>${format(time, '$2-$3')}`
        const value = format(time, '$1-$2-$3')
        _columnData.push({prop, label, align: 'center', value})
        time.setDate(time.getDate() + 1)
      }
      return _columnData
    }
  },
  created () {
    this.$nextTick(() => {
      this._getReservationList()
    })
  },
  methods: {
    columnClickClass (c) {
      if (c.prop === 'title') return ''
      if (format(c.value) === format(new Date())) return 'today'
      if (new Date(c.value).getTime() < new Date().getTime()) return 'lastday'
      return 'newday'
    },
    _getReservationList () {
      const time = format(this.time, '$1-$2-$3')
      getReservationList({ time }).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.tableData = this.getTableData(res.data.list)
        } else {
          Message.error(res.msg)
        }
      })
    },
    handleClick (e) {
      let _d = new Date(this.time)
      if (e === 'next') {
        _d.setDate(_d.getDate() + 7)
      } else {
        _d.setDate(_d.getDate() - 7)
      }
      this.time = _d
      this.tableData = []
      this._getReservationList()
    },
    addAppointment (row, column) {
      const index = PROPS_ARR.indexOf(column.property)
      const item = row[`${column.property}Obj`]
      if (index > -1) {
        if (item && !isNull(item.id)) {
          let { id } = item
          this.$router.push({path: '/appointment/info',
            query: { id }})
        } else {
          let reserveTime = row.reserveTime
          let reserveDate = this.columnData[index + 1].value
          if (format(reserveDate) < format(new Date())) {
            return Message.error('预约时间不能小于今天！')
          }
          if (format(reserveDate) === format(new Date()) && new Date().getHours() >= reserveTime) {
            return Message.error('预约时间不能小于当前时间！')
          }
          this.$router.push({path: '/appointment/addAppointment', query: { reserveDate, reserveTime }})
        }
      }
    },
    renderHeader (createElement, { column, _self }) {
      let label = column.label
      let labelArr = label.split('<br/>')
      if (labelArr.length > 1) {
        return createElement('div', {style: TABLE_COLUMN}, [
          createElement('span', {style: TABLE_COLUMN}, [labelArr[0]]),
          createElement('span', {style: TABLE_COLUMN}, [labelArr[1]])
        ])
      } else {
        return label
      }
    },
    getTableData (arr) {
      let tableMap = this.getWorkTime()
      for (let item of arr) {
        const reserveTime = item.reserveTime
        if (tableMap.has(reserveTime)) {
          let t = tableMap.get(reserveTime)
          const reserveDate = new Date(item.reserveDate)
          const propsKey = PROPS_ARR[reserveDate.getDay()]
          t[propsKey] = item.appUserName
          t[`${propsKey}Obj`] = {
            id: item.id,
            appUserId: item.appUserId,
            consultantId: item.consultantId,
            appUserName: item.appUserName,
            reserveDate: item.reserveDate,
            reserveTime: item.reserveTime
          }
        }
      }
      return [...tableMap].map(e => e[1])
    },
    getWorkTime () {
      let map = new Map()
      for (let i = 10; i < 22; i++) {
        if (i !== 12 || i !== 13) {
          map.set(i, {title: `${i}:00-${i + 1}:00`, reserveTime: i})
        }
      }
      return map
    }
  },
  watch: {
    pickerTime () {
      this.time = new Date(this.pickerTime)
      this._getReservationList()
    }
  },
  components: {
    [Table.name]: Table,
    [TableColumn.name]: TableColumn,
    [DatePicker.name]: DatePicker
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.scheduling-table-wrapper
  width 100%
  height 100%
  & >>> .today
    opacity 1
    color $color-theme
  & >>> .lastday
    opacity 0.6
  & >>> .newday
    opacity 1
    color #333
  .scheduling-table-header
    margin 0 15px
    height 49px
    line-height 49px
    font-size 0
    text-align center
    .scheduling-date-prev,
    .scheduling-date-content,
    .scheduling-date-next
      height 49px
      line-height 49px
      background-color $color-background
      font-size $font-size-md
      text-align center
      inline-block-top()
    .scheduling-date-prev,
    .scheduling-date-next
      width 49px
      transition background-color 0.2s
      &:hover
        background-color $color-mark
    .scheduling-date-content
      position relative
      width 140px
      overflow hidden
    .scheduling-date-input
      position absolute
      top 0
      left 0
      width 100px
      height 49px
      z-index $zIndex-brothers
      opacity 0
  .scheduling-table-content
    padding 0 15px

</style>
