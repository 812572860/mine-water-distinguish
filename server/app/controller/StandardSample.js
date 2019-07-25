const { write } = require('../utils/response')

const StandardManager = require('../service/water/StandardManager')

exports.create = (req, res, next) => {
  new StandardManager().create(req.body, write.bind(null, res))
}
exports.bulkCreate = (req, res, next) => {
  new StandardManager().bulkCreate(req.body, write.bind(null, res))
}

exports.update = (req, res, next) => {
  new StandardManager().update(req.body, write.bind(null, res))
}

exports.remove = (req, res, next) => {
  new StandardManager().remove(req.body, write.bind(null, res))
}

exports.getAll = (req, res, next) => {
  new StandardManager().getAll(req.body, write.bind(null, res))
}
