// 离子单位转换服务
import SampleWater from '../models/SampleWater'

// 从毫克每升转换为毫克当量每升
export const convertToMeq = data => {
  const sample = new SampleWater(data)
  sample.ca = data.ca / 40
  sample.mg = data.mg / 24
  sample.kna = data.kna / 25
  sample.hco3 = data.hco3 / 61
  sample.co3 = data.co3 / 60
  sample.cl = data.cl / 35.5
  sample.so4 = data.so4 / 96
  return sample
}

// 从毫克每升转换为毫克当量百分比
export const convertToMeqPercent = data => {
  const sample = convertToMeq(data)
  let positiveIon = sample.ca + sample.kna + sample.mg
  let nagitiveIcon = sample.hco3 + sample.co3 + sample.so4 + sample.cl
  sample.ca = (sample.ca * 100) / positiveIon
  sample.mg = (sample.mg * 100) / positiveIon
  sample.kna = (sample.kna * 100) / positiveIon
  sample.hco3 = (sample.hco3 * 100) / nagitiveIcon
  sample.co3 = (sample.co3 * 100) / nagitiveIcon
  sample.so4 = (sample.so4 * 100) / nagitiveIcon
  sample.cl = (sample.cl * 100) / nagitiveIcon
  return sample
}

// 计算阴阳离子误差
export const getDeviation = data => {
  const sample = convertToMeq(data)
  let positiveIon = sample.ca + sample.kna + sample.mg
  let nagitiveIcon = sample.hco3 + sample.co3 + sample.so4 + sample.cl
  return (
    Math.abs((positiveIon - nagitiveIcon) * 100) / (positiveIon + nagitiveIcon)
  )
}
 // 计算TDS值
export const getCacluteTDS = data => {
   const sample = new SampleWater(data)
   return sample.ca + sample.mg + sample.kna + sample.so4 + sample.cl + 0.5 * sample.hco3
 }

 // 钠钙质量浓度比值
export const getNaCaDensRatio = data => {
   const sample = new SampleWater(data)
   return sample.kna / (sample.ca + sample.mg)
 }

// // 总硬度（CaCO3 mg/L）
// const getTotalHardness = data => {
//   const sample = new SampleWater(data)
//   return 
// }
// // 总碱度（CaCO3 mg/L）
// const getTotalAlkali = data => {
//   const sample = new SampleWater(data)
// }

 // 碱硬度比
export const getAlkaliHardnessRatio = data => {
  const sample = new SampleWater(data)
  return (0.82 * sample.hco3) / (2.497 * sample.ca + 4.118 * sample.mg)
}
// 钠氯比
export const getNaClRatio = data => {
  const sample = convertToMeq(data)
  return sample.kna / sample.cl
}

