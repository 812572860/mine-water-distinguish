import axios from '../utils/axios'
import {getConfig} from './index'

export const login = (username, password) => axios.post(getConfig().serverUrl + '/auth/loginIn', { username, password })

export const signin = info => axios.post(getConfig().serverUrl + '/auth/signIn', info)

export const getUserList = params => axios.post(getConfig().serverUrl + '/auth/all', params)

export const saveUser = info => {
  if(info.id && info.id > 0) {
    delete info.password
    return axios.put(getConfig().serverUrl + '/auth', info)
  } else {
    return signin(info)
  }
}

export const checkUsername = info => axios.post(getConfig().serverUrl + '/auth/duplicate', info)

export const changePassword = info => axios.put(getConfig().serverUrl + '/auth/password', info)

export const removeUser = info => axios.delete(getConfig().serverUrl + '/auth', {data: info})