import express from 'express'
const router = express.Router();
import userModel from '../models/user.js';
import taskModel from '../models/tasks.js'
import { generateReferral } from '../essentials/referral.js';
import { isOneDayCompleted } from '../essentials/referral.js'


router.get('/:username', async (req, res) => {
    const username = req.params.username;
    const { start } = req.query;

    try {
        if (!username) {
            return res.json({ msg: false });
        }

        // Find the user in the database
        let user = await userModel.findOne({ username });

        const date = new Date();

        if (!user) {
            // User does not exist, create a new user
            let tokens = 0;

            if (start) {
                // If a referral number is provided, check if it is valid
                const referrer = await userModel.findOne({ referral_num: start });

                if (referrer) {
                    tokens += 10; // Add tokens for the referral
                    referrer.invited_friends.push(username);
                    referrer.tokens += 20
                    await referrer.save(); // Save the referrer document
                }
            }

            // Generate a referral number for the new user
            const referral = generateReferral();
            user = await userModel.create({
                username,
                tokens,
                referral_num: referral,
                last_checkin: date
            });

            return res.json({
                user,
                msg: true
            });
        }

        // If the user exists, return the existing user
        return res.json({
            user,
            msg: true
        });

    } catch (err) {
        // Handle any errors that occur
        return res.json({
            msg: false,
            error: err.message // Optional: for debugging
        });
    }
});

router.post('/update-wallet', async (req, res) => {
    const { id, wallet_address, username } = req.body;

    try {
        // Validate input
        if (!id || !wallet_address || !username) {
            return res.status(400).json({ msg: false });
        }

        // Find user by ID
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ msg: false });
        }

        // Update wallet address
        user.wallet_address = wallet_address;
        await user.save();

        return res.status(200).json({
            msg: true,
            user
        });
    } catch (err) {
        console.error('Error updating wallet address:', err);
        return res.status(500).json({
            msg: false,
            error: err.message
        });
    }
});

router.post('/claim-daily-reward', async (req, res) => {
    const { username } = req.body;

    try {
        // Find the user by username
        const user = await userModel.findOne({ username });
        if (!user) {
            return res.status(404).json({ msg: false });
        }

        const now = new Date();

        // If the user has never checked in before, or one day has passed since the last check-in
        if (!user.last_checkin || isOneDayCompleted(user.last_checkin)) {
            // Add 10 tokens to the user's account
            user.tokens += 10;
            user.last_checkin = now;

            // Save the user data
            await user.save();

            return res.json({
                msg: true,
                user
            });
        } else {
            return res.json({ msg: false});
        }
    } catch (error) {
        console.error('Error claiming daily reward:', error);
        return res.status(500).json({ message: false });
    }
});




export default router;