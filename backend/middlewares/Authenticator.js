const jwt = require('jsonwebtoken')


const auth = (req, res, next) => {
    const token = req.headers.authorization
    console.log(token)

    //if user did not provide token
    if(!token){
        return res.send({"message": "Token not provided"})
    }

    //if user provides token, check and move to next 
    try{
        jwt.verify(token, "meetingScheduler", function(err, decoded){
            if(err){
                console.log(err)
            }
            else{
                console.log(decoded)
                req.body.user = decoded.user
                next()
            }
        })
    }
    //if incorrect token provided
    catch(err){
        return res.send({"message" : "Invalid Token. Access denied", error : err})
    }
}

module.exports = auth