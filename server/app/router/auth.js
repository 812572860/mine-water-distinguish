const express = require('express')
const router = express.Router()

const {
  signIn,
  loginIn,
  updateUser,
  deleteUser,
  checkUsername,
  getList,
  changePassword
} = require('../controller/User')

router.post('/signIn', signIn)
router.post('/loginIn', loginIn)
router.put('/', updateUser)
router.delete('/', deleteUser)
router.post('/duplicate', checkUsername)
router.post('/all', getList)
router.put('/password', changePassword)

module.exports = router
