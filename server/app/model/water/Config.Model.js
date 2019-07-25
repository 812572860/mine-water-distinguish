module.exports = (dbContext, dataTypes) => {
  const WaterConfig = dbContext.define(
    'WaterConfig',
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: dataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: { msg: '类型不能为空！' }
        }
      },
      name: {
        type: dataTypes.STRING(200)
      },
      code: {
        type: dataTypes.STRING(200)
      },
      sort: {
        type: dataTypes.INTEGER,
        defaultValue: 0
      },
      remark: {
        type: dataTypes.TEXT
      }
    },
    {
      tableName: 'water_config',
      underscored: true,
      paranoid: true, // 软删除
      timestamps: true
    }
  )

  WaterConfig.isDuplicate = (config, callback) => {
    const query = {
      type: config.type,
      name: config.name
    }
    if (config.id) {
      query.id = { $ne: config.id }
    }
    let errInfo
    WaterConfig.findOne({
      where: query
    })
      .then(result => {
        if (result) {
          errInfo = { error: true, message: '配置项已存在' }
          callback(errInfo)
        } else {
          callback(null, config)
        }
      })
      .catch(err => {
        errInfo = { error: true, message: '配置信息查询失败', err }
        callback(errInfo)
      })
  }

  WaterConfig.combineSort = function (sorter = []) {
    return sorter.length
      ? sorter.reduce((previous, current) => {
        return previous.concat([[current.field, current.direction]])
      }, [])
      : [['type', 'ASC'],['sort', 'ASC']]
  }

  WaterConfig.combineQuery = function ({ keyword = '' }) {
    if (keyword) {
      return {
        $or: [
          {
            type: {
              $like: `%${keyword}%`
            }
          },
          {
            name: {
              $like: `%${keyword}%`
            }
          }
        ]
      }
    } else {
      return {}
    }
  }

  WaterConfig.fetchBy = function(
    { pager = {}, sorter = [], where = {} },
    callback
  ) {
    let options = {
      where,
      sorter: WaterConfig.combineSort(sorter)
    }
    const { pageSize = 0, current = 1 } = pager
    if (pageSize) {
      options.offset = pageSize * (current - 1)
      options.limit = pageSize
    }
    return WaterConfig.findAll(options)
      .then(array => callback(null, array))
      .catch(err => callback(err))
  }

  return WaterConfig
}
