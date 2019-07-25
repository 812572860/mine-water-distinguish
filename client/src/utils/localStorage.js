/**
 * 存储localStorage
 */
export const setStore = (key, content, expire = 0) => {
  if (!key) return
  let info = {
    data: content,
    time: Date.now(),
    expire: expire * 6000 * 60 // 以小时为单位
  }
  window.localStorage.setItem(key, JSON.stringify(info))
}

/**
 * 获取localStorage
 */
export const getStore = key => {
  if (!key) {
    return
  }
  let val = window.localStorage.getItem(key)
  if(val) {
    let info = JSON.parse(val)
    if (Date.now() - info.time > info.expire) {
      window.localStorage.removeItem(key)
      return null
    }
    return info.data
  }
  
  return val
}

/**
 * 删除某个localStorage
 */
export const removeStore = key => {
  if (!key) return
  window.localStorage.removeItem(key)
}
