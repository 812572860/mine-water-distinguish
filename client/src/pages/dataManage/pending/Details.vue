<template>
  <div>
    <el-card shadow="hover" v-if="showResult">
      <div slot="header" class="clearfix">
        <span>基于水化学成分识别水源判别结果</span>
      </div>
      <span style="font-size: 20px;font-weight: 400;margin-left: 20px;">{{distinguishResult}}</span>
    </el-card>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="item-label">水样编号：</span>
          <span class="l-value">{{ data.sampleNo }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">矿井名称：</span>
          <span class="l-value">{{ data.mineName }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">开采煤层：</span>
          <span class="l-value">{{ data.mineLayer }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">开采水平：</span>
          <span class="l-value">{{ data.mineLevel }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">水样点性状：</span>
          <span class="l-value">{{ data.sampleCharacter }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">充水层：</span>
          <span class="l-value">{{ data.aquifer }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">充水水源：</span>
          <span class="l-value">{{ data.sampleSource }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">取样时间：</span>
          <span class="l-value">{{ data.sampleTime }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">取样地点：</span>
          <span class="l-value">{{ data.samplePlace }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">数据来源：</span>
          <span class="l-value">{{ data.dataSource }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">水温(℃)：</span>
          <span class="l-value">{{ data.waterTemperature || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">pH值：</span>
          <span class="l-value">{{ data.ph || '--' }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>原始数据（mg/l）</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="item-label">Ca：</span>
          <span class="l-value">{{ data.ca }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Mg：</span>
          <span class="l-value">{{ data.mg }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Na+K：</span>
          <span class="l-value">{{ data.kna }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">CO<sub>3</sub>：</span>
          <span class="l-value">{{ data.co3 }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">HCO<sub>3</sub>：</span>
          <span class="l-value">{{ data.hco3 }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">SO<sub>4</sub>：</span>
          <span class="l-value">{{ data.so4 }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Cl：</span>
          <span class="l-value">{{ data.cl }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">TDS：</span>
          <span class="l-value">{{ data.tds }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>毫克当量计算值（meq）</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="item-label">Ca：</span>
          <span class="l-value">{{ meqData.ca.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Mg：</span>
          <span class="l-value">{{ meqData.mg.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Na+K：</span>
          <span class="l-value">{{ meqData.kna.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">CO<sub>3</sub>：</span>
          <span class="l-value">{{ meqData.co3.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">HCO<sub>3</sub>：</span>
          <span class="l-value">{{ meqData.hco3.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">SO<sub>4</sub>：</span>
          <span class="l-value">{{ meqData.so4.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Cl：</span>
          <span class="l-value">{{ meqData.cl.toFixed(2) }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>毫克当量百分比计算值（meq%）</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="item-label">Ca：</span>
          <span class="l-value">{{ meqPercentData.ca.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Mg：</span>
          <span class="l-value">{{ meqPercentData.mg.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Na+K：</span>
          <span class="l-value">{{ meqPercentData.kna.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">CO<sub>3</sub>：</span>
          <span class="l-value">{{ meqPercentData.co3.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">HCO<sub>3</sub>：</span>
          <span class="l-value">{{ meqPercentData.hco3.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">SO<sub>4</sub>：</span>
          <span class="l-value">{{ meqPercentData.so4.toFixed(2) }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">Cl：</span>
          <span class="l-value">{{ meqPercentData.cl.toFixed(2) }}</span>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>其他指标计算值</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <span class="item-label">钠钙比：</span>
          <span class="l-value">{{ nacaRatio.toFixed(2) || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">碱硬比：</span>
          <span class="l-value">{{ alkaliHardnessRatio.toFixed(2) || '--' }}</span>
        </el-col>
        <el-col :span="6">
          <span class="item-label">钠氯比：</span>
          <span class="l-value">{{ naclRation.toFixed(2) || '--' }}</span>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { convertToMeq, convertToMeqPercent, getNaCaDensRatio, getAlkaliHardnessRatio, getNaClRatio } from '@/service/unitTranform'
import {getDistinguishResult} from '@/service/distinguish'
export default {
  props: {
    data: {
      type: Object,
      requiredf: true
    },
    showResult: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    meqData () {
      return convertToMeq(this.data)
    },
    meqPercentData () {
      return convertToMeqPercent(this.data)
    }
  },
  data() {
    return {
      nacaRatio: 0,
      alkaliHardnessRatio: 0,
      naclRation: 0,
      distinguishResult: ''
    }
  },
  mounted() {
    this.alkaliHardnessRatio = getAlkaliHardnessRatio(this.data)
    this.nacaRatio = getNaCaDensRatio(this.data)
    this.naclRation = getNaClRatio(this.data)
    this.distinguishResult = getDistinguishResult(this.data)
  },
}
</script>

<style scoped>
.el-card{
  margin-bottom: 10px;
}
.clearfix {
  font-weight: 500;
  font-size: 16px;
}
.el-col {
  margin-bottom: 8px;
  display: flex;
  flex-direction: row;
  align-items: right;
}
.item-label {
  margin-right: 16px;
  width: 100px;
  text-align: right;
}
</style>
