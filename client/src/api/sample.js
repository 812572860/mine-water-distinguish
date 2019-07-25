import axios from '@/utils/axios'
import { getConfig } from '@/utils/config'
import SampleWater from '@/models/SampleWater'

/**
 * 标准水样相关api
 */
// 获取全部标准水样
export const getAllStandardSampleList = () =>
  axios.post(getConfig().serverUrl + '/standardSample/all')
// 分页获取筛选的标准水样
export const getStandardSampleListByPager = ({
  pageSize = 15,
  current = 1,
  keyword = ''
}) =>
  axios.post(getConfig().serverUrl + '/standardSample/all', {
    pager: {
      pageSize,
      current
    },
    keyword
  })
// 保存水样信息
export const saveStandardSample = info => {
  if (info instanceof Array) {
    // 数组则批量新增
    return bathCreateStandardSample(info)
  } else {
    if (info.id) {
      // 修改
      return updateStandardSample(info)
    } else {
      // 新增
      return createStandardSample(info)
    }
  }
}
// 新增一个标准水样
const createStandardSample = info => {
  const sample = new SampleWater(info)
  return axios.post(getConfig().serverUrl + '/standardSample', sample)
}
// 批量新增标准水样
const bathCreateStandardSample = infos => {
  const samples = infos && infos.map(item => new SampleWater(item))
  return axios.post(getConfig().serverUrl + '/standardSample/bulk', samples)
}
// 修改一个标准水样
const updateStandardSample = info => {
  const sample = new SampleWater(info)
  return axios.put(getConfig().serverUrl + '/standardSample', sample)
}
// 删除一个标准水样
export const deleteStandardSample = info => {
  const sample = new SampleWater(info)
  return axios.delete(getConfig().serverUrl + '/standardSample', {
    data: sample
  })
}

/**
 * 待判水样相关api
 */
// 分页获取筛选的待判水样
export const getPendingSampleListByPager = params =>
  axios.post(getConfig().serverUrl + '/pendingSample/all', params)
// 保存一个水样
export const savePendingSample = info => {
  if (info instanceof Array) {
    // 数组则批量新增
    return bathCreatePendingSample(info)
  } else {
    if (info.id && info.id > 0) {
      return updatePendingSample(info)
    } else {
      return createPendingSample(info)
    }
  }
}
// 新增一个标准水样
export const createPendingSample = info => {
  const sample = new SampleWater(info)
  return axios.post(getConfig().serverUrl + '/pendingSample', sample)
}
// 批量新增待判水样
const bathCreatePendingSample = infos => {
  const samples = infos && infos.map(item => new SampleWater(item))
  return axios.post(getConfig().serverUrl + '/pendingSample/bulk', samples)
}
// 修改一个标准水样
export const updatePendingSample = info => {
  const sample = new SampleWater(info)
  return axios.put(getConfig().serverUrl + '/pendingSample', sample)
}
// 删除一个标注水样
export const deletePendingSample = info => {
  const sample = new SampleWater(info)
  return axios.delete(getConfig().serverUrl + '/pendingSample', {
    data: sample
  })
}
