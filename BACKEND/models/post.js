const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mentor",
  },

  name: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now(),
  },

  content: {
    type: String,
    required: true,
  },

  comment: [
    {
      mentee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentee",
      },

      name: {
        type: String,
        required: true,
      },

      /*textComment: {
        type: String,
        require: true,
      },*/

      avatar: {
        type: String,
      },

      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
