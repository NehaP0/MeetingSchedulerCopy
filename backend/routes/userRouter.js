const express = require('express')
// const User = require('../models/user')
const {User, Meeting, Event} = require('../models/userAndMeeting')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')

const userRoute = express.Router()

let loggedInUserEmail;


userRoute.post("/postuser", async(req, res)=>{
    console.log("create user called");
    const {name,emailID,password,userAvailability} = req.body
    try{

        console.log(name,emailID,password,userAvailability);

        const hashedPassword = await bcrypt.hash(password, 5)
        console.log(hashedPassword)

        // const meeting =  await Meeting.create({title: "fillingSub", start:"2019-01-18T09:00:00+05:30", end:"2019-01-18T09:30:00+05:30", }) 
        const meeting =  await Meeting.create({start:"2019-01-18T09:00:00+05:30", end:"2019-01-18T09:30:00+05:30", user:"abc", userEmail:"abc@gmail.com", currentDateTime:"date"}) 

        console.log(meeting);

        const event =  await Event.create({evName: "30 Minute Meeting", evType:"One-on-One", evDuration:{hrs:0, minutes:30}, evLocation: "zoom", meetings: [meeting]}) 
        // const event =  await Event.create({evName: "30 Minute Meeting", evType:"One-on-One", evDuration:{hrs:0, minutes:30}, evLocation: "zoom"}) 
        console.log(event);

        const user = await User.create({name , emailID, password:hashedPassword,  events: [event], userAvailability : userAvailability, meetingsWtOthers: [meeting]})
        // const user = await User.create({name , emailID, password:hashedPassword,  events: [event], userAvailability : userAvailability, meetingsWtOthers: []})
        console.log(user);

        return res.send({message : "User added"})
    }
    catch(err){
        return res.send({message : `User creation failed : ${err}`})
    }
})

userRoute.patch("/patchuser", async(req, res)=>{
    console.log("patch user called");
    const {emailID,userAvailability} = req.body
    console.log("body ", req.body);
    try{
        await User.updateOne(
            { emailID: emailID },
            { userAvailability: userAvailability } 
        )

        return res.send({message : "Availability Updated"})
    }
    catch(err){
        return res.send({message : `User availability updation : ${err}`})
    }
})



userRoute.post("/login", async(req, res)=>{

    const {emailID,password} = req.body
    console.log("loggedIn usersEmail and Password ", emailID,password)
    try{
        //check if user's emailId matches with the one that is there in the database
        const user = await User.findOne({emailID : emailID})
        // console.log(user, "line 40");

        //if user does not exist in database send response invalid credentials
        if(user.length==0){
            return res.send({"message": 'Invalid Credentials'})
        }
        else{
            const matchPassword = bcrypt.compare(password, user.password, (err, result)=>{
                if(result){
                    const token = jwt.sign({emailID: user.emailID}, 'meetingScheduler')
                    loggedInUserEmail = user.emailID
                    // console.log("user ", user);
                    return res.send({"token":{token}, "message": `Login Successful.`})
                }
                else{
                    return res.send({"message": 'Invalid Credentials'})
                }
            })
        }
    }
    catch (err) {
        res.status(404).send({ msg: `User login failed ${err.message}` })
    }
})


console.log("loggedInUserEmail export", loggedInUserEmail);

module.exports = {userRoute, getLoggedInUserEmail: () => loggedInUserEmail}