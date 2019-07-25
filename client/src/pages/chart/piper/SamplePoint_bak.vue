<template>
  <!-- 水样点 -->
  <CanvasMap
    :width="width"
    :height="height"
    @loaded="onLoadPiper"
  >
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
</template>

<script>
import { getSamplePoint, getWaterSourceColor } from '@/service/piper'

import Point from '@/models/Point'
export default {
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
    return {
      samplePointList: [],
      pendingSamplePoint: null
    }
  },
  computed: {

  },
  watch: {
    data: {
      handler (val) {
        debugger
        let samples = val.filter(item => item.visible)
        this.samplePointList = samples.map(item => getSamplePoint(item, this.startPoint, this.sideLength, this.spaceLength, this.sources))
      },
      deep: true
    }
  },
  methods: {
    onLoadPiper () {
      let sources = [...this.sources]
      // let samples = [...this.data]
      // 根据水源设置颜色
      let resultWithColor = getWaterSourceColor(sources)
      this.legendList = resultWithColor.sources

      // this.samplePointList = samples.map(item => getSamplePoint(item, this.startPoint, this.sideLength, this.spaceLength, sources))
      if (this.pendingSample) {
        this.pendingSamplePoint = getSamplePoint(this.pendingSample, this.startPoint, this.sideLength, this.spaceLength)
      }
    },
    onSelectSample (sample) {
      debugger
      this.$emit('selectSample', sample)
    }
  }
}
</script>

<style>
</style>
