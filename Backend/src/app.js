import express from 'express'
import cookieParser from 'cookie-parser'
import cors from "cors"
import passport from 'passport'
import './passpord.config.js'
import session from 'express-session'


const app = express()


app.use(cors({
    origin: 'https://frontend-hirrd.vercel.app' , 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
        'Content-Type', 
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin'
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: ['Set-Cookie']  
}));


app.use(session({
      secret: process.env.GOOGLE_CLIENT_SECRET, 
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );
app.use(passport.initialize());
app.use(passport.session());



app.use(express.json({ limit: '20kb' }))

app.use(express.urlencoded({ extended: true, limit: '20kb'}))

app.use(express.static('public'))

app.use(cookieParser())


// Routes
import userRoute from './routes/user.routes.js'
import companies from './routes/company.routes.js'
import jobs from './routes/job.routes.js'
import savedJob from './routes/savedJob.routes.js'
import applications from './routes/applications.routes.js'

app.use('/api/v1/users', userRoute)
app.use('/api/v1/company', companies)
app.use('/api/v1/job', jobs)
app.use('/api/v1/savedJob', savedJob)
app.use('/api/v1/application', applications)

export { app }


// http://localhost:5000/api/v1/users/register