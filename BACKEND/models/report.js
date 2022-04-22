const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reportSchema = new Schema({

  reportId : {
    type: String,
    required: true
  },

  senderId : {
    type: String,
    required: true
  },

  receiverId : {
    type: String,
    required: true
  },

  reason : {
    type: String,
    required: true
  },


})

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;