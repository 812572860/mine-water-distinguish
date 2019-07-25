const express = require('express')
const router = express.Router()

const { create, update, remove, getAll } = require('../controller/WaterConfig')

router.get('/all', getAll )
router
  .route('/')
  .post(create)
  .put(update)
  .delete(remove)

module.exports = router
