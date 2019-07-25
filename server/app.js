const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const morgan = require('morgan')

const config = require('./config/config')
const dbCtx = require('./app/model')
const {rps} = require('./app/middleware/authorization')
const failure = require('./app/middleware/failure')

// 路由
const authRoute = require('./app/router/auth')
const waterConfigRoute = require('./app/router/waterConfig')
const pendingSampleRoute = require('./app/router/pendingSample')
const standardSampleRoute = require('./app/router/standardSample')
const fileRoute = require('./app/router/file')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(bodyParser.json({limit: '20mb'}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static(path.join(__dirname, 'app', 'public')))
app.use(express.static(path.join(__dirname, 'dist')))
app.get('/', function(req, res) {
  res.sendfile(__dirname = '/index.html')
})

app.use('/auth', authRoute)
// app.use(rps())
app.use('/config', waterConfigRoute)
app.use('/pendingSample', pendingSampleRoute)
app.use('/standardSample', standardSampleRoute)
app.use('/file', fileRoute)

app.use(failure)

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
  dbCtx.sequelize
    .authenticate()
    .then(() => {
      console.log('已正常连接数据库')
    })
    .catch(err => {
      console.log('无法连接数据库，故障描述：', err)
    })
} else if (process.env.NODE_ENV === 'development') {
  dbCtx.sequelize
    .sync()
    .then(_ => {
      console.log('已同步更新数据库结构')
    })
    .catch(err => {
      console.log('无法同步更新数据库结构，故障描述：', err)
    })
}

app.listen(config.server.http.port, () => {
  console.log(`已正常开启Http服务，使用端口：${config.server.http.port}`)
})