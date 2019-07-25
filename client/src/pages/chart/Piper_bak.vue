<template>
  <div class="container">
    <span class="title">Piper三线图</span>
    <div class="main">
      <div class="piper" :style="{ height: height + 20 + 'px' }">
        <CanvasMap
          canvasId="base"
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
        <CanvasMap
          canvasId="piper"
          :width="width"
          :height="height"
          @loaded="onLoadPiper"
        >
          <!-- 水样点 -->
          <!-- 待判水样点 -->
          <template v-if="pendingSamplePoint">
            <CanvasMarker
              :data="pendingSamplePoint.info"
              :point="pendingSamplePoint.leftPoint"
              :size="25"
              :anchor="[0, 0]"
              type="text"
              label="★"
              fillColor="red"
              @click="onSelectSample"
            />
            <CanvasMarker
              :data="pendingSamplePoint.info"
              :point="pendingSamplePoint.rightPoint"
              :size="25"
              :anchor="[0, 0]"
              type="text"
              label="★"
              fillColor="red"
              @click="onSelectSample"
            />
            <CanvasMarker
              :data="pendingSamplePoint.info"
              :point="pendingSamplePoint.topPoint"
              :size="25"
              :anchor="[0, 0]"
              type="text"
              label="★"
              fillColor="red"
              @click="onSelectSample"
            />
          </template>
          
          <!-- 标准水样 -->
          <div v-for="item in samplePointList" :key="item.id">
            <CanvasMarker
              :data="item.info"
              :point="item.leftPoint"
              :size="25"
              :anchor="[0, 0]"
              :fillColor="item.fillColor || 'grey'"
              @click="onSelectSample"
            />
            <CanvasMarker
              :point="item.rightPoint"
              :size="25"
              :anchor="[0, 0]"
              :fillColor="item.fillColor || 'grey'"
            />
            <CanvasMarker
              :point="item.topPoint"
              :size="25"
              :anchor="[0, 0]"
              :fillColor="item.fillColor || 'grey'"
            />
          </div>
        </CanvasMap>
      </div>
      <div class="legend">
        <div class="legend-border">
          <span style="text-align:center;font-size:22px;letter-spacing:5px;margin-bottom:10px;">
            图例</span
          >
          <div
            v-for="item in legendList"
            :key="item.id"
            style="display:flex;align-items:center;padding:5px"
          >
            <div
              class="legend-icon"
              :style="{ 'background-color': item.color }"
            ></div>
            <span>{{ item.name }}</span>
            <Checkbox
                :label="item.id"
                @change="
                  v => {
                    onCheckChange(item.id, v);
                  }
                "
                :value="false"
              />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CanvasMap from '@/components/canvas/Map'
import CanvasPolygon from '@/components/canvas/Polygon'
import CanvasLine from '@/components/canvas/Line'
import CanvasMarker from '@/components/canvas/Marker'

import { getBorderPoints, getScaleplatePoints, getIconLabelPoints, getSamplePoint, getWaterSourceColor } from '@/service/piper'

import Point from '@/models/Point'
import Line from '@/models/Line'
export default {
  components: {
    CanvasMap,
    CanvasPolygon,
    CanvasLine,
    CanvasMarker
  },
  props: {
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
    // let clientWidth = document.documentElement.clientWidth
    // let clientHeight = document.documentElement.clientHeight
    return {
      // width: clientWidth / 2,
      // height: clientHeight * 3 / 4 + 20,
      // startPoint: new Point([50, 20]),
      // sideLength: clientHeight * 3 / 8,
      // spaceLength: clientHeight / 25,
      polygonList: [],
      dashLineList: [],
      samplePointList: [],
      labelList: [],
      ionLabelList: [],
      legendList: [],
      pendingSamplePoint: null
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
    },
    onLoadPiper () {
      let sources = [...this.sources]
      let samples = [...this.data]
      // 根据水源设置颜色
      let resultWithColor = getWaterSourceColor(sources)
      this.legendList = resultWithColor.sources
      
      this.samplePointList = samples.map(item => getSamplePoint(item, this.startPoint, this.sideLength, this.spaceLength, sources))
      if(this.pendingSample) {
        this.pendingSamplePoint = getSamplePoint(this.pendingSample, this.startPoint, this.sideLength, this.spaceLength)
      }
    },
    onSelectSample (sample) {
      this.$emit('selectSample', sample)
    },
    onCheckChange (item) {

    }
  },
}

</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}
.main {
  position: relative;
  height: 100%;
  display: flex;
  /* flex-direction: column; */
  align-items: center;
}
.title {
  font-size: 32px;
  display: block;
  text-align: center;
}
.piper {
  position: relative;
  width: 70%;
  /* height: 100%; */
}
.legend {
  width: 20%;
  height: 100%;
  position: relative;
}
.legend-border {
  width: 100%;
  height: auto;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  /* border: 1px solid black; */
}
.legend-icon {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: none;
  margin-right: 10px;
  margin-left: 10px;
}
</style>
