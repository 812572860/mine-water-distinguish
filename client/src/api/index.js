import axios from '@/utils/axios'

export const getConfig = () => window.sysConfig

/**
 * 基础设置信息
 */
// 获取全部配置信息
export const getAllBaseInfoList = () =>
  axios.get(getConfig().serverUrl + '/config/all')
// 保存一个配置
export const saveBaseInfo = info => {
  if (info.id) {
    return axios.put(getConfig().serverUrl + '/config', info)
  } else {
    return axios.post(getConfig().serverUrl + '/config', info)
  }
}
// 增加一个配置
export const createBaseInfo = info =>
  axios.post(getConfig().serverUrl + '/config', info)
// 修改一个配置
export const updateBaseInfo = info =>
  axios.put(getConfig().serverUrl + '/config', info)
// 删除一个配置
export const deleteBaseInfo = info =>
  axios.delete(getConfig().serverUrl + '/config', info)

/**
 * 文件相关
 */
// 下载水样数据模板
export const downloadTemplateFile = () => {
  let iframe = document.createElement('iframe')
  iframe.style.display = 'none'
  iframe.src =
    getConfig().serverUrl + '/file/download?filename=水样数据模板.xlsx'
  iframe.onload = function() {
    document.body.removeChild(iframe)
  }
  document.body.appendChild(iframe)
}
