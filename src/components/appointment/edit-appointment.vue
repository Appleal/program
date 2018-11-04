<template>
  <c-dialog title="改约" @close="goBack">
  <div class="edit-appointment-wrapper">
    <div class="edit-appointment-item">
      <label>客户编号：</label>
      <span class="edit-text">{{brmid}}</span>
    </div>
    <div class="edit-appointment-item">
      <label>客户姓名：</label>
      <span class="edit-text">{{appUserName}}</span>
    </div>
    <div class="edit-appointment-item">
      <label>选择顾问：</label>
      <el-select v-model="consultantId" size="mini">
        <el-option v-for="(item, index) in consultantList" style="width: 220px"
          :key="index" :label="item.name" :value="item.consultantId">
        </el-option>
      </el-select>
    </div>
    <div class="edit-appointment-item">
      <label>选择时间：</label>
      <el-date-picker size="mini"
        format="yyyy-MM-dd" value-format="yyyy-MM-dd"
        :picker-options="orderEndDateOptions"
        @change="changeReserveDate"
        v-model="reserveDate" style="width: 135px;"></el-date-picker>
      <el-select v-model="reserveTime" size="mini" placeholder="请选择预约时间">
        <el-option v-for="(item, index) in reserveTimeList"
          v-show="reserveDateIsToday(item)"
          :key="index" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="edit-appointment-item edit-appointment-button">
      <el-button type="info" size="small" @click="goBack">取消</el-button>
      <el-button size="small"
        :loading="loading"
        class="element-button"
        @click="save">确定</el-button>
    </div>
  </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import {
  Button, Input, DatePicker, Select, Option, Message
} from 'element-ui'
import { ERR_SUCCESS } from 'api/config'
import { getReservation, getConsultantInfoByAppUserId, updateReservation } from 'api/reservation'
import { format, isNull } from 'common/js/util'
import cDialog from 'base/c-dialog/c-dialog'
import {appointMixin} from 'common/js/mixin'

const COMPONENTS_NAME = 'edit-appointment'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      loading: false,
      brmid: '',
      appUserId: '',
      appUserName: '',
      consultantId: '',
      reserveDate: '',
      reserveTime: '',
      idList: [],
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
  mixins: [appointMixin],
  created () {
    const { id } = this.$route.query
    this.reserveTimeList = this.getReserveTimeList()
    this._getReservation(id)
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    save () {
      const {id, reserveDate, reserveTime, consultantId} = this
      if (isNull(reserveDate) || isNull(reserveTime)) {
        Message.error('请选择时间！')
        return
      }
      if (isNull(consultantId) || consultantId === 0) {
        Message.error('请选择顾问！')
        return
      }
      this.loading = true
      this._updateReservation({
        id,
        reserveDate: format(reserveDate, '$1-$2-$3 $4:$5:$6'),
        reserveTime,
        consultantid: consultantId
      })
    },
    _getReservation (id) {
      getReservation({id}).then(res => {
        const { id, appUserId, consultantId, appUserName, brmid } = res.data
        this.id = id
        this.consultantId = consultantId === 0 ? '' : consultantId
        this.consultantId = consultantId
        this.appUserId = appUserId
        this.appUserName = String(appUserName)
        this.reserveDate = new Date(res.data.reserveDate)
        this.reserveTime = String(res.data.reserveTime)
        this.brmid = brmid
        const d = `${res.data.reserveDate} ${res.data.reserveTime}:00:00`
        if (new Date(d).getTime() > new Date().getTime()) {
          this.hasButton = true
        }
      })
    },
    changeReserveDate () {
      let h = new Date().getHours()
      if (format(new Date()) === format(this.reserveDate)) {
        if (h < 10) h = 10
      } else {
        h = 10
      }
      this.reserveTime = ''
      this.reserveTimeList = this.getReserveTimeList(h)
    },
    reserveDateIsToday (item) {
      if (format(new Date()) === format(this.reserveDate)) {
        let h = new Date().getHours()
        if (h >= Number(item.value)) return false
      }
      return true
    },
    _getConsultantInfoByAppUserId () {
      getConsultantInfoByAppUserId(this.appUserId).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.consultantList = res.data.list
        } else {
          Message.error(res.msg)
        }
      })
    },
    _updateReservation (screening) {
      updateReservation(screening).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.$router.replace('/appointment')
          Message({
            type: 'success',
            message: '改约成功!'
          })
        } else {
          this.loading = false
          Message.error(res.msg)
        }
      })
    },
    filterMethod (q) {
      if (q === '') {
        this.idList = this.idListClone
        return
      }
      const idList = this.idListClone
      let idListNew = []
      for (let id of idList) {
        if (String(id.name).indexOf(q) > -1 || String(id.appUserId).indexOf(q) > -1) { /* eslint-disable-line eqeqeq */
          idListNew.push(id)
        }
      }
      this.idList = idListNew
    }
  },
  watch: {
    appUserId () {
      this._getConsultantInfoByAppUserId()
    }
  },
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    [Input.name]: Input,
    [Button.name]: Button,
    cDialog
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.edit-appointment-wrapper
  padding 10px 15px
  width 420px
  .edit-appointment-item
    position relative
    padding 10px 0
    height 28px
    line-height 28px
    label
      font-size $font-size-sm
      color $color-text
  .edit-appointment-button
    text-align right
    button
      margin-right 15px
      width 105px
  .edit-appointment-line
    margin 15px 0
    width 100%
    border-top 1px solid #dcdcdc
.edit-text
  font-size 12px
</style>
