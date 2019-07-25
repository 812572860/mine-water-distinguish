exports.server = {
  http: {
    port: 3777
  }
}

exports.postgreConfig = {
  username: 'postgres',
  password: 'library',
  database: 'test',
  host: '127.0.0.1',
  port: 5432,
  dialect: 'postgres'
}

exports.jwt = {
  secret: 'callofduty',
  expires: '30 days'
}
