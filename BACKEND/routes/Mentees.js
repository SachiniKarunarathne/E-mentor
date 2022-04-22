const router = require("express").Router();
let Mentee = require("../models/mentee");
const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const config = require("config");
const jwt = require("jsonwebtoken");
const authentication = require("../middleware/menteeAuthentication");


//Get Mentee by name
router.get("/mentee_by_name/:mentee_name", async (req, res) => {
  try {
    let menteeName = req.params.mentee_name;
    let mentee = await Mentee.find({
      firstName: menteeName,
    }).select("-password");
    res.json(mentee);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server error...");
  }
});


// CREATE (add data)
router.post(
  "/register",
  [
    check("email", "Email is empty").isEmail(),
    check("password", "Password should contain 8-12 characters.").isLength({
      min: 6,
      max: 12,
    }),
    check("firstName", "First Name is empty").not().isEmpty(),
    check("lastName", "Last Name is empty").not().isEmpty(),
    check("gender", "Gender is empty").not().isEmpty(),
    check("degree", "Degree is empty").not().isEmpty(),
    check("year", "Year is empty").not().isEmpty(),
    check("skills", "Skills are empty").not().isEmpty(),
    check("interests", "Interests are empty").not().isEmpty(),
    check("linkedIn", "Skills is empty").not().isEmpty(),
    check("gitHub", "Degree is empty").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      let {
        email,
        password,
        firstName,
        lastName,
        gender,
        degree,
        year,
        skills,
        interests,
        linkedIn,
        gitHub,
      } = req.body;
      let mentee = await Mentee.findOne({ email }).select("password");
      let fetchedEmailFormDatabase = await Mentee.findOne({ email }).select(
        "passwors"
      );
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (mentee) {
        return res.status(401).send("User is already created!");
      }

      if (fetchedEmailFormDatabase === email) {
        return res.status(401).json("Email is already taken!");
      }

      const avatar = gravatar.url(email, {
        r: "pg",
        d: "mm",
        s: "200",
      });

      let newMentee = new Mentee({
        email,
        password,
        firstName,
        lastName,
        gender,
        degree,
        year,
        skills,
        interests,
        linkedIn,
        gitHub,
        avatar,
      });

      const salt = await bcryptjs.genSalt(10);

      let hashedPassword = await bcryptjs.hash(password, salt);

      newMentee.password = hashedPassword;

      await newMentee.save();

      const payload = {
        mentee: {
          id: newMentee._id,
        },
      };

      jwt.sign(
        payload,
        config.get("jsonWebTokenSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );

      res.send("Successfully Registered!");
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error.");
    }
  }
);

//Mentor Login
router.post(
  "/login",
  [
    check("email", "Email is empty").isEmail(),
    check("password", "Password should contain 8-12 characters.").isLength({
      min: 6,
      max: 12,
    }),
  ],
  async (req, res) => {
    try {
      let { email, password } = req.body;
      let mentee = await Mentee.findOne({ email });
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!mentee) {
        return res.status(404).send("User with this Email does not exist!");
      }

      let doPasswordsMatch = await bcryptjs.compare(password, mentee.password);

      if (!doPasswordsMatch) {
        return res.status(401).json("Password do not match!");
      }

      const payload = {
        mentee: {
          id: mentee._id,
        },
      };

      jwt.sign(
        payload,
        config.get("jsonWebTokenSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error.");
    }
  }
);

//PUT request
router.put(
  "/search_mentee_by_email",
  [check("emailFromSearch", "emailFromSearch is empty").not().isEmpty()],
  async (req, res) => {
    try {
      let { emailFromSearch } = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      let mentees = await Mentee.find().select("-password");
      let findMenteeByEmail = mentees.filter(
        (mentee) =>
          mentee.email.toString().toLowerCase().split(" ").join("") ===
          emailFromSearch.toString().toLowerCase().split(" ").join("")
      );
      res.json(findMenteeByEmail);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error.");
    }
  }
);


// Update and save data

router.put(
  "/change_mentee_data/:mentee_data_to_change",
  authentication,
  [check("changeMenteeData", "Input is Empty").not().isEmail()],
  async (req, res) => {
    try {
      const { changeMenteeData } = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      let mentee = await Mentee.findById(req.mentee.id).select("-password");
      if (!mentee) return res.status(404).jason("Mentee not found!");

      let dataToChange = req.params.mentee_data_to_change.toString();

      if (mentee[dataToChange] === changeMenteeData.toString())
        return res.status(401).json("Data is already in the database!");
      mentee[dataToChange] = changeMenteeData.toString();

      await mentee.save();

      res.json("Data is Updated!");
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error.");
    }
  }
);

// change password
router.put(
  '/check_actual_password', authentication, [check("passwordToCheck", "Password should be between 6-12 characters!").isLength({min: 6, max: 12})], async (req,res) => {
    try {
      const { passwordToCheck } = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      let mentee = await Mentee.findById(req.mentee.id);

      let passwordMatch = await bcryptjs.compare(passwordToCheck, mentee.password );

      if(!passwordMatch) return res.status(401).json("Password do not match!");

      res.json("Successful!");

    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error.");
    }
  }
)

router.put("/change_mentee_password", authentication, [check("newPassword", "New password should be between 6-12 characters!").isLength({min: 6, max: 12})], async (req,res) => {
  try {
    const { newPassword } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    let mentee = await Mentee.findById(req.mentee.id);

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    mentee.password = hashedPassword;

    await mentee.save();

    res.json("Successful");

  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error.");
  }
})

// Delete profile
router.delete(
  "/delete_mentee/:mentee_id",
  authentication,
  async (req, res) => {
    try {
      let mentee = await Mentee.findById(req.params.mentee_id);

      if (!mentee) return res.status(404).json("User not found");

      await mentee.remove();

      res.json("Profile is removed!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("server error...");
    }
  }
);






module.exports = router;