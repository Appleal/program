<template>
  <div class="userNumber" style="height: 400px">
    <el-input placeholder="请输入客户编号" v-model="user" size="small" style="width: auto;">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-button size="mini" style="margin-left: 10px;" @click="query">查询</el-button>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button, Input, Notification} from 'element-ui'
import { ERR_SUCCESS } from 'api/config'
import { getAppUserInfo } from 'api/placeOrder'
export default {
  data () {
    return {
      user: ''
    }
  },
  methods: {
    verification () {
      if (this.user === '') {
        Notification.error({
          title: '错误',
          message: '用户名不能为空！'
        })
        return true
      }
      return false
    },
    query () {
      if (this.verification()) return
      getAppUserInfo({
        userid: this.user
      }).then((res) => {
        if (res.code === ERR_SUCCESS) {
          this.$router.push({ path: '/orderstep/auditlist' })
          localStorage.setItem('userMessage', JSON.stringify(res))
        } else {
          Notification.error({
            title: '错误',
            message: '该用户不存在，请确认后在输入！'
          })
        }
      }).catch(() => {
      })
    }
  },
  created () {
    let data = {
      index: 1
    }
    this.$emit('showCityName', data)
  },
  components: {
    [Button.name]: Button,
    [Input.name]: Input
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .userNumber
    margin-left 1%;
    margin-top 20px
  .el-button--mini
    padding: 9px 15px;
</style>
