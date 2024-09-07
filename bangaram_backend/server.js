import express from 'express'
const app = express()
const port = process.env.PORT || 5000
import dotenv from 'dotenv'
import connectMongoDb from './config/db.js'
import cors from 'cors'

// routes
import userRoutes from './routes/user.js'
import taskRoutes from './routes/tasks.js'

// env setup
dotenv.config();

//connecting database
connectMongoDb();

app.use(express.json())
app.use(cors())

app.get('/',(req,res)=>{
    res.send("Api is online");
})

app.use('/user', userRoutes);
app.use('/tasks', taskRoutes)


app.listen(port,()=>{
    console.log("Server is live on http://127.0.0.1:"+port);
})