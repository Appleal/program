<template>
  <el-checkbox-group
    class="element-select-box"
    v-model="checkBoxValue"
    :class="sizeClass"
    @change="(v) => {this.change(v, 'checkBoxValue')}"
    v-if="type === 2">
    <el-checkbox-button
        v-for="l in list"
        :label="l[labelKey]"
        :key="l[labelKey]">
    </el-checkbox-button>
  </el-checkbox-group>
  <el-radio-group
    class="element-select-box"
    v-model="radioValue"
    @change="(v) => {this.change(v, 'radioValue')}"
    :class="sizeClass"
    v-else >
    <el-radio-button
      v-for="l in list"
      :label="l[labelKey]"
      :key="l[labelKey]">
    </el-radio-button>
  </el-radio-group>
</template>

<script type="text/ecmascript-6">
import { CheckboxGroup, CheckboxButton, RadioGroup, RadioButton } from 'element-ui'

const COMPONENT_NAME = 'c-selectBox'

export default {
  name: COMPONENT_NAME,
  props: {
    list: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 1 // 1多选  2单选
    },
    size: {
      type: String,
      default: 'small'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    value: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      checkBoxValue: this.stringToArray(this.value),
      radioValue: this.value
    }
  },
  created () {
    this.$nextTick(() => {
      this.valueInit()
    })
  },
  methods: {
    valueInit () {
      // 1多选  2单选
      const {value, stringToArray} = this
      if (this.type === 2) {
        this.checkBoxValue = stringToArray(value)
      } else {
        this.radioValue = value
      }
    },
    arrayToString (e) {
      // ['肾亏', ’肾亏‘] => '1,2,3'
      let newValue = []
      const {list, valueKey, labelKey} = this
      if (list instanceof Array) {
        e.forEach(t => {
          list.forEach(l => {
            const value = l[valueKey]
            const text = l[labelKey]
            if (text === t) {
              newValue.push(value)
            }
          })
        })
      }
      return newValue.join(' ')
    },
    stringToArray (e) {
      // '1,2,3' => ['肾亏', ’肾亏‘]
      if (!e) return []
      if (typeof e !== 'string') e = e.toString()
      const newArr = e.split(' ')
      let newValue = []
      const {list, valueKey, labelKey} = this
      if (list instanceof Array) {
        newArr.forEach(arr => {
          list.forEach(l => {
            const value = l[valueKey]
            const text = l[labelKey]
            if (value == arr) { /* eslint-disable-line eqeqeq */
              newValue.push(text)
            }
          })
        })
      }
      return newValue
    },
    change (e, type) {
      if (type === 'radioValue') {
        if (e === this.value) return
        this.$emit('change', e)
      } else {
        if (e === this.value) return
        this.$emit('change', this.arrayToString(e))
      }
    }
  },
  computed: {
    sizeClass: function () {
      return {
        mini: this.size === 'mini',
        small: this.size !== 'mini'
      }
    }
  },
  watch: {
    value (e) {
      this.valueInit()
    }
  },
  components: {
    [CheckboxGroup.name]: CheckboxGroup,
    [CheckboxButton.name]: CheckboxButton,
    [RadioGroup.name]: RadioGroup,
    [RadioButton.name]: RadioButton
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

</style>
