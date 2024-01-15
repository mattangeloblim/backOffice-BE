const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Audit = sequelize.define("Audit", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    tableName: 'audit_log',
    timestamps: true,
});

// Audit.sync()

module.exports = Audit;