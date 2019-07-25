<template>
  <div class="legend-border">
    <span
      style="text-align:center;font-size:22px;letter-spacing:5px;margin-bottom:10px;"
    >
      图例</span
    >
    <div class="legend-item" v-if="pendingSample">
      <span style="color: red;font-size:20px;margin:0 10px;">★</span>
      <span>{{pendingSample.sampleNo + '待判水样'}}</span>
    </div>
    <div v-for="item in legendList" :key="item.id" class="legend-item">
      <div
        class="legend-icon"
        :style="{ 'background-color': item.color }"
      ></div>
      <span>{{ item.name }}</span>
      <Checkbox
        :label="item.id"
        @change="v => onCheckChange(item, v)"
        :value="item.visible"
      />
    </div>
  </div>
</template>

<script>
import { getWaterSourceColor } from '@/service/piper'
export default {
  props: {
    sources: {
      type: [Array, Object],
      default: () => []
    },
    pendingSample: {
      type: Object
    }
  },
  data () {
    return {
      samplePointList: [],
      legendList: []
    }
  },
  created () {
    // 根据水源设置颜色
    // let resultWithColor = getWaterSourceColor([...this.sources])
    this.legendList = this.sources || []
  },
  methods: {
    onCheckChange (item, value) {
      this.$emit('checkChanged', item, value)
    }
  }
}
</script>

<style scoped>
.legend-border {
  width: 100%;
  height: auto;
  max-height: 600px;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  /* border: 1px solid black; */
}
.legend-item {
  display: flex;
  align-items: center;
  padding: 5px;
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
