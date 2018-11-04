<template>
  <div class="userMsg">
    <user-msg></user-msg>
    <p class="order">
      <span>客户量表</span>
    </p>
    <el-form ref="record" :model="record" >
      <ul>
        <li>
          <label>手术史及疾病史：</label>
          <div class="input-wapper">
             <input type="text"  v-model="record.diseaseHistory" placeholder="是否有家族遗传病，精神病等，没有则写无。是否有做手术，什么手术，手术多长时间，没有则写无"/>
          </div>
        </li>
        <li>
          <label>过敏史：</label>
          <div class="input-wapper">
             <input type="text" v-model="record.allergyHistory" placeholder="有则写具体对什么过敏，没有则写无"/>
          </div>
        </li>
        <li>
          <label>痛风：</label>
          <div class="input-wapper">
              <input type="text" v-model="record.gout" placeholder="没有写：无，有：写具体数值，并注明有无服药物"/>
          </div>
        </li>
        <li>
          <div class="pressure">
            <label>高压：</label>
            <div class="input-wapper">
               <input type="text" v-model="record.highBloodPressure" placeholder="写具体数值"/>
            </div>
          </div>
          <div class="pressure">
            <label>低压：</label>
            <div class="input-wapper">
              <input type="text" v-model="record.lowBloodPressure" placeholder="写具体数值"/>
            </div>
          </div>
        </li>
        <li>
          <label>血糖（BS）：</label>
          <div class="input-wapper">
            <input type="text"  v-model="record.bloodSugar" placeholder="写具体数值，并写明：空腹血糖或者饭后2小时血糖值，并注明有无降糖药物"/>
          </div>
        </li>
        <li>
          <label>心肝肾功能：</label>
          <div class="input-wapper">
            <textarea v-model="record.heartCapability"  placeholder="是否有重大心肝肾疾病，比如心脏（搭桥、起搏器、支架等）、 肾病（肾结核，尿毒症、侧肾摘除等）、 肝病（乙肝大三阳、重度脂肪肝、肝硬化、肝腹水）等。没有则写：正常"></textarea>
          </div>
        </li>
        <li>
          <label>首卖已经解决的问题：</label>
          <div class="input-wapper">
            <input v-model="record.firstBuySolved" type="text" placeholder="顾客首次来改善的问题"/>
          </div>
        </li>
        <li>
          <el-form-item label="目前存在的问题：" class="auditlist">
            <el-radio-group v-model="record.currentIssue" size="medium"><!--record.present-->
              <el-radio border :label="String(item.id)" v-for="(item, index) in symptomTypeList" :key="item.name" @change="changePresent(index)">
                <span>{{ item.name }}</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="主要症状" class="auditlist" v-if="isState">
            <el-radio-group v-model="record.mainDisease" size="medium">
              <el-radio border :label="String(item.id)" v-for="item in resourcesItems" :key="item.name">{{ item.name }}</el-radio>
            </el-radio-group>
            <span style="color:#666; font-size: 12px; ">（单选）</span>
          </el-form-item>
          <el-form-item label="主要症状" v-model="record.mainDisease" class="auditlist" v-else>
            <c-select-box
              :value="record.mainDisease"
              :list="resourcesItems"
              :type="2"
              labelKey="name" valueKey="id"
              @change="updateCheckBox">
            </c-select-box>
            <span style="color:#666; font-size: 12px; line-height: 30px">（多选）</span>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="精液情况：" class="auditlist">
            <el-radio-group v-model="record.spermSituation" size="medium"> <!--record.spermSituation-->
              <el-radio border :label="String(item.id)" v-for="(item) in spermSituationList" :key="item.id">
              <span>{{ item.name }}</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </li>
        <li>
        <el-form-item label="舌苔："  class="auditlist">
          <el-radio-group v-model="record.tongue" size="medium"> <!--record.tongue-->
              <el-radio border :label="String(item.id)" v-for="(item  ) in optionList" :key="item.title">
                <span>{{ item.name }}</span>
              </el-radio>
          </el-radio-group>
        </el-form-item>
        </li>
        <li>
          <el-form-item label="头晕、乏力、四肢麻木：" class="auditlist">
            <el-radio-group v-model="record.faintWeakNumb" size="medium">
              <el-radio border label="1"><span>有</span></el-radio>
              <el-radio border label="0"><span>无</span></el-radio>
            </el-radio-group>
          </el-form-item>
      </li>
        <li>
          <el-form-item label="急躁易怒、失眠多梦：" class="auditlist">
            <el-radio-group v-model="record.impatientSleepless" size="medium">
              <el-radio border label="1"><span>有</span></el-radio>
              <el-radio border label="0"><span>无</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="怕冷，手脚冰凉，四肢腰部冷痛："  class="auditlist">
            <el-radio-group v-model="record.cold" size="medium">
              <el-radio border label="1"><span>有</span></el-radio>
              <el-radio border label="0"><span>无</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </li>
        <li>
          <el-form-item label="手心发热，口干咽燥，面红耳赤，总想喝水，容易上火：" class="auditlist max">
            <el-radio-group v-model="record.dryOnfire" size="medium">
              <el-radio border label="1"><span>有</span></el-radio>
              <el-radio border label="0"><span>无</span></el-radio>
            </el-radio-group>
          </el-form-item>
        </li>
        <li>
          <label>备注：</label>
          <div class="input-wapper">
            <textarea placeholder="如顾客只是保养或者关联药品单请在此栏注明" v-model="record.note" ></textarea>
          </div>
        </li>
      </ul>
    </el-form>
    <div class="but">
      <a href="javascript:;" @click="palceOrder"> 下一步 </a>
      <router-link to="/orderstep/auditlist"> 上一步 </router-link>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { Button, Input, Select, Option, Radio, RadioGroup, Form, FormItem, Checkbox, CheckboxButton, CheckboxGroup } from 'element-ui'
import userMsg from './user-msg.vue'
import cSelectBox from 'base/c-selectBox/c-selectBox'
import { ERR_SUCCESS } from 'api/config'
import { getAppUserGauge } from 'api/placeOrder'

export default {
  data () {
    return {
      // 获取表单所有的数据
      radio2: 1,
      isState: true,
      userId: '',
      UserGauge: '',
      record: {
        diseaseHistory: '',
        allergyHistory: '',
        ventilation: '',
        highPressure: '',
        lowPressure: '',
        bloodugar: '',
        darling: '',
        problem: '',
        present: '',
        resources: '',
        situation: '',
        tongue: '',
        dizzy: '',
        impatience: '',
        cold: '',
        hand: '',
        note: '',
        mainDisease: ''
      },
      optionList: [],
      spermSituationList: [], // 精液情况
      symptomTypeList: [], // 目前症状
      resourcesItems: [],
      doubleResources: []
    }
  },
  methods: {
    palceOrder () {
      // this.$router.push({ path: '/orderstep/placeorder' })
    },
    changePresent (n) {
      this.resourcesItems = this.symptomTypeList[n].optionList
      if (n === 2) {
        this.isState = false
      } else if (n === 3) {
        this.isState = false
      } else {
        this.isState = true
      }
    },
    updateCheckBox (array) {
      this.record.mainDisease = array
    }
  },
  created () {
    let data = {
      index: 2
    }
    this.$emit('showCityName', data)
    var userInfo = JSON.parse(localStorage.getItem('userMessage'))
    this.userId = userInfo.data.id
    getAppUserGauge({
      userid: this.userId
    }).then((res) => {
      if (res.code === ERR_SUCCESS) {
        this.record = res.data
        // this.chatCustomer = res.data
        this.optionList = this.record.tongueList[0].optionList
        this.spermSituationList = this.record.spermSituationList[0].optionList
        this.symptomTypeList = this.record.symptomTypeList
        this.changePresent(parseInt(this.record.currentIssue - 1))
      } else {
        Notification.error({
          title: '错误',
          message: '该用户不存在，请确认后在输入！'
        })
      }
    }).catch(() => {
    })
  },
  watch: {

  },
  updated () {
    window.scroll(0, 0)
  },
  components: {
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
    userMsg,
    cSelectBox
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .order
    height 30px
    line-height 30px
    border-bottom 1px solid #c2c2c2
    margin-bottom 10px
    span
      width 100px
      border 1px solid #c2c2c2
      display inline-block
      border-bottom none
      height 30px
      text-align center
      font-size 12px
      background-color #FFFFFF
  .userMsg
    width 98%
    margin 0 auto
    margin-top 20px
  ul
    li
      width 100%
      margin-bottom 10px
      overflow: hidden
      .pressure
        width 50%
        float left
      &:nth-child(4)
        input
          width 95%
          float left
        label
          &:last-child
            width 100px
      &:nth-child(15)
        label
          width 360px
      &:nth-child(15)
        p
          width 400px
      label
        width 200px
        float left
        text-align right
        height 30px
        line-height 30px
        display inline-block
        font-size 12px
      .input-wapper
        margin-left 200px
      input
        width 98%
        border 1px solid #e3e3e3
        padding-left 6px
        outline none
        font-size 12px
        height 30px
        line-height 30px
        color #4e4e4e
      textarea
        width 98%
        height 60px
        resize none
        border:none
        border 1px solid #d3cbcb
        padding-left 6px
        padding-top 6px
        outline none
        color #666
      p
        width 760px
        float left
        height 30px
        line-height 30px
        span
          width 90px
          height 30px
          display inline-block
          color #999999
          background-color #e6e6e6
          line-height 30px;
          font-size 12px
          text-align center
          margin-right 20px
        .active
          color #FFFFFF
          background-color #2873d0
  .but
    height 50px
    margin-top 30px
    a
      float right
      width 120px
      height 36px
      border-radius 3px
      background-color #e6e6e6
      border 1px solid #b3b3b3
      text-align center
      line-height 36px
      cursor pointer
      margin-right 26px
      &:hover
        background-color #2873d0
        border 1px solid #2873d0
        color #FFFFFF
</style>
