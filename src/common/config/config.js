const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST, DB_CONNECTION, DB_PORT } = require("../constants/config-constant")

module.exports = {
  "username": DB_USERNAME,
  "password": DB_PASSWORD,
  "database": DB_NAME,
  "host": DB_HOST,
  "port": DB_PORT,
  "dialect": DB_CONNECTION,
  "logging": false,
  query: { raw: true }
}