
<script>
export default {
  name: 'CanvasPolygon',
  props: {
    // 二维坐标点集合
    points: {
      type: Array,
      default: () => []
    },
    // 设置线条颜色，若有透明壳采用rgba()
    lineColor: {
      type: String
    },
    // 设置填充样式，若有值，则进行填充
    fillColor: {
      type: String
    },
    // 设置线条宽度
    lineWidth: {
      type: Number,
      default: 1.0
    },
    /*
      用来设置线条末端样式
      butt: 线段末端以方形结束,
      round: 线段末端以圆形结束,
      square:线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域
     */
    lineCap: {
      type: String,
      default: 'butt'
    },
    /**
     * 设定线条与线条间接合处的样式
     * round: 通过填充一个额外的，圆心在相连部分末端的扇形，绘制拐角的形状。 圆角的半径是线段的宽度
     * bevel: 在相连部分的末端填充一个额外的以三角形为底的区域， 每个部分都有各自独立的矩形拐角
     * miter: 通过延伸相连部分的外边缘，使其相交于一点，形成一个额外的菱形区域
     */
    lineJoin: {
      type: String,
      default: 'miter'
    },
    // 限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度
    miterLimit: {
      type: Number,
      default: 10.0
    },
    // 一组描述交替绘制线段和间距（坐标空间单位）长度的数字，若有值，则表示线为虚线。如[5,10]
    lineDash: {
      type: Array
    },
    // 设置虚线样式的起始偏移量, 实现蚂蚁线效果
    lineDashOffset: {
      type: Number,
      default: 0
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
    context () {
      return this.mapCtx && this.mapCtx.context
    },
  },
  render() {
    return ''
  },
  created () {
    this.drawLine()
  },
  methods: {
    drawLine () {
      if (this.context && this.points && this.points.length) {
        this.context.beginPath()
        // 设置线宽
        this.context.lineWidth = this.lineWidth
        // 设置线颜色
        this.context.strokeStyle = this.lineColor
        // 设置填充样式
        this.context.fillStyle = this.fillColor
        // 设置线条末端样式
        this.context.lineCap = this.lineCap
        // 设置线条交接处样式
        this.lineJoin = this.lineJoin
        // 设置线条相交时线条长度
        this.context.miterLimit = this.miterLimit
        // 是否为虚线
        if (this.lineDash) {
          this.context.setLineDash(this.lineDash)
          this.context.lineDashOffset = this.lineDashOffset
        }
        this.context.moveTo(this.points[0].x, this.points[0].y)
        for (let i = 1; i < this.points.length; i++) {
          this.context.lineTo(this.points[i].x, this.points[i].y)
        }
        this.context.closePath()
        // 绘制边框
        if (this.lineColor) this.context.stroke()
        // 填充颜色
        if(this.fillColor) this.context.fill()
        this.context.restore()
      }
    }
  },
}
</script>

<style>
</style>
