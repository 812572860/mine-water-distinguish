const path = require('path')
let Service = require('node-windows').Service;

let svc = new Service({
  name: 'mine-water-service', //服务名称
  description: 'mine-water-service', //描述
  script: path.resolve('./app.js') //nodejs项目要启动的文件路径
})

svc.on('uninstall', function () {
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

svc.uninstall();