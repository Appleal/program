<template>
  <article class="work-article">
    <slot name="title">
      <h3>{{this.title}}</h3>
    </slot>
    <div class="work-article-content">
      <slot></slot>
    </div>
  </article>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~common/css/variable"
@import "~common/css/mixin"

.work-article
  width 100%
  background-color $color-home-workData-background
  bg-box-shadow()
  h3
    padding-top 15px
    padding-left 16px
    height 21px
    line-height 21px
    font-size $font-size-md
  .work-article-content
    margin 0
    padding 10px 16px 19px 16px
    font-size 0
</style>
