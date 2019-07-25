const { write } = require('../utils/response')

const ConfigManager = require('../service/water/ConfigManager')

exports.create = (req, res, next) => {
  new ConfigManager().create(req.body, write.bind(null, res))
}

exports.update = (req, res, next) => {
  new ConfigManager().update(req.body, write.bind(null, res))
}

exports.remove = (req, res, next) => {
  new ConfigManager().remove(req.body, write.bind(null, res))
}

exports.getAll = (req, res, next) => {
  new ConfigManager().getAll(req.body, write.bind(null, res))
}
