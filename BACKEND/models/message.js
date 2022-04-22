const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({

  senderId : {
    type: String,
    required: true
  },

  receiverId : {
    type: String,
    required: true
  },

  msgId : {
    type: String,
    required: true
  },

  description : {
    type: String,
    required: true
  },

  timestamp : {
    type: timestamp,
    required: true
  }


})

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;