const express = require('express')
// const User = require('../models/user')
const {User} = require('../models/userAndMeeting')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')

const userRoute = express.Router()

let loggedInUserEmail;


userRoute.post("/postuser", async(req, res)=>{
    console.log("create user called");
    const {name,emailID,password} = req.body
    try{

        const hashedPassword = await bcrypt.hash(password, 5)
        // console.log(hashedPassword)

        const user = await User.create({name , emailID, password:hashedPassword})
        return res.send({message : "User added"})
    }
    catch(err){
        return res.send({message : `User creation failed : ${err}`})
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