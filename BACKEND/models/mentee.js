const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const menteeSchema = new Schema({

  email : {
    type: String,
    required: true
  },

  password : {
    type: String,
    required: true
  },

  firstName : {
    type: String,
    required: true
  },

  lastName : {
    type: String,
    required: true
  },

  gender : {
    type: String,
    required: true
  },

  degree : {
    type: String,
    required: true
  },

  year : {
    type: String,
    required: true
  },

  skills : {
    type: String,
    required: true
  },

  interests : {
    type: String,
    required: true
  },

  /* profile_image : {
    data: String,
    contentType: String
  }, */

  linkedIn : {
    type: String,
    required: false
  },

  gitHub : {
    type: String,
    required: false
  },

  sentRequst : [{
    userName : {
      type : String,
      default: ''
    }
  }],

  /*friendList: [{
    mentorId: {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Mentor'
    },

    name: {
      type: String,
      default : firstName+lastName
    }
  }],*/

  totalRequest: {
    type: Number,
    default: 0
  }

})

const Mentee = mongoose.model("Mentee", menteeSchema);

module.exports = Mentee;

