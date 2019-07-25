const dbCtx = require('../app/model/index')

describe('初始化数据库', () => {
  it('测试数据库连接', done => {
    dbCtx.sequelize
      .authenticate()
      .then(() => {
        done()
      })
      .catch(err => {
        done(err)
      })
  })
  it('初始化数据库', done => {
    dbCtx.sequelize
      .sync({ force: true })
      .then(() => {
        done()
      })
      .catch(err => {
        done(err)
      })
  })
})
