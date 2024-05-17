const express = require("express");
// const User = require('../models/user')
const { User, Meeting, Event } = require("../models/userAndMeeting");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const auth = require("../middlewares/Authenticator");
const multer = require("multer");
const path = require("path");
const upload = multer({ dest: 'uploads/' });

  
const userRoute = express.Router();

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
    });

    console.log(meeting);

    const event = await Event.create({
      evName: "30 Minute Meeting",
      evType: "One-on-One",
      evDuration: { hrs: 0, minutes: 30 },
      evLocation: "zoom",
      meetings: [meeting],
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
    return res.send({ message: `User availability updation : ${err}` });
  }
});

userRoute.post("/login", async (req, res) => {
  const { emailID, password } = req.body;
  console.log("loggedIn usersEmail and Password ", emailID, password);

  // try{
  //     if(emailID == "admin@gmail.com"){
  //         console.log("admin emailID ", emailID);
  //         if(password == "admin@123"){
  //             console.log("admin password ", password);
  //             // const token = jwt.sign({emailID: emailID}, 'meetingScheduler')
  //             res.redirect(`http://localhost:4200/users`)
  //             return res.send({"token":"token", "message": `Login Successful.`})

  //         }
  //     }
  // }
  try {
    //check if user's emailId matches with the one that is there in the database
    const user = await User.findOne({ emailID: emailID });
    // console.log(user, "line 40");

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
            return res.send({ token: { token }, message: `Login Successful.` });
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



userRoute.patch('/uploadAvatar/:emailId', upload.single('image'), async (req, res) => {
  try {
    const userEmailId = req.params.emailId;
    const imageUrl = req.file.path; // This assumes you save the image to your server. Adjust accordingly if you want to store it elsewhere.
    
    console.log("userEmailId, imageUrl ",userEmailId, imageUrl);

    // Update the user document with the image link
    // await User.findByIdAndUpdate(userId, { $set: { image: imageUrl } });

    await User.findOneAndUpdate({ emailID: userEmailId }, { $set: { profileImage: imageUrl } });


    res.json({ success: true, message: 'User data updated successfully' });
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


userRoute.get('/getImage/:emailId', async (req, res) => {
  console.log("I am called ");
  const userEmailId = req.params.emailId;
  console.log("userEmailId ", userEmailId);
  try{
    const user = await User.findOne({ emailID: userEmailId });
    console.log("user ", user);
    // Send the image file as a response
    res.status(200).send({message : user.profileImage});

    // res.status(500).send(user.profileImage.split("/", 1), { root: 'uploads' });
    // res.send({ msg: `userUnavaibilityArray `, arr: userUnavaibility });

  }
  catch(err){
    res.status(500).send(err)
  }


  // const filename = req.params.filename;
  // res.sendFile(filename, { root: 'uploads' });
});

module.exports = { userRoute, getLoggedInUserEmail: () => loggedInUserEmail };
