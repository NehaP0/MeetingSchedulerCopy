const mongoose = require('mongoose')

const meetingSchema = mongoose.Schema({
    Subject:{
        type : String,
        required : true
    },
    StartTime: {
        type : String,
    },
    EndTime :{ 
        type : String,
        required : true
    },
    // user :{ 
    //     type : String,
    //     required : true
    // }
})



const userSchema = mongoose.Schema({
    name:{
        type : String,
        required : true
    },
    emailID: {
        type : String,
        required : true
    },
    password :{ 
        type : String,
        required : true
    } ,
    meetings: [meetingSchema]
})

const User = mongoose.model('User', userSchema)

const Meeting = mongoose.model('Meeting', meetingSchema)

module.exports = { User, Meeting };