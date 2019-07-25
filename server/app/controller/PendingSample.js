const { write } = require('../utils/response')

const PandingManager = require('../service/water/PendingManager')

exports.create = (req, res, next) => {
  new PandingManager().create(req.body, write.bind(null, res))
}

exports.bulkCreate = (req, res, next) => {
  new PandingManager().bulkCreate(req.body, write.bind(null, res))
}

exports.update = (req, res, next) => {
  new PandingManager().update(req.body, write.bind(null, res))
}

exports.remove = (req, res, next) => {
  new PandingManager().remove(req.body, write.bind(null, res))
}

exports.getAll = (req, res, next) => {
  new PandingManager().getAll(req.body, write.bind(null, res))
}
