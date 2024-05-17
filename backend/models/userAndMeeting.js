const mongoose = require("mongoose");

// start, end, user, userEmail, currentDateTime, evType, evName
const meetingSchema = mongoose.Schema({
  start: {
    type: String,
  },
  end: {
    type: String,
    required: true,
  },
  user: {
    type: String,
  },
  userEmail: {
    type: Array,
    required: true,
  },
  currentDateTime: {
    type: String,
    required: true,
  },
  evName: {
    type: String,
  },
  evType: {
    type: String,
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
});

const availabilitySchema = mongoose.Schema({
  duration: { type: Object, required: true },
  workingHrs: { type: Object, required: true },
  workingDays: { type: Array, required: true },
  nonWorkingDays: { type: Array, required: true },
});

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
    required: true,
  },
  // meetings: [meetingSchema],
  events: [eventSchema],
  userAvailability: {
    type: availabilitySchema,
    required: true,
  },
  meetingsWtOthers: [meetingSchema],
//   profileImage: {
//     data: Buffer,
//     contentType: String
// },
profileImage: {
  type: String,
  required: true,
}
});

const User = mongoose.model("User", userSchema);

const Meeting = mongoose.model("Meeting", meetingSchema);

const Event = mongoose.model("Event", eventSchema);

const Availability = mongoose.model("Availability", availabilitySchema);

module.exports = { User, Meeting, Event, Availability };
