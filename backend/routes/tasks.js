import express from 'express'
const router = express.Router();
import userModel from '../models/user.js';
import taskModel from '../models/tasks.js'
import jwtVerify from '../jwt/jwtVerify.js'
import validateUser from '../essentials/validateUser.js';


router.get('/', jwtVerify, async (req, res) => {
    try {
        const tasks = await taskModel.find({});
        res.status(200).json({
            res: true,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            res: false,
            msg: 'Error fetching tasks',
            error: error.message
        });
    }
});

router.post('/task', jwtVerify, async (req, res) => {
    try {
        const { text } = req.body;

        // Check if text is provided
        if (!text) {
            return res.status(400).json({
                msg: false,
                message: 'Text parameter is required'
            });
        }

        // Find the task by text
        const task = await taskModel.findOne({ text });

        if (task) {
            return res.status(200).json({
                msg: true,
                task
            });
        } else {
            return res.status(404).json({
                msg: false,
                message: 'Task not found'
            });
        }

    } catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({
            msg: false,
            message: 'Error fetching task',
            error: error.message
        });
    }
});

// POST: Add a new task
router.post('/', jwtVerify, async (req, res) => {
    const { text, url, reward, type } = req.body;

    // Check if all required fields are present
    if (!text || !reward || !type) {
        return res.status(400).json({
            res: false,
        });
    }

    try {
        // Create a new task
        const task = await taskModel.create({ text, url : url && url, reward, type });

        // Respond with the created task
        res.status(201).json({
            msg: 'Task created successfully',
            res : true,
            task: task
        });
    } catch (error) {
        // Handle errors and respond
        res.status(500).json({
            msg: 'Error creating task',
            res :false,
            error: error.message
        });
    }
});


router.post('/validate', jwtVerify, async (req, res) => {
    const { telegram_id, reward, text, type, url } = req.body;

    try {
        // Validate input
        if (!telegram_id || !reward || !text || !type) {

            console.log(telegram_id,reward,text,type)
            return res.status(400).json({
                msg: "Missing required fields",
                res: false
            });
        }

        // Find user and task asynchronously
        const user = await userModel.findOne({ telegram_id });
        const task = await taskModel.findOne({ text });

        // Validate user and task existence
        if (!user || !task) {
            return res.status(404).json({
                msg: "User or task not found",
                res: false
            });
        }

        // Check if the task has already been completed by the user
        if (user.tasks.includes(text)) {
            return res.status(400).json({
                msg: "Task already completed",
                res: false
            });
        }

        // Handle different task types
        const rewardCondition = {
            'invite_3': user.invited_friends.length > 2,
            'invite_5': user.invited_friends.length > 4,
            'invite_15': user.invited_friends.length > 14,
            'invite_30': user.invited_friends.length > 29,
            'wallet' : user.wallet_address?.length>0,
            'twitter' : true,
            'free' : true,
            'youtube' : true,
            'collab' : true
        };

        if (task.type === 'join_channel') {
            const chat_id = `@${task.url.replace("https://t.me/", "")}`;
            const validate = await validateUser(chat_id, user.telegram_id);
            if (!validate) {
                return res.status(400).json({
                    msg: "User not in the channel",
                    res: false
                });
            }
        } else if (rewardCondition[task.type] === undefined || !rewardCondition[task.type]) {
            console.log("debug")
            return res.json({
                res: false,
                user
            });
        }

        // Award the reward
        user.tokens += Number(reward);
        user.tasks.push(text);
        await user.save();

        return res.status(200).json({
            res: true,
            user
        });

    } catch (err) {
        console.error("Server error:", err); // Added for better debugging
        return res.status(500).json({
            msg: "Server error",
            res: false,
            error: err.message
        });
    }
});





// delete a task
router.post('/delete', jwtVerify, async (req, res) => {
    try {
        const { text } = req.body;

        // Check if text is provided
        if (!text) {
            return res.status(400).json({
                msg: false,
                message: 'Text parameter is required'
            });
        }

        // Delete the task by text
        const result = await taskModel.deleteOne({ text });

        if (result.deletedCount > 0) {
            // Find all users that have this task
            const users = await userModel.find({ tasks: text });

            // Update each user's task array by removing the deleted task
            await Promise.all(users.map(async (user) => {
                user.tasks = user.tasks.filter((task) => task !== text);
                await user.save();  // Save the updated user document
            }));

            return res.status(200).json({
                msg: true,
                message: 'Task deleted successfully'
            });
        } else {
            return res.status(404).json({
                msg: false,
                message: 'Task not found'
            });
        }

    } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({
            msg: false,
            message: 'Error deleting task',
            error: error.message
        });
    }
});





export default router;