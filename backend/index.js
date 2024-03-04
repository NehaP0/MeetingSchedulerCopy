const express = require('express')
const {userRoute, getLoggedInUserEmail} = require('./routes/userRouter')
const allUsersRoute = require('./routes/allusersRouter')
const meetingRoute = require('./routes/meetingRouter')
const {calendarLinkRoute} = require('./routes/calendarLinkRouter')
// const connection = require('./db')
const cors = require('cors')
const mongoose = require('mongoose')
const auth = require('./middlewares/Authenticator')
const eventRoute = require('./routes/eventRouter')
// const bodyParser = require("body-parser")
const port = process.env.port



require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())

const connection = mongoose.connect('mongodb+srv://neha:phadtare@cluster0.rw33h7h.mongodb.net/meetingScheduler?retryWrites=true&w=majority')

console.log(connection)


// -------------------


//   }
// -------------------

//Routes

//user login and account creation
app.use('/user', userRoute)

//Auth AuthMiddleware
// app.use(auth)

//get all users
app.use('/allUsersRoute', allUsersRoute)

app.use('/event', eventRoute)


app.use('/meeting', meetingRoute)

app.use('/calendarLink', calendarLinkRoute)




app.listen(3000, async()=>{
    try{
        await connection
        console.log("Connected to mongodb Atlas");
    }
    catch(err){
        console.log(err);
        console.log("Couldn't connect to Mongo Atlas");
    }
    console.log('App listening at port 3000');
})

