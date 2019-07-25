<template>
  <div class="container">
    <span class="title">Piper三线图</span>
    <div class="main">
      <div class="piper" :style="{ height: height + 20 + 'px' }">
        <PiperBase
          :width="width"
          :height="height"
          :startPoint="startPoint"
          :sideLength="sideLength"
          :spaceLength="spaceLength"
        />
        <PiperPoint
          :width="width"
          :height="height"
          :startPoint="startPoint"
          :sideLength="sideLength"
          :spaceLength="spaceLength"
          :data="sampleList"
          :sources="sourceList"
          :pendingSample="pendingSample"
        />
      </div>
      <div class="legend">
        <PiperLegend
          :sources="sourceList"
          :pendingSample="pendingSample"
          @checkChanged="onChangeSourceVisible"
        />
      </div>
    </div>
  </div>
</template>

<script>

import Point from '@/models/Point'

import PiperBase from './piper/Base'
import PiperLegend from './piper/Legend'
import PiperPoint from './piper/SamplePoint'
export default {
  components: {
    PiperBase,
    PiperLegend,
    PiperPoint
  },
  props: {
    width: {
      type: Number,
      default: 800
    },
    height: {
      type: Number,
      default: 600
    },
    startPoint: {
      type: Object,
      default: () => new Point([50, 20])
    },
    sideLength: {
      type: Number,
      default: 300
    },
    spaceLength: {
      type: Number,
      default: 20
    },
    // 待判水样点
    pendingSample: {
      type: Object
    },
    showSamplesOnLoad: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      sourceList: [],
      sampleList: [],
    }
  },
  computed: {

  },
  created () {
    this.sampleList = this.$store.state.standardSample.list.map(item => {
      item.visible = this.showSamplesOnLoad
      return item
    })
    this.sourceList = this.$store.getters['baseInfo/sampleSourceList'].map(item => {
      item.visible = this.showSamplesOnLoad
      return item
    })
  },
  methods: {
    onChangeSourceVisible (source, visible) {
      const self = this
      this.sampleList = [...this.sampleList].map(item => {
        if (item.sampleSource === source.code || item.sampleSource === source.name) {
          item.visible = visible
        } else if (source.code === '' && self.sourceList.findIndex( s => s.code === item.sampleSource || s.name === item.sampleSource) < 0) {
          item.visible = visible
        }
        return item
      })
    }
  },
}
</script>

<style scoped>
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
  margin-top: 20px;
}
</style>
