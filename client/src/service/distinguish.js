// 水质指标识别法服务
import SampleWater from '../models/SampleWater'
import {
  getCacluteTDS,
  convertToMeqPercent,
  getNaCaDensRatio,
  getAlkaliHardnessRatio,
  getNaClRatio
} from './unitTranform'

// const distinguishResult = {
//   laokongOrHunhe: { text: '老空水或混合水' },
//   shayan: { text: '砂岩水' },
//   shayanWithSO4: { text: '硫酸盐较高的砂岩水' },
//   shayanWithCl: { text: '氯化物较高的砂岩水' },
//   shayanOrHunhe: { text: '砂岩水或混合水' },
//   meizhongliu: { text: '受煤中硫影响的矿井水' },
//   hunheMainHuiyan: { text: '灰岩水为主的混合水' },
//   hunheMainShayan: { text: '砂岩水为主的混合水' },
//   hunheWithCl: { text: '氯化物略高的混合水' }
// }

export const getDistinguishResult = data => {
  const sample = new SampleWater(data)
  const sampleMeqPercent = convertToMeqPercent(data)
  if (!sample.TDS || sample.TDS <= 0) sample.TDS = getCacluteTDS(data)
  if (sample.TDS < 1000) {
    return tdsLower1000(sample, sampleMeqPercent)
  } else if (sample.TDS >= 1000 && sample.TDS < 1200) {
    return tdsLower1200(sample, sampleMeqPercent)
  } else if (sample.TDS >= 1200 && sample.TDS < 1500) {
    return tdsLower1500(sample, sampleMeqPercent)
  } else {
    return tdsGreater1500(sample, sampleMeqPercent)
  }
}

// TDS＜1000 mg/L
const tdsLower1000 = (sample, sampleMeqPercent) => {
  if (
    sample.so4 >= 500 ||
    sampleMeqPercent.so4 >= 50 ||
    sampleMeqPercent.so4 >= sampleMeqPercent.hco3 ||
    sampleMeqPercent.so4 + sampleMeqPercent.cl >= 60 ||
    sample.sampleCharacter.indexOf('臭鸡蛋味') > -1
  ) {
    return '老空水或混合水'
  } else if (sampleMeqPercent.kna >= 80) {
    return knaPercentGreater80(sample, sampleMeqPercent)
  } else if (sampleMeqPercent.kna >= 50 && sampleMeqPercent.kna < 80) {
    return knaPercentLower80(sample, sampleMeqPercent)
  } else if (sampleMeqPercent.kna >= 20 && sampleMeqPercent.kna < 50) {
    return knaPercentLower50(sample, sampleMeqPercent)
  } else {
    return knaPercentLower20(sample, sampleMeqPercent)
  }
}
// 1000≤TDS＜1200 mg/L
const tdsLower1200 = (sample, sampleMeqPercent) => {
  let nacaRatio = getNaCaDensRatio(sample)
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if(sample.co3 !== 0 || nacaRatio >= 10 || alkaliHardnessRatio >= 5 || sampleMeqPercent.kna >= 80) {
    return '以砂岩水为主的混合水'
  } else {
    if(sample.so4 >= 300 || sampleMeqPercent.so4 >= 40) {
      return '受煤中硫影响的混合水'
    } else {
      if(sampleMeqPercent.kna >= 50) {
        return '以砂岩水为主的混合水'
      } else {
        return '以灰岩水为主的混合水'
      }
    }
  }
}
// 1200≤TDS＜1500 mg/L
const tdsLower1500 = (sample, sampleMeqPercent) => {
  let nacaRatio = getNaCaDensRatio(sample)
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if (sample.co3 !== 0 || nacaRatio >= 10 || alkaliHardnessRatio >= 5 || sampleMeqPercent.kna >= 80) {
    return '以砂岩水为主的老空水'
  } else {
    if (sample.so4 >= 300 || sampleMeqPercent.so4 >= 40) {
      return '受煤中硫影响的老空水'
    } else {
      if (sampleMeqPercent.kna >= 50) {
        return '以砂岩水为主的老空水'
      } else {
        return '以灰岩水为主的老空水'
      }
    }
  }
}
// TDS≥1500mg/L
const tdsGreater1500 = (sample, sampleMeqPercent) => {
  let nacaRatio = getNaCaDensRatio(sample)
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if (
    sample.co3 !== 0 ||
    nacaRatio >= 10 ||
    alkaliHardnessRatio >= 50 ||
    sampleMeqPercent.kna >= 80
  ) {
    return '以砂岩水为主的老空水'
  } else {
    if (sample.so4 >= 300 || sampleMeqPercent.so4 >= 40) {
      return '受煤中硫影响的老空水'
    } else {
      if (sampleMeqPercent.kna >= 50) {
        return '以砂岩水为主的老空水'
      } else {
        return '以灰岩水为主的老空水'
      }
    }
  }
}

/** TDS＜1000 mg/L */
// γNa≥80%
const knaPercentGreater80 = (sample, sampleMeqPercent) => {
  let nacaRatio = getNaCaDensRatio(sample)
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if (
    (sample.mineLayer &&
      sample.mineLayer.indexOf('己组煤') < 0 &&
      sample.mineLayer.indexOf('庚组煤') < 0) ||
    (sample.mineLayer.indexOf('己组煤') < 0 &&
      sample.sampleCharacter.indexOf(' 顶板水') > -1) ||
    (sample.sampleCharacter.indexOf('民井水') > -1 &&
      sample.aquifer.indexOf('平顶山砂岩') > -1) ||
    (sample.sampleCharacter.indexOf('钻孔水') > -1 &&
      sample.aquifer.indexOf('二叠系砂岩') > -1)
  ) {
    return '砂岩水'
  } else {
    if (
      (sampleMeqPercent.so4 >= 20 || sample.so4 >= 200) &&
      (sample.co3 !== 0 ||
        nacaRatio >= 5 ||
        alkaliHardnessRatio >= 1.5 ||
        sample.ca + sample.mg <= 700)
    ) {
      return '硫酸盐较高的砂岩水'
    } else {
      if (
        (sample.cl >= 100 || sampleMeqPercent.cl >= 20) &&
        (sample.co3 !== 0 ||
          nacaRatio >= 5 ||
          alkaliHardnessRatio >= 1.5 ||
          sample.ca + sample.mg <= 700)
      ) {
        return '氯化物较高的砂岩水'
      } else {
        if (
          sampleMeqPercent.kna >= 90 ||
          sample.co3 !== 0 ||
          nacaRatio >= 5 ||
          alkaliHardnessRatio >= 1.5 ||
          sample.ca + sample.mg <= 700
        ) {
          return '砂岩水'
        } else {
          return '砂岩水或混合水'
        }
      }
    }
  }
}
// 50%≤γNa＜80%
const knaPercentLower80 = (sample, sampleMeqPercent) => {
  let nacaRatio = getNaCaDensRatio(sample)
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if (
    (sample.co3 !== 0 &&
      nacaRatio >= 1.5 &&
      alkaliHardnessRatio >= 1.5 &&
      (sample.mineName &&
      sample.mineName.indexOf('八矿') < 0)) ||
    (sample.mineLayer &&
      sample.mineLayer.indexOf('己组煤') < 0 &&
      sample.mineLayer.indexOf('庚组煤') < 0) ||
    (sample.sampleCharacter.indexOf('民井水') > -1 &&
      sample.aquifer.indexOf('平顶山砂岩') > -1) ||
    (sample.sampleCharacter.indexOf('钻孔水') &&
      sample.aquifer.indexOf('二叠系砂岩') > -1)
  ) {
    return '砂岩水'
  } else {
    if (sampleMeqPercent.so4 >= 40) {
      return '受煤中硫影响的矿井水'
    } else {
      if (sample.cl >= 100 || sampleMeqPercent.cl >= 25) {
        if (nacaRatio <= 1 || alkaliHardnessRatio <= 1) {
          return '灰岩水为主的混合水'
        } else if (
          sample.co3 !== 0 ||
          alkaliHardnessRatio >= 2 ||
          sample.kna >= 200 ||
          sample.ca + sample.mg <= 80
        ) {
          return '砂岩水为主的混合水'
        } else {
          return '氯化物略高的混合水'
        }
      } else {
        if (nacaRatio <= 1 || alkaliHardnessRatio <= 1) {
          return '寒灰水'
        } else if (nacaRatio > 1 && nacaRatio <= 2.2) {
          return nacaRatioLower2(sample)
        } else if (nacaRatio > 2.2 || alkaliHardnessRatio < 3) {
          return nacaRatioLower3(sample)
        } else {
          return nacaRatioGreater3(sample)
        }
      }
    }
  }
}
// 20%≤γNa＜50%
const knaPercentLower50 = (sample, sampleMeqPercent) => {
  let nacaRatio = getNaCaDensRatio(sample)
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  let naclRatio = getNaClRatio(sample)
  if (
    (sample.co3 !== 0 && nacaRatio >= 1) ||
    (sample.mineLayer &&
      sample.mineLayer.indexOf('己组煤') < 0 &&
      sample.mineLayer.indexOf('庚组煤') < 0) ||
    (sample.mineLayer.indexOf('己组煤') > -1 &&
      sample.sampleCharacter.indexOf('顶板水') > -1) ||
    (sample.sampleCharacter.indexOf('民井水') > -1 &&
      sample.aquifer.indexOf('平顶山砂岩') > -1) ||
    (sample.sampleCharacter.indexOf('钻孔水') > -1 &&
      sample.aquifer.indexOf('二叠系砂岩') > -1)
  ) {
    return '砂岩水'
  } else {
    if (sampleMeqPercent.so4 >= 40) {
      return '太灰水为主的混合水'
    } else {
      if (sample.cl >= 100 || sampleMeqPercent.cl >= 25) {
        if (nacaRatio <= 1 || alkaliHardnessRatio <= 1) {
          return '氯化物较高的寒灰水'
        } else if (
          sample.co3 !== 0 ||
          alkaliHardnessRatio >= 1 ||
          sample.na >= 200 ||
          sample.ca + sample.mg <= 80
        ) {
          return '氯化物较高的混合水'
        } else {
          return '氯化物较高的灰岩水'
        }
      } else {
        if (
          (sample.sampleCharacter.indexOf('民井水') > -1 &&
            sample.aquifer.indexOf('寒武系灰岩') > -1) ||
          (sample.sampleCharacter.indexOf('钻孔水') > -1 &&
            sample.aquifer.indexOf('寒武系灰岩') > -1) ||
          (sample.sampleCharacter.indexOf('放水孔水') > -1 &&
            sample.aquifer.indexOf('寒武系灰岩') > -1)
        ) {
          return '寒灰水'
        } else {
          if (
            nacaRatio <= 1 &&
            (sample.mineName.indexOf('五矿') > -1 ||
              sample.mineName.indexOf('二矿') > -1 ||
              sample.mineName.indexOf('十三矿') > -1 ||
              sample.mineName.indexOf('十一矿') > -1 ||
              sample.mineName.indexOf('七矿') > -1 ||
              sample.mineName.indexOf('吴寨矿') > -1)
          ) {
            if (alkaliHardnessRatio <= 1) {
              return '寒灰水'
            } else {
              return '灰岩砂岩混合水'
            }
          } else {
            if (
              sample.mineName.indexOf('八矿') > -1 &&
              sample.ca + sample.mg >= 95 &&
              nacaRatio <= 1.5 &&
              alkaliHardnessRatio <= 1.2
            ) {
              return '寒灰水'
            } else {
              if (
                sampleMeqPercent.so4 >= 30 ||
                sample.so4 >= 250 ||
                (sample.mineLayer.indexOf('庚组煤') > -1 &&
                  sample.sampleCharacter.indexOf('顶板水') > -1) ||
                ((sample.sampleCharacter.indexOf('钻孔水') > -1 ||
                  sample.sampleCharacter.indexOf('放水孔水') > -1) &&
                  (sample.aquifer.indexOf('太原组七灰') > -1 ||
                    sample.aquifer.indexOf('太原组二灰') > -1))
              ) {
                return '太灰水'
              } else {
                if (alkaliHardnessRatio >= 1 && naclRatio >= 6) {
                  return '砂岩水'
                } else {
                  if (
                    sample.tds <= 400 &&
                    nacaRatio <= 1 &&
                    alkaliHardnessRatio <= 1
                  ) {
                    return '寒灰水或浅部太灰水'
                  } else if (
                    sample.ca + sample.mg <= 70 &&
                    alkaliHardnessRatio > 1
                  ) {
                    return '砂岩水或混合水'
                  } else if (nacaRatio > 1 && alkaliHardnessRatio > 1) {
                    return '太灰砂岩混合水'
                  } else if (nacaRatio < 1 && alkaliHardnessRatio < 1) {
                    return '寒灰或混合水'
                  } else {
                    return '灰岩水货混合水'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
// γNa＜20%
const knaPercentLower20 = (sample, sampleMeqPercent) => {
  let nacaRatio = getNaCaDensRatio(sample)
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if (
    (sample.sampleCharacter.indexOf('民井水') > -1 &&
      sample.aquifer.indexOf('寒武系灰岩') > -1) ||
    (sample.sampleCharacter.indexOf('钻孔水') > -1 &&
      sample.aquifer.indexOf('寒武系灰岩') > -1) ||
    (sample.sampleCharacter.indexOf('放水孔水') > -1 &&
      sample.aquifer.indexOf('寒武系灰岩') > -1)
  ) {
    return '寒灰水'
  } else {
    if (
      (sample.mineLayer.indexOf('庚组煤') > -1 &&
        sample.sampleCharacter.indexOf('顶板水') > -1) ||
      ((sample.sampleCharacter.indexOf('钻孔水') > -1 ||
        sample.sampleCharacter.indexOf('放水孔水') > -1) &&
        (sample.aquifer.indexOf('太原组七灰') > -1 ||
          sample.aquifer.indexOf('太原组二灰') > -1))
    ) {
      return '太灰水'
    } else {
      if (sampleMeqPercent.so4 >= 40) {
        if (
          sample.kna <= 55 &&
          nacaRatio <= 0.3 &&
          alkaliHardnessRatio <= 0.75
        ) {
          return '寒灰水'
        } else {
          return '太灰水或混合水'
        }
      } else {
        if (sample.cl >= 100 || sampleMeqPercent.cl >= 25) {
          if (
            sample.kna <= 55 &&
            nacaRatio <= 0.35 &&
            alkaliHardnessRatio <= 0.75
          ) {
            return '氯化物较高的寒灰水'
          } else {
            return '氯化物较高的太灰水'
          }
        } else {
          if (
            (sample.mineLayer.indexOf('己组煤') > -1 &&
              sample.sampleCharacter.indexOf('顶板水') > -1) ||
            (sample.sampleCharacter.indexOf('民井水') > -1 &&
              sample.aquifer.indexOf('平顶山砂岩') > -1) ||
            (sample.sampleCharacter.indexOf('钻孔水') > -1 &&
              sample.aquifer.indexOf('二叠系砂岩') > -1)
          ) {
            return '砂岩水或混合水'
          } else {
            if (
              (sample.mineName.indexOf('十三矿') > -1 ||
                sample.mineName.indexOf('吴寨矿') > -1 ||
                sample.mineName.indexOf('二矿') > -1 ||
                sample.mineName.indexOf('五矿') > -1) &&
              sampleMeqPercent.cl + sampleMeqPercent.so4 >= 30
            ) {
              if (
                sample.na <= 55 &&
                nacaRatio <= 0.35 &&
                alkaliHardnessRatio <= 1
              ) {
                return '寒灰水'
              } else {
                return '太灰水或混合水'
              }
            } else {
              if (
                sample.mineName.indexOf('八矿') > -1 &&
                sample.ca + sample.mg >= 90 &&
                nacaRatio <= 0.3 &&
                alkaliHardnessRatio <= 1.2
              ) {
                return '寒灰水'
              } else {
                if (sampleMeqPercent.so4 >= 20 || sample.so4 >= 200) {
                  if (
                    sample.mineName.indexOf('十一矿') > -1 ||
                    sample.mineName.indexOf('七矿') > -1 ||
                    sample.mineName.indexOf('五矿') > -1
                  ) {
                    return '寒灰或浅部太灰水'
                  } else {
                    return '寒灰水或二灰水'
                  }
                } else {
                  if (
                    nacaRatio >= 1 ||
                    alkaliHardnessRatio >= 1 ||
                    sample.tds >= 500
                  ) {
                    if (
                      sample.mineLevel.indexOf('一水平') >= -1 ||
                      sample.mineLevel.indexOf('浅部') >= -1
                    ) {
                      return '太灰水'
                    } else if (sample.sampleCharacter.indexOf('井筒水') > -1) {
                      return '泥灰岩水'
                    } else if (
                      sample.mineName.indexOf('十三矿') > -1 ||
                      sample.mineName.indexOf('吴寨矿') > -1 ||
                      sample.mineName.indexOf('二矿') > -1 ||
                      sample.mineName.indexOf('五矿') > -1 ||
                      sample.mineName.indexOf('七矿') > -1 ||
                      sample.mineName.indexOf('八矿') > -1
                    ) {
                      return '寒灰水'
                    } else {
                      return '寒灰水或浅部太灰水'
                    }
                  } else {
                    return '寒灰水或浅部太灰水'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

// 1.0＜ρNa/ρCa≤2.2
const nacaRatioLower2 = sample => {
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if (
    alkaliHardnessRatio <= 1.6 &&
    (sample.mineName.indexOf('八矿') > -1 ||
      sample.mineName.indexOf('五矿') > -1 ||
      sample.mineName.indexOf('十三矿') > -1 ||
      sample.mineName.indexOf('二矿') > -1 ||
      sample.mineName.indexOf('十矿') > -1)
  ) {
    return '寒灰水'
  } else {
    if (sample.ca + sample.mg <= 70) {
      return '砂岩水'
    } else {
      return '灰岩砂岩混合水'
    }
  }
}
// 2.2＜ρNa/ρCa＜3.0
const nacaRatioLower3 = sample => {
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if (
    sample.co3 !== 0 ||
    alkaliHardnessRatio >= 2 ||
    sample.na >= 200 ||
    sample.ca + sample.mg <= 80
  ) {
    return '砂岩水'
  } else {
    return '灰岩砂岩混合水'
  }
}

// ρNa/ρCa≥3.0
const nacaRatioGreater3 = sample => {
  let alkaliHardnessRatio = getAlkaliHardnessRatio(sample)
  if (
    sample.co3 !== 0 ||
    alkaliHardnessRatio >= 2.5 ||
    sample.na >= 200 ||
    sample.ca + sample.mg <= 80
  ) {
    return '砂岩水'
  } else {
    return '灰岩砂岩混合水'
  }
}
