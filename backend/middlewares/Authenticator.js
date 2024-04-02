const jwt = require('jsonwebtoken')


// const auth = (req, res, next) => {
//     const token = req.headers.authorization
//     console.log(token)

//     //if user did not provide token
//     if(!token){
//         return res.send({"message": "Token not provided"})
//     }

//     //if user provides token, check and move to next 
//     try{
//         jwt.verify(token, "meetingScheduler", function(err, decoded){
//             if(err){
//                 console.log(err)
//             }
//             else{
//                 console.log(decoded)
//                 req.body.user = decoded.user
//                 next()
//             }
//         })
//     }
//     //if incorrect token provided
//     catch(err){
//         return res.send({"message" : "Invalid Token. Access denied", error : err})
//     }
// }


const auth = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
      const bearerToken = bearerHeader.split(' ')[1];
      req.token = bearerToken;
    //   process.env.JWT_SECRET
      jwt.verify(req.token, "meetingScheduler", (err, authData) => {
        if (err) {
            console.log(err, 'line 41 middleware');
        return res.status(500).json({message : `Invalid token`})
        //   res.sendStatus(403); // Forbidden
        } else {
        console.log('all clear line 45 middleware');

          next();
        }
      });
    } else {
      // Forbidden
      console.log('err in line 52 middleware');

      return res.status(500).json({message : `Token not provided.`})

    //   res.sendStatus(403);
    }
  };
  

module.exports = auth