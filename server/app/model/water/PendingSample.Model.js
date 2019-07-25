module.exports = (dbContext, dataTypes) => {
  const PendingSample = dbContext.define(
    'PendingSample',
    {
      id: {
        type: dataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      sampleNo: {
        type: dataTypes.STRING(200),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: { msg: '水样编号不能为空！' }
        }
      },
      originalNo: {
        type: dataTypes.STRING(200)
      },
      mineName: {
        type: dataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: { msg: '名称不能为空！' }
        }
      },
      mineLayer: {
        type: dataTypes.STRING(500)
      },
      mineLevel: {
        type: dataTypes.TEXT
      },
      aquifer: {
        type: dataTypes.TEXT
      },
      sampleSource: {
        type: dataTypes.TEXT
      },
      sampleCharacter: {
        type: dataTypes.TEXT
      },
      samplePlace: {
        type: dataTypes.TEXT
      },
      sampleTime: {
        type: dataTypes.STRING(200)
      },
      unit: {
        type: dataTypes.STRING(200),
        defaultValue: 'mg/l'
      },
      kna: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      ca: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      mg: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      hco3: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      co3: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      so4: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      cl: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      ph: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      tds: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      waterTemperature: {
        type: dataTypes.FLOAT,
        defaultValue: 0
      },
      dataSource: {
        type: dataTypes.TEXT
      },
      remark: {
        type: dataTypes.TEXT
      }
    },
    {
      tableName: 'water_pending',
      underscored: true,
      paranoid: true, // 软删除
      timestamps: true
    }
  )

  PendingSample.isDuplicate = (config, callback) => {
    const query = {
      sampleNo: config.sampleNo,
      mineName: config.mineName
    }
    if (config.id) {
      query.id = { $ne: config.id }
    }
    let errInfo
    PendingSample.findOne({
      where: query
    })
      .then(result => {
        if (result) {
          errInfo = { error: true, message: '水样已存在' }
          callback(errInfo)
        } else {
          callback(null, config)
        }
      })
      .catch(err => {
        errInfo = { error: true, message: '水样信息查询失败', err }
        callback(errInfo)
      })
  }

  PendingSample.combineSort = function(sorter = []) {
    return sorter.length
      ? sorter.reduce((previous, current) => {
          return previous.concat([[current.field, current.direction]])
        }, [])
      : [['created_at', 'DESC']]
  }

  PendingSample.combineQuery = function({ keyword = '' }) {
    if (keyword) {
      return {
        $or: [
          {
            mineName: {
              $like: `%${keyword}%`
            }
          },
          {
            mineLayer: {
              $like: `%${keyword}%`
            }
          },
          {
            mineLevel: {
              $like: `%${keyword}%`
            }
          },
          {
            sampleNo: {
              $like: `%${keyword}%`
            }
          },
          {
            sampleCharacter: {
              $like: `%${keyword}%`
            }
          },
          {
            samplePlace: {
              $like: `%${keyword}%`
            }
          },
          {
            aquifer: {
              $like: `%${keyword}%`
            }
          },
          {
            sampleSource: {
              $like: `%${keyword}%`
            }
          }
        ]
      }
    } else {
      return {}
    }
  }

  PendingSample.fetchBy = function(
    { pager = {}, sorter = [], where = {} },
    callback
  ) {
    let options = {
      where,
      sorter: PendingSample.combineSort(sorter)
    }
    const { pageSize = 0, current = 1 } = pager
    if (pageSize) {
      options.offset = pageSize * (current - 1)
      options.limit = pageSize
    }
    return PendingSample.findAll(options)
      .then(array => callback(null, array))
      .catch(err => callback(err))
  }

  return PendingSample
}
