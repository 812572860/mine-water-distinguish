
<script>
import Point from '@/models/Point'
export default {
  name: 'CanvasMarker',
  props: {
    data: {
      type: [Object, String]
    },
    // 二维坐标点
    point: {
      type: [Object],
      default: () => new Point()
    },
    // 设置填充样式
    fillColor: {
      type: String
    },
    // 样子，圆形circle or 正方形rect or 文本text
    type: {
      type: String,
      default: 'circle'
    },
    // 半径 or 宽
    size: {
      type: Number,
      default: 10
    },
    // 相对于左上角的偏移量，[0,0]表示左上角坐标为point,[1,1]表示右下角坐标为point
    anchor: {
      type: Array,
      default: () => [0.5, 0.5]
    },
    // 若绘制文本，设置文本样式
    fontFamily: {
      type: String,
      default: 'Lato'
    },
    // 文本内容
    label: {
      type: String,
      default: ''
    }
  },
  inject: {
    mapCtx: {
      default () {
        return null
      }
    },
  },
  computed: {
    canvas () {
      return this.mapCtx && this.mapCtx.canvas
    },
    context () {
      return this.mapCtx && this.mapCtx.context
    },
    centerPoint () {
      return new Point([this.point.x - this.anchor[0] * this.size, this.point.y - this.anchor[1] * this.size])
    }
  },
  render () {
    return null
  },
  created () {
    this.drawMarker(this.fillColor)
  },
  // destroyed() {
  //   console.log(this.data)
  //   this.drawMarker('white',true)
  // },
  methods: {
    drawMarker (fillColor, isClear = false) {
      // ☆★○●◇◆□■△▲
      if (this.context && this.point) {
        if (this.type === 'text') {
          // 文本
          this.context.fillStyle = fillColor
          this.context.font = `${this.size}px ${this.fontFamily}`
          this.context.fillText(this.label, this.centerPoint.x, this.centerPoint.y)
        } else if (this.type === 'rect') {
          // 正方形
          // 设置填充样式
          this.context.fillStyle = fillColor
          
          if(isClear) {
            this.context.clearRect(this.centerPoint.x, this.centerPoint.y, this.size, this.size)
          } else {
            this.context.fillRect(this.centerPoint.x, this.centerPoint.y, this.size, this.size)
          }
        } else {
          // 圆形
          // 设置填充样式
          this.context.fillStyle = fillColor
          // this.context.arc(this.point.x, this.point.y, this.size, 0, Math.PI * 2, true)
          // this.context.fill()
          this.context.font = `${this.size}px ${this.fontFamily}`
          this.context.fillText("●", this.centerPoint.x, this.centerPoint.y)
          // let img = new Image()
          // img.src = '/imgs/A.png'
          // img.onload = () => {
          //   this.context.drawImage(img, centerPoint.x, centerPoint.y)
          // }
          // img.onclick = () => {
          //   this.$emit('click', this.data)
          // }
        }
        this.context.restore()
        // if (this.canvas && this.data) {
        //   this.canvas.onclick = (e) => {
        //     console.log(e)
        //     if(this.isPointInStroke(this.type, {x: e.x, y: e.y})) {
        //       this.$emit('click', this.data)
        //     }
        //   }
        // }
      }
    },
    isPointInStroke (type, point) {
      let isIn = false
      if (type === 'rect') {
        let centerPoint = new Point([this.point.x - this.anchor[0] * this.size, this.point.y - this.anchor[1] * this.size])
        this.context.rect(centerPoint.x, centerPoint.y, this.size, this.size)
        isIn = this.context.isPointInPath(point.x, point.y)
        this.context.clearRect(centerPoint.x, centerPoint.y, this.size, this.size)
      } else {

      }
      return isIn
    }
  },
}
</script>

<style>
</style>
