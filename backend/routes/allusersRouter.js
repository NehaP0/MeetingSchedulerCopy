const express = require('express')
// const User = require('../models/user')
const {User, Meeting} = require('../models/userAndMeeting')
const auth = require('../middlewares/Authenticator')


const allUsersRoute = express.Router()


allUsersRoute.get("/", async(req, res)=>{
    try {
        let UserList = await User.find()
        res.status(200).send({ users: UserList });        
    } 
    catch (err) {
        res.status(404).send({ msg: `User list not found ${err.message}` })
    }
})

allUsersRoute.get("/getAUser", async(req, res)=>{
    console.log("i got called in backend");
    let {reqUserId, eventId} = req.query
    console.log("reqUserId ", reqUserId);
    try {
        let UserList = await User.find()
        let reqUser = UserList.find((user)=>{
            if(user._id == reqUserId){
                console.log("user._id == reqUserId ", user._id == reqUserId, user._id, reqUserId);
                return user
            }
        })
        console.log("reqUser ", reqUser);
        res.status(200).send({ reqUser: reqUser });        
    } 
    catch (err) {
        res.status(404).send({ msg: `User list not found ${err.message}` })
    }
})

module.exports = allUsersRoute