const express = require('express')
const router = express.Router()

const { create, update, remove, getAll, bulkCreate } = require('../controller/PendingSample')

router.post('/all', getAll)
router.post('/bulk', bulkCreate)
router
  .route('/')
  .post(create)
  .put(update)
  .delete(remove)

module.exports = router
