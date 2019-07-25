const async = require('async')

class MenuManager {
  constructor (db) {
    this.db = db || require('../../model').Menu
  }
  // 新增菜单
  create (args, callback) {
    const menu = this.db.build({ ...args })
    async.waterfall(
      [
        cb => {
          return menu
            .validate()
            .then(() => {
              cb(null, {})
            })
            .catch(err => {
              cb({ err: true, message: err.message })
            })
        },
        (_, cb) => this.db.isDuplicate(menu, cb),
        (_, cb) => {
          menu
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
              cb({ error: true, message: '菜单新增失败', info: err })
            })
        }
      ],
      function (err, res) {
        callback(err, res)
      }
    )
  }

  // 修改菜单信息
  update (args, callback) {
    async.waterfall(
      [
        // 获取菜单信息
        cb =>
          this.db
            .findByPk(args.id)
            .then(menu => {
              if (menu) {
                cb(null, menu.set({ ...args }))
              } else {
                cb({ error: true, message: '该菜单不存在' })
              }
            })
            .catch(err => {
              cb({ error: true, message: '菜单查询失败', err })
            }),
        // validate验证
        (menu, cb) => {
          return menu
            .validate()
            .then(res => {
              cb(null, menu)
            })
            .catch(err => {
              cb({ err: true, message: err.message })
            })
        },
        // 唯一校验
        (menu, cb) => this.db.isDuplicate(menu, cb),
        // 提交新信息
        (menu, cb) =>
          menu
            .save()
            .then(res => {
              cb(null, res.get({ plain: true }))
            })
            .catch(err => {
              cb({ error: true, message: '菜单信息修改失败', err })
            })
      ],
      function (err, res) {
        callback(err, res)
      }
    )
  }
  // 删除菜单
  delete (args, callback) {
    let error
    const id = args && args.id
    if (!id) {
      error = { error: true, message: '删除菜单不能为空！' }
      return callback(error)
    }
    async.waterfall(
      [
        // 获取信息
        cb =>
          this.db
            .findByPk(id)
            .then(menu => {
              if (menu) {
                cb(null, menu)
              } else {
                error = { error: true, message: '该菜单信息不存在' }
                cb(error)
              }
            })
            .catch(err => {
              error = {
                error: true,
                message: '菜单信息查询失败',
                err
              }
              cb(error)
            }),
        // 提交新信息
        (menu, cb) =>
          this.db
            .destroy({ where: { id: menu.id } })
            .then(res => {
              cb(null, res)
            })
            .catch(err => {
              error = {
                error: true,
                message: '菜单信息删除失败',
                err
              }
              cb(error)
            })
      ],
      callback
    )
  }
  // 获取菜单列表
  getAll (input, callback) {
    if (!input || typeof input !== 'object') {
      callback(new Error('输入参数错误'))
      return
    }
    let { pager = {}, sorter = [{ field: 'created_at', direction: 'DESC' }], keyword = '' } = input
    let filters = this.db.combineQuery({ keyword })
    this.fetchBy({
      pager,
      sorter,
      filters
    }, (err, result) => {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    })
  }
}

module.exports = MenuManager