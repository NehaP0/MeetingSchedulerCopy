const mongoose = require('mongoose')

const meetingSchema = mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    start: {
        type : String,
    },
    end :{ 
        type : String,
        required : true
    },
    // user :{ 
    //     type : String,
    //     required : true
    // }
})

const availabilitySchema = mongoose.Schema({
    duration:{type : Object, required : true},
    workingHrs : {type : Object, required: true},
    workingDays : {type : Array, required: true},
    nonWorkingDays : {type : Array, required: true}
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
    meetings: [meetingSchema],
    userAvailability : { 
        type: availabilitySchema, 
        required: true 
    }
})

const User = mongoose.model('User', userSchema)

const Meeting = mongoose.model('Meeting', meetingSchema)

const Availability = mongoose.model('Availability', availabilitySchema)

module.exports = { User, Meeting, Availability };