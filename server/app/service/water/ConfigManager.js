const async = require('async')

class ConfigManager {
  constructor(db) {
    this.db = db || require('../../model').WaterConfig
  }
  // 新增基础配置项
  create(args, callback) {
    const config = this.db.build({ ...args })
    async.waterfall(
      [
        cb => {
          return config
            .validate()
            .then(() => {
              cb(null, {})
            })
            .catch(err => {
              cb({ err: true, message: err.message })
            })
        },
        (_, cb) => this.db.isDuplicate(config, cb),
        (_, cb) => {
          config
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
              cb({ error: true, message: '基础配置项新增失败', info: err })
            })
        }
      ],
      function(err, res) {
        callback(err, res)
      }
    )
  }

  // 修改基础配置项信息
  update(args, callback) {
    async.waterfall(
      [
        // 获取基础配置项信息
        cb =>
          this.db
            .findByPk(args.id)
            .then(config => {
              if (config) {
                cb(null, config.set({ ...args }))
              } else {
                cb({ error: true, message: '该基础配置项不存在' })
              }
            })
            .catch(err => {
              cb({ error: true, message: '基础配置项查询失败', err })
            }),
        // validate验证
        (config, cb) => {
          return config
            .validate()
            .then(res => {
              cb(null, config)
            })
            .catch(err => {
              cb({ err: true, message: err.message })
            })
        },
        // 唯一校验
        (config, cb) => this.db.isDuplicate(config, cb),
        // 提交新信息
        (config, cb) =>
          config
            .save()
            .then(res => {
              cb(null, res.get({ plain: true }))
            })
            .catch(err => {
              cb({ error: true, message: '基础配置项信息修改失败', err })
            })
      ],
      function(err, res) {
        callback(err, res)
      }
    )
  }
  // 删除基础配置项
  remove(args, callback) {
    let error
    const id = args && args.id
    if (!id) {
      error = { error: true, message: '删除基础配置项不能为空！' }
      return callback(error)
    }
    async.waterfall(
      [
        // 获取信息
        cb =>
          this.db
            .findByPk(id)
            .then(config => {
              if (config) {
                cb(null, config)
              } else {
                error = { error: true, message: '该基础配置项信息不存在' }
                cb(error)
              }
            })
            .catch(err => {
              error = {
                error: true,
                message: '基础配置项信息查询失败',
                err
              }
              cb(error)
            }),
        // 提交新信息
        (config, cb) =>
          this.db
            .destroy({ where: { id: config.id } })
            .then(res => {
              cb(null, res)
            })
            .catch(err => {
              error = {
                error: true,
                message: '基础配置项信息删除失败',
                err
              }
              cb(error)
            })
      ],
      callback
    )
  }
  // 获取基础配置项列表
  getAll(input, callback) {
    if (!input || typeof input !== 'object') {
      callback(new Error('输入参数错误'))
      return
    }
    let {
      pager = {},
      sorter = [
        { field: 'type', direction: 'ASC' },
        { field: 'sort', direction: 'ASC' }
      ],
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

  fetchBy ({ filters, sorter = [], pager }, callback) {
    async.waterfall([
      (cb) => {
        return this.db
          .count({ where: filters })
          .then(total => cb(null, total))
          .catch(err => cb(err))
      },
      (total, cb) => {
        if (total) {
          const { pageSize = 0 } = pager
          return this.db
            .fetchBy({
              where: filters,
              sorter,
              pager: pageSize && (total > pageSize) ? pager : {}
            }, (err, arr) => {
              if (err) {
                cb(err)
              } else {
                cb(null, { total, pager, items: arr })
              }
            })
        } else {
          return cb(null, { total: 0, pager, items: [] })
        }
      }
    ], (err, result) => {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    })
  }
}

module.exports = ConfigManager
