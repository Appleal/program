<template>
  <div>
    <div class="saleType">
      <span>售后类型：</span>
      <ul class="list">
        <li v-for="(item , index) in saleType" :key="item.msg" v-bind:class="{ nowpage: index==selectItem }" @click="active(index)">
          {{ item.msg }}
        </li>
      </ul>
    </div>
    <div class="problem">
      <span>问题说明：</span>
      <textarea></textarea>
    </div>
    <div class="submit">
      <el-button  @click="submit">查询</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {Button} from 'element-ui'
export default {
  name: 'payMessage',
  data () {
    return {
      saleType: [
        {msg: '退货'},
        {msg: '退款'},
        {msg: '质量问题'},
        {msg: '漏货补发'},
        {msg: '其它'}
      ],
      selectItem: 0
    }
  },
  methods: {
    active (num) {
      this.selectItem = num
    },
    submit () {
    // alert(this.saleType[this.selectItem].msg)
    }
  },
  components: {
    [Button.name]: Button
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
  span
      width 100px
      float left
      display block
      height 32px
      line-height 32px
      font-size 14px
  .list
      height 40px
      line-height 40px
      margin-left 100px
      li
        float left
        width 90px
        height 32px
        line-height 32px
        background-color #e6e6e6
        text-align center
        margin-right 10px
        font-size 14px
        cursor pointer
      .nowpage
        background-color #2873d0
        color #fff
  textarea
      width 600px
      height 200px
      border 1px solid #b3b3b3
      resize none
      outline none
      padding 10px
  .submit
    height 40px;
    margin-top 20px
    button
      float right
      background-color #2873d0
      color #fff
      display block
      width 100px
      height 36px
      line-height 36px
      padding 0px
      margin-right 50px
  </style>
