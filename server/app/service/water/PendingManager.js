const async = require('async')

class PendingManager {
  constructor (db) {
    this.db = db || require('../../model').PendingSample
  }
  // 新增待判水样信息
  create (args, callback) {
    const sample = this.db.build({ ...args })
    async.waterfall(
      [
        cb => {
          return sample
            .validate()
            .then(() => {
              cb(null, {})
            })
            .catch(err => {
              cb({ err: true, message: err.message })
            })
        },
        (_, cb) => this.db.isDuplicate(sample, cb),
        (_, cb) => {
          sample
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
              cb({ error: true, message: '待判水样信息新增失败', info: err })
            })
        }
      ],
      function (err, res) {
        callback(err, res)
      }
    )
  }

  // 批量添加待判水样数据
  bulkCreate (args, callback) {
    // const sampleList = this.db.build([...args])
    async.waterfall(
      [
        cb =>
          this.db
            .bulkCreate([...args], { validate: true })
            .then(() => {
              cb(null, {})
            })
            .catch(err => {
              cb({
                error: true,
                message: '待判水样信息批量新增失败',
                info: err
              })
            }),
        (_, cb) =>
          this.db
            .findAll()
            .then(res => {
              cb(null, res)
            })
            .catch(err => {
              cb({
                error: true,
                message: '待判水样信息批量新增后查询失败',
                info: err
              })
            })
      ],
      function (err, res) {
        callback(err, res)
      }
    )
  }
  // 修改待判水样信息信息
  update (args, callback) {
    async.waterfall(
      [
        // 获取待判水样信息信息
        cb =>
          this.db
            .findByPk(args.id)
            .then(sample => {
              if (sample) {
                cb(null, sample.set({ ...args }))
              } else {
                cb({ error: true, message: '该待判水样信息不存在' })
              }
            })
            .catch(err => {
              cb({ error: true, message: '待判水样信息查询失败', err })
            }),
        // validate验证
        (sample, cb) => {
          return sample
            .validate()
            .then(res => {
              cb(null, sample)
            })
            .catch(err => {
              cb({ err: true, message: err.message })
            })
        },
        // 唯一校验
        (sample, cb) => this.db.isDuplicate(sample, cb),
        // 提交新信息
        (sample, cb) =>
          sample
            .save()
            .then(res => {
              cb(null, res.get({ plain: true }))
            })
            .catch(err => {
              cb({ error: true, message: '待判水样信息信息修改失败', err })
            })
      ],
      function (err, res) {
        callback(err, res)
      }
    )
  }
  // 删除待判水样信息
  remove (args, callback) {
    let error
    const id = args && args.id
    if (!id) {
      error = { error: true, message: '删除待判水样信息不能为空！' }
      return callback(error)
    }
    async.waterfall(
      [
        // 获取信息
        cb =>
          this.db
            .findByPk(id)
            .then(sample => {
              if (sample) {
                cb(null, sample)
              } else {
                error = { error: true, message: '该待判水样信息信息不存在' }
                cb(error)
              }
            })
            .catch(err => {
              error = {
                error: true,
                message: '待判水样信息信息查询失败',
                err
              }
              cb(error)
            }),
        // 提交新信息
        (sample, cb) =>
          this.db
            .destroy({ where: { id: sample.id } })
            .then(res => {
              cb(null, res)
            })
            .catch(err => {
              error = {
                error: true,
                message: '待判水样信息信息删除失败',
                err
              }
              cb(error)
            })
      ],
      callback
    )
  }
  // 获取待判水样信息列表
  getAll (input, callback) {
    // if (!input || typeof input !== 'object') {
    //   callback(new Error('输入参数错误'))
    //   return
    // }
    let {
      pager = {},
      sorter = [
        { field: 'created_at', direction: 'DESC' }
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

module.exports = PendingManager