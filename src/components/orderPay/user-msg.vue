<template>
  <div class="user">
    <div class="order">
      <span>基本信息</span>
      <a @click="modify" href="javaScript:;" v-if="show">修改资料</a>
      <div v-else class="step">
            <a href="javaScript:;" class="save" @click="save">保存</a>
            <a href="javaScript:;" class="cancel" @click="cancel">取消</a>
      </div>
    </div>

    <div class="message">
      <div class="img">
        <img :src="userMessage.portraitUrl"/>
      </div>
      <div class="text">
        <p class="user-title">
          <span class="userName">{{ userMessage.nickName }}</span>
          <span class="userNum">({{ userMessage.id }})</span>
          <span class="vip"><icon-vip :width="18" :height="14" :size="22"></icon-vip>{{ userMessage.userGrade }}</span>
        </p>
        <ul v-if="show" class="clienlist">
          <li class="list">
            <label>类型：</label>
            <span> {{ userMessage.userTypeText }}</span>
          </li>
          <li class="list">
            <label>性别：</label>
            <span> {{ _genderFormat(userMessage.gender)}}</span>
          </li>
          <li class="list">
            <label>年龄：</label>
            <span> {{ userMessage.age }} 岁</span>
          </li>
          <li class="list">
            <label>身份证：</label>
            <span> {{ userMessage.idcardNo }}</span>
          </li>
          <li class="list">
            <label>症状：</label>
            <span> {{ userMessage.symptomTypeText }}</span>
          </li>
          <li class="list">
            <label>身高：</label>
            <span> {{ userMessage.height }}cm</span>
          </li>
          <li class="list">
            <label>体重：</label>
            <span> {{ userMessage.weight }}KG</span>
          </li>
          <li class="list">
            <label>收货地址：</label>
            <span> {{ userMessage.address  }} </span>
            <span> {{ userMessage.receiver }} (收)</span>
          </li>
        </ul>

        <div v-else>
          <el-form :model="userMessage" ref="form"  >
            <ul class="modify">
              <li class="list">
                <label>类型：</label>
                <el-select v-model="userMessage.userType" placeholder="客户类型" class="downSelct mini">
                  <el-option
                    v-for="userTypeList in userMessage.userTypeList"
                    :key="userTypeList.id"
                    :label="userTypeList.name"
                    :value="userTypeList.id">
                  </el-option>
                </el-select>

              </li>
              <li class="list sort-input">
                <label>性别：</label>
                <el-select v-model="userMessage.gender" class="mini">
                  <el-option v-for="item in genderList"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </li>
              <li class="list sort-input">
                <label>年龄：</label>
                <input class="edit" v-model="userMessage.age"/>
              </li>
              <li class="list">
                <label>身份证：</label>
                <input class="edit"  v-model="userMessage.idcardNo"/>
              </li>
              <li class="list symptoms">
                <el-form-item label="主要症状：" class="auditlist symptom">
                    <c-select-box
                    :value="userMessage.symptomType"
                    :list="symptoms"
                    :type="2"
                    labelKey="name" valueKey="id"
                    @change="updateCheckBox">
                  </c-select-box>
                </el-form-item>
              </li>
              <li class="list sort-input">
                <label>身高：</label>
                <input class="edit" v-model="userMessage.height" />
              </li>
              <li class="list sort-input" style="width: 30%; margin-left: 2.7%">
                <label>体重：</label>
                <input class="edit"  v-model="userMessage.weight" />
              </li>
            </ul>
            <div class="address" style="float: left; width: 100% ">
              <div class="address-title">选择收货地址：</div>
              <ul class="address-list">
                <li v-for="(item) in addressList"  :key="item.name" :class="{active: item.id === selectItem }" @click="address(item.id)">
                  <p><span>收货人：{{ item.receiver }}</span></p>
                  <p>{{ item.address }}</p>
                </li>
              </ul>
            </div>
          </el-form>
        </div>
      </div>
    </div>

  </div>
</template>

<script type="text/ecmascript-6">
import { Button, Input, Select, Option, Radio, RadioGroup, Form, FormItem, Checkbox, CheckboxButton, CheckboxGroup } from 'element-ui'
import ElInput from '../../../node_modules/element-ui/packages/input/src/input.vue'
import { ERR_SUCCESS } from 'api/config'
import { updataAppUserInfo, getAppUserInfo } from 'api/placeOrder'
import { genderFormat, dictKeyGetArray, isNull } from 'common/js/util'
import cSelectBox from 'base/c-selectBox/c-selectBox'
import iconVip from 'base/icon-vip/icon-vip'
export default {
  data () {
    return {
      number: 0,
      selectItem: '',
      show: true,
      userid: '',
      // 获取修改之后的用户信息
      userMessage: {
        id: '',
        gender: '',
        addressId: '',
        age: '',
        height: '',
        weight: '',
        idcardNo: '',
        userType: '',
        symptomType: ''
      },
      symptoms: [], // 修改资料 客户症状
      addressList: [], // 修改资料 地址资料
      genderList: [
        {value: 1, label: '男'},
        {value: 2, label: '女'}
      ]
    }
  },
  methods: {
    modify () { // 进入编辑状态
      this.show = false
    },
    _genderFormat (e) {
      return genderFormat(e)
    },
    updateCheckBox (array) {
      this.userMessage.symptomType = array
    },
    address (num) {
      this.selectItem = num
      this.userMessage.addressId = num
      this._dictKeyAddrss(num)
    },
    cancel () {
      this.show = true
    },
    save () {
      this._dictKeyGetArray(this.userMessage)
      this._dictKeyUserType(this.userMessage.userType)
      this.show = true
      const {id, gender, addressId, age, height, weight, idcardNo, userType, symptomType} = this.userMessage
      updataAppUserInfo({userInfo: {id, gender, addressId, age, height, weight, idcardNo, userType, symptomType}}).then(res => {
        if (res.code === ERR_SUCCESS) {
        } else {
          Notification.error({
            title: '错误',
            message: res.msg
          })
        }
      })
    },
    _dictKeyGetArray (scaleList) {
      const symptomType = scaleList.symptomType
      if (isNull(scaleList)) return
      if (isNull(symptomType)) return
      let symptomTypeText = ''
      dictKeyGetArray({
        value: symptomType,
        targetArray: scaleList.symptomTypeList,
        valueKey: 'id'
      }, (f) => {
        symptomTypeText += ` ${f.name}`
      })
      scaleList.symptomTypeText = symptomTypeText.substr(1)
    },
    _dictKeyAddrss (num) {
      this.userMessage.addressList.forEach(arr => {
        if (arr['id'] == num) { /* eslint-disable-line eqeqeq */
          this.userMessage.receiver = arr['receiver']
          this.userMessage.address = arr['address']
        }
      })
    },
    _dictKeyUserType (num) {
      this.userMessage.userTypeList.forEach(arr => {
        if (arr['id'] == num) { /* eslint-disable-line eqeqeq */
          this.userMessage.userTypeText = arr['name']
        }
      })
    },
    updataUser () {
      getAppUserInfo({
        userid: this.userid
      }).then((res) => {
        if (res.code === ERR_SUCCESS) {
          var userData = res.data
          this.userMessage = res.data // 修改信息数据
          this.userMessage.id = userData.id
          // 修改资料
          this.symptoms = userData.symptomTypeList
          this.addressList = userData.addressList
          this._dictKeyGetArray(this.userMessage)
          this._dictKeyUserType(this.userMessage.userType)
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
    var user = JSON.parse(localStorage.getItem('userMessage'))
    this.userid = user.data.id
    this.updataUser()
  },
  watch: {
  },
  components: {
    ElInput,
    [Button.name]: Button,
    [Input.name]: Input,
    [Select.name]: Select,
    [Option.name]: Option,
    [Radio.name]: Radio,
    [RadioGroup.name]: RadioGroup,
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Checkbox.name]: Checkbox,
    [CheckboxButton.name]: CheckboxButton,
    [CheckboxGroup.name]: CheckboxGroup,
    cSelectBox,
    iconVip
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .user-title
    margin-bottom 10px
  .text
      overflow hidden
  .edit
    height 24px
    line-height 24px
    padding-left 6px
    border 1px solid #f2f2f2
    width 70px
    border-radius 5px
    outline none
    color #999999
  .symptoms
    width 40%;
    span
      width 70px
      height 24px
      display inline-block
      border-radius 3px
      background-color #e6e6e6
      color #666
      margin-right 10px
      text-align center
      line-height 24px
      cursor pointer
      font-size 12px
    .active
      background-color #2873d0
      color #fff
  .vip
    color #f5b232
    position relative
    padding-left 0px
    margin-left 4px
    text-indent -5px
    font-size 12px
  .address
    .address-title
      float left
      width 100px
    .address-list
      margin-left 100px
      .add
        text-align center
        line-height 60px
        font-size 30px
        color #808080
      li
        height 60px
        width 47%;
        margin-bottom 20px
        margin-right 2%;
        float left
        border 1px solid #f2f2f2
        border-radius 5px
        background #fff
        cursor pointer
        color #808080
        p
          height 30px
          line-height 30px
          margin-left 10px
      .active
        background-color #2873d0
        color #fff
  .util-icon
    width 20px
    height 20px
    display inline-block
    position absolute
    left -11px
    top 2px
    img
      max-width 100%
  .order
    height 30px
    line-height 30px
    border-bottom 1px solid #c2c2c2
    margin-bottom 10px
    .step
      width 100px
      float right
    span
      width 100px
      border 1px solid #c2c2c2
      display inline-block
      border-bottom none
      height 30px
      text-align center
      font-size 12px
      background-color #FFFFFF
    a
      float right
      font-size 12px
      color #3275fa
      margin-right 6px
      &:hover
        color #2873d0
  .message
    padding-top 10px
    margin-bottom 20px
  .img
    float left
    height 120px
    width 120px
    img
      max-width 100%
  .text
    margin-left 130px
  .clienlist
    margin-top 10px
    .list
      float left
      margin-bottom 10px
      width 16%
      height 30px
      line-height 30px
      margin-bottom 0px
      color #4D4D4D
      i
        font-style normal
        margin-left 20px
      &:last-child
        width 100%
      &:first-child
        width 32%
      &:nth-child(5)
        width 32%
      &:nth-child(4)
        width 36%
        input
          width 200px
    .symptoms
      width 40%
  .modify
    .list
      float left
      margin-bottom 10px
      width 24%
      height 30px
      line-height 30px
      margin-bottom 10px
      color #4D4D4D
      i
        font-style normal
        margin-left 20px
      &:nth-child(4)
        width 41%
        margin-left 1%
        input
          width 200px
    .symptoms
      width 41%
    .sort-input
       width 17%
       .edit
          width 60px
  .userNum
    color #999999
  .user
    overflow hidden
</style>
