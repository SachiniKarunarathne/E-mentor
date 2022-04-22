const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({

  mentorId : {
    type: String,
    required: true
  },

  menteeId : {
    type: String,
    required: true
  },

  description : {
    type: String,
    required: true
  },

  rating : {
    type: String,
    required: true
  },


})

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;