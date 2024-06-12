import express from 'express'
import dotenv from 'dotenv'
import DBconnect from './db.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRoutes.js'
dotenv.config()
import { errorHandler } from './middleware/errorHandler.js'

const PORT = process.env.PORT || 8888

const app = express()

app.use(express.json())
app.use(cookieParser());
app.use(morgan('dev'))
app.use('/api/users', userRoute)
app.use(errorHandler)



app.listen(PORT, () => {
    DBconnect()
   console.log(`server is running on PORT ${PORT}`) 
})



