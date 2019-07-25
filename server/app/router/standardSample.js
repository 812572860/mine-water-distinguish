const express = require('express')
const router = express.Router()

const { create, bulkCreate, update, remove, getAll } = require('../controller/StandardSample')

router.post('/all', getAll)
router.post('/bulk', bulkCreate)
router
  .route('/')
  .post(create)
  .put(update)
  .delete(remove)

module.exports = router
