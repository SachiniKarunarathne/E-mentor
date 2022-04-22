const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const mentorSchema = new Schema({

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

  organization : {
    type: String,
    required: true
  },
  
  designation : {
    type: String,
    required: true
  },

  language : {
    type: String,
    required: true
  },

  degree : {
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

  availability : {
    type: String,
    required: true
  },

  noOfMentees : {
    type: String,
  },

  /*recRequest : [{
    name : {
      type : String,
      default: lastName
    }
  }],*/

  /*friendList: [{
    mentorId: {
      type : mongoose.Schema.Types.ObjectId,
      ref : 'Mentee'
    },

    name: {
      type: String,
      default : firstName+lastName
    }
  }],*/

})

const Mentor = mongoose.model("Mentor", mentorSchema);

module.exports = Mentor;