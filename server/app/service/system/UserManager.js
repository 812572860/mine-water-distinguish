const async = require('async')
const jwt = require('../../../config/plugin.jwt')

class UserManager {
  constructor(db) {
    this.db = db || require('../../model').User
  }

  // 检查用户名是否重复
  checkUsername(args, callback) {
    const user = this.db.build({ ...args })
    async.waterfall([cb => this.db.isDuplicate(user, cb)], function(err, res) {
      let result = null
      let error = null
      if (err) {
        if (!err.error) {
          result = {
            isDuplicate: true,
            message: err.message
          }
        } else {
          error = err
        }
      } else {
        result = {
          isDuplicate: false
        }
      }
      callback(error, result)
    })
  }
  // 注册用户
  signIn(args, callback) {
    const user = this.db.build({ ...args })
    async.waterfall(
      [
        cb => {
          return user
            .validate()
            .then(() => {
              cb(null, {})
            })
            .catch(err => {
              cb({ err: true, message: err.message })
            })
        },
        (_, cb) => this.db.isDuplicate(user, cb),
        (_, cb) => {
          user
            .save()
            .then(res => {
              cb(
                null,
                res.get({
                  plain: true
                })
              )
            })
            .catch(err => {
              cb({ error: true, message: '用户注册失败', info: err })
            })
        }
      ],
      function(err, res) {
        callback(err, res)
      }
    )
  }
  // 修改用户信息
  update(args, callback) {
    async.waterfall(
      [
        // 获取用户信息
        cb =>
          this.db
            .findByPk(args.id)
            .then(user => {
              if (user) {
                cb(null, user.set({ ...args }))
              } else {
                cb({ error: true, message: '该用户不存在' })
              }
            })
            .catch(err => {
              cb({ error: true, message: '用户查询失败', err })
            }),
        // validate验证
        (user, cb) => {
          return user
            .validate()
            .then(res => {
              cb(null, user)
            })
            .catch(err => {
              cb({ err: true, message: err.message })
            })
        },
        // 唯一校验
        (user, cb) => this.db.isDuplicate(user, cb),
        // 提交新信息
        (user, cb) =>
          user
            .save()
            .then(res => {
              cb(null, res.get({ plain: true }))
            })
            .catch(err => {
              cb({ error: true, message: '用户信息修改失败', err })
            })
      ],
      function(err, res) {
        callback(err, res)
      }
    )
  }
  // 修改密码
  changePassword(args, callback) {
    async.waterfall(
      [
        // 获取用户信息
        cb =>
          this.db
            .findByPk(args.id)
            .then(user => {
              if (user) {
                cb(null, user)
              } else {
                cb({ error: true, message: '该用户不存在' })
              }
            })
            .catch(err => {
              cb({ error: true, message: '用户查询失败', err })
            }),
        // // 比较密码
        // (user, cb) => user.comparePassword(args.password, cb),
        // 提交新信息
        (user, cb) =>
          user
            .set({ password: args.password })
            .save()
            .then(res => {
              cb(null, res.get({ plain: true }))
            })
            .catch(err => {
              cb({ error: true, message: '用户密码修改失败', err })
            })
      ],
      function(err, res) {
        callback(err, res)
      }
    )
  }
  // 删除用户
  delete(args, callback) {
    let error
    const id = args && args.id
    if (!id) {
      error = { error: true, message: '删除用户不能为空！' }
      return callback(error)
    }
    async.waterfall(
      [
        // 获取信息
        cb =>
          this.db
            .findByPk(id)
            .then(user => {
              if (user) {
                cb(null, user)
              } else {
                error = { error: true, message: '该用户信息不存在' }
                cb(error)
              }
            })
            .catch(err => {
              error = {
                error: true,
                message: '用户信息查询失败',
                err
              }
              cb(error)
            }),
        // 提交新信息
        (user, cb) =>
          this.db
            .destroy({ where: { id: user.id } })
            .then(res => {
              cb(null, res)
            })
            .catch(err => {
              error = {
                error: true,
                message: '用户信息删除失败',
                err
              }
              cb(error)
            })
      ],
      callback
    )
  }
  // 获取用户列表
  getAll(input, callback) {
    if (!input || typeof input !== 'object') {
      callback(new Error('输入参数错误'))
      return
    }
    let {
      pager = {},
      sorter = [{ field: 'created_at', direction: 'DESC' }],
      keyword = ''
    } = input
    let filters = this.db.combineQuery({ keyword })
    const { pageSize = 0 } = pager
    if (pageSize) {
      this.fetchBy({ filters, sorter, pager }, callback)
    } else {
      return this.db.fetchBy({ where: filters, sorter }, (err, array) => {
        if (err) {
          return callback(err)
        }
        return callback(null, {
          total: array.length,
          pager: null,
          items: array
        })
      })
    }
  }
  //登录
  loginIn(args, callback) {
    const { username, password } = args

    async.waterfall(
      [
        // 获取用户信息
        cb =>
          this.db
            .findAll({
              where: { username }
            })
            .then(res => {
              if (res && res.length) {
                cb(null, res[0])
              } else {
                cb({ error: true, message: '用户名不存在' })
              }
            })
            .catch(err => {
              cb({ error: true, message: '用户获取失败' })
            }),
        // 比较密码
        (user, cb) => user.comparePassword(password, cb),
        (user, cb) => {
          cb(null, {
            message: '登录成功',
            user: {
              token: jwt.sign({id: user.id, username: user.name}),
              info: {
                ...user
              }
            }
          })
        }
      ],
      function(err, res) {
        callback(err, res)
      }
    )
  }

  fetchBy({ filters, sorter = [], pager }, callback) {
    async.waterfall(
      [
        cb => {
          return this.db
            .count({ where: filters })
            .then(total => cb(null, total))
            .catch(err => cb(err))
        },
        (total, cb) => {
          if (total) {
            const { pageSize = 0 } = pager
            return this.db.fetchBy(
              {
                where: filters,
                sorter,
                pager: pageSize && total > pageSize ? pager : {}
              },
              (err, arr) => {
                if (err) {
                  cb(err)
                } else {
                  cb(null, { total, pager, items: arr })
                }
              }
            )
          } else {
            return cb(null, { total: 0, pager, items: [] })
          }
        }
      ],
      (err, result) => {
        if (err) {
          callback(err)
        } else {
          callback(null, result)
        }
      }
    )
  }
}

module.exports = UserManager
