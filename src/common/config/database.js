import { Sequelize } from 'sequelize'
import config from "./config"

const sequelize = new Sequelize(config)
module.exports = sequelize;




