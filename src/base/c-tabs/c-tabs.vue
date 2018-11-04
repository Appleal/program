<template>
  <div class="c-tab-wrapper">
    <ul class="c-tab-header">
      <li class="c-tab-header-item"
          v-for="(msg, index) in list"
          :key="msg.title"
          :style="$listLiStyle"
          :class="{active: tabsValue === index}"
          @click="headerClick(msg, index)" >
        {{msg}}
      </li>
    </ul>
    <div class="c-tab-line" :style="$listLineStyle"></div>
    <slot></slot>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      tabsValue: 0
    }
  },
  computed: {
    $listLiStyle () {
      if (this.list.length === 0) return `width: 0px`
      return `width: ${100 / this.list.length}%`
    },
    $listLineStyle () {
      if (this.list.length === 0) return `width: 0px`
      const width = 100 / this.list.length
      return {
        width: `${width}%`,
        left: `${width * this.tabsValue}%`
      }
    }
  },
  methods: {
    headerClick (msg, index, event) {
      this.tabsValue = index
    }
  },
  watch: {
    value (newValue) {
      this.tabsValue = newValue
    },
    tabsValue (newValue) {
      this.$emit('input', newValue)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.c-tab-wrapper
  position relative
  width 100%
  .c-tab-header
    position relative
    margin 0
    padding 0
    width 100%
    height 49px
    font-size 0
    &::after
      content ''
      display block
      width 100%
      height 1px
      background-color #f2f2f2
    .c-tab-header-item
      line-height 49px
      height 49px
      font-size $font-size-sm
      color $color-text
      text-align center
      cursor pointer
      inline-block-top()
      &.active
        color $color-theme
  .c-tab-line
    position absolute
    top 48px
    left 0
    height 2px
    text-align center
    transition left 200ms
    &::before
      content ''
      width 65%
      height 2px
      background-color $color-theme
      inline-block-top()
</style>
