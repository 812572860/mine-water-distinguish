<template>
  <div class="l-form">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      style="margin: 15px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="水样编号" prop="sampleNo">
            <el-input v-model="form.sampleNo"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="取样时间" prop="sampleTime">
            <el-date-picker
              v-model="form.sampleTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="取样位置" prop="samplePlace">
            <el-input v-model="form.samplePlace"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="矿井名称" prop="mineName">
            <el-select v-model="form.mineName">
              <el-option
                v-for="(item, index) in mineList"
                :key="index"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开采煤层" prop="mineLayer">
            <el-select v-model="form.mineLayer">
              <el-option
                v-for="(item, index) in mineLayerList"
                :key="index"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开采水平" prop="mineLevel">
            <el-select v-model="form.mineLevel">
              <el-option
                v-for="(item, index) in mineLevelList"
                :key="index"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="水样特点" prop="sampleCharacter">
            <el-select v-model="form.sampleCharacter">
              <el-option
                v-for="(item, index) in sampleCharacterList"
                :key="index"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="充水层" prop="aquifer">
            <el-select v-model="form.aquifer">
              <el-option
                v-for="(item, index) in aquiferList"
                :key="index"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="8">
          <el-form-item label="充水水源" prop="sampleSource">
            <el-select v-model="form.sampleSource">
              <el-option
                v-for="(item, index) in sampleSourceList"
                :key="index"
                :value="item.name"
                :label="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Ca (mg/L)" prop="ca">
            <el-input-number
              v-model="form.ca"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Mg (mg/L)" prop="mg">
            <el-input-number
              v-model="form.mg"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="K+Na (mg/L)" prop="kna">
            <el-input-number
              v-model="form.kna"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="HCO3 (mg/L)" prop="hco3">
            <el-input-number
              v-model="form.hco3"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="CO3 (mg/L)" prop="co3">
            <el-input-number
              v-model="form.co3"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="Cl (mg/L)" prop="cl">
            <el-input-number
              v-model="form.cl"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="SO4 (mg/L)" prop="so4">
            <el-input-number
              v-model="form.so4"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="TDS (mg/L)" prop="TDS">
            <el-input-number
              v-model="form.tds"
              controls-position="right"
              :min="0"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="水温 (℃)" prop="waterTemperature">
            <el-input-number
              v-model="form.waterTemperature"
              controls-position="right"
              :min="-30"
              :max="100"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="数据来源" prop="dataSource">
            <el-input v-model="form.dataSource"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dataButton">
      <el-button @click="$emit('onCancel')">关闭</el-button>
      <el-button @click="onSubmit" type="primary">提交</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SampleWater from '@/models/SampleWater'
export default {
  props: {
    data: {
      type: Object,
      default: () => new SampleWater()
    }
  },
  data () {
    return {
      form: Object.assign({}, this.data),
      rules: {}
    }
  },
  computed: {
    ...mapGetters({
      mineList: 'baseInfo/mineList',
      mineLayerList: 'baseInfo/mineLayerList',
      mineLevelList: 'baseInfo/mineLevelList',
      sampleCharacterList: 'baseInfo/sampleCharacterList',
      aquiferList: 'baseInfo/aquiferList',
      sampleSourceList: 'baseInfo/sampleSourceList'
    })
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit('saveData', this.form)
        }
      })
    }
  },
}
</script>

<style lang="scss">
.dataButton {
  text-align: right
}
</style>
