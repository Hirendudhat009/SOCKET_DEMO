
/**
 * chat.js
 * @description :: sequelize model of database table chat
 */


import sequelizePaginate from "sequelize-paginate"
import sequelize from "../src/common/config/database";
import sequelizeTransforms from "sequelize-transforms";
import { DataTypes } from "sequelize";

let Chat = sequelize.define('chat', {
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    type: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "0 - text, 1 - audio, 2 - video, 3 - photo"
    },
    seenAt: {
        type: DataTypes.DATE,
        allowNull: true
    },
})


Chat.prototype.toJSON = function () {
    let values = Object.assign({}, this.get());
    return values;
};

sequelizeTransforms(Chat);
sequelizePaginate.paginate(Chat);
export default Chat;



















