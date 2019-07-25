export const getConfig = () => {
  const config = window.sysConfig
  return {
    sysName: config.sysName,
    serverUrl: config.serverUrl
  }
}