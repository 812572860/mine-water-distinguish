<template>
  <div class="map">
    <canvas ref="canvas" :width="width" :height="height"><slot /></canvas>
  </div>
</template>

<script>
import { getSamplePoint } from '@/service/piper'
import Point from '@/models/Point'
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
    },
    // 待判水样点
    pendingSample: {
      type: Object
    },
    // 参考水样点
    data: {
      type: [Array, Object],
      default: () => []
    },
    sources: {
      type: [Array, Object],
      default: () => []
    },
    startPoint: {
      type: Object,
      default: () => new Point([50, 20])
    },
    sideLength: {
      type: Number,
      default: 200
    },
    spaceLength: {
      type: Number,
      default: 20
    }
  },
  data () {
    return {
      canvas: null,
      context: null,
      samplePointList: []
    }
  },
  computed: {
    centerPoint () {
      return new Point([this.point.x - this.anchor[0] * this.size, this.point.y - this.anchor[1] * this.size])
    }
  },
  watch: {
    data: {
      handler (val) {
        this.drawStandardSamples(val)
      },
      deep: true
    }
  },
  mounted () {
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
      setTimeout(() => {
        this.drawStandardSamples(this.data)
      }, 500)
    },
    drawStandardSamples (samples) {
      this.samplePointList = samples.filter(item => item.visible).map(item => getSamplePoint(item, this.startPoint, this.sideLength, this.spaceLength, this.sources))

      if (this.context) {
        this.context.clearRect(0, 0, this.width, this.height)

        let type = 'circle'
        let label = '●'
        let size = 25
        let fontFamily = 'Lato'
        let anchor = [0.5, 0.5]
        // let leftCenterPoint, rightCenterPoint, topCenterPoint

        this.samplePointList.forEach(ele => {
          // leftCenterPoint = new Point([ele.leftPoint.x - anchor[0] * size, ele.leftPoint.y - anchor[1] * size])
          // 绘制左侧三角形中的点
          this.drawMarker(type, ele.fillColor, label, size, fontFamily, ele.leftPoint)

          // 绘制右侧三角形中的点
          // rightCenterPoint = new Point([ele.rightPoint.x - anchor[0] * size, ele.rightPoint.y - anchor[1] * size])
          this.drawMarker(type, ele.fillColor, label, size, fontFamily, ele.rightPoint)

          // 绘制顶部菱形中的点
          // topCenterPoint = new Point([ele.topPoint.x - anchor[0] * size, ele.topPoint.y - anchor[1] * size])
          this.drawMarker(type, ele.fillColor, label, size, fontFamily, ele.topPoint)

        });
        // 绘制待判水样
        this.drawPendingSample()
      }
    },
    drawPendingSample () {
      if (this.pendingSample) {
        let sample = getSamplePoint(this.pendingSample, this.startPoint, this.sideLength, this.spaceLength)
        let type = 'text'
        let label = '★'
        let size = 30
        let fontFamily = 'Lato'

        // 绘制左侧三角形中的点
        this.drawMarker(type, 'red', label, size, fontFamily, sample.leftPoint)

        // 绘制右侧三角形中的点
        this.drawMarker(type, 'red', label, size, fontFamily, sample.rightPoint)

        // 绘制顶部菱形中的点
        this.drawMarker(type, 'red', label, size, fontFamily, sample.topPoint)
      }
    },
    drawMarker (type, fillColor, label, size, fontFamily, centerPoint) {
      // ☆★○●◇◆□■△▲
      if (this.context && centerPoint) {
        if (type === 'text') {
          // 文本
          this.context.fillStyle = fillColor
          this.context.font = `${size}px ${fontFamily}`
          this.context.fillText(label, centerPoint.x, centerPoint.y)
        } else if (type === 'rect') {
          // 正方形
          // 设置填充样式
          this.context.fillStyle = fillColor
          this.context.fillRect(centerPoint.x, centerPoint.y, size, size)
        } else {
          // 圆形
          // 设置填充样式
          this.context.fillStyle = fillColor
          this.context.font = `${size}px ${fontFamily}`
          this.context.fillText("●", centerPoint.x, centerPoint.y)
        }
        this.context.restore()
      }
    }
  },

  destroyed () {
    console.log('clear canvas')

    if (this.context) {
      this.context.clearRect(0, 0, this.width, this.height)
    }
  }
}
</script>

<style scoped>
.map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
}
</style>
