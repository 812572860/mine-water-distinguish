<template>
  <i :class="['checked', activeIcon, {disabled: disabled}]" v-if="checkValue" @click="onClickIcon"></i>
  <i :class="['unchecked', inactiveIcon,{disabled: disabled}]" v-else @click="onClickIcon"></i>
</template>
<style lang="scss" scoped>
i.unchecked, i.checked {
  color: #00a3ff;
  line-height: 35px;
  font-size: 20px;
  position: absolute;
  right: 25px;
}
</style>

<script>
export default {
  name: 'Checkbox',
  props: {
    /** true时的图标 */
    activeIcon: {
      type: String,
      default: () => {
        return 'iconfont icon-circle-check'
      }
    },
    /**
     * false时的图标
     */
    inactiveIcon: {
      type: String,
      default: () => {
        return 'iconfont icon-circle-uncheck'
      }
    },
    /**
     * 传进来的值
     */
    value: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    /**
     * 颜色
     */
    color: {
      type: [String],
      default: () => {
        return ''
      }
    },
    /**
     * 是否禁用
     */
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data () {
    return {
      checkValue: this.value
    }
  },
  methods: {
    /**
     * 图标点击事件
     */
    onClickIcon () {
      if (this.disabled) { return }
      this.checkValue = !this.checkValue
      this.$emit('input', this.checkValue)
      this.$emit('change', this.checkValue)
    }
  }
}
</script>

