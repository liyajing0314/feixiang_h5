<template>
  <svg class="svg-icon" aria-hidden="true" :class="className">
    <use :xlink:href="iconName"/>
  </svg>
</template>

<script>
  export default {
    name: 'SvgIcon',
    props: {
      iconClass: {
        type: String,
        required: true
      },
      className: {
        type: String,
        default: ''
      }
    },
    computed: {
      //引入的图标名称
      iconName() {
        return `#icon-${this.iconClass}`
      },
      // svgClass() {
      //   if (this.className) {
      //     return 'svg-icon ' + this.className
      //   } else {
      //     return 'svg-icon'
      //   }
      // }
    }
  }
</script>

<style scoped>
  .svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor!important;
    overflow: hidden;
  }
</style>
