const { write } = require('../utils/response')

const UserManager = require('../service/system/UserManager')

exports.signIn = (req, res, next) => {
  new UserManager().signIn(req.body, write.bind(null, res))
}

exports.loginIn = (req, res, next) => {
  new UserManager().loginIn(req.body, write.bind(null, res))
}

exports.updateUser = (req, res, next) => {
  new UserManager().update(req.body, write.bind(null, res))
}

exports.deleteUser = (req, res, next) => {
  new UserManager().delete(req.body, write.bind(null, res))
}

exports.checkUsername = (req, res, next) => {
  new UserManager().checkUsername(req.body, write.bind(null, res))
}

exports.getList = (req, res, next) => {
  new UserManager().getAll(req.body, write.bind(null, res))
}

exports.changePassword = (req, res, next) => {
  new UserManager().changePassword(req.body, write.bind(null, res))
}
