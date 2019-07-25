<template>
  <CanvasMap
    :width="width"
    :height="height"
    @loaded="onLoadBorder"
  >
    <!--多边形外框-->
    <CanvasPolygon
      v-for="(points, index) in polygonList"
      :key="index"
      :points="points"
      lineColor="black"
      :lineWidth="2"
    />
    <!-- 内部虚线标尺 -->
    <CanvasLine
      v-for="(points, index) in dashLineList"
      :key="'line' + index"
      :points="points"
      lineColor="black"
      :lineDash="[5, 10]"
    />
    <!-- 外部刻度标注 -->
    <CanvasMarker
      v-for="(item, index) in labelList"
      :key="'label' + index"
      :point="item.point"
      :label="item.label"
      type="text"
      fillColor="black"
    />
    <!-- 外部离子标注 -->
    <CanvasMarker
      v-for="(item, index) in ionLabelList"
      :key="'ionlabel' + index"
      :point="item.point"
      :label="item.label"
      :anchor="item.anchor"
      :size="16"
      type="text"
      fillColor="black"
    />
  </CanvasMap>
</template>

<script>
import { getBorderPoints, getScaleplatePoints, getIconLabelPoints } from '@/service/piper'

import Point from '@/models/Point'
import Line from '@/models/Line'
export default {
  props: {
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 400
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
      polygonList: [],
      dashLineList: [],
      labelList: [],
      ionLabelList: []
    }
  },
  methods: {
    onLoadBorder () {
      // 外框端点
      let endPoints = getBorderPoints(this.startPoint, this.sideLength, this.spaceLength)
      this.polygonList = Object.values(endPoints)
      this.ionLabelList = getIconLabelPoints(endPoints)
      let scaleplates = getScaleplatePoints(this.sideLength)
      this.dashLineList = scaleplates.dashLines
      this.labelList = scaleplates.labelPoints
    }
  }
}
</script>

<style>
</style>
