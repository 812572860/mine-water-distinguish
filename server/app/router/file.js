const express = require('express')
const fs = require('fs')
const path = require('path')
const router = express.Router()

router.get('/download', (req, res, next) => {
  let fileFolder = path.resolve(__dirname, "..", '..', 'uploads')
  var filename = req.query.filename
  var oldname = filename // req.query.oldname
  var file = fileFolder + '/' + filename
  res.writeHead(200, {
    'Content-Type': 'application/octet-stream', //告诉浏览器这是一个二进制文件
    'Content-Disposition': 'attachment; filename=' + encodeURI(oldname) //告诉浏览器这是一个需要下载的文件
  }) //设置响应头
  var readStream = fs.createReadStream(file) //得到文件输入流
  readStream.on('data', chunk => {
    res.write(chunk, 'binary') //文档内容以二进制的格式写到response的输出流
  })
  readStream.on('end', () => {
    res.end()
  })
  //读取文件发生错误事件
  readStream.on('error', (err) => {
    console.log('发生异常:', err);
  });
})

module.exports = router
