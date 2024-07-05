const express = require("express");
// const User = require('../models/user')
const { User, Meeting, Event } = require("../models/userAndMeeting");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const auth = require("../middlewares/Authenticator");
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: "uploads/" });
const axios = require("axios");
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const { v4: uuidv4 } = require("uuid");
const readline = require("readline");
const moment = require("moment-timezone");
const { log } = require("console");
// const { getLoggedInUserEmailFromQuery } = require('./calendarLinkRouter');
const twilio = require("twilio");
require("dotenv").config();

const userRoute = express.Router();

const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];
const TOKEN_PATH = "token.json";



const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

// // Create the uploads directory if it doesn't exist
// const uploadsDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadsDir)) {
//   fs.mkdirSync(uploadsDir);
// }

// // Multer configuration
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Destination folder for uploaded files
//   },
//   filename: function (req, file, cb) {
//     const extension = path.extname(file.originalname);
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + "-" + uniqueSuffix + extension);
//   },
// });

// const upload = multer({ storage: storage }).single("image");

let loggedInUserEmail;
let shortIdvariable;

userRoute.post("/postuser", async (req, res) => {
  console.log("create user called");
  const { name, emailID, password, userAvailability, phoneNumber } = req.body;
  try {
    console.log(name, emailID, password, userAvailability, phoneNumber);

    const hashedPassword = await bcrypt.hash(password, 5);
    console.log(hashedPassword);

    // const meeting =  await Meeting.create({title: "fillingSub", start:"2019-01-18T09:00:00+05:30", end:"2019-01-18T09:30:00+05:30", })
    const meeting = await Meeting.create({
      start: "2019-01-18T09:00:00+05:30",
      end: "2019-01-18T09:30:00+05:30",
      user: "abc",
      userEmail: "abc@gmail.com",
      currentDateTime: "date",
      questionsWdAnswers : []
    });

    console.log(meeting);

    const event = await Event.create({
      evName: "30 Minute Meeting",
      evType: "One-on-One",
      evDuration: { hrs: 0, minutes: 30 },
      evLocation: "zoom",
      meetings: [meeting],
      allowInviteesToAddGuests: true,
      surnameReq: false,
      questionsToBeAsked: [
        {
          question: "Please share anything that will help prepare for our meeting.",
          answerRequiredOrNot: false,
          showThisQuestionOrNot: true,
          // answer: "", 
          _id: (Math.floor(Math.random() * 10000000000000001).toString())
        }
      ],
      // evLinkEnd: "30 Minute Meeting".replace(/ /g, "-"),
      whenCanInviteesSchedule: {
        status: true,
        days: {
          status: false
        },
        withinDateRange: {
          status: false
        },
        indefinitely: {
          status: true
        }
      },
      minimumNotice : {
        status: false,
        hrs : {
          status : false
        },
        mins:{
          status : false
        },
        days:{
          status : false
        }
      },
      noOfMeetsAllowedPerDay : {
        status : false
      },
      startTimIncrements : {
        status : true,
        mins : 30
      }

    });
    // const event =  await Event.create({evName: "30 Minute Meeting", evType:"One-on-One", evDuration:{hrs:0, minutes:30}, evLocation: "zoom"})
    console.log(event);

    const user = await User.create({
      name,
      emailID,
      password: hashedPassword,
      phoneNumber: phoneNumber,
      events: [event],
      userAvailability: userAvailability,
      meetingsWtOthers: [meeting],
      profileImage: "",
      cloduraBranding : true
    });
    // const user = await User.create({name , emailID, password:hashedPassword,  events: [event], userAvailability : userAvailability, meetingsWtOthers: []})
    console.log(user);

    return res.send({ message: "User account added" });
  } catch (err) {
    return res.send({ message: `User account creation failed : ${err}` });
  }
});

userRoute.patch("/patchuser", auth, async (req, res) => {
  console.log("patch user called");
  const { emailID, userAvailability } = req.body;
  console.log("body ", req.body);
  try {
    await User.updateOne(
      { emailID: emailID },
      { userAvailability: userAvailability }
    );

    return res.send({ message: "Availability Updated" });
  } catch (err) {
    console.log("error ", err);
    return res.send({ message: `User availability updation : ${err}` });
  }
});

userRoute.post("/login", async (req, res) => {
  const { emailID, password } = req.body;
  console.log("loggedIn usersEmail and Password ", emailID, password);

  try {
    //check if user's emailId matches with the one that is there in the database
    const user = await User.findOne({ emailID: emailID });
    console.log("user ", user, "line 40");

    //if user does not exist in database send response invalid credentials
    if (user.length == 0) {
      return res.send({ message: "Invalid Credentials" });
    } else {
      const matchPassword = bcrypt.compare(
        password,
        user.password,
        (err, result) => {
          if (result) {
            const token = jwt.sign(
              { emailID: user.emailID },
              "meetingScheduler"
            );
            loggedInUserEmail = user.emailID;
            // console.log("user ", user);
            return res.send({ token: { token }, message: `Login Successful.`, user: user._id });
          } else {
            return res.send({ message: "Invalid Credentials" });
          }
        }
      );
    }
  } catch (err) {
    res.status(404).send({ msg: `User login failed ${err.message}` });
  }
  // }
  // catch (err) {
  //     res.status(404).send({ msg: `User login failed ${err.message}` })
  // }
});

console.log("loggedInUserEmail export", loggedInUserEmail);

userRoute.get("/getParticularUser", async(req,res)=>{
  console.log("/getParticularUser called");
  const { userEmailId } = req.query;
  try {
    const user = await User.findOne({ emailID: userEmailId });

    res.send({ msg: `got user `, user: user });
  } catch (err) {
    res.status(404).send({ msg: `Finding failed ${err.message}` });
  }
})

userRoute.delete("/deleteUser", async (req, res) => {
  const { id } = req.query;

  console.log("delete user called ", id);
  try {
    await User.deleteOne({ _id: id });
    return res.status(200).json({ message: "User deleted." });
  } catch (err) {
    return res.status(500).json({ message: `User deletion failed : ${err}` });
  }
});

userRoute.patch("/editUserNameAndEmail/:id", async (req, res) => {
  const { id } = req.params;
  console.log("editUserNameAndEmail user called");
  const { userName, email } = req.body;
  console.log("body ", req.body);
  try {
    await User.updateOne({ _id: id }, { name: userName, emailID: email });
    return res.send({ message: "User Updated" });
  } catch (err) {
    return res.send({ message: `User updation failed: ${err}` });
  }
});

userRoute.get("/initialUserUnavailibility", async (req, res) => {
  console.log("/initialUserUnavailibility called");
  const { userId } = req.query;
  try {
    //check if user's Id matches with the one that is there in the database
    const user = await User.findOne({ _id: userId });

    let userUnavaibility = user[0]["userAvailability"]["nonWorkingDays"];
    console.log("userUnavaibility ", userUnavaibility);
    // return userUnavaibility
    res.send({ msg: `userUnavaibilityArray `, arr: userUnavaibility });
  } catch (err) {
    res.status(404).send({ msg: `User login failed ${err.message}` });
  }
});

// userRoute.post(
//   // "/uploadAvatar/:emailId", upload,
//   "/uploadAvatar/:emailId",

//   async (req, res) => {
//     console.log("uploadAvatar called ", req.params.emailId, req.params, req.body);
//     // console.log("req ", req);
//     try {
//       // const file = req.body.image;
//       // const file = req.file.location
//       const file = req.file;
//       // const user = await User.findOne({ emailID: req.params.emailId });
//       // const user = await User.findById(req.params.id);
//       // if (!user) {
//       //   return res.status(404).json({ message: "User not found" });
//       // }
//       if(!file){
//         return res.status(400).json({ message: "No file uploaded" });
//       }

//       const user = await User.findOne({ emailID: req.params.emailId });
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // Update user profile image data
//       user.profileImage.data = fs.readFileSync(file.path);
//       user.profileImage.contentType = file.mimetype;
//       await user.save();
//       return res.status(200).json({ message: "Image uploaded successfully" });
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

userRoute.patch("/uploadAvatar/:emailId", upload.single("image"),
  async (req, res) => {
    try {
      const userEmailId = req.params.emailId;
      const imageUrl = req.file.path; // This assumes you save the image to your server. Adjust accordingly if you want to store it elsewhere.

      console.log("userEmailId, imageUrl ", userEmailId, imageUrl);

      // Update the user document with the image link
      // await User.findByIdAndUpdate(userId, { $set: { image: imageUrl } });

      await User.findOneAndUpdate(
        { emailID: userEmailId },
        { $set: { profileImage: imageUrl } }
      );

      res.json({ success: true, message: "User data updated successfully" });
    } catch (error) {
      console.error("Error updating user data:", error);
      res.status(500).json({ success: false, error: error });
    }
  }
);

userRoute.patch("/deleteAvatar",
  async (req, res) => {
    try {
      const {userEmail} = req.body

      console.log("userEmail ", userEmail);

      await User.findOneAndUpdate(
        { emailID: userEmail },
        { $set: { profileImage: "" } }
      );

      res.json({ success: true, message: "Image deleted" });
    } catch (error) {
      console.error("Error deleting image", error);
      res.status(500).json({ success: false, error: error });
    }
  }
);

userRoute.patch("/cloduraBrandingOnOff",
  async (req, res) => {
    try {
      const {userEmail, cloduraBrandingReq} = req.body

      console.log("userEmail ", userEmail, "cloduraBrandingReq ", cloduraBrandingReq);

      await User.findOneAndUpdate(
        { emailID: userEmail },
        { $set: { cloduraBranding : cloduraBrandingReq } }
      );

      res.json({ success: true, message: "cloduraBranding set" });
    } catch (error) {
      console.error("Error setting cloduraBranding", error);
      res.status(500).json({ success: false, error: error });
    }
  }
);

userRoute.get("/getImage/:emailId", async (req, res) => {
  console.log("I am called ");
  const userEmailId = req.params.emailId;
  console.log("userEmailId ", userEmailId);
  try {
    const user = await User.findOne({ emailID: userEmailId });
    console.log("user ", user);
    // Send the image file as a response
    res.status(200).send({ message: user.profileImage });
  } catch (err) {
    res.status(500).send(err);
  }
});

//to generate a poll and its link
//working fine
//generates voting poll link and pushes the user preferred times in his db
userRoute.patch("/updatePoll/:emailId", async (req, res) => {
  console.log("update poll called to generate a poll and its link ");
  // To Generate a 12-character random string
  function generateRandomString(length) {
    const characters =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  const shortId = generateRandomString(12);
  console.log("shortId ", shortId);

  try {
    const userEmailId = req.params.emailId;
    let deets = req.body;
    deets["link"] = `http://localhost:3000/user/vs?shortId=${shortId}`;
    deets["uniqueId"] = shortId;

    console.log("userEmailId ", userEmailId, "deets ", deets);

    await User.findOneAndUpdate(
      { emailID: userEmailId },
      { $push: { voting: deets } },
      { new: true, useFindAndModify: false }
    );

    console.log("Done with update ");

    res.json({
      success: true,
      message: "User data updated successfully",
      link: deets["link"],
    });
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});


//when user pastes the voting link in browser, redirects user to new app
//working fine
userRoute.get("/vs", async (req, res) => {
  console.log("vs called ");
  const { shortId } = req.query;
  shortIdvariable = shortId;
  res.redirect("http://localhost:4300/");
});

//finds the user whose calendar it is,and sends his shortId, to show the prefferd voting times
userRoute.get("/getUserDeetsForVoting", async (req, res) => {
  console.log("/getUserDeetsForVoting called ");
  try {
    //change this (user)
    let user = await User.findOne({ emailID: loggedInUserEmail });
    console.log("user sending ", user);
    console.log("sending response ", { user: user, shortId: shortIdvariable });
    res.send({ user: user, shortId: shortIdvariable });
  } catch (error) {
    res.send({ err: error });
  }
});

//when some user selects his time from voting poll
//goes to the user whose cal, and finds that particular event of voting and pushes the deets of what user has voted for
//sends mail to user whose calendar (here i am sending to logged in user, so change that)
//works fine
userRoute.post("/getUserVoteSelection", async (req, res) => {
  console.log("received request ");
  console.log("req body ", req.body);
  console.log("email ", req.body.userVal.emailID);
  console.log("selectedTimes ", req.body.selectedTimes);

  try {
    let user = await User.findOne({ emailID: loggedInUserEmail });
    console.log("user ", user);
    let votingArr = user.voting;
    console.log("votingArr ", votingArr);

    //variables req for mail sending start
    //loggedInUserEmail
    let whoHasVotedNow = "";
    let totalNumberOfPeopleWhoHaveVotedTillNow = 0;
    let noOfVotesForTopTimes = 0;
    let topTimes = "";
    let meetingName = "";
    // let whoAllVotedForTopTimes = []
    // let duration = ''
    // let pollCreationDate = ''
    //variables req for mail sending end

    votingArr.find((obj) => {
      console.log("obj.uniqueId, req.body.shortIdVal", obj.uniqueId, req.body.shortIdVal);
      console.log("obj.uniqueId == req.body.shortIdVal", obj.uniqueId == req.body.shortIdVal);

      if (obj.uniqueId == req.body.shortIdVal) {
        console.log("uniqueId found ", req.body.shortIdVal);
        console.log("details ", obj.details);
        console.log("selectedTimes ", req.body.selectedTimes);

        for (let i = 0; i < req.body.selectedTimes.length; i++) {
          let found = false;
          for (let j = 0; j < obj.details.length; j++) {
            console.log(
              "ids ",
              req.body.selectedTimes[i]["id"],
              obj.details[j]["_id"]
            );
            if (req.body.selectedTimes[i]["id"] == obj.details[j]["_id"]) {
              found = true;
              let whoVotedObj = {
                whoVotedName: req.body.whoVotedName,
                whoVotedEmail: req.body.whoVotedEmail,
              };

              obj.details[j]["whoVoted"].push(whoVotedObj);

              reqObjectForMailSending = obj;
              console.log("whoVoted ", obj.details[j]["whoVoted"]);

              whoHasVotedNow = req.body.whoVotedName;
              console.log("who has voted now ", whoHasVotedNow);
              totalNumberOfPeopleWhoHaveVotedTillNow += obj.details[j]["whoVoted"].length;
              noOfVotesForTopTimes = Math.max(noOfVotesForTopTimes, obj.details[j]["whoVoted"].length);

              // whoAllVotedForTopTimes
              let maxVotedTime = 0;
              let nameOfMaxVotedTime = "";
              if (obj.details[j]["whoVoted"].length > maxVotedTime) {
                maxVotedTime = obj.details[j]["whoVoted"].length;
                nameOfMaxVotedTime = obj.details[j]["start"];
                meetingName = obj.evName;
                console.log("maxVotedTime ", maxVotedTime);
                console.log("nameOfMaxVotedTime ", nameOfMaxVotedTime)
                console.log("meetingName ", meetingName)
              }
              topTimes = nameOfMaxVotedTime;
            }
          }
        }

        user.save();
      }
    });

    console.log("loggedInUserEmail, whoHasVotedNow, totalNumberOfPeopleWhoHaveVotedTillNow, noOfVotesForTopTimes, topTimes, meetingName",
      loggedInUserEmail,
      whoHasVotedNow,
      totalNumberOfPeopleWhoHaveVotedTillNow,
      noOfVotesForTopTimes,
      topTimes,
      meetingName
    );
    sendMailForVoteSelection(
      loggedInUserEmail,
      whoHasVotedNow,
      totalNumberOfPeopleWhoHaveVotedTillNow,
      noOfVotesForTopTimes,
      topTimes,
      meetingName
    );

    res.send({ msg: "received request" });
  } catch (error) {
    console.log("error ", error);
    res.send({ msg: error });
  }
});


//for polling results page in scheduled events to show all the times
//working fine
userRoute.get("/getVotingEvents", async (req, res) => {
  console.log("/getVotingEvents called");
  try {
    let user = await User.findOne({ emailID: loggedInUserEmail });
    console.log("user found ", user);
    if (user.voting) {
      console.log("sending response ", { votingArr: user.voting });
      res.send({ msg: user.voting });
    } else {
      res.send({ msg: "voting arr not found" });
    }
  } catch (error) {
    res.send({ err: error });
  }
});


//whose calendar it is, when he confirms the final voting time to schedule
//generates meet link
//puts the meeting in users actual calendar, and also in calendar of who all voted
//sends email to whose calendar and who all voted even for other times
// Deletes that meeting from voting array

userRoute.post("/votingMeetConfirmed", async (req, res) => {
  console.log("votingMeetConfirmed called ");
  let { meetingId, detailObjId } = req.body;
  console.log("body ", meetingId, detailObjId);
  // body  {
  //   meetingId: '665cf00117f34bddb122f593',
  //   detailObjId: '665cf00117f34bddb122f594'
  // }
  let myMeeting = { title: "", evType: "", start: "", end: "", otherEmails: [], user: "", userEmail: "", additionalInfo: "" };

  try {
    let meetLink;

    let importedloggedInUserEmail = loggedInUserEmail;
    console.log("loggedInUsers imported EmailId is ", importedloggedInUserEmail);


    let loggedInUser = await User.findOne({ emailID: importedloggedInUserEmail });
    console.log("loggedInUser ", loggedInUser);


    let votingArr = loggedInUser.voting;
    console.log("votingArr ", votingArr);

    console.log("myMeeting ", myMeeting);

    votingArr.find((meeting) => {
      if (meeting._id == meetingId) {
        console.log("found meeting ", meeting);
        let foundMeeting = meeting;
        myMeeting["title"] = foundMeeting["evName"];
        console.log("foundMeeting.evName", foundMeeting["evName"]);

        myMeeting["evType"] = 'Group'
        console.log("myMeeting.evType", myMeeting["evType"]);

        meeting.details.find((detailsOfVoting) => {
          console.log("detailsOfVoting._id == detailObjId ", detailsOfVoting._id, detailObjId);
          if (detailsOfVoting._id == detailObjId) {
            console.log("found details ", detailsOfVoting);
            myMeeting["start"] = detailsOfVoting["start"];
            myMeeting["end"] = detailsOfVoting["end"];
          }
          let whoVotedArr = detailsOfVoting.whoVoted;
          for (let i = 0; i < whoVotedArr.length; i++) {
            myMeeting.otherEmails.push(whoVotedArr[i]["whoVotedEmail"]);
          }
        });
      }
    });

    console.log("myMeeting new", myMeeting);


    // Delete this meeting from voting array now
    votingArr = votingArr.filter((meeting) => !meeting._id.equals(meetingId));
    loggedInUser.voting = votingArr;
    console.log("loggedInUser.voting ", loggedInUser.voting);

    // Save the updated user document
    await loggedInUser.save();
    console.log("deleted from voting");


    let {
      title,
      start,
      end,
      user,
      userEmail,
      otherEmails,
      additionalInfo,
      evType,
    } = myMeeting;

    console.log("title, start, end, user, userEmail, otherEmails,additionalInfo, evType,", title, start, end, user, userEmail,
      otherEmails,
      additionalInfo,
      evType,);


    // let currentDateTime = new Date();
    // currentDateTime = moment.utc(currentDateTime).tz("Asia/Calcutta").format(); //2024-02-19T12:25:36+05:30
    // currentDateTime = currentDateTime.split("+")[0]; //2024-02-19T12:25:36
    // console.log(currentDateTime, start,end,"and ", start < currentDateTime, end < currentDateTime);


    console.log("meeting will be scheduled with ", otherEmails);

    let findLoggedInUser = loggedInUser
    console.log("findLoggedInUser ", findLoggedInUser);

    let loggedInUserName = findLoggedInUser.name;
    console.log("loggedInUserName ", loggedInUserName);

    // meeting = await Meeting.create({
    //   start : myMeeting.start,
    //   end : myMeeting.end,
    //   user: "",
    //   userEmail: "",
    //   currentDateTime,
    //   evType : myMeeting.evType,
    //   evName: myMeeting.title,
    // });
    // console.log( "meeting ",meeting);


    await User.updateOne(
      { emailID: loggedInUserEmail },
      { $push: { meetingsWtOthers: myMeeting } }
    );
    console.log("meetingsWtOthers of loggedInUser updated");

    // ppl who are in db are put in emailsOfUsersFoundInDb array and ppl who are not in db are put in emailsOfUsersNotFoundInDb array

    let emailsOfUsersFoundInDb = [];
    let emailsOfUsersNotFoundInDb = [];

    for (let i = 0; i < otherEmails.length; i++) {
      let findHimInDb = await User.findOne({ emailID: otherEmails[i] });
      console.log("findHimInDb ", findHimInDb);
      if (findHimInDb) {
        emailsOfUsersFoundInDb.push(otherEmails[i]);
        console.log("pushed in emailsOfUsersFoundInDb ", otherEmails[i]);
        // console.log("phoneNumber ", findHimInDb[0].phoneNumber);
        // phoneNumbersOfUsersFoundInDb.push(findHimInDb[0].phoneNumber)
      } else {
        emailsOfUsersNotFoundInDb.push(otherEmails[i]);
        console.log("pushed in emailsOfUsersNotFoundInDb ", otherEmails[i]);
      }
    }

    // console.log("phoneNumbersOfUsersFoundInDb ", phoneNumbersOfUsersFoundInDb);
    console.log("emailsOfUsersFoundInDb ", emailsOfUsersFoundInDb);
    console.log("emailsOfUsersNotFoundInDb ", emailsOfUsersNotFoundInDb);


    // if (!findUser) {
    //   //if who is scheduling meeting is not in db
    //   console.log("User doesn't exists");
    //   emailsOfUsersNotFoundInDb.push(userEmail);
    //   console.log("in if statement ","emailsOfUsersFoundInDb ",emailsOfUsersFoundInDb,"emailsOfUsersNotFoundInDb ",emailsOfUsersNotFoundInDb);
    // } else {
    //   //if who is scheduling meeting is in db
    //   emailsOfUsersFoundInDb.push(userEmail);
    //   console.log("User found", findUser);
    // }
    // -----------------------------------------------------------------------------------

    // ppl who are found in db, put the meeting in their meetingsWtOthers array
    try {
      for (let i = 0; i < emailsOfUsersFoundInDb.length; i++) {
        // const meeting =  await Meeting.create({start, end})
        // hardcoding right now evType evName
        // const meeting =  await Meeting.create({start, end, user, userEmail, currentDateTime, evType:"One-on-One", evName: "Morning Scrum"})
        let meeting;
        meeting = await Meeting.create(myMeeting);
        console.log("meeting of ", meeting);

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
      await sendMail(
        meetLink,
        loggedInUserName,
        importedloggedInUserEmail,
        otherEmails,
        additionalInfo
      );

      return res.status(200).json({
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
          summary: "Meeting scheduled",
          start: {
            dateTime: myMeeting.start,
            timeZone: "Asia/Kolkata",
          },
          end: {
            dateTime: myMeeting.end,
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
            let meetLink = res.data.hangoutLink;
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
  async function sendMail(
    meetingLink,
    loggedInUserName,
    importedloggedInUserEmail,
    // additionalInfo
  ) {
    // -------------------mail sending starts-----------------
    // initialize nodemailer
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
          // company: user,
          eventName: myMeeting.title,
          // eventDecription: eventDecription,
          // eventDate: eventDate,
          eventStartTime: myMeeting.start,
          eventEndTime: myMeeting.end,
          meetingLink: meetingLink,
          additionalInfo: myMeeting.additionalInfo,
        },
      };
      for (let i = 0; i < myMeeting.otherEmails.length; i++) {
        let mailOptions = {
          from: '"My Company"', // sender address
          template: "email1", // the name of the template file, i.e., email.handlebars
          // to: userFound.emailID,
          to: myMeeting.otherEmails[i],
          // subject: `Hi, ${userFound.name}`,
          subject: `Meeting Scheduled`,
          context: {
            //   name: userFound.name,
            // name: user,
            company: loggedInUserName,
            eventName: myMeeting.title,
            // eventDecription: eventDecription,
            // eventDate: eventDate,
            eventStartTime: myMeeting.start,
            eventEndTime: myMeeting.end,
            meetingLink: meetingLink,
            additionalInfo: myMeeting.additionalInfo,
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
        // await transporter.sendMail(mailOptions);
        await transporter.sendMail(mailOptions2);
        console.log(`Email sent`);
      } catch (error) {
        console.log(`Nodemailer error sending email`, error);
      }
    }
  }


});

// ------------------------------
async function sendMailForVoteSelection(loggedInUserEmail,
  whoHasVotedNow,
  totalNumberOfPeopleWhoHaveVotedTillNow,
  noOfVotesForTopTimes,
  topTimes,
  meetingName
) {
  // -------------------mail sending starts-----------------
  // initialize nodemailer
  console.log("sendMailForVoteSelection called ");
  console.log("in sendMailForVoteSelection loggedInUserEmail,whoHasVotedNow,totalNumberOfPeopleWhoHaveVotedTillNow, noOfVotesForTopTimes,topTimes,meetingName ", loggedInUserEmail, whoHasVotedNow, totalNumberOfPeopleWhoHaveVotedTillNow, noOfVotesForTopTimes, topTimes, meetingName);
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
    console.log("I'll send mail to ", loggedInUserEmail);
    const mailOptions = {
      from: '"My Company"', // sender address
      template: "email3", // the name of the template file, i.e., email.handlebars
      to: loggedInUserEmail,
      // subject: `Hi, ${userFound.name}`,
      subject: `${whoHasVotedNow} has voted in poll for Meeting`,
      context: {
        whoHasVotedNow: whoHasVotedNow,
        totalNumOfPeopleVoted: totalNumberOfPeopleWhoHaveVotedTillNow,
        topTimes: topTimes,
        noOfVotesForTopTimes: noOfVotesForTopTimes,
        evName: meetingName,
      },
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${loggedInUserEmail}`);
    } catch (error) {
      console.log(`Nodemailer error sending email to ${loggedInUserEmail}`, error);
    }
  }
}
// -----------------mailsending ends-------------

module.exports = { userRoute, getLoggedInUserEmail: () => loggedInUserEmail };