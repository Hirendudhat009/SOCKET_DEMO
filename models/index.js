/**
 * index.js
 * @description :: exports all the models and its relationships among other models
 */

import dbConnection from "../src/common/config/database";

//models
import User from "./user";
import Chat from "./chat";

const db = {};
db.sequelize = dbConnection;


// chat - user -manager
Chat.belongsTo(User, {
  foreignKey: 'senderId',
  as: 'sender',
  targetKey: 'id',
  onDelete: "CASCADE"
});
User.hasMany(Chat, {
  foreignKey: 'senderId',
  sourceKey: 'id'
});

Chat.belongsTo(User, {
  foreignKey: 'receiverId',
  as: 'receiver',
  targetKey: 'id',
  onDelete: "CASCADE"
});
User.hasMany(Chat, {
  foreignKey: 'receiverId',
  sourceKey: 'id'
});



export default db