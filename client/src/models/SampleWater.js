import moment from 'moment'
class SampleWater{
  constructor(args) {
    let temp = {}
    if(args) {
      Object.assign(temp, args)
    }
    // 唯一标识
    this.id = temp.id
    // 矿井名称
    this.mineName = temp.mineName || ''
    // 开采煤层
    this.mineLayer = temp.mineLayer || ''
    // 开采水平
    this.mineLevel = temp.mineLevel || ''
    // 水样编号
    this.sampleNo = temp.sampleNo || ''
    // 原始编号
    this.originalNo = temp.originalNo || ''
    // 取样地点
    this.samplePlace = temp.samplePlace || ''
    // 取样时间
    this.sampleTime = (temp.sampleTime && moment(temp.sampleTime).format('YYYY-MM-DD')) || ''
    // 水样点性状
    this.sampleCharacter = temp.sampleCharacter || ''
    // 充水层（或水井、钻孔揭露的含水层）
    this.aquifer = temp.aquifer || ''
    // 充水水源
    this.sampleSource = temp.sampleSource || ''
    // 单位
    this.unit = temp.unit || 'mg/l'
    // KNa
    this.kna = temp.kna || 0
    // Ca
    this.ca = temp.ca || 0
    // Mg
    this.mg = temp.mg || 0
    // HCO3
    this.hco3 = temp.hco3 || 0
    // CO3
    this.co3 = temp.co3 || 0
    // SO4
    this.so4 =temp .so4 || 0
    // Cl
    this.cl = temp.cl || 0
    // TDS
    this.tds = temp.tds || 0
    // pH
    this.ph = temp.ph || 0
    // 水温
    this.waterTemperature = temp.waterTemperature || 0
    // 数据来源
    this.dataSource = temp.dataSource || ''
    // 备注
    this.remark = temp.remark || ''
    // 填充颜色
    this.fillColor = temp.fillColor || 'grey'
  }
}

export default SampleWater