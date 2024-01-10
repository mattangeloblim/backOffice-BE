const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Update the path as per your file structure

const betting = sequelize.define("betting", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  game_type: {
    type: DataTypes.STRING,
  },
  game_id: {
    type: DataTypes.INTEGER,
  },
  game_session: {
    type: DataTypes.STRING,
  },
  bet_ref_id: {
    type: DataTypes.INTEGER,
  },
  bet_data: {
    type: DataTypes.STRING,
  },
  amount: {
    type: DataTypes.STRING,
  },
  platform_id: {
    type: DataTypes.STRING,
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
  closed_date: {
    type: DataTypes.DATE,
  },
  created_date: {
    type: DataTypes.DATE,
  },
  updated_date: {
    type: DataTypes.DATE,
  },
  jackpot_contribution: {
    type: DataTypes.FLOAT,
  },
}, {
  tableName: 'bettings', 
  timestamps: false, 
});



module.exports = betting;