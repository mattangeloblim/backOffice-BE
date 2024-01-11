const express = require("express")
const router = express.Router()
const Betting = require("../models/bettings")
const BettingResult = require("../models/betting_results")
const GamePlayHistory = require("../models/GamePlayHistory")
const { Op, sequelize } = require("sequelize");
const moment = require("moment");

router.get("/betting/logs", async (req, res) => {
    try {
        const selectedFields = ['id', 'user_id', 'game_type', 'game_id', 'game_session', 'bet_ref_id', 'bet_data', 'amount', 'created_date', 'updated_date', 'jackpot_contribution'];

        const dateFilter = req.query.dateFilter; // Get the date filter from the query parameter
        const dateEnd = req.query.dateEnd; // Get the end date filter from the query parameter

        let startDate, endDate;

        if (dateFilter) {
            startDate = moment(dateFilter).startOf('day');
        } else {
            startDate = moment().startOf('day'); // Default to today if dateFilter is not provided
        }

        if (dateEnd) {
            endDate = moment(dateEnd).endOf('day');
        } else {
            endDate = moment().endOf('day'); // Default to today's end of day if dateEnd is not provided
        }

        const dateCondition = {
            created_date: {
                [Op.gte]: startDate.toDate(),
                [Op.lt]: endDate.toDate(),
            }
        };

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
            const matchedResult = resultBet.find((result) => result.bet_id === bet.id);

            if (matchedResult) {
                bet.winning_amount = matchedResult.amount_won;
                bet.jackpot_payout = matchedResult.result === 'JACKPOT' ? matchedResult.amount_won : 0;
            } else {
                bet.winning_amount = 0;
                bet.jackpot_payout = 0;
            }
        });

        res.status(200).json({ Betting_Logs: adjustedBets });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});

router.get("/ggr/dashboard", async (req, res) => {
    try {
        const dateFilter = req.query.dateFilter || moment().startOf('day').format('YYYY-MM-DD');
        const dateEnd = req.query.dateEnd; // Get the end date filter from the query parameter

        // Parse the provided start and end date filters into moment objects 
        const startDate = dateFilter ? moment(dateFilter) : moment().startOf('day');
        const endDate = dateEnd ? moment(dateEnd) : moment().startOf('day');

        const response = [];

        // Loop through each day from the start date until the end date
        while (startDate.isSameOrBefore(endDate)) {
            const startOfDay = startDate.clone().startOf('day');
            const endOfDay = startDate.clone().endOf('day');

            const dateCondition = {
                created_date: {
                    [Op.gte]: startOfDay.toDate(),
                    [Op.lt]: endOfDay.toDate(),
                }
            };

            const betRecords = await Betting.findAll({
                attributes: ['amount', 'jackpot_contribution'],
                where: dateCondition,
                raw: true
            });
            
            const betResults = await BettingResult.findAll({
                attributes:['amount_won', 'result'],
                where: dateCondition,
                raw: true
            })

            const totalAmount = betRecords
                .reduce((total, record) => total + parseFloat(record.amount || 0), 0);

            const totalJackpotContribution = betRecords
                .reduce((total, record) => total + parseFloat(record.jackpot_contribution || 0), 0);

            const totalPayout = betResults
                .reduce((total, record) => total + parseFloat(record.amount_won || 0), 0);

                const totalJackpotPayout = betResults
                .filter(record => record.result === 'JACKPOT')
                .reduce((total, record) => total + parseFloat(record.amount_won || 0), 0);

            response.push({
                date: startDate.format('YYYY-MM-DD'),
                amount: totalAmount,
                payout: totalPayout,
                ggr: totalAmount - totalPayout,
                jackpot_contribution: totalJackpotContribution,
                jackpotPayout: totalJackpotPayout,
            });

            // Move to the next day
            startDate.add(1, 'day');
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error);   
        res.status(500).json({ message: error.message });
    }
});

router.get("/gameplay/history", async (req, res) => {
    try {
        const selectedFields = ['id', 'username', 'game', 'credit_before', 'cards', 'bet', 'winning_cards_identification', 'ball_list', 'extraball_cost', 'side_bet', 'win', 'win_spent', 'first_bonus_feature_win', 'second_bonus_feature_win', 'jackpot_win', 'credit_after', 'game_start', 'game_end', 'platform_name'];

        const dateFilter = req.query.dateFilter; // Get the date filter from the query parameter
        const dateEnd = req.query.dateEnd; // Get the end date filter from the query parameter

        let startDate, endDate;

        if (dateFilter) {
            startDate = moment(dateFilter).startOf('day');
        } else {
            startDate = moment().startOf('day'); 
        }

        if (dateEnd) {
            endDate = moment(dateEnd).endOf('day');
        } else {
            endDate = moment().endOf('day'); 
        }

        const dateCondition = {
            created_date: {
                [Op.gte]: startDate.toDate(),
                [Op.lt]: endDate.toDate(),
            }
        };

        const GamePlayHistories = await GamePlayHistory.findAll({
            attributes: selectedFields,
            where: dateCondition,
            order: [['id', 'DESC']],
        });

        res.status(200).json({ GamePlayHistories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


module.exports = router