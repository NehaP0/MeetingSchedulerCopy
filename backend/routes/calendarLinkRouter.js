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

const calendarLinkRoute = express.Router()


const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')


//to get only by link
calendarLinkRoute.get("/", async(req, res)=>{
    const {name, id} = req.query

    try {
        const user = await User.findOne({name: name, emailID : id})

        res.redirect(`http://localhost:4200/calendarByLink?name=${name}&id=${id}`)

        
        // res.send({message : "req is sent to me", name: name, id: id})
    } catch (error) {
        res.send({message : error})
    }
})



calendarLinkRoute.post("/", async(req, res)=>{
    // console.log(req);

    let meetLink;

    let importedloggedInUserEmail = getLoggedInUserEmail();
    console.log("loggedInUsers imported EmailId is ",importedloggedInUserEmail);

    if(!importedloggedInUserEmail){
        // res.redirect('http://localhost:4200/login')
        res.send({"message": "Please login first."})
        // alert("Please login first")
    }
    else{

        let {Subject, StartTime, EndTime} = req.body
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
        console.log("meeting will be scheduled with ", id);
    
    
        try{
            let findUser = await User.find({name:name})
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
                         { name: name },
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
                             console.log("I'll send mail to ", id);
                         const mailOptions1 = {
                             from: '"My Company"', // sender address
                             template: "email1", // the name of the template file, i.e., email.handlebars
                             // to: userFound.emailID,
                             to: id,
                             // subject: `Hi, ${userFound.name}`,
                             subject: `Meeting Scheduled`,
                             context: {
                             //   name: userFound.name,
                             name: name,
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
                            company: name,
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
                             console.log(`Email sent to ${name}`);
                         } catch (error) {
                             console.log(`Nodemailer error sending email to ${name}`, error);
                         }
                     }
                     
                    } 
                
                    // -----------------mailsending ends-------------


})

module.exports = calendarLinkRoute

