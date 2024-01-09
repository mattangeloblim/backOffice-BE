const { DataTypes } = require('sequelize');
const sequelize = require("../config/database"); 

const GamePlayHistory = sequelize.define('GamePlayHistory', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    site_branch_id: DataTypes.STRING,
    location: DataTypes.STRING,
    username: {
        type: DataTypes.STRING
    },
    player_id: DataTypes.STRING,
    game: DataTypes.STRING,
    credit_before: DataTypes.STRING,
    cards: DataTypes.STRING,
    bet: DataTypes.STRING,
    winning_cards_identification: DataTypes.STRING,
    ball_list: DataTypes.STRING,
    extraball_cost: DataTypes.STRING,
    side_bet: DataTypes.STRING,
    win: DataTypes.STRING,
    win_spent: DataTypes.STRING,
    first_bonus_feature_win: DataTypes.STRING,
    second_bonus_feature_win: DataTypes.STRING,
    jackpot_win: DataTypes.STRING,
    credit_after: DataTypes.STRING,
    game_start: DataTypes.STRING,
    game_end: DataTypes.STRING,
    platform_id: DataTypes.STRING,
    platform_name: DataTypes.STRING,
    token: DataTypes.STRING,
    deleted_at: DataTypes.DATE,
    created_date: DataTypes.DATE,
    updated_date: DataTypes.DATE
}, {
    tableName: 'game_play_histories',
    timestamps: false,
});

// GamePlayHistory.sync()

module.exports = GamePlayHistory;