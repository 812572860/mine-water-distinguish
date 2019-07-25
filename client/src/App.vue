<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'mine-water',
  computed: {
    noticeInfo () {
      return this.$store.state.noticeInfo
    }
  },
  watch: {
    noticeInfo: {
      handler (value) {
        this.$message[value.type](value.message)
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
/* CSS */
@import "./styles/style";
</style>
