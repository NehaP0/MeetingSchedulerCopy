const express = require("express");
const { User, Meeting, Event } = require("../models/userAndMeeting");
const { getLoggedInUserEmail } = require("./userRouter");
const auth = require("../middlewares/Authenticator");

const eventRoute = express.Router();

eventRoute.post("/createEvent", auth, async (req, res) => {
  console.log("createEvent called");
  let importedloggedInUserEmail = getLoggedInUserEmail();
  // let importedloggedInUserEmail = "nehaphadtare334@gmail.com"
  console.log("loggedInUsers imported EmailId is ", importedloggedInUserEmail);
  console.log("reqBody", req.body);
  let { evName, evType, evDuration, evLocation } = req.body;

  console.log("gotten body data", req.body);

  try {
    let findLoggedInUser = await User.find({
      emailID: importedloggedInUserEmail,
    });
    let loggedInUserName = findLoggedInUser[0].name;

    console.log("User found", loggedInUserName);
    let eventsArray = await findLoggedInUser[0].events;

    console.log("eventsArray", eventsArray);

    // let currentDateTime = new Date();
    // currentDateTime = moment.utc(currentDateTime).tz('Asia/Calcutta').format(); //2024-02-19T12:25:36+05:30
    // currentDateTime = currentDateTime.split('+')[0] //2024-02-19T12:25:36
    //const meeting =  await Meeting.create({start, end, user:user, userEmail:userEmail, currentDateTime})

    const event = await Event.create({
      evName,
      evType,
      evDuration,
      evLocation,
      meetings: [
        {
          start: "2019-01-18T09:00:00+05:30",
          end: "2019-01-18T09:30:00+05:30",
          user: "abc",
          userEmail: "abc@gmail.com",
          currentDateTime: "2019-01-18T09:00:00",
        },
      ],
    });
    //  console.log(meeting);
    console.log("User line 58", event);

    // Update the user document to include the new meeting
    await User.updateOne(
      { name: loggedInUserName },
      { $push: { events: event } }
    );
    return res.send({ message: `Event created` });

    // return res.status(200).json({message : `Event created`})
  } catch (err) {
    return res.send({ message: `Event creation failed : ${err}` });

    // return res.status(500).json({message : `Event creation failed : ${err}`})
  }
});

eventRoute.get("/getEvents", async (req, res) => {
  let importedloggedInUserEmail = getLoggedInUserEmail();
  console.log("loggedInUsers imported EmailId is ", importedloggedInUserEmail);

  try {
    let findLoggedInUser = await User.find({
      emailID: importedloggedInUserEmail,
    });

    console.log("logged in user is ", findLoggedInUser);

    let events = findLoggedInUser[0].events;

    return res.status(200).json({ message: events });
  } catch (err) {
    return res.status(500).json({ message: `Event creation failed : ${err}` });
  }
});

eventRoute.delete("/deleteEvent", auth, async (req, res) => {
  const { id } = req.query;
  let importedloggedInUserEmail = getLoggedInUserEmail();

  console.log("delete called ", id);
  try {
    let findLoggedInUser = await User.find({
      emailID: importedloggedInUserEmail,
    });
    console.log("logged in user is ", findLoggedInUser);

    let events = findLoggedInUser[0].events;
    let meetingsArrayOfThatEvent = [];
    let evName = "";
    let evType = "";
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      if (event._id == id) {
        evName = event.evName;
        evType = event.evType;
        console.log(event);
        meetingsArrayOfThatEvent = event.meetings;
        break;
      }
    }
    console.log("meetingsArrayOfThatEvent ", meetingsArrayOfThatEvent);

    for (let i = 0; i < meetingsArrayOfThatEvent.length; i++) {
      console.log("in for loop ", meetingsArrayOfThatEvent);
      meetingsArrayOfThatEvent[i]["evName"] = evName;
      meetingsArrayOfThatEvent[i]["evType"] = evType;
      findLoggedInUser[0].meetingsWtOthers.push(meetingsArrayOfThatEvent[i]);
    }
    console.log("meetingsArrayOfThatEvent later ", meetingsArrayOfThatEvent);
    console.log("meetingsWtOthers ", findLoggedInUser[0].meetingsWtOthers);

    // for(let i=0; i<events.length; i++){
    //     let event = events[i]
    //     if(event._id == id){
    //         event.deleteOne()
    //         break;
    //     }
    // }
    // await findLoggedInUser[0].save()

    const filteredEvents = findLoggedInUser[0].events.filter((event) => {
      // console.log(event._id.toString(), id);
      // console.log(typeof(event._id.toString()), typeof(id));
      // console.log(event._id.toString() == id);
      return event._id.toString() !== id;
    });

    // console.log('filteredEvents ', filteredEvents);
    // Update the user's events array
    findLoggedInUser[0].events = filteredEvents;

    await findLoggedInUser[0].save();
    console.log("events later later ", findLoggedInUser[0].events);
    return res.status(200).json({ message: "Event deleted." });
  } catch (err) {
    return res.status(500).json({ message: `Event deletion failed : ${err}` });
  }
});

eventRoute.patch("/editEvent", auth, async (req, res) => {
  console.log("editEvent called");
  let importedloggedInUserEmail = getLoggedInUserEmail();
  // let importedloggedInUserEmail = "nehaphadtare334@gmail.com"
  console.log("loggedInUsers imported EmailId is ", importedloggedInUserEmail);
  console.log("reqBody", req.body);
  let { evId, evName, evType, evDuration, evLocation } = req.body;

  console.log("gotten body data", req.body);

  try {
    let findLoggedInUser = await User.find({
      emailID: importedloggedInUserEmail,
    });
    let loggedInUserName = findLoggedInUser[0].name;

    console.log("User found", loggedInUserName);
    let eventsArray = await findLoggedInUser[0].events;

    console.log("eventsArray", eventsArray);
    console.log("Duation", evDuration);

    for (let i = 0; i < eventsArray.length; i++) {
      if (eventsArray[i]._id == evId) {
        // console.log("duration in for loop ",eventsArray[i].evDuration['hrs'],eventsArray[i].evDuration['minutes']);
        console.log(
          "duration in for loop ",
          eventsArray[i].evDuration,
          eventsArray[i].evDuration["hrs"],
          eventsArray[i].evDuration["minutes"]
        );

        eventsArray[i].evName = evName;
        eventsArray[i].evType = evType;
        eventsArray[i].evDuration = evDuration;
        eventsArray[i].evLocation = evLocation;
        break;
      }
    }

    await findLoggedInUser[0].save();

    return res.send({ message: `Event edited` });

    // return res.status(200).json({message : `Event created`})
  } catch (err) {
    return res.send({ message: `Failed to edit event: ${err}` });

    // return res.status(500).json({message : `Event creation failed : ${err}`})
  }
});

// Admin part

eventRoute.get(
  "/getEventsOfSelectedUserAdmin/:selectedUserId",
  async (req, res) => {
    let { selectedUserId } = req.params;
    console.log("selected user Id is ", selectedUserId);

    try {
      let findSelectedUser = await User.find({ _id: selectedUserId });

      console.log("selected user is ", findSelectedUser);

      let events = findSelectedUser[0].events;

      return res.status(200).json({ message: events });
    } catch (err) {
      return res
        .status(500)
        .json({ message: `Event creation failed : ${err}` });
    }
  }
);

eventRoute.patch("/editEventAdmin/:selectedUsersId", async (req, res) => {
  let { selectedUsersId } = req.params;

  console.log("editEventAdmin called");

  console.log("reqBody", req.body);
  let { evId, evName, evType, evDuration, evLocation } = req.body;

  console.log("gotten body data", req.body);

  try {
    let findSelectedUser = await User.find({ _id: selectedUsersId });
    let selectedUserName = findSelectedUser[0].name;

    console.log("User found ", selectedUserName);
    let eventsArray = await findSelectedUser[0].events;

    console.log("eventsArray", eventsArray);
    console.log("Duration", evDuration);

    for (let i = 0; i < eventsArray.length; i++) {
      if (eventsArray[i]._id == evId) {
        // console.log("duration in for loop ",eventsArray[i].evDuration['hrs'],eventsArray[i].evDuration['minutes']);
        console.log(
          "duration in for loop ",
          eventsArray[i].evDuration,
          eventsArray[i].evDuration["hrs"],
          eventsArray[i].evDuration["minutes"]
        );

        eventsArray[i].evName = evName;
        eventsArray[i].evType = evType;
        eventsArray[i].evDuration = evDuration;
        eventsArray[i].evLocation = evLocation;
        break;
      }
    }

    await findSelectedUser[0].save();

    return res.send({ message: `Event edited` });

    // return res.status(200).json({message : `Event created`})
  } catch (err) {
    return res.send({ message: `Failed to edit event: ${err}` });

    // return res.status(500).json({message : `Event creation failed : ${err}`})
  }
});

eventRoute.post("/createEventAdmin", async (req, res) => {
  console.log("createEventAdmin called");
  console.log("reqBody", req.body);
  // let {selectedUserId,evName, evType, evDuration, evLocation} = req.body
  let { selectedUserId, evName, evType, evDuration, evLocation } = req.body;

  console.log("gotten body data", req.body);

  try {
    let findSelectedUser = await User.find({ _id: selectedUserId });
    let selectedUserName = findSelectedUser[0].name;

    console.log("User found", selectedUserName);
    let eventsArray = await findSelectedUser[0].events;
    console.log("eventsArray", eventsArray);

    const event = await Event.create({
      evName,
      evType,
      evDuration,
      evLocation,
      meetings: [
        {
          start: "2019-01-18T09:00:00+05:30",
          end: "2019-01-18T09:30:00+05:30",
          user: "abc",
          userEmail: "abc@gmail.com",
          currentDateTime: "2019-01-18T09:00:00",
        },
      ],
    });
    //  console.log(meeting);
    console.log("User line 272", event);

    // Update the user document to include the new meeting
    await User.updateOne({ _id: selectedUserId }, { $push: { events: event } });
    return res.send({ message: `Event created` });

    // return res.status(200).json({message : `Event created`})
  } catch (err) {
    return res.send({ message: `Event creation failed : ${err}` });

    // return res.status(500).json({message : `Event creation failed : ${err}`})
  }
});

eventRoute.post("/assignEventAdmin", async (req, res) => {
  console.log("assignEventAdmin called");
  console.log("reqBody", req.body);
  // let {selectedUserId,evName, evType, evDuration, evLocation} = req.body
  let {
    assignEventToThisUserId,
    idOfEventToBAssigned,
    userIdToWhomEventBelongs,
  } = req.body;

  console.log("gotten body data", req.body);

  try {
    let finduserToWhomEventBelongs = await User.find({
      _id: userIdToWhomEventBelongs,
    });
    let userNameToWhomEventBelongs = finduserToWhomEventBelongs[0].name;
    console.log("User to whom event belongs", userNameToWhomEventBelongs);

    let finduserToWhomEventIsToBeAssigned = await User.find({
      _id: assignEventToThisUserId,
    });
    let userNameToWhomEventIsToBeAssigned =
      finduserToWhomEventIsToBeAssigned[0].name;
    console.log(
      "User to whom event is to be assigned",
      userNameToWhomEventIsToBeAssigned
    );

    let eventsArrayOfUserToWhomEventBelongs =
      await finduserToWhomEventBelongs[0].events;
    console.log(
      "eventsArrayOfUserToWhomEventBelongs",
      eventsArrayOfUserToWhomEventBelongs
    );

    let eventToBAssigned = {};

    for (let i = 0; i < eventsArrayOfUserToWhomEventBelongs.length; i++) {
      if (eventsArrayOfUserToWhomEventBelongs[i]._id == idOfEventToBAssigned) {
        // console.log("duration in for loop ",eventsArray[i].evDuration['hrs'],eventsArray[i].evDuration['minutes']);
        console.log(
          "eventToBAssigned found ",
          eventsArrayOfUserToWhomEventBelongs[i]
        );

        eventToBAssigned = eventsArrayOfUserToWhomEventBelongs[i];
        break;
      }
    }

    await User.updateOne(
      { _id: assignEventToThisUserId },
      { $push: { events: eventToBAssigned } }
    );
    return res.send({ message: `Event assignment succesfull.` });

    // return res.status(200).json({message : `Event created`})
  } catch (err) {
    return res.send({ message: `Event assignment failed : ${err}` });

    // return res.status(500).json({message : `Event creation failed : ${err}`})
  }
});

// eventRoute.delete("/deleteEventAdmin/:details",  async(req, res)=>{
eventRoute.delete("/deleteEventAdmin", async (req, res) => {
  const { eventId, userId } = req.query;
  console.log(eventId, userId);
  try {
    let findSelectedUser = await User.find({ _id: userId });
    console.log("selected user is ", findSelectedUser);

    let events = findSelectedUser[0].events;
    let meetingsArrayOfThatEvent = [];
    let evName = "";
    let evType = "";
    for (let i = 0; i < events.length; i++) {
      let event = events[i];
      if (event._id == eventId) {
        evName = event.evName;
        evType = event.evType;
        console.log(event);
        meetingsArrayOfThatEvent = event.meetings;
        break;
      }
    }
    // console.log("meetingsArrayOfThatEvent ",meetingsArrayOfThatEvent);

    for (let i = 0; i < meetingsArrayOfThatEvent.length; i++) {
      console.log("in for loop ", meetingsArrayOfThatEvent);
      meetingsArrayOfThatEvent[i]["evName"] = evName;
      meetingsArrayOfThatEvent[i]["evType"] = evType;
      findSelectedUser[0].meetingsWtOthers.push(meetingsArrayOfThatEvent[i]);
    }
    // console.log("meetingsArrayOfThatEvent later ",meetingsArrayOfThatEvent);
    // console.log("meetingsWtOthers ",findSelectedUser[0].meetingsWtOthers);

    const filteredEvents = findSelectedUser[0].events.filter((event) => {
      // console.log(event._id.toString(), eventId);
      // console.log(typeof(event._id.toString()), typeof(eventId));
      // console.log(event._id.toString() == eventId);
      return event._id.toString() !== eventId;
    });

    // console.log('filteredEvents ', filteredEvents);
    // Update the user's events array
    findSelectedUser[0].events = filteredEvents;

    await findSelectedUser[0].save();
    // console.log("events later later ",findSelectedUser[0].events);
    return res.status(200).json({ message: "Event deleted." });
  } catch (err) {
    return res.status(500).json({ message: `Event deletion failed : ${err}` });
  }
});

eventRoute.patch("/editMeet/:selectedUsersId", async (req, res) => {
  let { selectedUsersId } = req.params;

  console.log("selectedUsersId ", selectedUsersId);

  console.log("editMeetAdmin called");

  console.log("reqBody", req.body);

  let {
    selectedEventId,
    selectedMeetingId,
    date,
    startTime,
    endTime,
    name,
    emailId,
  } = req.body;

  console.log("gotten body data", req.body);

  try {
    let findSelectedUser = await User.find({ _id: selectedUsersId });
    let selectedUserName = findSelectedUser[0].name;

    console.log("User found ", selectedUserName);
    let eventsArray = await findSelectedUser[0].events;

    console.log("eventsArray", eventsArray);

    let findSelectedEvent = eventsArray.filter((event) => {
      return event._id.toString() == selectedEventId;
    });
    console.log(findSelectedEvent);

    let eventMeetings = findSelectedEvent[0].meetings;

    console.log("eventMeetings ", eventMeetings);

    let findSelectedMeet = eventMeetings.filter((meet) => {
      return meet._id.toString() == selectedMeetingId;
    });

    console.log("findSelectedMeet ", findSelectedMeet);

    if (startTime.length == 8) {
      console.log("if statement startTime.length ",startTime, startTime.length);
      findSelectedMeet[0].start = `${date}T${startTime}`;
    } else {
      console.log("else statement startTime.length ",startTime, startTime.length);
      findSelectedMeet[0].start = `${date}T${startTime}:00`;
    }

    if (endTime.length == 8) {
      console.log("if statement endTime.length ",endTime, endTime.length);
      findSelectedMeet[0].end = `${date}T${endTime}`;
    } else {
      console.log("else statement endTime.length ",endTime, endTime.length);
      findSelectedMeet[0].end = `${date}T${endTime}:00`;
    }

    findSelectedMeet[0].user = name;
    findSelectedMeet[0].userEmail = emailId;

    await findSelectedUser[0].save();

    return res.send({ message: `Meeting edited.` });
  } catch (err) {
    return res.send({ message: `Failed to edit meet: ${err}` });
  }
});

eventRoute.patch(
  "/editMeetFromUserSide/:selectedUsersEmailId",
  async (req, res) => {
    let { selectedUsersEmailId } = req.params;

    console.log("editMeetUser called");

    console.log("reqBody", req.body);

    let { meetId, date, startTime, endTime, name, emailId } = req.body;

    try {
      let findSelectedUser = await User.find({ emailID: selectedUsersEmailId });
      let selectedUserName = findSelectedUser[0].name;

      console.log("User found ", selectedUserName);
      let eventsArray = await findSelectedUser[0].events;

      console.log("eventsArray", eventsArray);

      for (let i = 0; i < eventsArray.length; i++) {
        let found = false;
        let eventMeetingsArray = eventsArray[i].meetings;

        for (let j = 0; j < eventMeetingsArray.length; j++) {
          console.log("eventMeetingsArray[j] ", eventMeetingsArray[j]);
          console.log(
            "eventMeetingsArray[j].start ",
            eventMeetingsArray[j].start
          );
          console.log("eventMeetingsArray[j].id ", eventMeetingsArray[j]._id);

          if (eventMeetingsArray[j]._id.toString() == meetId) {
            console.log("found");
            found = true;
            eventMeetingsArray[j].start = `${date}T${startTime}`;
            eventMeetingsArray[j].end = `${date}T${endTime}`;
            eventMeetingsArray[j].user = name;
            eventMeetingsArray[j].userEmail = emailId;

            await findSelectedUser[0].save();
            break;
          }
        }
        if (found == true) {
          break;
        }
      }

      console.log("findSelectedUser ", findSelectedUser[0]);
      return res.send({ message: `Meeting edited.` });
    } catch (err) {
      return res.send({ message: `Failed to edit meet: ${err}` });
    }
  }
);

module.exports = eventRoute;

// if(eventMeetings[j]["_id"] == meetId){
//   console.log("found ", eventMeetings[j]["_id"] == meetId, eventMeetings[j]["_id"], meetId);
//   found = true
//   break;
// }
