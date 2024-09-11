import express from 'express'
const app = express()
const port = process.env.PORT || 5000
import dotenv from 'dotenv'
import connectMongoDb from './config/db.js'
import cors from 'cors'
import domainWhitelistMiddleware from './domain_whitelisting/middleware.js'

// routes
import userRoutes from './routes/user.js'
import taskRoutes from './routes/tasks.js'
import leaderboard from './routes/leaderboard.js'

// env setup
dotenv.config();

//connecting database
connectMongoDb();




const corsOptions = {
    origin: [
        'https://bangaram-project.vercel.app',
        'https://bangaram-project-saikrishna488s-projects.vercel.app',
        'https://bangaram-project-git-main-saikrishna488s-projects.vercel.app',
    ],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions)); // Apply CORS with allowed origins
app.use(domainWhitelistMiddleware)
app.use(express.json())





app.get('/', (req, res) => {
    res.send("Api is online");
})

app.use('/user', userRoutes);
app.use('/tasks', taskRoutes)
app.use('/leaderboard', leaderboard)


app.listen(port, () => {
    console.log("Server is live on port :" + port);
})