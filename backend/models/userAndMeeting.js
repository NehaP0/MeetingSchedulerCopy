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
  questionsWdAnswers : {
    type: Array
  },
  bookedForWhichEvId : {
    type : String
  }

});

const daysSchema = mongoose.Schema({
  status: {
    type:Boolean,
    required: true
  },
  noOfDays: {
    type: Number
  },
  allDays:{
    type: Boolean
  },
  onlyWeekDays:{
    type: Boolean
  },
})

const withinDateRangeSchema = mongoose.Schema({
  status: {
    type:Boolean,
    required: true
  },
  start: {
    type: String
  },
  end:{
    type: String
  }
})

const whenCanInviteesScheduleSchema = mongoose.Schema({
  status: {
    type:Boolean,
    required: true
  },
  days: daysSchema,
  withinDateRange: withinDateRangeSchema,
  indefinitely : {status : {
    type:Boolean,
    required: true
  }}
})

const minimumNoticeSchema = mongoose.Schema({
  status: {
    type:Boolean,
    required: true
  },
  hrs:{
    status: {
      type:Boolean,
      required: true
    },
    noOfHrs:{
      type:Number
    }
  },
  mins:{
    status: {
      type:Boolean,
      required: true
    },
    noOfMins:{
      type:Number
    }
  },
  days:{
    status: {
      type:Boolean,
      required: true
    },
    noOfDays:{
      type:Number
    }
  }
})

const noOfMeetsAllowedPerDaySchema = mongoose.Schema({
  status:{
    type:Boolean,
    required: true
  },
  noOfMeetsAllowed: {
    type: Number
  }
})

const startTimIncrementsSchema = mongoose.Schema({
  status:{
    type:Boolean,
    required: true
  },
  mins: {
    type: Number
  },
  hrs:{
    type: Number
  }
})

confirmationPageSchema = mongoose.Schema({
  status : Boolean
})

externalUrlSchema = mongoose.Schema({
  status : Boolean,
  link : String
})

const redirection = mongoose.Schema({
  confirmationPage : confirmationPageSchema,
  externalUrl : externalUrlSchema
})


const eventLinksSchema = mongoose.Schema({
  linkEnd : {type : String},
  evId : {type : String}
})

const followUpEmailSchema = mongoose.Schema({
  sendFollowUpEmail : {type : Boolean},
  time : {type : Number},
  unit : {type : String}
})

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
  evLinkEnd : {type: String},
  whenCanInviteesSchedule: whenCanInviteesScheduleSchema,
  minimumNotice: minimumNoticeSchema,
  noOfMeetsAllowedPerDay: noOfMeetsAllowedPerDaySchema,
  startTimIncrements : startTimIncrementsSchema,
  maxInviteesPerEventForGrpEvent : {type: Number},
  displayRemainingSpotsOnBookingPageGrp : {type: Boolean},
  redirectTo : redirection,
  pasEvntDeetsToRedirectPg : Boolean,
  // sendFollowupEmail : {type: Boolean},
  sendFollowupEmail : followUpEmailSchema,
  bgClr : {type : String},
  txtClr : {type : String},
  btnAndLnkClr : {type : String},
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

const contactsSchema = mongoose.Schema({
  _id: {type: String},
  name:{type: String},
  emailID:{type: String}
})

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
  eventLinks : [eventLinksSchema],
  events: [eventSchema],
  userAvailability: {
    type: availabilitySchema,
    required: true,
  },
  meetingsWtOthers: [meetingSchema],
  profileImage: {
    type: String,
  },
  cloduraBranding : {
    type : Boolean
  },
  voting: {
    type: [votingSchema]
  },
  contacts: {
    type : [contactsSchema]
  }
});



const User = mongoose.model("User", userSchema);

const Meeting = mongoose.model("Meeting", meetingSchema);

const Event = mongoose.model("Event", eventSchema);

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = { User, Meeting, Event, Availability };