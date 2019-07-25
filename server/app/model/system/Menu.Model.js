module.exports = (dbContext, DataTypes) => {
  const Menu = dbContext.define(
    'Menu',
    {
      name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          notEmpty: { msg: '菜单名称不能为空！' }
        }
      },
      code: {
        type: DataTypes.STRING(200),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: { msg: '菜单编码不能为空！' }
        }
      },
      sort: {
        type: DataTypes.INTEGER,
        default: 0
      },
      perentId: {
        type: DataTypes.INTEGER
      },
      path: {
        type: DataTypes.TEXT
      },
      url: {
        type: DataTypes.STRING(500)
      },
      icon: {
        type: DataTypes.STRING(200)
      },
      description: {
        type: DataTypes.TEXT
      }
    },
    {
      tableName: 'sys_menu',
      underscored: true,
      paranoid: true, // 软删除
      timestamps: true
    }
  )
  Menu.associate = function(models) {
    // associations can be defined here
  }

  Menu.beforeSave(menu => {
    if (menu.changed('parentId') && menu.parentId) {
      return Menu.findByPk(menu.parentId).then(res => {
        if (res.path) {
          let parents = res.path.split(',').concat(menu.parentId)
          menu.path = parents.join(',')
        } else {
          menu.path = menu.parentId
        }
        return menu
      })
    }
  })

  Menu.isDuplicate = (menu, callback) => {
    const query = {
      type: menu.type,
      name: menu.name
    }
    if (menu.id) {
      query.id = { $ne: menu.id }
    }
    let errInfo
    Menu.findOne({
      where: query
    })
      .then(result => {
        if (result) {
          errInfo = { error: true, message: '配置项已存在' }
          callback(errInfo)
        } else {
          callback(null, menu)
        }
      })
      .catch(err => {
        errInfo = { error: true, message: '配置信息查询失败', err }
        callback(errInfo)
      })
  }

  Menu.combineSort = function (sorter = []) {
    return sorter.length
      ? sorter.reduce((previous, current) => {
        return previous.concat([[current.field, current.direction]])
      }, [])
      : [['type', 'ASC'], ['sort', 'ASC']]
  }

  Menu.fetchBy = function (
    { pager = {}, sorter = [], where = {} },
    callback
  ) {
    let options = {
      where,
      sorter: Menu.combineSort(sorter)
    }
    const { pageSize = 0, current = 1 } = pager
    if (pageSize) {
      options.offset = pageSize * (current - 1)
      options.limit = pageSize
    }
    return Menu.findAll(options)
      .then(array => callback(null, array))
      .catch(err => callback(err))
  }

  return Menu
}
