const express = require("express");
// const Meeting = require('../models/meeting')
// const User = require('../models/user')
const { User, Meeting } = require("../models/userAndMeeting");
const { userRoute, getLoggedInUserEmail } = require("./userRouter");
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const readline = require("readline");
const moment = require("moment-timezone");
// const { getLoggedInUserEmailFromQuery } = require('./calendarLinkRouter');
const twilio = require("twilio");
require("dotenv").config();

let loggedInUserEmail;

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const TOKEN_PATH = "token.json";

const calendarLinkRoute = express.Router();

const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const { log } = require("console");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

//to get calendar by link
calendarLinkRoute.get("/", async (req, res) => {
  const { name, id } = req.query;
  console.log("calendarLinkRoute am called");

  try {
    // const user = await User.findOne({ name: name, emailID: id });
    console.log(`redirecting to http://localhost:4200/calendarByLink?name=${name}&id=${id}`);

    res.redirect(`http://localhost:4200/calendarByLink?name=${name}&id=${id}`);

    // res.send({message : "req is sent to me", name: name, id: id})
  } catch (error) {
    console.log("error occured ", error);
    res.send({ message: error });
  }
});

// calendarLinkRoute.get("/sharable", async (req, res) => {
//   const { name, id, evType, evName, evDurHrs, evDurMins, image } = req.query;
//   console.log("/sharable called");
//   try {
//     const user = await User.findOne({ name: name, emailID: id });

//     loggedInUserEmail = id;

//     res.redirect(
//       `http://localhost:4200/createMeeting?name=${name}&id=${id}&evType=${evType}&evName=${evName}&evDurHrs=${evDurHrs}&evDurMins=${evDurMins}&image=${image}`
//     );

//     // res.send({message : "req is sent to me", name: name, id: id})
//   } catch (error) {
//     res.send({ message: error });
//   }
// });


calendarLinkRoute.get("/sharable", async (req, res) => {
  const { userId, eventId } = req.query;
  console.log("/sharable called");
  console.log("req.query ", userId);
  try {
    const user = await User.findOne({ _id : userId });
    console.log("found user in server inin voting app")
    loggedInUserEmail = user.emailID;
    console.log("loggedInUserEmail ", loggedInUserEmail);
    res.redirect(
      `http://localhost:4500/create?userId=${userId}&eventId=${eventId}`

    );

    // res.send({message : "req is sent to me", name: name, id: id})
  } catch (error) {
    res.send({ message: error });
  }
});


calendarLinkRoute.post("/postMeetFromMeetPage", async (req, res) => {
  console.log("postMeetFromMeetPage called ");
  let meetLink;

  // let importedloggedInUserEmail = getLoggedInUserEmail();
  // let importedloggedInUserEmail = "nehaphadtare334@gmail.com"


  let {
    title,
    start,
    end,
    user,
    userEmail,
    otherEmails,
    additionalInfo,
    evType,
    questionsWdAnswers,
    emailOfCalendarOwner,
    evId,
    userSurname
  } = req.body;
  console.log(
    "title ",
    title,
    "start ",
    start,
    "end ",
    end,
    "user ",
    user,
    "userEmail ",
    userEmail,
    "additionalInfo ",
    additionalInfo,
    "evType ",
    evType,
    "questionsWdAnswers ",
    questionsWdAnswers,
    "emailOfCalendarOwner ",
    emailOfCalendarOwner,
    "evId ",
    evId,
    "userSurname ",
    userSurname
  );

  // let importedloggedInUserEmail = loggedInUserEmail;
  // console.log("loggedInUsers imported EmailId is ", importedloggedInUserEmail);
  // start = moment.utc(start).tz('Asia/Calcutta').format();
  // end = moment.utc(end).tz('Asia/Calcutta').format();
  let currentDateTime = new Date();
  currentDateTime = moment.utc(currentDateTime).tz("Asia/Calcutta").format(); //2024-02-19T12:25:36+05:30
  currentDateTime = currentDateTime.split("+")[0]; //2024-02-19T12:25:36
  console.log(
    "start ",
    start,
    "end ",
    end,
    "currentDateTime ",
    currentDateTime
  );

  console.log(
    currentDateTime,
    start,
    end,
    "and ",
    start < currentDateTime,
    end < currentDateTime
  );

  if (start < currentDateTime || end < currentDateTime) {
    res.send({
      message: "Meetings cannot be scheduled earlier than the current time",
    });
  } else {
    console.log("gotten body data", req.body);
    console.log("meeting will be scheduled with ", userEmail, otherEmails);

    try {
      let findUser = await User.findOne({ name: user });
      console.log("findUser ", findUser);
      
      let calendarOwnerUser = await User.findOne({
        emailID: emailOfCalendarOwner,
      });
      console.log("calendarOwnerUser ", calendarOwnerUser);

      let calendarOwnerUserName = calendarOwnerUser.name;
      console.log("calendarOwnerUserName ", calendarOwnerUserName);
      let calendarOwnerPhoneNumber = calendarOwnerUser.phoneNumber;
      console.log("calendarOwnerPhoneNumber ", calendarOwnerPhoneNumber);

      // if(findUser.length != 0){
      //   let phoneNumbersOfUsersFoundInDb = [findUser[0].phoneNumber]
      // }


      console.log("findUser ", findUser);

      // whosoevers calendar it is find that event for him and put meeting in that event and send him mail.

      let eventsArrOfCalendarOwner = await calendarOwnerUser.events;
      console.log("eventsArrOfCalendarOwner ", eventsArrOfCalendarOwner);

      for (let i = 0; i < eventsArrOfCalendarOwner.length; i++) {
        let oneEvent = eventsArrOfCalendarOwner[i];
        console.log("oneEvent ", oneEvent);
        console.log(oneEvent.evName, title);
        if (oneEvent.evName == title) {
          console.log("oneEvent name found same", oneEvent, title);
          let foundEvent = oneEvent;
          console.log("foundEvent ", foundEvent);
          // const meeting =  await Meeting.create({start, end})
          console.log(
            "start, end, user, userEmail, currentDateTime",
            start,
            end,
            user,
            userEmail,
            currentDateTime
          );
          let meeting
          if(evType=="One-on-One"){
             meeting = await Meeting.create({
              start,
              end,
              user: user,
              userSurname : "",
              userEmail: [userEmail, ...otherEmails],
              currentDateTime,
              description : additionalInfo,
              questionsWdAnswers,
              userSurname
            });
          }
          else if(evType=="Group"){
             meeting = await Meeting.create({
              start,
              end,
              user: user,
              userSurname : "",
              userEmail: [userEmail, ...otherEmails],
              currentDateTime,
              description : additionalInfo,
              questionsWdAnswers,
              bookedForWhichEvId : evId,
              userSurname
            });
          }
          console.log("meeting of logged in user ", meeting);
          console.log("foundEvent.meetings ", foundEvent.meetings);
          foundEvent.meetings.push(meeting);
          console.log("pushed");
          await calendarOwnerUser.save();
          console.log("saved");
          console.log(calendarOwnerUser);
          break;
        }
      }

      // ppl who are in db are put in emailsOfUsersFoundInDb array and ppl who are not in db are put in emailsOfUsersNotFoundInDb array

      let emailsOfUsersFoundInDb = [];
      let emailsOfUsersNotFoundInDb = [];


      for (let i = 0; i < otherEmails.length; i++) {
        let findHimInDb = await User.find({ emailID: otherEmails[i] });
        if (findHimInDb) {
          emailsOfUsersFoundInDb.push(otherEmails[i]);
          // console.log("phoneNumber ", findHimInDb[0].phoneNumber);
          // phoneNumbersOfUsersFoundInDb.push(findHimInDb[0].phoneNumber)
        } else {
          emailsOfUsersNotFoundInDb.push(otherEmails[i]);
        }
      }

      // console.log("phoneNumbersOfUsersFoundInDb ", phoneNumbersOfUsersFoundInDb);
      console.log("emailsOfUsersFoundInDb ", emailsOfUsersFoundInDb);


      if (!findUser) {
        //if who is scheduling meeting is not in db
        console.log("User doesn't exists");
        emailsOfUsersNotFoundInDb.push(userEmail);
        console.log(
          "in if statement ",
          "emailsOfUsersFoundInDb ",
          emailsOfUsersFoundInDb,
          "emailsOfUsersNotFoundInDb ",
          emailsOfUsersNotFoundInDb
        );
      } else {
        //if who is scheduling meeting is in db
        emailsOfUsersFoundInDb.push(userEmail);
        console.log("User found", findUser);
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
            meeting = await Meeting.create({
              start,
              end,
              user: calendarOwnerUserName,
              userSurname : "",
              userEmail: emailOfCalendarOwner,
              currentDateTime,
              evType,
              evName: title,
            });
            console.log("meeting of one who has filled the form", meeting);
          } else {
            meeting = await Meeting.create({
              start,
              end,
              user: user,
              userSurname : "",
              userEmail: userEmail,
              currentDateTime,
              evType,
              evName: title,
            });
            console.log(
              "meeting of ppl who were in meeting with others in form",
              meeting
            );
          }

          await User.updateOne(
            { emailID: emailsOfUsersFoundInDb[i] },
            { $push: { meetingsWtOthers: meeting } }
          );
          console.log("updated meeting for ", emailsOfUsersFoundInDb[i]);
        }
      } catch (err) {
        console.log("meeting of emailsOfUsersFoundInDb not updated.", err);
      }

      // --------new code--------

      try {
        meetLink = await createMeetingLink();
        console.log("Meeting link created:", meetLink);

        // console.log("in sendMail functn, I am sending ", meetLink, loggedInUserName, importedloggedInUserEmail,otherEmails,additionalInfo);
        console.log("in sendMail functn, I am sending ");

        // Continue with nodemailer code
        await sendMailUser(
          meetLink,
          calendarOwnerUserName,
          emailOfCalendarOwner,
          otherEmails,
          additionalInfo,
          questionsWdAnswers
        );
        // await sendMsg([loggedInUserPhoneNumber, ...phoneNumbersOfUsersFoundInDb]);
        // await sendMsg([...phoneNumbersOfUsersFoundInDb]);

        return res
          .status(200)
          .json({
            message:
              "Meeting scheduled successfully. A calendar invitation has been mailed to the attendees.",
          });
      } catch (err) {
        console.log("Error creating meeting link:", err);
        return res
          .status(500)
          .json({ message: `Meeting creation failed: ${err}` });
      }
      // --------new code ends--------
      // }

      // }
    } catch (err) {
      return res
        .status(500)
        .json({ message: `Meeting creation failed : ${err}` });
    }
  }

  //  --------------------
  // meeting link creation

  // Load client secrets from a file, downloaded from the Google Cloud Console
  async function createMeetingLink() {
    return new Promise((resolve, reject) => {
      fs.readFile("credentials.json", (err, content) => {
        if (err) return console.error("Error loading client secret file:", err);

        authorize(JSON.parse(content), scheduleMeeting);
      });

      function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uri } = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uri[0]
        );

        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getAccessToken(oAuth2Client, callback);
          oAuth2Client.setCredentials(JSON.parse(token));
          callback(oAuth2Client);
        });
      }

      async function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: SCOPES,
        });

        console.log("Authorize this app by visiting this URL:", authUrl);

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question("Enter the code from that page here: ", (code) => {
          rl.close();

          oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error("Error retrieving access token", err);

            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log("Token stored to", TOKEN_PATH);
            });

            callback(oAuth2Client);
          });
        });
      }

      function scheduleMeeting(auth) {
        const calendar = google.calendar({ version: "v3", auth });

        const event = {
          summary: title,
          start: {
            dateTime: start,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: end,
            timeZone: "Asia/Kolkata",
          },
          conferenceData: {
            createRequest: {
              requestId: uuidv4(),
            },
          },
        };

        calendar.events.insert(
          {
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
          },
          (err, res) => {
            if (err) return console.error("Error scheduling meeting:", err);
            meetLink = res.data.hangoutLink;
            console.log("Meeting scheduled:", meetLink);
            resolve(res.data.hangoutLink);
            return res.data.hangoutLink;
          }
        );
      }
      // console.log("meeting link created");

      // --------------meeting link creation ends------------
    });
  }

  // ------------------------------
  async function sendMailUser(
    meetingLink,
    calendarOwnerUserName,
    emailOfCalendarOwner,
    otherEmails,
    additionalInfo,
    questionsWdAnswers
  ) {
    // -------------------mail sending starts-----------------
    // initialize nodemailer
    console.log("sendMailUser called");
    console.log("nodemailer working");
    console.log("sendMail got ", meetingLink, calendarOwnerUserName, emailOfCalendarOwner, additionalInfo);
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nehaphadtare334@gmail.com",
        pass: "xtjc dyqr evlk bfcj",
      },
    });

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("../views/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("../views/"),
    };

    // use a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));

    //   for (const user of users) {
    await findUserFunction();
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
          company: emailOfCalendarOwner,
          eventName: title,
          // eventDecription: eventDecription,
          // eventDate: eventDate,
          eventStartTime: start,
          eventEndTime: end,
          meetingLink: meetingLink,
          additionalInfo: additionalInfo,
          questionsWdAnswers
        },
      };
      const mailOptions2 = {
        from: '"My Company"', // sender address
        template: "email2", // the name of the template file, i.e., email.handlebars
        // to: userFound.emailID,
        to: emailOfCalendarOwner,
        // subject: `Hi, ${userFound.name}`,
        subject: `Meeting Scheduled`,
        context: {
          //   name: userFound.name,
          name: calendarOwnerUserName,
          company: user,
          eventName: title,
          // eventDecription: eventDecription,
          // eventDate: eventDate,
          eventStartTime: start,
          eventEndTime: end,
          meetingLink: meetingLink,
          additionalInfo: additionalInfo,
          questionsWdAnswers
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
            company: calendarOwnerUserName,
            eventName: title,
            // eventDecription: eventDecription,
            // eventDate: eventDate,
            eventStartTime: start,
            eventEndTime: end,
            meetingLink: meetingLink,
            additionalInfo: additionalInfo,
            questionsWdAnswers
          },
        };
        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.log(
            `Nodemailer error sending email to ${otherEmails[i]}`,
            error
          );
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

  // -----------------msgSending starts------------
  // async function sendMsg(phoneNumbersArr) {
  //   console.log("sendMsg called ", phoneNumbersArr);
  //   const client = require("twilio")(accountSid, authToken);

  //   for(let i=0; i<phoneNumbersArr.length; i++){
  //       console.log(phoneNumbersArr[i]);
  //       client.messages
  //         .create({
  //           from: process.env.TWILIO_PHONE_NUMBER,
  //           // to: "+919359412215",
  //           to: `+91${phoneNumbersArr[i]}`,
  //           body: "Hi, your meeting is scheduled. For more details, check your mail.",
  //           //   }).then((message) => console.log(message.sid));
  //         })
  //         .then((message) => console.log(message.sid))
  //         .catch((err) => console.log(err));
  //   }
  // }
  //----------------msgSending Ends-------------------
});

calendarLinkRoute.post("/postMeetFromAdminSide", async (req, res) => {
  console.log("postMeetFromAdminSide called ");
  let meetLink;

  let {
    title,
    start,
    end,
    user,
    userEmail,
    otherEmails,
    additionalInfo,
    evType,
    questionsWdAnswers,
    selectedUserEmail,
  } = req.body;
  console.log(
    "title ",
    title,
    "start ",
    start,
    "end ",
    end,
    "user ",
    user,
    "userEmail ",
    userEmail,
    "additionalInfo ",
    additionalInfo,
    "evType ",
    evType,
    "questionsWdAnswers ",
    questionsWdAnswers,
    "selectedUserEmail ",
    selectedUserEmail
  );

  let currentDateTime = new Date();
  currentDateTime = moment.utc(currentDateTime).tz("Asia/Calcutta").format(); //2024-02-19T12:25:36+05:30
  currentDateTime = currentDateTime.split("+")[0]; //2024-02-19T12:25:36
  console.log(
    "start ",
    start,
    "end ",
    end,
    "currentDateTime ",
    currentDateTime
  );

  console.log(
    currentDateTime,
    start,
    end,
    "and ",
    start < currentDateTime,
    end < currentDateTime
  );

  if (start < currentDateTime || end < currentDateTime) {
    res.send({
      message: "Meetings cannot be scheduled earlier than the current time",
    });
  } else {
    console.log("gotten body data", req.body);
    console.log("meeting will be scheduled with ", userEmail, otherEmails);

    try {
      let findUser = await User.find({ name: user });
      console.log("findUser ", findUser);

      let findSelectedUser = await User.find({ emailID: selectedUserEmail });
      console.log("findSelectedUser ", findSelectedUser);

      let selectedUserName = findSelectedUser[0].name;
      console.log("selectedUserName ", selectedUserName);
      console.log("findUser ", findUser[0]);

      // whosoevers calendar it is find that event for him and put meeting in that event and send him mail.

      let eventsArrOfSelectedUser = await findSelectedUser[0].events;
      console.log("eventsArrOfSelectedUser ", eventsArrOfSelectedUser);

      for (let i = 0; i < eventsArrOfSelectedUser.length; i++) {
        let oneEvent = eventsArrOfSelectedUser[i];
        console.log("oneEvent ", oneEvent);
        console.log(oneEvent.evName, title);
        if (oneEvent.evName == title) {
          console.log("oneEvent name found same", oneEvent, title);
          let foundEvent = oneEvent;
          console.log("foundEvent ", foundEvent);
          // const meeting =  await Meeting.create({start, end})
          console.log(
            "start, end, user, userEmail, currentDateTime",
            start,
            end,
            user,
            userEmail,
            currentDateTime
          );
          const meeting = await Meeting.create({
            start,
            end,
            user: user,
            userSurname : "",
            userEmail: userEmail,
            currentDateTime,
            questionsWdAnswers
          });
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

      let emailsOfUsersFoundInDb = [];
      let emailsOfUsersNotFoundInDb = [];

      for (let i = 0; i < otherEmails.length; i++) {
        let findHimInDb = await User.find({ emailID: otherEmails[i] });
        if (findHimInDb) {
          emailsOfUsersFoundInDb.push(otherEmails[i]);
        } else {
          emailsOfUsersNotFoundInDb.push(otherEmails[i]);
        }
      }

      if (findUser.length == 0) {
        //if who is scheduling meeting is not in db
        console.log("User doesn't exists");
        emailsOfUsersNotFoundInDb.push(userEmail);
        console.log(
          "in if statement ",
          "emailsOfUsersFoundInDb ",
          emailsOfUsersFoundInDb,
          "emailsOfUsersNotFoundInDb ",
          emailsOfUsersNotFoundInDb
        );
      } else {
        //if who is scheduling meeting is in db
        emailsOfUsersFoundInDb.push(userEmail);
        console.log("User found", findUser);
      }
      // -----------------------------------------------------------------------------------

      // ppl who are found in db, put the meeting in their meetingsWtOthers array
      try {
        for (let i = 0; i < emailsOfUsersFoundInDb.length; i++) {
          let meeting;
          if (emailsOfUsersFoundInDb[i] == userEmail) {
            meeting = await Meeting.create({
              start,
              end,
              user: selectedUserName,
              userSurname : "",
              userEmail: selectedUserEmail,
              currentDateTime,
              evType,
              evName: title,
            });
            console.log("meeting of one who has filled the form ", meeting);
          } else {
            meeting = await Meeting.create({
              start,
              end,
              user: user,
              userSurname : "",
              userEmail: userEmail,
              currentDateTime,
              evType,
              evName: title,
            });
            console.log(
              "meeting of ppl who were in meeting with others in form ",
              meeting
            );
          }

          await User.updateOne(
            { emailID: emailsOfUsersFoundInDb[i] },
            { $push: { meetingsWtOthers: meeting } }
          );
          console.log("updated meeting for ", emailsOfUsersFoundInDb[i]);
        }
      } catch (err) {
        console.log("meeting of emailsOfUsersFoundInDb not updated.", err);
      }

      // --------new code--------

      try {
        meetLink = await createMeetingLink();
        console.log("Meeting link created:", meetLink);

        // Continue with nodemailer code
        await sendMailAdmin(
          meetLink,
          selectedUserName,
          selectedUserEmail,
          otherEmails,
          additionalInfo,
          questionsWdAnswers
        );
        // await sendMsg();

        return res
          .status(200)
          .json({
            message:
              "Your meeting has been scheduled. A calendar invitation has been sent to your email address.",
          });
      } catch (err) {
        console.log("Error creating meeting link:", err);
        return res
          .status(500)
          .json({ message: `Meeting creation failed: ${err}` });
      }
      // --------new code ends--------
      // }

      // }
    } catch (err) {
      return res
        .status(500)
        .json({ message: `Meeting creation failed : ${err}` });
    }
  }

  //  --------------------
  // meeting link creation

  // Load client secrets from a file, downloaded from the Google Cloud Console
  async function createMeetingLink() {
    return new Promise((resolve, reject) => {
      fs.readFile("credentials.json", (err, content) => {
        if (err) return console.error("Error loading client secret file:", err);

        authorize(JSON.parse(content), scheduleMeeting);
      });

      function authorize(credentials, callback) {
        const { client_secret, client_id, redirect_uri } = credentials.web;
        const oAuth2Client = new google.auth.OAuth2(
          client_id,
          client_secret,
          redirect_uri[0]
        );

        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getAccessToken(oAuth2Client, callback);
          oAuth2Client.setCredentials(JSON.parse(token));
          callback(oAuth2Client);
        });
      }

      async function getAccessToken(oAuth2Client, callback) {
        const authUrl = oAuth2Client.generateAuthUrl({
          access_type: "offline",
          scope: SCOPES,
        });

        console.log("Authorize this app by visiting this URL:", authUrl);

        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question("Enter the code from that page here: ", (code) => {
          rl.close();

          oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error("Error retrieving access token", err);

            oAuth2Client.setCredentials(token);
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log("Token stored to", TOKEN_PATH);
            });

            callback(oAuth2Client);
          });
        });
      }

      function scheduleMeeting(auth) {
        const calendar = google.calendar({ version: "v3", auth });

        const event = {
          summary: title,
          start: {
            dateTime: start,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: end,
            timeZone: "Asia/Kolkata",
          },
          conferenceData: {
            createRequest: {
              requestId: uuidv4(),
            },
          },
        };

        calendar.events.insert(
          {
            calendarId: "primary",
            resource: event,
            conferenceDataVersion: 1,
          },
          (err, res) => {
            if (err) return console.error("Error scheduling meeting:", err);
            meetLink = res.data.hangoutLink;
            console.log("Meeting scheduled:", meetLink);
            resolve(res.data.hangoutLink);
            return res.data.hangoutLink;
          }
        );
      }
      // console.log("meeting link created");

      // --------------meeting link creation ends------------
    });
  }

  // ------------------------------
  async function sendMailAdmin(
    meetingLink,
    selectedUserName,
    selectedUserEmail,
    additionalInfo,
    questionsWdAnswers
  ) {
    // -------------------mail sending starts-----------------
    // initialize nodemailer
    console.log("sendMailAdmin called");
    console.log("nodemailer working");
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nehaphadtare334@gmail.com",
        pass: "xtjc dyqr evlk bfcj",
      },
    });

    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.resolve("../views/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("../views/"),
    };

    // use a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));

    //   for (const user of users) {
    await findUserFunction();
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
          additionalInfo: additionalInfo,
          questionsWdAnswers : questionsWdAnswers
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
          additionalInfo: additionalInfo,
          questionsWdAnswers : questionsWdAnswers
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
            additionalInfo: additionalInfo,
            questionsWdAnswers : questionsWdAnswers
          },
        };
        try {
          await transporter.sendMail(mailOptions);
        } catch (error) {
          console.log(
            `Nodemailer error sending email to ${otherEmails[i]}`,
            error
          );
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

  //------------------msg sending starts------------
  // async function sendMsg(){
  //     console.log("send msgs called.");
  //     const accountSid = 'ACc66c42cb4ebc6196fd11affbf4889f0f';
  //     const authToken = 'afb680f59e2768d7ffd87f920ffb5edc';
  //     const client = require('twilio')(accountSid, authToken);

  //     client.messages
  //         .create({
  //                     from: '+12515510873',
  //                     to: '+919359412215'
  //         })
  //         .then(message => console.log(message.sid))
  //         .done();
  // }

  async function sendMsg() {
    console.log("sendMsg called");
    const client = require("twilio")(accountSid, authToken);

    client.messages
      .create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to: +919359412215,
        body: "Your meeting",
        //   }).then((message) => console.log(message.sid));
      })
      .then((message) => console.log(message.sid))
      .catch((err) => console.log(err));
  }

  //------------------msg sending ends------------
});

calendarLinkRoute.delete("/deleteMeetFromAdminSide", async (req, res) => {
  const { selectedMeetId, selectedEventId, selectedUserId } = req.query;

  console.log(
    "delete meet from admin called ",
    selectedMeetId,
    selectedEventId,
    selectedUserId
  );
  try {
    let findSelectedUser = await User.find({ _id: selectedUserId });
    console.log("selected user is ", findSelectedUser);

    let events = findSelectedUser[0].events;
    console.log("events ", events);

    // let thatEvent = await events.find({_id.toString() == selectedEventId})
    let thatEvent;
    for (let i = 0; i < events.length; i++) {
      console.log(
        "events[i]._id.toString(), selectedEventId ",
        events[i]._id.toString(),
        selectedEventId,
        events[i]._id.toString() == selectedEventId
      );
      if (events[i]._id.toString() == selectedEventId) {
        thatEvent = events[i];
        break;
      }
    }
    console.log("thatEvent ", thatEvent);

    let meetingsArrayOfThatEvent = await thatEvent.meetings;
    console.log("meetingsArrayOfThatEvent ", meetingsArrayOfThatEvent);

    const filteredMeetings = meetingsArrayOfThatEvent.filter((meet) => {
      // console.log(event._id.toString(), id);
      // console.log(typeof(event._id.toString()), typeof(id));
      // console.log(event._id.toString() == id);
      console.log(
        "meet._id.toString(), selectedMeetId",
        meet._id.toString(),
        selectedMeetId,
        meet._id.toString() == selectedMeetId
      );
      return meet._id.toString() !== selectedMeetId;
    });

    console.log("filteredMeetings ", filteredMeetings);

    meetingsArrayOfThatEvent = filteredMeetings;
    console.log("meetingsArrayOfThatEvent ", meetingsArrayOfThatEvent);
    // console.log('filteredEvents ', filteredEvents);
    // Update the user's events array
    // findLoggedInUser[0].events = filteredEvents;

    thatEvent.meetings = filteredMeetings;
    console.log("thatEvent after deletion", thatEvent);

    await findSelectedUser[0].save();
    console.log("user saved w/o that meet ");
    return res.status(200).json({ message: "Meeting deleted." });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `Meeting deletion failed : ${err}` });
  }
});

module.exports = {
  calendarLinkRoute,
  getLoggedInUserEmailFromQuery: () => loggedInUserEmail,
};