import express from 'express'
const router = express.Router();
import userModel from '../models/user.js';
import taskModel from '../models/tasks.js'
import adminModel from '../models/admin.js';
import { generateReferral } from '../essentials/referral.js';
import { isOneDayCompleted, getRemainingTime } from '../essentials/referral.js'
import jwtVerify from '../jwt/jwtVerify.js'


router.post('/', jwtVerify, async (req, res) => {
    const { start, username, telegram_id } = req.body;

    try {
        if (!username) {
            return res.json({ msg: false });
        }

        // Find the user in the database
        let user = await userModel.findOne({ username });

        const date = new Date();

        if (!user) {
            // User does not exist, create a new user
            let tokens = 500;

            if (start) {
                // If a referral number is provided, check if it is valid
                const referrer = await userModel.findOne({ referral_num: start });
                if (referrer) {
                    tokens += 1000; // Add tokens for the referral
                    referrer.invited_friends.push(username);
                    referrer.tokens += 2000; // Corrected to add tokens
                    referrer.tickets += 5; // Corrected to add tickets
                    await referrer.save(); // Save the referrer document
                }
            }

            // Generate a referral number for the new user
            const referral = generateReferral();
            user = await userModel.create({
                username,
                tokens,
                referral_num: referral,
                telegram_id,
                tickets: 5,
                last_checkin: date
            });

            return res.json({
                user,
                msg: true
            });
        }

        // Check if one day has passed since last check-in
        if (isOneDayCompleted(user.last_checkin)) {
            user.tickets += 5; // Increment tickets correctly
            user.last_checkin = date; // Update last check-in date
            await user.save();
        }

        // If the user exists, return the existing user
        return res.json({
            user,
            msg: true
        });

    } catch (err) {
        // Handle any errors that occur
        console.error(err); // Log the error for debugging
        return res.json({
            msg: false,
            error: "An error occurred while processing your request." // User-friendly error message
        });
    }
});


router.post('/dropgame', jwtVerify, async (req, res) => {
    const { username, tokens } = req.body;

    try {
        // Validate input
        if (!username || !tokens) {
            return res.status(400).json({ res: false, msg: 'Username is required.' });
        }

        // Find user by username
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ res: false, msg: 'User not found.' });
        }

        // Update tickets count
        user.tickets = Math.max(user.tickets - 1, 0); // Ensure tickets don't go below 0
        user.tokens += tokens
        await user.save();

        return res.status(200).json({
            res: true,
            user
        });
    } catch (err) {
        console.error('Error updating tickets:', err);
        return res.status(500).json({
            res: false,
            error: err.message
        });
    }
});


//update tickets
router.post('/updatetickets', jwtVerify, async (req, res) => {
    const { username, tickets } = req.body;

    try {
        // Validate input
        if (!username || !tickets) {
            return res.status(400).json({ res: false, msg: 'Username is required.' });
        }

        // Find user by username
        const user = await userModel.findOne({ username });

        if (!user) {
            return res.status(404).json({ res: false, msg: 'User not found.' });
        }

        // Update tickets count
        user.tickets = tickets  // Ensure tickets don't go below 0
        await user.save();

        return res.status(200).json({
            res: true,
            user
        });
    } catch (err) {
        console.error('Error updating tickets:', err);
        return res.status(500).json({
            res: false,
            error: err.message
        });
    }
});



router.post('/update-wallet', jwtVerify, async (req, res) => {
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

router.post('/daily-reward', jwtVerify, async (req, res) => {
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
            // console.log("tokens claimed")

            return res.json({
                msg: true,
                user,
            });
        } else {
            // Calculate remaining time
            const remainingTime = getRemainingTime(user.last_checkin);
            return res.json({
                msg: false,
                remainingTime
            });
        }
    } catch (error) {
        console.error('Error claiming daily reward:', error);
        return res.status(500).json({ msg: false });
    }
});

router.post('/admin', async (req, res) => {
    try {
        const { key } = req.body;

        // Check if key is provided
        if (!key) {
            return res.json({
                msg: false,
                error: "Admin key is missing"
            });
        }

        // Find the admin by key
        const admin = await adminModel.findOne({ key });

        if (admin) {
            return res.json({
                msg: true,
                data: admin
            });
        } else {
            return res.json({
                msg: false,
                error: "Admin not found"
            });
        }

    } catch (err) {
        return res.json({
            msg: false,
            error: "Server error"
        });
    }
});


router.post('/addAdmin', async (req, res) => {
    try {
        const { key, secret } = req.body;

        console.log(key,secret)

        // Ensure both key and secret are provided
        if (!key || !secret) {
            return res.json({
                msg: false,
                error: 'Key and secret are required'
            });
        }

        // Check if the provided secret matches the JWT secret
        if (secret !== process.env.JWT_SECRET) {
            return res.json({
                msg: false,
                error: 'Invalid secret'
            });
        }

        // Create a new admin
        const admin = await adminModel.create({ key });

        if (admin) {
            return res.json({
                msg: true,
                data: admin
            });
        } else {
            return res.json({
                msg: false,
                error: 'Failed to create admin'
            });
        }

    } catch (err) {
        console.error('Error adding admin:', err);
        return res.json({
            msg: false,
            error: 'Server error'
        });
    }
});

router.post('/delete', jwtVerify, async (req, res) => {
    try {
        const { username } = req.body;

        // Ensure username is provided
        if (!username) {
            return res.json({
                msg: false,
                error: 'Username is required'
            });
        }

        // Attempt to delete the user
        const result = await userModel.deleteOne({ username });

        if (result.deletedCount > 0) {
            // User was successfully deleted
            return res.json({
                msg: true
            });
        } else {
            // No user found with the given username
            return res.json({
                msg: false,
                error: 'User not found'
            });
        }
        console.log("user not found")

    } catch (err) {
        console.error('Error deleting user:', err);
        return res.json({
            msg: false,
            error: 'Server error'
        });
    }
});

router.post('/update', jwtVerify, async (req, res) => {
    try {
        const { username, tokens } = req.body;

        // Ensure username is provided
        if (!username || !tokens) {
            return res.json({
                msg: false,
                error: 'Username and tokens are required'
            });
        }

        // Find the user by username
        const user = await userModel.findOne({ username });

        if (user) {
            // Update the user's tokens
            user.tokens = tokens;

            // Save the updated user
            await user.save();

            return res.json({
                msg: true,
                user
            });
        } else {
            // No user found with the given username
            return res.json({
                msg: false,
                error: 'User not found'
            });
        }

    } catch (err) {
        console.error('Error updating user:', err);
        return res.json({
            msg: false,
            error: 'Server error'
        });
    }
});





export default router;