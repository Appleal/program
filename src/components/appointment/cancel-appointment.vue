<template>
  <c-dialog title="取消预约说明" @close="goBack" class="element-dialog">
    <div class="layer-wrapper">
      <div class="reject-wrapper">
        <div class="reject-item">
          <span class="label">客户姓名：</span>
          <span class="reject-input-item">
            {{appointment.appUserName}}
          </span>
        </div>
        <div class="reject-item" v-if="appointment.reserveDate">
          <span class="label"> 预约时间：</span>
          <span class="reject-input-item">
            {{cancelDate(appointment)}}
          </span>
        </div>
        <div class="reject-item">
          <span class="label"><strong>*</strong>原因说明：</span>
          <span class="reject-input-item">
            <el-input
              style="margin-top: 15px;"
              type="textarea"
              :rows="4"
              v-model="appointment.rejectReason"
              placeholder="请输入内容">
              </el-input>
          </span>
        </div>
        <div class="reject-item" style="margin-top: 35px;">
          <el-button size="small" @click="goBack">取消</el-button>
          <el-button type="primary"
            :loading="loading"
            size="small" @click="_updateReservation">确认</el-button>
        </div>
      </div>
    </div>
  </c-dialog>
</template>

<script type="text/ecmascript-6">
import cDialog from 'base/c-dialog/c-dialog'
import { Button, Input, Message } from 'element-ui'
import { format } from 'common/js/util'
import { ERR_SUCCESS } from 'api/config'
import { getReservation, updateReservation } from 'api/reservation'

export default {
  data () {
    return {
      loading: false,
      appointment: {
        appUserName: '',
        reserveTime: '',
        rejectReason: '',
        reserveDate: ''
      }
    }
  },
  created () {
    this.$nextTick(() => {
      const { id } = this.$route.query
      this._getReservation(id)
    })
  },
  methods: {
    cancelDate (appointment) {
      let d = appointment.reserveDate
      let t = appointment.reserveTime
      return d + ` ${t}:00-${Number(t) + 1}:00`
    },
    goBack () {
      this.$router.go(-1)
    },
    _getReservation (id) {
      getReservation({ id }).then(res => {
        if (res.code === ERR_SUCCESS) {
          const {
            id, appUserId, consultantId, createTime, appUserName, reserveDate, reserveTime
          } = res.data
          this.appointment.id = id
          this.appointment.consultantId = consultantId
          this.appointment.appUserId = appUserId
          this.appointment.appUserName = String(appUserName)
          this.appointment.createTime = format(new Date(createTime))
          this.appointment.reserveDate = format(new Date(reserveDate))
          this.appointment.reserveTime = reserveTime
        } else {
          Message.error(res.msg)
        }
      })
    },
    _updateReservation () {
      if (this.loading) return
      const {id, rejectReason} = this.appointment
      if (!rejectReason) {
        Message.error('请填写取消原因！')
        return
      }
      this.loading = true
      updateReservation({
        id,
        reserveState: -1,
        rejectReason: rejectReason
      }).then(res => {
        if (res.code === ERR_SUCCESS) {
          this.$router.replace('/appointment')
          Message({
            message: '操作成功！',
            type: 'success'
          })
        } else {
          Message.error(res.msg)
        }
        this.loading = false
      })
    }
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input,
    cDialog
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/css/variable"
  @import "~common/css/mixin"

  .layer-wrapper
    width 660px
    height 320px
    box-sizing border-box
    .reject-wrapper
      margin 0 auto
      width 540px
      height 320px
    .reject-item
      width 100%
      line-height 50px
      color $color-text
      font-size $font-size-sm
      text-align center
      & >>> button
        width 120px
      .label
        margin-right 10px
        width 120px
        height 50px
        line-height 50px
        text-align right
        inline-block-top()
        strong
          color #FF0000
      .reject-input-item
        width 400px
        text-align left
        inline-block-top()
</style>
