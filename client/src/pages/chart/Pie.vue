<template>
  <div id="myChart" :style="{ width: '100%', height: '500px' }"></div>
</template>

<script>
import echarts from 'echarts'
import { convertToMeqPercent } from '@/service/unitTranform'
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    this.drawPie(convertToMeqPercent(this.data))
  },
  methods: {
    drawPie (data) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('myChart'))
      // 绘制图表
      myChart.setOption({
        title: {
          show: false,
          text: '阴阳离子比值饼图',
          left: 'center',
          top: 20
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {d}%"
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel']
            },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '离子',
            type: 'pie',
            radius: '80%',
            startAngle: 180,
            center: ['50%', '50%'],
            data: [
              { name: 'Ca', value: data.ca / 2 },
              { name: 'Mg', value: data.mg / 2 },
              { name: 'Na+K', value: data.kna / 2 },
              { name: 'HCO3', value: data.hco3 / 2 },
              { name: 'CO3', value: data.co3 / 2 },
              { name: 'SO4', value: data.so4 / 2 },
              { name: 'Cl', value: data.cl / 2 }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    }
  }
}
</script>

<style>
</style>
