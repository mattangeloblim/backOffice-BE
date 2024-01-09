const express = require("express")
const router = express.Router()
const Betting = require("../models/bettings")
const BettingResult = require("../models/betting_results")
const { Op } = require("sequelize");
const moment = require("moment");

router.get("/betting/logs", async (req, res) =>{
    try {
        const selectedFields = ['id', 'user_id', 'game_type', 'game_id', 'game_session', 'bet_ref_id', 'bet_data', 'amount', 'created_date', 'updated_date', 'jackpot_contribution'];

        const today = moment().startOf('day'); 
        const yesterday = moment().subtract(1, 'days').startOf('day'); 
        const lastWeek = moment().subtract(7, 'days').startOf('day'); 

        const dateFilter = req.query.dateFilter || 'today'; 

        let dateCondition = {};

        switch (dateFilter) {
            case 'today':
                dateCondition = {
                    created_date: {
                        [Op.gte]: today.toDate(),
                    }
                };
                break;
            case 'yesterday':
                dateCondition = {
                    created_date: {
                        [Op.between]: [yesterday.toDate(), today.toDate()],
                    }
                };
                break;
            case 'last week':
                dateCondition = {
                    created_date: {
                        [Op.between]: [lastWeek.toDate(), today.toDate()],
                    }
                };
                break;
            default:
                break;
        }

        const allBets = await Betting.findAll({
            where: dateCondition,
            order: [['created_date', 'DESC']],
            attributes: selectedFields,
        });

        const adjustedBets = allBets.map((bet) => {
            return {
                ...bet.dataValues,
                created_date: moment.utc(bet.created_date).tz('Asia/Manila').add(8, 'hours').format('YYYY-MM-DD HH:mm:ss'),
                updated_date: moment.utc(bet.updated_date).tz('Asia/Manila').add(8, 'hours').format('YYYY-MM-DD HH:mm:ss')
                
            };
        });

        const resultBet = await BettingResult.findAll({
            where: dateCondition,
            order: [['created_date', 'DESC']],
            attributes: ['bet_id', 'amount_won', 'result']
        });
        
        adjustedBets.forEach((bet) => {
            const matchedResult = resultBet.find((result) => {
                return result.bet_id === bet.id;
            });
        
            if (matchedResult) {
                bet.winning_amount = matchedResult.amount_won;
                if (matchedResult.result === 'JACKPOT') {
                    bet.jackpot_payout = matchedResult.amount_won;
                } else {
                    bet.jackpot_payout = 0;
                }
            } else {
                bet.winning_amount = 0; // Set winning_amount to 0 if no match is found
                bet.jackpot_payout = 0; // Set jackpot_payout to 0 if no match is found
            }
        });

        res.status(200).json({ Betting_Logs: adjustedBets });
    } catch (error) {
        console.error(error)
        res.status(500).json({message: error.message})
    }
})
module.exports = router