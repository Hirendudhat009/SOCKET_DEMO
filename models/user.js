
/**
 * user.js
 * @description :: sequelize model of database table user
 */


import sequelizePaginate from "sequelize-paginate"
import sequelize from "../src/common/config/database";
import sequelizeTransforms from "sequelize-transforms";
import { baseUrl } from "../src/common/constants/config-constant";
import { DataTypes } from "sequelize";

let User = sequelize.define('user', {
    profileImage: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isOnline: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})


User.prototype.toJSON = function () {
    return {
        userId: this.id,
        fullname: this.fullname,
        email: this.email,
        profileImage: this.profileImage ? baseUrl(this.profileImage) : null,
        isOnline: this.isOnline,

    };
};

sequelizeTransforms(User);
sequelizePaginate.paginate(User);
export default User;



















