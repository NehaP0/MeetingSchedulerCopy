const express = require('express')
const {User, Meeting, Event} = require('../models/userAndMeeting')
const {getLoggedInUserEmail} = require('./userRouter')


const eventRoute = express.Router()

eventRoute.post("/createEvent", async(req, res)=>{

    console.log("createEvent called");
    let importedloggedInUserEmail = getLoggedInUserEmail();
    // let importedloggedInUserEmail = "nehaphadtare334@gmail.com"
    console.log("loggedInUsers imported EmailId is ",importedloggedInUserEmail);
    console.log("reqBody", req.body);
    let {evName, evType, evDuration, evLocation} = req.body

    console.log("gotten body data", req.body);


    try{
        let findLoggedInUser = await User.find({emailID : importedloggedInUserEmail})
        let loggedInUserName = findLoggedInUser[0].name

        console.log("User found", loggedInUserName)
        let eventsArray = await findLoggedInUser[0].events


        console.log("eventsArray", eventsArray);

        // let currentDateTime = new Date();
        // currentDateTime = moment.utc(currentDateTime).tz('Asia/Calcutta').format(); //2024-02-19T12:25:36+05:30
        // currentDateTime = currentDateTime.split('+')[0] //2024-02-19T12:25:36
        //const meeting =  await Meeting.create({start, end, user:user, userEmail:userEmail, currentDateTime})

        const event =  await Event.create({evName, evType, evDuration, evLocation, meetings: [{start:"2019-01-18T09:00:00+05:30", end:"2019-01-18T09:30:00+05:30", user:"abc", userEmail:"abc@gmail.com", currentDateTime:"2019-01-18T09:00:00"}]})    
        //  console.log(meeting);
        console.log("User line 58", event);
            
        // Update the user document to include the new meeting
        await User.updateOne(
            { name: loggedInUserName },
            { $push: { events: event } } 
        )         
        return res.send({message : `Event created`})      
 
        // return res.status(200).json({message : `Event created`})      
    }
    catch(err){
        return res.send({message : `Event creation failed : ${err}`})

        // return res.status(500).json({message : `Event creation failed : ${err}`})
    }
})


eventRoute.get("/getEvents", async(req, res)=>{
    let importedloggedInUserEmail = getLoggedInUserEmail();
    console.log("loggedInUsers imported EmailId is ",importedloggedInUserEmail);

    try{
        let findLoggedInUser = await User.find({emailID : importedloggedInUserEmail})

        console.log("logged in user is ", findLoggedInUser);

        let events = findLoggedInUser[0].events

        return res.status(200).json({message : events})  
    }
    catch(err){
        return res.status(500).json({message : `Event creation failed : ${err}`})
    }

})

eventRoute.delete("/deleteEvent", async(req, res)=>{
    const {id} = req.query
    let importedloggedInUserEmail = getLoggedInUserEmail();

    console.log("delete called ", id);
    try{
        let findLoggedInUser = await User.find({emailID : importedloggedInUserEmail})
        console.log("logged in user is ", findLoggedInUser);

        let events = findLoggedInUser[0].events
        let meetingsArrayOfThatEvent = []
        let evName = ""
        let evType = ""
        for(let i=0; i<events.length; i++){
            let event = events[i]
            if(event._id == id){
                evName = event.evName
                evType = event.evType
                console.log(event);
                meetingsArrayOfThatEvent = event.meetings
                break;
            }
        }
        console.log("meetingsArrayOfThatEvent ",meetingsArrayOfThatEvent);

        for(let i=0; i<meetingsArrayOfThatEvent.length; i++){
            console.log("in for loop ", meetingsArrayOfThatEvent);
            meetingsArrayOfThatEvent[i]["evName"] = evName
            meetingsArrayOfThatEvent[i]["evType"] = evType
            findLoggedInUser[0].meetingsWtOthers.push(meetingsArrayOfThatEvent[i])
        }
        console.log("meetingsArrayOfThatEvent later ",meetingsArrayOfThatEvent);
        console.log("meetingsWtOthers ",findLoggedInUser[0].meetingsWtOthers);

        for(let i=0; i<events.length; i++){
            let event = events[i]
            if(event._id == id){
                event.deleteOne()
                break;
            }
        }
        await findLoggedInUser[0].save()
        console.log("events later later ",findLoggedInUser[0].events);
        return res.status(200).json({ message: "Event deleted." });
    }
    catch(err){
        return res.status(500).json({message : `Event deletion failed : ${err}`})
    }

})

module.exports = eventRoute

