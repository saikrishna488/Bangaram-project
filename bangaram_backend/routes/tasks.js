import express from 'express'
const router = express.Router();
import userModel from '../models/user.js';
import taskModel from '../models/tasks.js'


router.get('/', async (req, res) => {
    try {
        const tasks = await taskModel.find({});
        res.status(200).json({
            msg: true,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            msg: false,
            message: 'Error fetching tasks',
            error: error.message
        });
    }
});

// POST: Add a new task
router.post('/', async (req, res) => {
    const { text, url, reward } = req.body;

    // Check if all required fields are present
    if (!text || !url || !reward) {
        return res.status(400).json({
            msg: false,
        });
    }

    try {
        // Create a new task
        const task = await taskModel.create({ text, url, reward });

        // Respond with the created task
        res.status(201).json({
            msg: 'Task created successfully',
            task: task
        });
    } catch (error) {
        // Handle errors and respond
        res.status(500).json({
            msg: 'Error creating task',
            error: error.message
        });
    }
});


router.post('/validate', async (req, res) => {
    const { username, reward, text } = req.body;

    try {
        // Validate input
        if (!username || !reward || !text) {
            return res.status(400).json({
                msg: false,
                message: "Missing required fields"
            });
        }

        // Find user and task asynchronously
        const user = await userModel.findOne({ username });

        const task = await taskModel.findOne({ text });
        

        // Validate user and task existence
        if (!user || !task) {
            return res.status(404).json({
                msg: false,
                message: "User or task not found"
            });
        }

        // Check if the task has already been completed by the user
        if (!user.tasks.includes(text)) {
            // Update user's tokens and add the task to the completed tasks
            user.tokens += Number(reward);  // Ensure reward is treated as a number
            user.tasks.push(text);

            // Save the updated user
            await user.save();

            return res.status(200).json({
                msg: true,
                user
            });
        } else {
            return res.status(400).json({
                msg: false,
                message: "Task already completed"
            });
        }

    } catch (err) {
        return res.status(500).json({
            msg: false,
            message: "Server error",
            error: err.message
        });
    }
});




export default router;