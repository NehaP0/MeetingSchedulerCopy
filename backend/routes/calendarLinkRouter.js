const express = require('express')
// const Meeting = require('../models/meeting')
// const User = require('../models/user')
const { User, Meeting } = require('../models/userAndMeeting')
const { userRoute, getLoggedInUserEmail } = require('./userRouter')
const { google } = require('googleapis');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const readline = require('readline');
const moment = require('moment-timezone');
// const { getLoggedInUserEmailFromQuery } = require('./calendarLinkRouter');

let loggedInUserEmail;




const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];
const TOKEN_PATH = 'token.json';

const calendarLinkRoute = express.Router()


const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path');
const { log } = require('console');


//to get calendar by link
calendarLinkRoute.get("/", async (req, res) => {
    const { name, id } = req.query

    try {
        const user = await User.findOne({ name: name, emailID: id })

        res.redirect(`http://localhost:4200/calendarByLink?name=${name}&id=${id}`)


        // res.send({message : "req is sent to me", name: name, id: id})
    } catch (error) {
        res.send({ message: error })
    }
})



// calendarLinkRoute.post("/", async(req, res)=>{

//     let meetLink;

//     // let importedloggedInUserEmail = getLoggedInUserEmail();
//     let importedloggedInUserEmail = getLoggedInUserEmailFromQuery();

//     // let importedloggedInUserEmail = "nehaphadtare334@gmail.com"
//     console.log("loggedInUsers imported EmailId is ",importedloggedInUserEmail);


//     let {title, start, end, user, userEmail} = req.body
//     start = moment.utc(start).tz('Asia/Calcutta').format();
//     end = moment.utc(end).tz('Asia/Calcutta').format();
//     let currentDateTime = new Date();
//     currentDateTime = moment.utc(currentDateTime).tz('Asia/Calcutta').format();

//     console.log(currentDateTime , start  , end, "and " ,start<currentDateTime , end < currentDateTime)

//     if(start<currentDateTime || end < currentDateTime){
//         res.send({message: "Meetings cannot be scheduled earlier than the current date and time"})
//     }

//     else{

//         console.log("gotten body data", req.body);
//         console.log("meeting will be scheduled with ", userEmail);


//     try{
//         let findUser = await User.find({name:user})

//         console.log("findUser ", findUser);

//         let findLoggedInUser = await User.find({emailID : importedloggedInUserEmail})
//         let loggedInUserName = findLoggedInUser[0].name


//         if(findUser.length ==0){
//             console.log("User doesn't exists");
//         }
//         else{
//             console.log("User found", findUser)
//             let meetingsArray = await findUser[0].meetings
//             let loggedInUsermeetingsArray = await findLoggedInUser[0].meetings



//             console.log("meetingsArray", meetingsArray);

//             let userAvailable = true
//             let loggedInuserAvailable = true

//             // for(let i=0; i<meetingsArray.length; i++){
//             //     if(StartTime >= meetingsArray[i]["StartTime"] && EndTime <= meetingsArray[i]["EndTime"]){
//             //         res.send({message: "User Unavailable at this date and time."})
//             //         userAvailable = false
//             //         break;
//             //     }
//             // }
//             // if(userAvailable){
//             //     for(let i=0; i<loggedInUsermeetingsArray.length; i++){
//             //         if(StartTime >= loggedInUsermeetingsArray[i]["StartTime"] && EndTime <= loggedInUsermeetingsArray[i]["EndTime"]){
//             //             res.send({message: "You have an event scheduled at this date and time, please select some other time."})
//             //             loggedInuserAvailable = false
//             //             break;
//             //         }
//             //     }
//             // }

//             // if(userAvailable && loggedInuserAvailable){
//                 const meeting =  await Meeting.create({title, start, end})    
//                 //  console.log(meeting);

//                  // Update the user document to include the new meeting
//                  await User.updateOne(
//                      { name: user },
//                      { $push: { meetings: meeting } } 
//                  )
//                  await User.updateOne(
//                     { emailID: importedloggedInUserEmail },
//                     { $push: { meetings: meeting } } 
//                 )


//                  console.log("User line 68", meeting);

//                 // --------new code--------

//                 try {
//                     meetLink = await createMeetingLink();
//                     console.log("Meeting link created:", meetLink);

//                     // Continue with nodemailer code
//                     await sendMail(meetLink, loggedInUserName, importedloggedInUserEmail);

//                     return res.status(200).json({ message: "Meeting Created" });
//                 } catch (err) {
//                     console.log("Error creating meeting link:", err);
//                     return res.status(500).json({ message: `Meeting creation failed: ${err}` });
//                 }
//                 // --------new code ends--------
//             // }

//     }
// }
//     catch(err){
//         return res.status(500).json({message : `Meeting creation failed : ${err}`})
//     }

//     }




//     //  --------------------
//                 // meeting link creation

//                 // Load client secrets from a file, downloaded from the Google Cloud Console
//     async function createMeetingLink() {
//         return new Promise((resolve, reject) => {    
//             fs.readFile('credentials.json', (err, content) => {
//         if (err) return console.error('Error loading client secret file:', err);

//         authorize(JSON.parse(content), scheduleMeeting);
//         });

//         function authorize(credentials, callback) {
//         const { client_secret, client_id, redirect_uri } = credentials.web;
//         const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uri[0]);

//         fs.readFile(TOKEN_PATH, (err, token) => {
//             if (err) return getAccessToken(oAuth2Client, callback);
//             oAuth2Client.setCredentials(JSON.parse(token));
//             callback(oAuth2Client);
//         });
//         }

//         async function getAccessToken(oAuth2Client, callback) {
//         const authUrl = oAuth2Client.generateAuthUrl({
//             access_type: 'offline',
//             scope: SCOPES,
//         });

//         console.log('Authorize this app by visiting this URL:', authUrl);

//         const rl = readline.createInterface({
//             input: process.stdin,
//             output: process.stdout,
//         });

//         rl.question('Enter the code from that page here: ', (code) => {
//             rl.close();

//             oAuth2Client.getToken(code, (err, token) => {
//             if (err) return console.error('Error retrieving access token', err);

//             oAuth2Client.setCredentials(token);
//             fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
//                 if (err) return console.error(err);
//                 console.log('Token stored to', TOKEN_PATH);
//             });

//             callback(oAuth2Client);
//             });
//         });
//         }

//         function scheduleMeeting(auth) {
//         const calendar = google.calendar({ version: 'v3', auth });

//         const event = {
//             summary: title,
//             start: {
//             dateTime: start,
//             timeZone: 'Asia/Kolkata',
//             },
//             end: {
//             dateTime: end,
//             timeZone: 'Asia/Kolkata',
//             },
//             conferenceData: {
//             createRequest: {
//                 requestId: uuidv4(),
//             },
//             },
//         };

//         calendar.events.insert(
//             {
//             calendarId: 'primary',
//             resource: event,
//             conferenceDataVersion: 1,
//             },
//             (err, res) => {
//             if (err) return console.error('Error scheduling meeting:', err);
//             meetLink = res.data.hangoutLink;
//             console.log('Meeting scheduled:', meetLink);
//             resolve(res.data.hangoutLink);
//             return res.data.hangoutLink
//             }
//         );
//         }
//         // console.log("meeting link created"); 




//             // --------------meeting link creation ends------------ 


// })
// }




// // ------------------------------
// async function sendMail(meetingLink, loggedInUserName, importedloggedInUserEmail) {

//                     // -------------------mail sending starts-----------------
//                      // initialize nodemailer
//                      console.log("nodemailer working");
//                      var transporter = nodemailer.createTransport(
//                          {
//                              service: 'gmail',
//                              auth:{
//                                  user: 'nehaphadtare334@gmail.com',
//                                  pass: 'xtjc dyqr evlk bfcj'
//                              }
//                          }
//                      );


//                      // point to the template folder
//                      const handlebarOptions = {
//                          viewEngine: {
//                              partialsDir: path.resolve('../views/'),
//                              defaultLayout: false,
//                          },
//                          viewPath: path.resolve('../views/'),
//                      };

//                      // use a template file with nodemailer
//                      transporter.use('compile', hbs(handlebarOptions))

//                      //   for (const user of users) {
//                      await findUserFunction()
//                      async function findUserFunction(){

//                          // let userFound = await User.find( { "name": usersName} )
//                          // if (userFound.length!==0) {
//                              console.log("I'll send mail to ", userEmail);
//                          const mailOptions1 = {
//                              from: '"My Company"', // sender address
//                              template: "email1", // the name of the template file, i.e., email.handlebars
//                              // to: userFound.emailID,
//                              to: userEmail,
//                              // subject: `Hi, ${userFound.name}`,
//                              subject: `Meeting Scheduled`,
//                              context: {
//                              //   name: userFound.name,
//                              name: user,
//                              company: loggedInUserName,
//                              eventName: title, 
//                              // eventDecription: eventDecription, 
//                              // eventDate: eventDate, 
//                              eventStartTime: start,
//                              eventEndTime: end,
//                              meetingLink : meetingLink
//                              },
//                          };
//                          const mailOptions2 = {
//                             from: '"My Company"', // sender address
//                             template: "email2", // the name of the template file, i.e., email.handlebars
//                             // to: userFound.emailID,
//                             to: importedloggedInUserEmail,
//                             // subject: `Hi, ${userFound.name}`,
//                             subject: `Meeting Scheduled`,
//                             context: {
//                             //   name: userFound.name,
//                             name: loggedInUserName,
//                             company: user,
//                             eventName: title, 
//                             // eventDecription: eventDecription, 
//                             // eventDate: eventDate, 
//                             eventStartTime: start,
//                             eventEndTime: end,
//                             meetingLink : meetingLink
//                             },
//                         };
//                          try {
//                              await transporter.sendMail(mailOptions1);
//                              await transporter.sendMail(mailOptions2);
//                              console.log(`Email sent to ${user}`);
//                          } catch (error) {
//                              console.log(`Nodemailer error sending email to ${user}`, error);
//                          }
//                      }

//                     } 

//                     // -----------------mailsending ends-------------

//     })








calendarLinkRoute.get("/sharable", async (req, res) => {
    const { name, id, evType, evName, evDurHrs, evDurMins } = req.query
    console.log("/sharable called")
    try {
        const user = await User.findOne({ name: name, emailID: id })

        loggedInUserEmail = id

        res.redirect(`http://localhost:4200/createMeeting?name=${name}&id=${id}&evType=${evType}&evName=${evName}&evDurHrs=${evDurHrs}&evDurMins=${evDurMins}`)


        // res.send({message : "req is sent to me", name: name, id: id})
    } catch (error) {
        res.send({ message: error })
    }
})


calendarLinkRoute.post("/postMeetFromMeetPage", async (req, res) => {

    let meetLink;

    // let importedloggedInUserEmail = getLoggedInUserEmail();
    // let importedloggedInUserEmail = "nehaphadtare334@gmail.com"
    let importedloggedInUserEmail = loggedInUserEmail
    console.log("loggedInUsers imported EmailId is ", importedloggedInUserEmail);


    let { title, start, end, user, userEmail, otherEmails, additionalInfo, evType } = req.body
    console.log("title ", title, "start ", start, "end ", end, "user ", user, "userEmail ", userEmail, "additionalInfo ", additionalInfo, "evType ", evType);

    // start = moment.utc(start).tz('Asia/Calcutta').format();
    // end = moment.utc(end).tz('Asia/Calcutta').format();
    let currentDateTime = new Date();
    currentDateTime = moment.utc(currentDateTime).tz('Asia/Calcutta').format(); //2024-02-19T12:25:36+05:30
    currentDateTime = currentDateTime.split('+')[0] //2024-02-19T12:25:36
    console.log("start ", start, "end ", end, "currentDateTime ", currentDateTime);

    console.log(currentDateTime, start, end, "and ", start < currentDateTime, end < currentDateTime)

    if (start < currentDateTime || end < currentDateTime) {
        res.send({ message: "Meetings cannot be scheduled earlier than the current time" })
    }

    else {
        console.log("gotten body data", req.body);
        console.log("meeting will be scheduled with ", userEmail, otherEmails);

        try {
            let findUser = await User.find({ name: user })
            console.log("findUser ", findUser);

            let findLoggedInUser = await User.find({ emailID: importedloggedInUserEmail })
            console.log("findLoggedInUser ", findLoggedInUser);

            let loggedInUserName = findLoggedInUser[0].name
            console.log("loggedInUserName ", loggedInUserName);
            console.log("findUser ", findUser[0]);


            // whosoevers calendar it is find that event for him and put meeting in that event and send him mail.

            let eventsArrOfLoggedInUser = await findLoggedInUser[0].events
            console.log("eventsArrOfLoggedInUser ", eventsArrOfLoggedInUser);

            for (let i = 0; i < eventsArrOfLoggedInUser.length; i++) {
                let oneEvent = eventsArrOfLoggedInUser[i]
                console.log("oneEvent ", oneEvent);
                console.log(oneEvent.evName, title);
                if (oneEvent.evName == title) {
                    console.log("oneEvent name found same", oneEvent, title);
                    let foundEvent = oneEvent
                    console.log("foundEvent ", foundEvent);
                    // const meeting =  await Meeting.create({start, end})
                    console.log("start, end, user, userEmail, currentDateTime", start, end, user, userEmail, currentDateTime);
                    const meeting = await Meeting.create({ start, end, user: user, userEmail: userEmail, currentDateTime })
                    console.log("meeting of logged in user ", meeting);
                    console.log("foundEvent.meetings ", foundEvent.meetings);
                    foundEvent.meetings.push(meeting);
                    console.log("pushed");
                    await findLoggedInUser[0].save();
                    console.log("saved");
                    console.log(findLoggedInUser[0]);
                    break;
                }
            }


            // ppl who are in db are put in emailsOfUsersFoundInDb array and ppl who are not in db are put in emailsOfUsersNotFoundInDb array

            let emailsOfUsersFoundInDb = []
            let emailsOfUsersNotFoundInDb = []

            for (let i = 0; i < otherEmails.length; i++) {
                let findHimInDb = await User.find({ emailID: otherEmails[i] })
                if (findHimInDb) {
                    emailsOfUsersFoundInDb.push(otherEmails[i])
                }
                else {
                    emailsOfUsersNotFoundInDb.push(otherEmails[i])
                }
            }

            if (findUser.length == 0) {//if who is scheduling meeting is not in db
                console.log("User doesn't exists");
                emailsOfUsersNotFoundInDb.push(userEmail)
                console.log("in if statement ", "emailsOfUsersFoundInDb ", emailsOfUsersFoundInDb, "emailsOfUsersNotFoundInDb ", emailsOfUsersNotFoundInDb);
            }
            else {//if who is scheduling meeting is in db
                emailsOfUsersFoundInDb.push(userEmail)
                console.log("User found", findUser)
            }
            // -----------------------------------------------------------------------------------

            // ppl who are found in db, put the meeting in their meetingsWtOthers array
            try {

                for (let i = 0; i < emailsOfUsersFoundInDb.length; i++) {
                    // const meeting =  await Meeting.create({start, end})
                    // hardcoding right now evType evName
                    // const meeting =  await Meeting.create({start, end, user, userEmail, currentDateTime, evType:"One-on-One", evName: "Morning Scrum"})
                    let meeting;
                    if (emailsOfUsersFoundInDb[i] == userEmail) {
                        meeting = await Meeting.create({ start, end, user: loggedInUserName, userEmail: loggedInUserEmail, currentDateTime, evType, evName: title })
                        console.log("meeting of one who has filled the form", meeting);
                    }
                    else {
                        meeting = await Meeting.create({ start, end, user: user, userEmail: userEmail, currentDateTime, evType, evName: title })
                        console.log("meeting of ppl who were in meeting with others in form", meeting);
                    }


                    await User.updateOne(
                        { emailID: emailsOfUsersFoundInDb[i] },
                        { $push: { meetingsWtOthers: meeting } }
                    )
                    console.log("updated meeting for ", emailsOfUsersFoundInDb[i]);
                }
            }
            catch (err) {
                console.log("meeting of emailsOfUsersFoundInDb not updated.", err);
            }


            // --------new code--------

            try {
                meetLink = await createMeetingLink();
                console.log("Meeting link created:", meetLink);

                // Continue with nodemailer code
                await sendMail(meetLink, loggedInUserName, importedloggedInUserEmail, otherEmails, additionalInfo);

                return res.status(200).json({ message: "Meeting scheduled successfully. A calendar invitation has ben mailed to the users." });
            } catch (err) {
                console.log("Error creating meeting link:", err);
                return res.status(500).json({ message: `Meeting creation failed: ${err}` });
            }
            // --------new code ends--------
            // }

            // }
        }
        catch (err) {
            return res.status(500).json({ message: `Meeting creation failed : ${err}` })
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
                    summary: title,
                    start: {
                        dateTime: start,
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: end,
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
            // console.log("meeting link created"); 




            // --------------meeting link creation ends------------ 


        })
    }




    // ------------------------------
    async function sendMail(meetingLink, loggedInUserName, importedloggedInUserEmail, additionalInfo) {

        // -------------------mail sending starts-----------------
        // initialize nodemailer
        console.log("nodemailer working");
        var transporter = nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
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
        async function findUserFunction() {

            // let userFound = await User.find( { "name": usersName} )
            // if (userFound.length!==0) {
            console.log("I'll send mails");
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
                    eventName: title,
                    // eventDecription: eventDecription, 
                    // eventDate: eventDate, 
                    eventStartTime: start,
                    eventEndTime: end,
                    meetingLink: meetingLink,
                    additionalInfo: additionalInfo
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
                    eventName: title,
                    // eventDecription: eventDecription, 
                    // eventDate: eventDate, 
                    eventStartTime: start,
                    eventEndTime: end,
                    meetingLink: meetingLink,
                    additionalInfo: additionalInfo
                },
            };
            for (let i = 0; i < otherEmails.length; i++) {
                let mailOptions = {
                    from: '"My Company"', // sender address
                    template: "email1", // the name of the template file, i.e., email.handlebars
                    // to: userFound.emailID,
                    to: otherEmails[i],
                    // subject: `Hi, ${userFound.name}`,
                    subject: `Meeting Scheduled`,
                    context: {
                        //   name: userFound.name,
                        // name: user,
                        company: loggedInUserName,
                        eventName: title,
                        // eventDecription: eventDecription, 
                        // eventDate: eventDate, 
                        eventStartTime: start,
                        eventEndTime: end,
                        meetingLink: meetingLink,
                        additionalInfo: additionalInfo
                    },
                };
                try {
                    await transporter.sendMail(mailOptions);
                } catch (error) {
                    console.log(`Nodemailer error sending email to ${otherEmails[i]}`, error);
                }
            }
            try {
                await transporter.sendMail(mailOptions1);
                await transporter.sendMail(mailOptions2);
                console.log(`Email sent`);
            } catch (error) {
                console.log(`Nodemailer error sending email to ${user}`, error);
            }
        }

    }

    // -----------------mailsending ends-------------

})



calendarLinkRoute.post("/postMeetFromAdminSide", async (req, res) => {

    let meetLink;

    let { title, start, end, user, userEmail, otherEmails, additionalInfo, evType, selectedUserEmail } = req.body
    console.log("title ", title, "start ", start, "end ", end, "user ", user, "userEmail ", userEmail, "additionalInfo ", additionalInfo, "evType ", evType, "selectedUserEmail ", selectedUserEmail);


    let currentDateTime = new Date();
    currentDateTime = moment.utc(currentDateTime).tz('Asia/Calcutta').format(); //2024-02-19T12:25:36+05:30
    currentDateTime = currentDateTime.split('+')[0] //2024-02-19T12:25:36
    console.log("start ", start, "end ", end, "currentDateTime ", currentDateTime);

    console.log(currentDateTime, start, end, "and ", start < currentDateTime, end < currentDateTime)

    if (start < currentDateTime || end < currentDateTime) {
        res.send({ message: "Meetings cannot be scheduled earlier than the current time" })
    }
    else {
        console.log("gotten body data", req.body);
        console.log("meeting will be scheduled with ", userEmail, otherEmails);

        try {
            let findUser = await User.find({ name: user })
            console.log("findUser ", findUser);

            let findSelectedUser = await User.find({ emailID: selectedUserEmail })
            console.log("findSelectedUser ", findSelectedUser);

            let selectedUserName = findSelectedUser[0].name
            console.log("selectedUserName ", selectedUserName);
            console.log("findUser ", findUser[0]);


            // whosoevers calendar it is find that event for him and put meeting in that event and send him mail.

            let eventsArrOfSelectedUser = await findSelectedUser[0].events
            console.log("eventsArrOfSelectedUser ", eventsArrOfSelectedUser);

            for (let i = 0; i < eventsArrOfSelectedUser.length; i++) {
                let oneEvent = eventsArrOfSelectedUser[i]
                console.log("oneEvent ", oneEvent);
                console.log(oneEvent.evName, title);
                if (oneEvent.evName == title) {
                    console.log("oneEvent name found same", oneEvent, title);
                    let foundEvent = oneEvent
                    console.log("foundEvent ", foundEvent);
                    // const meeting =  await Meeting.create({start, end})
                    console.log("start, end, user, userEmail, currentDateTime", start, end, user, userEmail, currentDateTime);
                    const meeting = await Meeting.create({ start, end, user: user, userEmail: userEmail, currentDateTime })
                    console.log("meeting of selected user ", meeting);
                    console.log("foundEvent.meetings ", foundEvent.meetings);
                    foundEvent.meetings.push(meeting);
                    console.log("pushed");
                    await findSelectedUser[0].save();
                    console.log("saved");
                    console.log(findSelectedUser[0]);
                    break;
                }
            }


            // ppl who are in db are put in emailsOfUsersFoundInDb array and ppl who are not in db are put in emailsOfUsersNotFoundInDb array

            let emailsOfUsersFoundInDb = []
            let emailsOfUsersNotFoundInDb = []

            for (let i = 0; i < otherEmails.length; i++) {
                let findHimInDb = await User.find({ emailID: otherEmails[i] })
                if (findHimInDb) {
                    emailsOfUsersFoundInDb.push(otherEmails[i])
                }
                else {
                    emailsOfUsersNotFoundInDb.push(otherEmails[i])
                }
            }

            if (findUser.length == 0) {//if who is scheduling meeting is not in db
                console.log("User doesn't exists");
                emailsOfUsersNotFoundInDb.push(userEmail)
                console.log("in if statement ", "emailsOfUsersFoundInDb ", emailsOfUsersFoundInDb, "emailsOfUsersNotFoundInDb ", emailsOfUsersNotFoundInDb);
            }
            else {//if who is scheduling meeting is in db
                emailsOfUsersFoundInDb.push(userEmail)
                console.log("User found", findUser)
            }
            // -----------------------------------------------------------------------------------

            // ppl who are found in db, put the meeting in their meetingsWtOthers array
            try {

                for (let i = 0; i < emailsOfUsersFoundInDb.length; i++) {                    
                    let meeting;
                    if (emailsOfUsersFoundInDb[i] == userEmail) {
                        meeting = await Meeting.create({ start, end, user: selectedUserName, userEmail: selectedUserEmail, currentDateTime, evType, evName: title })
                        console.log("meeting of one who has filled the form ", meeting);
                    }
                    else {
                        meeting = await Meeting.create({ start, end, user: user, userEmail: userEmail, currentDateTime, evType, evName: title })
                        console.log("meeting of ppl who were in meeting with others in form ", meeting);
                    }


                    await User.updateOne(
                        { emailID: emailsOfUsersFoundInDb[i] },
                        { $push: { meetingsWtOthers: meeting } }
                    )
                    console.log("updated meeting for ", emailsOfUsersFoundInDb[i]);
                }
            }
            catch (err) {
                console.log("meeting of emailsOfUsersFoundInDb not updated.", err);
            }


            // --------new code--------

            try {
                meetLink = await createMeetingLink();
                console.log("Meeting link created:", meetLink);

                // Continue with nodemailer code
                await sendMail(meetLink, selectedUserName, selectedUserEmail, otherEmails, additionalInfo);

                return res.status(200).json({ message: "You are scheduled. A calendar invitation has been sent to your email address." });
            } catch (err) {
                console.log("Error creating meeting link:", err);
                return res.status(500).json({ message: `Meeting creation failed: ${err}` });
            }
            // --------new code ends--------
            // }

            // }
        }
        catch (err) {
            return res.status(500).json({ message: `Meeting creation failed : ${err}` })
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
                    summary: title,
                    start: {
                        dateTime: start,
                        timeZone: 'Asia/Kolkata',
                    },
                    end: {
                        dateTime: end,
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
            // console.log("meeting link created"); 




            // --------------meeting link creation ends------------ 


        })
    }




    // ------------------------------
    async function sendMail(meetingLink, selectedUserName, selectedUserEmail, additionalInfo) {

        // -------------------mail sending starts-----------------
        // initialize nodemailer
        console.log("nodemailer working");
        var transporter = nodemailer.createTransport(
            {
                service: 'gmail',
                auth: {
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
        async function findUserFunction() {

            // let userFound = await User.find( { "name": usersName} )
            // if (userFound.length!==0) {
            console.log("I'll send mails");
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
                    company: selectedUserName,
                    eventName: title,
                    // eventDecription: eventDecription, 
                    // eventDate: eventDate, 
                    eventStartTime: start,
                    eventEndTime: end,
                    meetingLink: meetingLink,
                    additionalInfo: additionalInfo
                },
            };
            const mailOptions2 = {
                from: '"My Company"', // sender address
                template: "email2", // the name of the template file, i.e., email.handlebars
                // to: userFound.emailID,
                to: selectedUserEmail,
                // subject: `Hi, ${userFound.name}`,
                subject: `Meeting Scheduled`,
                context: {
                    //   name: userFound.name,
                    name: selectedUserName,
                    company: user,
                    eventName: title,
                    // eventDecription: eventDecription, 
                    // eventDate: eventDate, 
                    eventStartTime: start,
                    eventEndTime: end,
                    meetingLink: meetingLink,
                    additionalInfo: additionalInfo
                },
            };
            for (let i = 0; i < otherEmails.length; i++) {
                let mailOptions = {
                    from: '"My Company"', // sender address
                    template: "email1", // the name of the template file, i.e., email.handlebars
                    // to: userFound.emailID,
                    to: otherEmails[i],
                    // subject: `Hi, ${userFound.name}`,
                    subject: `Meeting Scheduled`,
                    context: {
                        //   name: userFound.name,
                        // name: user,
                        company: selectedUserName,
                        eventName: title,
                        // eventDecription: eventDecription, 
                        // eventDate: eventDate, 
                        eventStartTime: start,
                        eventEndTime: end,
                        meetingLink: meetingLink,
                        additionalInfo: additionalInfo
                    },
                };
                try {
                    await transporter.sendMail(mailOptions);
                } catch (error) {
                    console.log(`Nodemailer error sending email to ${otherEmails[i]}`, error);
                }
            }
            try {
                await transporter.sendMail(mailOptions1);
                await transporter.sendMail(mailOptions2);
                console.log(`Email sent`);
            } catch (error) {
                console.log(`Nodemailer error sending email to ${user}`, error);
            }
        }

    }

    // -----------------mailsending ends-------------

})



calendarLinkRoute.delete("/deleteMeetFromAdminSide", async(req, res)=>{
    const {selectedMeetId, selectedEventId, selectedUserId} = req.query

    console.log("delete meet from admin called ", selectedMeetId, selectedEventId, selectedUserId);
    try{
        let findSelectedUser = await User.find({_id : selectedUserId})
        console.log("selected user is ", findSelectedUser);

        let events = findSelectedUser[0].events
        console.log("events ", events);

        // let thatEvent = await events.find({_id.toString() == selectedEventId})
        let thatEvent;
        for(let i=0; i<events.length; i++){
            console.log("events[i]._id.toString(), selectedEventId ", events[i]._id.toString(), selectedEventId, events[i]._id.toString() == selectedEventId);
            if(events[i]._id.toString() == selectedEventId){
                thatEvent = events[i]
                break;
            }
        }
        console.log("thatEvent ", thatEvent);

        let meetingsArrayOfThatEvent = await thatEvent.meetings
        console.log("meetingsArrayOfThatEvent ", meetingsArrayOfThatEvent);

        const filteredMeetings = meetingsArrayOfThatEvent.filter((meet) => {
            // console.log(event._id.toString(), id);
            // console.log(typeof(event._id.toString()), typeof(id));
            // console.log(event._id.toString() == id);
            console.log( "meet._id.toString(), selectedMeetId", meet._id.toString(), selectedMeetId ,meet._id.toString() == selectedMeetId);
            return meet._id.toString() !== selectedMeetId
        });

        console.log("filteredMeetings ", filteredMeetings);

        meetingsArrayOfThatEvent = filteredMeetings
        console.log("meetingsArrayOfThatEvent ", meetingsArrayOfThatEvent);
        // console.log('filteredEvents ', filteredEvents);
        // Update the user's events array
        // findLoggedInUser[0].events = filteredEvents;

        thatEvent.meetings = filteredMeetings;
        console.log("thatEvent after deletion", thatEvent);

        await findSelectedUser[0].save()
        console.log("user saved w/o that meet ");
        return res.status(200).json({ message: "Meeting deleted." });
    }
    catch(err){
        return res.status(500).json({message : `Meeting deletion failed : ${err}`})
    }  
})

module.exports = { calendarLinkRoute, getLoggedInUserEmailFromQuery: () => loggedInUserEmail }

