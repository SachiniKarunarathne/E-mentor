const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const mentorAuthentication = require("../middleware/mentorAuthentication");
const menteeAuthentication = require("../middleware/menteeAuthentication");
const { request } = require("express");
const { check, validationResult } = require("express-validator");
const Mentor = require("../models/mentor");
const Mentee = require("../models/mentee");

router.get("/posts", async (req, res) => {
  try {
    let post = await Post.find();
    res.json(post);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server Error");
  }
});

// Most recent
router.get("/posts/the_most_recent", async (req, res) => {
  try {
    let post = await Post.find().sort({ date: -1 });
    res.json(post);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server Error");
  }
});

// get all posts from one user
router.get("/user_posts/:user_id", async (req, res) => {
  try {
    let post = await Post.find().sort({ mentor: request.params.mentor.id });
    res.json("POST!");
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server Error");
  }
});

router.get("/user_posts/:userName", async (req, res) => {
  try {
    let post = await Post.find().sort({ mentor: request.params.mentor.id });
    res.json("POST!");
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server Error");
  }
});

router.get("/user_posts", mentorAuthentication, async (req, res) => {
  try {
    let post = await Post.find().sort();
    let mentorPosts = post.filter(
      (post) => post.mentor.toString() === req.mentor.id.toString()
    );
    res.json("POST!");
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server Error");
  }
});

// add posts
router.post(
  "/",
  mentorAuthentication,
  [check("textOfPost", "Text i required").not().isEmpty()],
  async (req, res) => {
    let { textOfPost } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      let mentor = await Mentor.findById(req.mentor.id).select("-password");
      if (!mentor) return res.status(401).json("User not found!");

      let newPost = new Post({
        content: textOfPost,
        name: mentor.firstName + " " + mentor.lastName,
        avatar: mentor.avatar,
        mentor: req.mentor.id,
      });

      await newPost.save();
      res.json("Congratulations! A new post is Created.");
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("server Error");
    }
  }
);

// comments
router.put(
  "/add_comment/:post_id",
  menteeAuthentication,
  [check("textOfComment", "Text is Empty").not().isEmpty()],
  async (req, res) => {
    const { textOfComment } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      let post = await Post.findById(req.params.post_id);
      let mentee = await Mentee.findById(req.mentee.id).select("-password");

      if (!mentee) return res.status(404).json("User not found");
      if (!post) return res.status(404).json("Post not found");

      let newComment = {
        textOfComment,
        name: mentee.firstName + " " + mentee.lastName,
        avatar: mentee.avatar,
      };

      post.comment.unshift(newComment);

      await post.save();
      //await newComment.save();
      res.json("Comment is added!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("server error...");
    }
  }
);

// delete post
router.delete(
  "/delete_post/:post_id",
  mentorAuthentication,
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.post_id);

      if (!post) return res.status(404).json("Post not found");
      if (post.mentorId !== req.mentor._id)
        return res.status(401).json("You are not allowed!");

      await post.remove();

      res.json("Post is removed!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("server error...");
    }
  }
);

/*
// delete comment
router.delete(
  "/delete_comment/:post_id/:comment_id",
  menteeAuthentication,
  async (req, res) => {
    try {
      let post = await Post.findById(req.params.post_id);

      if (!post) return res.status(404).json("POst not found");

      const removeComments = post.comment.filter(
        (comment) => comment._id !== req.params.comment_id
      );

      post.comment = removeComments;

      await post.save();

      res.json(post);
    } catch (error) {
      console.error(error);
      return res.status(500).json("server error...");
    }
  }
); */

module.exports = router;
