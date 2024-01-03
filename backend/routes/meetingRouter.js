const express = require('express')
// const Meeting = require('../models/meeting')
// const User = require('../models/user')
const {User, Meeting} = require('../models/userAndMeeting')
const {userRoute, getLoggedInUserEmail} = require('./userRouter')
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const readline = require('readline');
const moment = require('moment-timezone');




const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const TOKEN_PATH = 'token.json';

const meetingRoute = express.Router()


const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')



meetingRoute.post("/createMeeting", async(req, res)=>{

    let meetLink;

    let importedloggedInUserEmail = getLoggedInUserEmail();
    console.log("loggedInUsers imported EmailId is ",importedloggedInUserEmail);


    let {Subject, StartTime, EndTime, user, userEmail} = req.body
    StartTime = moment.utc(StartTime).tz('Asia/Calcutta').format();
    EndTime = moment.utc(EndTime).tz('Asia/Calcutta').format();
    let currentDateTime = new Date();
    currentDateTime = moment.utc(currentDateTime).tz('Asia/Calcutta').format();

    console.log(currentDateTime , StartTime  , EndTime, "and " ,StartTime<currentDateTime , EndTime < currentDateTime)

    if(StartTime<currentDateTime || EndTime < currentDateTime){
        res.send({message: "Meetings cannot be scheduled earlier than the current date and time"})
    }

    else{

        console.log("gotten body data", req.body);
    console.log("meeting will be scheduled with ", userEmail);


    try{
        let findUser = await User.find({name:user})
        let findLoggedInUser = await User.find({emailID : importedloggedInUserEmail})
        let loggedInUserName = findLoggedInUser[0].name


        if(findUser.length ==0){
            console.log("User doesn't exists");
        }
        else{
            console.log("User found", findUser)
            let meetingsArray = await findUser[0].meetings

            console.log("meetingsArray", meetingsArray);

            let userAvailable = true
            for(let i=0; i<meetingsArray.length; i++){
                if(StartTime >= meetingsArray[i]["StartTime"] && EndTime <= meetingsArray[i]["EndTime"]){
                    res.send({message: "User Unavailable at this date and time."})
                    userAvailable = false
                    break;
                }
            }

            if(userAvailable){
                const meeting =  await Meeting.create({Subject, StartTime:StartTime, EndTime:EndTime})    
                //  console.log(meeting);
                 
                 // Update the user document to include the new meeting
                 await User.updateOne(
                     { name: user },
                     { $push: { meetings: meeting } } 
                 )
                 await User.updateOne(
                    { emailID: importedloggedInUserEmail },
                    { $push: { meetings: meeting } } 
                )

                
                 console.log("User line 68", meeting);

                // --------new code--------

                try {
                    meetLink = await createMeetingLink();
                    console.log("Meeting link created:", meetLink);

                    // Continue with nodemailer code
                    await sendMail(meetLink, loggedInUserName, importedloggedInUserEmail);

                    return res.status(200).json({ message: "Meeting Created" });
                } catch (err) {
                    console.log("Error creating meeting link:", err);
                    return res.status(500).json({ message: `Meeting creation failed: ${err}` });
                }
                // --------new code ends--------
            }
                  
    }
}
    catch(err){
        return res.status(500).json({message : `Meeting creation failed : ${err}`})
    }

    }

    


    //  --------------------
                // meeting link creation

                // Load client secrets from a file, downloaded from the Google Cloud Console
    async function createMeetingLink() {
        return new Promise((resolve, reject) => {    
            fs.readFile('credentials.json', (err, content) => {
        if (err) return console.error('Error loading client secret file:', err);

        authorize(JSON.parse(content), scheduleMeeting);
        });

        function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uri } = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri[0]);

        fs.readFile(TOKEN_PATH, (err, token) => {
            if (err) return getAccessToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token));
            callback(oAuth2Client);
        });
        }

        async function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES,
        });

        console.log('Authorize this app by visiting this URL:', authUrl);

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question('Enter the code from that page here: ', (code) => {
            rl.close();

            oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);

            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });

            callback(oAuth2Client);
            });
        });
        }

        function scheduleMeeting(auth) {
        const calendar = google.calendar({ version: 'v3', auth });
    
        const event = {
            summary: Subject,
            start: {
            dateTime: StartTime,
            timeZone: 'Asia/Kolkata',
            },
            end: {
            dateTime: EndTime,
            timeZone: 'Asia/Kolkata',
            },
            conferenceData: {
            createRequest: {
                requestId: uuidv4(),
            },
            },
        };

        calendar.events.insert(
            {
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
            },
            (err, res) => {
            if (err) return console.error('Error scheduling meeting:', err);
            meetLink = res.data.hangoutLink;
            console.log('Meeting scheduled:', meetLink);
            resolve(res.data.hangoutLink);
            return res.data.hangoutLink
            }
        );
        }
        console.log("meeting link created"); 
                             

 

            // --------------meeting link creation ends------------ 
    

})
}




// ------------------------------
async function sendMail(meetingLink, loggedInUserName, importedloggedInUserEmail) {

                    // -------------------mail sending starts-----------------
                     // initialize nodemailer
                     console.log("nodemailer working");
                     var transporter = nodemailer.createTransport(
                         {
                             service: 'gmail',
                             auth:{
                                 user: 'nehaphadtare334@gmail.com',
                                 pass: 'xtjc dyqr evlk bfcj'
                             }
                         }
                     );


                     // point to the template folder
                     const handlebarOptions = {
                         viewEngine: {
                             partialsDir: path.resolve('../views/'),
                             defaultLayout: false,
                         },
                         viewPath: path.resolve('../views/'),
                     };

                     // use a template file with nodemailer
                     transporter.use('compile', hbs(handlebarOptions))

                     //   for (const user of users) {
                     await findUserFunction()
                     async function findUserFunction(){

                         // let userFound = await User.find( { "name": usersName} )
                         // if (userFound.length!==0) {
                             console.log("I'll send mail to ", userEmail);
                         const mailOptions1 = {
                             from: '"My Company"', // sender address
                             template: "email1", // the name of the template file, i.e., email.handlebars
                             // to: userFound.emailID,
                             to: userEmail,
                             // subject: `Hi, ${userFound.name}`,
                             subject: `Meeting Scheduled`,
                             context: {
                             //   name: userFound.name,
                             name: user,
                             company: loggedInUserName,
                             eventName: Subject, 
                             // eventDecription: eventDecription, 
                             // eventDate: eventDate, 
                             eventStartTime: StartTime,
                             eventEndTime: EndTime,
                             meetingLink : meetingLink
                             },
                         };
                         const mailOptions2 = {
                            from: '"My Company"', // sender address
                            template: "email2", // the name of the template file, i.e., email.handlebars
                            // to: userFound.emailID,
                            to: importedloggedInUserEmail,
                            // subject: `Hi, ${userFound.name}`,
                            subject: `Meeting Scheduled`,
                            context: {
                            //   name: userFound.name,
                            name: loggedInUserName,
                            company: user,
                            eventName: Subject, 
                            // eventDecription: eventDecription, 
                            // eventDate: eventDate, 
                            eventStartTime: StartTime,
                            eventEndTime: EndTime,
                            meetingLink : meetingLink
                            },
                        };
                         try {
                             await transporter.sendMail(mailOptions1);
                             await transporter.sendMail(mailOptions2);
                             console.log(`Email sent to ${user}`);
                         } catch (error) {
                             console.log(`Nodemailer error sending email to ${user}`, error);
                         }
                     }
                     
                    } 
                
                    // -----------------mailsending ends-------------


})

module.exports = meetingRoute



















































// const express = require('express')
// const Meeting = require('../models/meeting')
// const User = require('../models/user')
// const {userRoute, getLoggedInUserEmail} = require('./userRouter')

// const meetingRoute = express.Router()


// const hbs = require('nodemailer-express-handlebars')
// const nodemailer = require('nodemailer')
// const path = require('path')

// // const hbs = require('nodemailer-express-handlebars')
// // const nodemailer = require('nodemailer')
// // const path = require('path')



// meetingRoute.post("/createMeeting", async(req, res)=>{
//     let importedloggedInUserEmail = getLoggedInUserEmail();
//     console.log("loggedInUsers imported EmailId is ",importedloggedInUserEmail);

//     const {eventName,eventDecription, eventDate, eventTime, user, userEmail} = req.body
//     console.log("gotten response", req.body);
//     console.log("meeting will be scheduled with ", userEmail);

//     try{
//         foundUserWithSameDT = await Meeting.find( { "user": user, "eventDate": eventDate, "eventTime": eventTime} )

//         console.log("user having the same meeting time ",foundUserWithSameDT);
//         if(foundUserWithSameDT.length==0){
//                 let neweventDate = eventDate.split("T")[0]
//                 // console.log("neweventDate ", neweventDate);
//                 const meeting = await Meeting.create({eventName , eventDecription, eventDate : neweventDate, eventTime, user})
//                 const loggedInUser = await User.find( { "emailID": importedloggedInUserEmail} )
//                 let loggedInUserName = loggedInUser[0]['name']
                
//                 console.log("the loggedInUser is during meeting creation ", loggedInUser);
//                 console.log("hence the loggedInUserName is ", loggedInUserName);

//                 // usersName = user

//                 // ------------------------------
                    
//                         // initialize nodemailer
//                         var transporter = nodemailer.createTransport(
//                             {
//                                 service: 'gmail',
//                                 auth:{
//                                     user: 'nehaphadtare334@gmail.com',
//                                     pass: 'xtjc dyqr evlk bfcj'
//                                 }
//                             }
//                         );


//                         // point to the template folder
//                         const handlebarOptions = {
//                             viewEngine: {
//                                 partialsDir: path.resolve('../views/'),
//                                 defaultLayout: false,
//                             },
//                             viewPath: path.resolve('../views/'),
//                         };

//                         // use a template file with nodemailer
//                         transporter.use('compile', hbs(handlebarOptions))

//                         //   for (const user of users) {
//                         findUser()
//                         async function findUser(){

//                             // let userFound = await User.find( { "name": usersName} )
//                             // if (userFound.length!==0) {
//                                 console.log("I'll send mail to ", userEmail);
//                             const mailOptions = {
//                                 from: '"My Company"', // sender address
//                                 template: "email", // the name of the template file, i.e., email.handlebars
//                                 // to: userFound.emailID,
//                                 to: userEmail,
//                                 // subject: `Hi, ${userFound.name}`,
//                                 subject: `Meeting Scheduled`,
//                                 context: {
//                                 //   name: userFound.name,
//                                 name: user,
//                                 company: loggedInUserName,
//                                 eventName: eventName, 
//                                 eventDecription: eventDecription, 
//                                 eventDate: eventDate, 
//                                 eventTime: eventTime
//                                 },
//                             };
//                             try {
//                                 await transporter.sendMail(mailOptions);
//                                 console.log(`Email sent to ${user}`);
//                             } catch (error) {
//                                 console.log(`Nodemailer error sending email to ${user}`, error);
//                             }
//                             // }
//                         }
//                 // ------------------------------

//                 return res.send({message : "Meeting Created"})
//         }
//         else{
//                 // console.log("i'll not reate the meet");   
//                 return res.send({message : `User Unavailable at this date and time`})
//         }
//     }
//     catch(err){
//         return res.send({message : `Meeting creation failed : ${err}`})
//     }
// })




// module.exports = meetingRoute


// // {"_id":{"$oid":"6580f2f6bd8305ce8c5e165d"},"eventName":"tech disc 2","eventDecription":"tech disc 2","eventDate":"2023-12-14","eventTime":"1pm","user":"Neha","__v":{"$numberInt":"0"}}

// // 
// // {"_id":{"$oid":"6580f336bd8305ce8c5e1663"},"eventName":"tech disc ","eventDecription":"tech disc 2","eventDate":"2023-12-13","eventTime":"1pm","user":"Neha","__v":{"$numberInt":"0"}}

// // {"_id":{"$oid":"6580f3c474616f0a6a96fb12"},"eventName":"project","eventDecription":"project","eventDate":"2023-12-13","eventTime":"1pm","user":"Neha","__v":{"$numberInt":"0"}}

// //         foundUserWithSameDT = await Meeting.find( { "user": user, "eventDate": eventDate, "eventTime": eventTime, "userEmail":userEmail} )
