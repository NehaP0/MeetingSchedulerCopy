const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  question: {
    type: String
  },
  answerRequiredOrNot: {
    type: Boolean
  },
  showThisQuestionOrNot: {
    type: Boolean
  },
  _id: {
    type: String,
  }
})

const meetingSchema = mongoose.Schema({
  start: {
    type: String,
  },
  end: {
    type: String,
    required: true,
  },
  user: {
    type: String
  },
  userSurname : {
    type: String
  },
  userEmail: {
    type: Array,
    required: true,
  },
  currentDateTime: {
    type: String,
    // required: true,
  },
  evName: {
    type: String,
  },
  evType: {
    type: String,
  },
  description: {
    type: String
  },
});

const eventSchema = mongoose.Schema({
  evName: {
    type: String,
    required: true,
  },
  evType: {
    type: String,
    required: true,
  },
  evDuration: {
    type: Object,
    required: true,
  },
  evLocation: {
    type: String,
    required: true,
  },
  meetings: [meetingSchema],
  allowInviteesToAddGuests: { type: Boolean },
  surnameReq:{ type : Boolean},
  questionsToBeAsked: [questionSchema],
  evLinkEnd : {type: String}
});

const availabilitySchema = mongoose.Schema({
  duration: { type: Object, required: true },
  workingHrs: { type: Object, required: true },
  workingDays: { type: Array, required: true },
  nonWorkingDays: { type: Array, required: true },
});

const whoVoted = mongoose.Schema({
  whoVotedName: { type: String },
  whoVotedEmail: { type: String }
})

const votingSchema = mongoose.Schema(
  {
    evName: { type: String },
    reserveTimes: { type: Boolean },
    showVotes: { type: Boolean },
    link: { type: String },
    location: { type: String },
    uniqueId: { type: String },
    details: [
      {
        start: { type: String },
        end: { type: String },
        whoVoted: [whoVoted],
        noOfVotes: { type: Number },
      },
    ],
  },
);

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  emailID: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  events: [eventSchema],
  userAvailability: {
    type: availabilitySchema,
    required: true,
  },
  meetingsWtOthers: [meetingSchema],
  profileImage: {
    type: String,
  },
  voting: {
    type: [votingSchema]
  },
});



const User = mongoose.model("User", userSchema);

const Meeting = mongoose.model("Meeting", meetingSchema);

const Event = mongoose.model("Event", eventSchema);

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = { User, Meeting, Event, Availability };