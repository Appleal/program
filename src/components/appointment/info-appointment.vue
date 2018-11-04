<template>
  <c-dialog title="预约详情" @close="goBack">
  <div class="info-appointment-wrapper">
      <div class="info-appointment-item">
        <label>预约时间：</label>
        <label>{{_format(reserveDate)}}</label>
      </div>
      <div class="info-appointment-item">
        <label>预约顾问：</label>
        <label>{{consultantName}}</label>
      </div>
      <div class="info-appointment-line"></div>
      <div class="info-appointment-item info-appointment-button">
      <el-button size="small" class="element-button"
        @click="infoAction('subData')">消息</el-button>
      <el-button size="small"
        @click="infoAction('cancellation')" :disabled="hasButton">取消预约</el-button>
      <el-button size="small"
        @click="infoAction('change')" :disabled="hasButton">改约</el-button>
    </div>
  </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import {
  Button, Input, DatePicker, Select, Option
} from 'element-ui'
import { format, isNull } from 'common/js/util'
import cDialog from 'base/c-dialog/c-dialog'
import {appointMixin} from 'common/js/mixin'
import { getReservation } from 'api/reservation'

const COMPONENTS_NAME = 'edit-appointment'

export default {
  name: COMPONENTS_NAME,
  data () {
    return {
      consultantName: '',
      reserveDate: '',
      hasButton: true
    }
  },
  mixins: [appointMixin],
  created () {
    let { id } = this.$route.query
    getReservation({id}).then(res => {
      const { id, consultantName } = res.data
      this.id = id
      this.appUserId = res.data.appUserId
      this.consultantName = String(consultantName)
      this.reserveDate = new Date(res.data.reserveDate)
      const d = `${res.data.reserveDate} ${res.data.reserveTime}:00:00`
      if (new Date(d).getTime() > new Date().getTime()) {
        this.hasButton = false
      }
    })
  },
  methods: {
    _format (e) {
      return format(e)
    },
    goBack () {
      this.$router.go(-1)
    },
    infoAction (type) {
      switch (type) {
        case 'subData': // 资料
          if (isNull(this.id)) return
          // this.$router.push({path: '/appointment/item', query: {tid: this.appUserId}})
          this.$router.push({name: 'chatwindow', params: {tid: 'a' + this.appUserId}})
          break
        case 'cancellation': // 取消预约
          if (isNull(this.id)) return
          this.$router.push({path: '/appointment/cancel', query: {id: this.id}})
          break
        case 'change':
          if (isNull(this.id)) return
          this.$router.push({path: '/appointment/edit', query: {id: this.id}})
          break
      }
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

.info-appointment-wrapper
  padding 10px 15px
  width 420px
  .info-appointment-item
    position relative
    padding 10px 0
    height 28px
    line-height 28px
    label
      font-size $font-size-sm
      color $color-text
  .info-appointment-button
    text-align right
    button
      margin-right 15px
      width 105px
</style>
