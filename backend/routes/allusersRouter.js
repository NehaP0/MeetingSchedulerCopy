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

module.exports = allUsersRoute