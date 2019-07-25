<template>
  <div class="map">
    <canvas ref="canvas" :width="width" :height="height"><slot /></canvas>
    
  </div>
</template>

<script>
export default {
  name: 'CanvasMap',
  props: {
    width: {
      type: Number,
      default: 650
    },
    height: {
      type: Number,
      default: 500
    }
  },
  data () {
    return {
      canvas: null,
      context: null
    }
  },
  provide () {
    return {
      mapCtx: this
    }
  },
  mounted() {
    console.log('init canvas')
    this.initChart()
  },
  methods: {
    initChart () {
      // if(this.context) this.context = null
      var canvas = this.$refs.canvas
      if (canvas.getContext) {
        this.context = canvas.getContext("2d")
      }
      this.canvas = canvas
      setTimeout(() => this.$emit('loaded'), 500)
    }
  },
  destroyed() {
    console.log('clear canvas')
    this.context.clearRect(0, 0, this.width, this.height)
    if(this.context) this.context = null
  },
}
</script>

<style scoped>
.map{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
}
</style>
