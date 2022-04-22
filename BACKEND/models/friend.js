const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const friendSchema = new Schema(
  {
    sendId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentee",
    },

    sendName: {
      type: String,
      required: true,
    },

    recId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
    },

    recName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    participants: {
      type: [mongoose.Schema.Types.ObjectId],
    },
  },
  { timestamps: true }
);

const Firend = mongoose.model("Friend", friendSchema);

module.exports = Firend;
