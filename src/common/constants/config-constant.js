/**
 * configConstant.js
 * @description :: constants used in configuration
 */

import dotenv from "dotenv";
dotenv.config();

module.exports = {
  APP_NAME: process.env.APP_NAME || "home-yogi",
  PORT: process.env.PORT || 3000,

  DB_CONNECTION: process.env.DB_CONNECTION || "mysql",
  DB_HOST: process.env.DB_HOST,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: "#{-CS+qHv/mrd)wz>y2n%]$7WtD3*_4dd^a@Tby/U<Rq6wDEVu",
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT || 3306,

  NODE_ENV: process.env.NODE_ENV || "development",
  isSSLEnable: process.env.isSSLEnable || false,


  baseUrl(path = null) {
    let url = `http://${process.env.HOST}:${process.env.PORT}`;
    if (process.env.isSSLEnable === 'true') {
      url = `https://${process.env.HOST}:${process.env.PORT}`;
    }
    return url + (path ? `/${path}` : '');
  },

  apiBaseUrl(path = null) {
    let url = `http://${process.env.HOST}:${process.env.PORT}/api/v1`;
    if (process.env.isSSLEnable === 'true') {
      url = `https://${process.env.HOST}:${process.env.PORT}/api/v1`;
    }
    return url + (path ? `/${path}` : '');
  },

  managerApiBaseUrl(path = null) {
    let url = `http://${process.env.HOST}:${process.env.PORT}/manager/api/v1`;
    if (process.env.isSSLEnable === 'true') {
      url = `https://${process.env.HOST}:${process.env.PORT}/manager/api/v1`;
    }
    return url + (path ? `/${path}` : '');
  },
};