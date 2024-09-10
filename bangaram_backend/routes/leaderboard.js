import express from 'express';
const router = express.Router();
import userModel from '../models/user.js';
import jwtVerify from '../jwt/jwtVerify.js';

router.post('/', jwtVerify, async (req, res) => {
    try {
        const { username } = req.body;
        console.log(username)

        if (!username) {
            return res.status(400).json({
                msg: false,
                message: 'Username is required'
            });
        }

        let user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({
                msg: false,
                message: 'User not found'
            });
        }

        const users = await userModel.find({});

        // Create leaderboard and sort by tokens in descending order
        let leaderboard = users.map(user => ({
            username: user.username,
            tokens: user.tokens
        }));

        // Sort by tokens in descending order and slice top 100
        leaderboard = leaderboard
            .sort((a, b) => b.tokens - a.tokens)
            .slice(0, 100);

        const userRankIndex = leaderboard.findIndex(item => item.username === username);
        const rank = userRankIndex !== -1 ? userRankIndex + 1 : null;

        res.status(200).json({
            msg: true,
            leaderboard,
            userRank: {
                username: user.username,
                tokens: user.tokens,
                rank
            }
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            msg: false,
            message: 'Error fetching leaderboard',
            error: error.message
        });
    }
});

export default router;
