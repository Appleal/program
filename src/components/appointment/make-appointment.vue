<template>
  <c-dialog title="安排预约" @close="goBack">
    <div class="add-appointment-wrapper">
      <div class="add-appointment-item">
        <label>客户姓名：</label>
        {{appointment.appUserName}}
      </div>
      <div class="add-appointment-item">
        <label>选择时间：</label>
        <el-date-picker :picker-options="orderEndDateOptions" size="mini" v-model="appointment.reserveDate" style="width: 135px;"></el-date-picker>
        <el-select
          v-model="appointment.reserveTime" size="mini" placeholder="请选择预约时间">
          <el-option v-for="(item, index) in reserveTimeLsit"
            :key="index" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="add-appointment-item">
        <label>选择顾问：</label>
        <el-select v-model="appointment.consultantId" size="mini">
          <el-option v-for="(item, index) in consultantList"
            :key="index" :label="item.name" :value="item.consultantId">
          </el-option>
        </el-select>
      </div>
      <div class="add-appointment-item add-appointment-button">
        <el-button type="info" size="small" @click="goBack">取消</el-button>
        <el-button size="small"
          :loading="loading"
          class="element-button"
          @click="make">确定</el-button>
      </div>
    </div>

  </c-dialog>
</template>

<script type="text/ecmascript-6">
import {Button, Input, Select, Option, DatePicker, Message} from 'element-ui'
import cDialog from 'base/c-dialog/c-dialog'
import { format, isNull } from 'common/js/util'
import { ERR_SUCCESS } from 'api/config'
import { getConsultantInfoByAppUserId, getReservation, addReservation } from 'api/reservation'

const GET_RESRVETIME_LIST = (function () {
  let arr = []
  for (let i = 10; i < 22; i++) {
    if (i !== 12 || i !== 13) {
      arr.push({
        label: `${i}:00-${i + 1}:00`,
        value: String(i)
      })
    }
  }
  return arr
})()

export default {
  data () {
    return {
      loading: false,
      appointment: {
        id: '',
        appUserId: '',
        appUserName: '',
        reserveTime: '',
        reserveDate: new Date(),
        consultantId: ''
      },
      reserveTimeLsit: GET_RESRVETIME_LIST,
      consultantList: [],
      orderEndDateOptions: {
        disabledDate (time) {
          const d = new Date()
          if (format(d) === format(time)) {
            return false
          }
          return time.getTime() < d.getTime()
        }
      }
    }
  },
  computed: {
    dayComputed () {
      return format(this.reserveDate, '$3日')
    }
  },
  created () {
    this.$nextTick(() => {
      const { id } = this.$route.query
      this._getReservation(id)
    })
  },
  methods: {
    make () {
      if (this.loading) return
      const {id, reserveDate, reserveTime, consultantId} = this.appointment
      if (isNull(reserveDate) || isNull(reserveTime)) {
        Message.error('请选择时间！')
        return
      }
      if (isNull(consultantId)) {
        Message.error('请选择顾问！')
        return
      }
      this.loading = true
      addReservation({
        id,
        reserveDate: format(reserveDate, '$1-$2-$3 $4:$5:$6'),
        reserveTime,
        consultantid: consultantId
      }).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.$router.replace({path: '/appointment', query: {edit: '1'}})
          Message({
            message: '安排成功！',
            type: 'success'
          })
        } else {
          Message.error(res.msg)
        }
        this.loading = false
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    _format (e) {
      return format(e)
    },
    _getReservation (id) {
      getReservation({ id }).then(res => {
        if (res.code === ERR_SUCCESS) {
          const {
            id, appUserId, consultantId, reserveDate, reserveTime, appUserName
          } = res.data
          this.appointment.id = id
          this.appointment.consultantId = consultantId === 0 ? '' : consultantId
          this.appointment.appUserId = appUserId
          this.appointment.appUserName = String(appUserName)
          this.appointment.reserveDate = reserveDate && new Date(reserveDate)
          this.appointment.reserveTime = reserveTime && String(reserveTime)
          this._getConsultantInfoByAppUserId(appUserId)
        } else {
          Message.error(res.msg)
        }
      })
    },
    _getConsultantInfoByAppUserId (appUserId) {
      getConsultantInfoByAppUserId(appUserId).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.consultantList = res.data.list
        } else {
          Message.error(res.msg)
        }
      })
    }
  },
  watch: {
  },
  components: {
    [DatePicker.name]: DatePicker,
    [Select.name]: Select,
    [Option.name]: Option,
    [Input.name]: Input,
    [Button.name]: Button,
    [Message.name]: Message,
    cDialog
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.add-appointment-wrapper
  padding 10px 15px
  width 420px
  .add-appointment-item
    padding 10px 0
    height 28px
    line-height 28px
    label
      font-size $font-size-md
      color $color-text
  .add-appointment-button
    text-align right
    button
      margin-right 15px
      width 105px
  .add-appointment-line
    margin 15px 0
    width 100%
    border-top 1px solid #dcdcdc
</style>
