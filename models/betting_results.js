const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 

const BettingResult = sequelize.define("BettingResult", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    platform_id: {
      type: DataTypes.INTEGER,
    },
    platform_name: {
      type: DataTypes.STRING,
    },
    token: {
      type: DataTypes.STRING,
    },
    transaction_id: {
      type: DataTypes.STRING,
    },
    amount_won: {
      type: DataTypes.FLOAT,
    },
    result: {
      type: DataTypes.STRING,
    },
    bet_id: {
      type: DataTypes.INTEGER,
    },
    created_date: {
      type: DataTypes.DATE,
    },
    updated_date: {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'betting_results', 
    timestamps: false, 
  });

  BettingResult.sync()
  
  module.exports = BettingResult;