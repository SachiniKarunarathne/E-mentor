const router = require("express").Router();
let Friend = require("../models/friend");
let Mentor = require("../models/mentor");
let Mentee = require("../models/mentee");
//const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const config = require("config");
const jwt = require("jsonwebtoken");
const mentorAuthentication = require("../middleware/mentorAuthentication");
const menteerAuthentication = require("../middleware/menteeAuthentication");
const { check, validationResult } = require("express-validator");
const { request } = require("express");

//Send friend request
router.post(
  "/sendfriendrequest/:id",
  menteerAuthentication,
  mentorAuthentication,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      let mentor = await Mentor.findById(req.params.id);
      let mentee = await Mentee.findById(req.mentee.id).select("-password");

      if (!mentee) return res.status(404).json("User not found!");
      if (!mentor) return res.status(404).json("Mentor not found!");

      let foundFriendRequest = await Friend.findOne({
        sendId: mentee,
        recId: mentor,
        status: "Status",
        sendName : mentee.firstName,
        recName : mentor.firstName,
        participants : [mentee, mentor]
      });
      if (foundFriendRequest) {
        return res.status(400).send();
      }

      let newFriendRequest = new Friend({
        sendId: mentee,
        recId: mentor,
        status: "pending",
        sendName : mentee.firstName,
        recName : mentor.firstName,
        participants : [mentee, mentor]
      });

      await newFriendRequest.save()
      res.json("Requested!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("server error...");
    }
  }
); 

//get friend request of current user
router.get('/getFriendRequests/:id', async (req,res) => {

  const requests = await Friend.find({
    recId : req.params.id,
  })
  res.json(requests)
  res.status(200).send(requests);
})

// Accept request
router.post('/acceptrequest', mentorAuthentication, menteerAuthentication, async (req, res) => {
  const recipient = req.mentor.id;
  const sender = req.body;

  try {
    const updateSender = await Mentee.findOneAndUpdate(
      {_id : sender, friendList: {$nin : [recipient]}},
      { $push: {friendList: recipient}},
      {new : true}
    );

    const updateRecipient = await Mentor.findByIdAndUpdate(
      {_id: sender, friendList : {$nin: [recipient]}},
      {$push : {friendList: recipient}},
      {new : true}
    );

    if (updateRecipient) {
      const updateFriendRequest = await Friend.findByIdAndUpdate(
        {
          sendId : sender,
          recId : recipient
        },
        {
          $set : {status : 'accepted'},
          $push: {participants: [sender, recipient]},
        },
        {new : true}
      );

      const updateRequests = await Friend.find({
        recId: req.mentor.id,
        status: 'Pending'
      });

      res.status(200).send({
        updateRequests: updateRequests,
        updateUser
      })
      
    }
  
  } catch (error) {
    console.error(error);
      return res.status(500).json("server error...");
  }
})



router.get('/search', mentorAuthentication, menteerAuthentication, async (req,res) => {
  var sent = [],
  //var mentorfriends = [],
  //var menteefriends = [],
 // var received = [],
  //received= req.mentor.recRequest;
	sent= req.mentee.sentRequest;
	mentorfriends= req.mentor.friendsList;
  menteefriends= req.mentee.friendsList;

  
	
})

module.exports = router;
