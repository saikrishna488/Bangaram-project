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




app.use(express.json())
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow localhost
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };
  
app.use(cors(corsOptions)); // Apply CORS with allowed origins
app.use(domainWhitelistMiddleware)





app.get('/',(req,res)=>{
    res.send("Api is online");
})

app.use('/user', userRoutes);
app.use('/tasks', taskRoutes)
app.use('/leaderboard', leaderboard)


app.listen(port,()=>{
    console.log("Server is live on http://127.0.0.1:"+port);
})