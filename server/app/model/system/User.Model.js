const bcrypt = require('bcrypt')

module.exports = (dbContext, DataTypes) => {
  const User = dbContext.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.TEXT,
        // unique: true,
        allowNull: false,
        validate: {
          // isNull: {args: false, message: '用户名不能为空'}
          notEmpty: { msg: '用户名不能为空' }
        }
      },
      password: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: { args: false, message: '密码不能为空' }
        }
      },
      uniqueCode: {
        type: DataTypes.TEXT,
        unique: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      email: {
        type: DataTypes.TEXT,
        validate: {}
      },
      telephone: {
        type: DataTypes.TEXT
      },
      gender: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      address: {
        type: DataTypes.TEXT
      },
      isManager: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      tableName: 'sys_user',
      underscored: true,
      paranoid: true, // 软删除
      timestamps: true
    }
  )

  User.beforeSave(user => {
    if (user.changed('password')) {
      // 进行密码加密
      return bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash
      })
    }
  })

  /** 添加静态方法 */
  User.associate = function(models) {
    // associations can be defined here
  }
  User.isDuplicate = (user, callback) => {
    const query = {
      username: user.username
    }
    if (user.id) {
      query.id = { $ne: user.id }
    }
    let errInfo
    User.findOne({
      where: query
    })
      .then(result => {
        if (result) {
          errInfo = { error: false, message: '用户名已存在' }
          callback(errInfo)
        } else {
          callback(null, user)
        }
      })
      .catch(err => {
        errInfo = { error: true, message: '用户查询失败', err }
        callback(errInfo)
      })
  }

  User.combineQuery = function({ keyword = '' }) {
    if (keyword) {
      return {
        $or: [
          {
            username: {
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

  User.combineSort = function(sorter = []) {
    return sorter.length
      ? sorter.reduce((previous, current) => {
          return previous.concat([[current.field, current.direction]])
        }, [])
      : [['created_at', 'DESC']]
  }

  User.fetchBy = function({ pager = {}, sorter = [], where = {} }, callback) {
    let options = {
      where,
      sorter: User.combineSort(sorter)
    }
    const { pageSize = 0, current = 1 } = pager
    if (pageSize) {
      options.offset = pageSize * (current - 1)
      options.limit = pageSize
    }
    return User.findAll(options)
      .then(array => callback(null, array))
      .catch(err => callback(err))
  }

  /** 添加实例方法 */

  User.prototype.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password).then(res => {
      if (res) {
        callback(null, this.get({ plain: true }))
      } else {
        let errInfo = { error: true, message: '密码错误' }
        callback(errInfo)
      }
    })
  }

  return User
}
