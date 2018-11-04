<template>
  <c-dialog title="新增预约" @close="goBack">
  <div class="edit-appointment-wrapper">
    <div class="edit-appointment-item">
      <label>客户编号：</label>
      <el-select v-model="appUserId"
        v-show="addType"
        style="width: 220px"
        size="mini" placeholder="请选择客户编号">
        <el-option v-for="(item, index) in idList"
          :key="index" :label="item.nameId" :value="item.appUserId">
        </el-option>
      </el-select>
      <el-input
        v-model="brmId"
        v-show="!addType"
        style="width: 220px"
        @input="appUserIdTextChange"
        placeholder="请输入客户编号"
        size="mini">
      </el-input>
      <el-button size="mini" @click="addFn">
        <span v-show="addType">手动添加</span>
        <span v-show="!addType">选择客户</span>
      </el-button>
      <div class="appointment-loading" v-show="isLoading">
        <c-loading size="20"></c-loading>
      </div>
    </div>
    <div class="edit-appointment-item" v-show="appUserName">
      <label>客户姓名：</label>
      {{appUserName}}
    </div>
    <div class="edit-appointment-item" v-show="consultantList.length > 0">
      <label>选择顾问：</label>
      <el-select v-model="consultantId" size="mini" style="width: 220px">
        <el-option v-for="(item, index) in consultantList"
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
import {
  getReservation, getConsultantInfoByAppUserId, addReservation,
  getReservationInfo, getConsultantInfoByBrmId, saveReservation
} from 'api/reservation'
import { format, isNull } from 'common/js/util'
import cDialog from 'base/c-dialog/c-dialog'
import cLoading from 'base/c-loading/c-loading'
import {appointMixin} from 'common/js/mixin'

const COMPONENTS_NAME = 'edit-appointment'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      appUserName: '',
      addType: true,
      loading: false,
      brmId: '',
      appUserId: '',
      consultantId: '',
      reserveDate: '',
      reserveTime: '',
      idList: [],
      consultantList: [],
      isLoading: false,
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
    let { reserveDate, reserveTime } = this.$route.query
    this.reserveTimeList = this.getReserveTimeList()
    this.reserveDate = reserveDate && new Date(reserveDate)
    this.reserveTime = reserveTime && String(reserveTime)
    this._getReservationInfo()
  },
  methods: {
    addFn () {
      this.addType = !this.addType
      this.brmId = ''
      this.consultantId = ''
      this.appUserId = ''
      this.consultantList = []
    },
    appUserIdTextChange () {
      // 切换成文本输入
      if (this.addType) return
      this.appUserIdTextChangeTimer && clearTimeout(this.appUserIdTextChangeTimer)
      this.appUserIdTextChangeTimer = setTimeout(() => {
        const brmId = this.brmId
        if (isNull(brmId)) return
        this.isLoading = true
        getConsultantInfoByBrmId({ brmId }).then(res => {
          if (res.code === ERR_SUCCESS) {
            this.consultantList = res.data.list
            this.appUserId = res.data.appUserId
          } else {
            this.appUserId = ''
            this.consultantList = []
          }
          this.isLoading = false
        })
      }, 400)
    },
    _getReservationInfo () {
      getReservationInfo().then(res => {
        if (res.code === ERR_SUCCESS) {
          let data = res.data.list
          for (let d of data) {
            d.nameId = d.name + `(${d.brmid})`
          }
          this.idList = data
        } else {
          Message.error(res.msg)
        }
      })
    },
    goBack () {
      this.$router.go(-1)
    },
    save () {
      const {idList, reserveDate, reserveTime, consultantId, appUserId} = this
      if (isNull(reserveDate) || isNull(reserveTime)) {
        Message.error('请选择时间！')
        return
      }
      if (isNull(consultantId)) {
        Message.error('请选择顾问！')
        return
      }
      if (isNull(appUserId)) {
        Message.error('请选择客户编号！')
        return
      }
      this.loading = true
      for (const _id of idList) {
        if (_id.appUserId === appUserId) {
          this.id = Number(_id.resevationId)
          break
        }
      }
      this._addReservation({
        id: this.id,
        userid: appUserId,
        reserveDate: format(reserveDate, '$1-$2-$3 $4:$5:$6'),
        reserveTime,
        consultantid: consultantId
      })
    },
    _getReservation (id) {
      getReservation({id}).then(res => {
        const { id, appUserId, consultantId, appUserName } = res.data
        this.id = id
        this.consultantId = consultantId
        this.appUserId = appUserId
        this.appUserName = String(appUserName)
        this.reserveDate = new Date(res.data.reserveDate)
        this.reserveTime = String(res.data.reserveTime)
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
      this.isLoading = true
      getConsultantInfoByAppUserId(this.appUserId).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.consultantList = res.data.list
        } else {
          Message.error(res.msg)
          this.appUserId = ''
          this.consultantList = []
        }
        this.isLoading = false
      })
    },
    _addReservation (screening) {
      let postApi = addReservation
      if (!this.addType) {
        postApi = saveReservation
      }
      postApi(screening).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.$router.replace('/appointment')
          Message({
            type: 'success',
            message: '新增预约成功!'
          })
        } else {
          this.loading = false
          Message.error(res.msg)
        }
      })
    }
  },
  watch: {
    appUserId () {
      if (this.appUserId) {
        this.consultantId = ''
        this._getConsultantInfoByAppUserId()
      }
    }
  },
  components: {
    [Select.name]: Select,
    [Option.name]: Option,
    [DatePicker.name]: DatePicker,
    [Input.name]: Input,
    [Button.name]: Button,
    cDialog,
    cLoading
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
.appointment-loading
  height 20px
  inline-block-top(middle)
</style>
