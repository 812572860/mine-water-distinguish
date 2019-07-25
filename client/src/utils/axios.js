import axios from 'axios'

const serivce = axios.create({
  baseURL: '',
  timeout: 10000
})
serivce.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 回复拦截，主要针对部分回掉数据状态码进行处理
serivce.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    return Promise.reject(error.response && error.response.data.error || {message: '服务连接失败，请检查网络或检查服务是否未开启！'})
  }
)
export default serivce
