const router = require("express").Router();
let Mentor = require("../models/mentor");
const { check, validationResult } = require("express-validator");
const bcryptjs = require("bcryptjs");
const gravatar = require("gravatar");
const config = require("config");
const jwt = require("jsonwebtoken");
const authentication = require("../middleware/mentorAuthentication");

router.get("/", authentication, async (req, res) => {
  try {
    let mentor = await Mentor.findById(req.mentor.id).select("-password");
    res.json(mentor);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server Error");
  }
});

router.get("/mentors", async (req, res) => {
  try {
    let mentor = await Mentor.find().select("-password");
    res.json(mentor);
  } catch (error) {
    console.error(error.message);
    return res.status(500).send("server Error");
  }
});

//Get Mentor by name
router.get("/mentor_by_name/:mentor_name", async (req, res) => {
  try {
    let mentorName = req.params.mentor_name;
    let mentor = await Mentor.find({
      firstName: mentorName,
    }).select("-password");
    res.json(mentor);
  } catch (error) {
    console.error(error);
    return res.status(500).json("Server error...");
  }
});

//Get Mentor by degree
router.get("/mentor_by_degree/:mentor_degree", async (req, res) => {
  try {
    let mentorDegree = req.params.mentor_degree;
    let mentor = await Mentor.find({ degree: mentorDegree }).select(
      "-password"
    );
    res.json(mentor);
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
    check("organization", "Organization is empty").not().isEmpty(),
    check("designation", "Designation is empty").not().isEmpty(),
    check("language", "Language is empty").not().isEmpty(),
    check("degree", "Degree is empty").not().isEmpty(),
    check("skills", "Skills are empty").not().isEmpty(),
    check("interests", "Interests are empty").not().isEmpty(),
    check("linkedIn", "Skills is empty").not().isEmpty(),
    check("gitHub", "Degree is empty").not().isEmpty(),
    check("availability", "Skills is empty").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      let {
        email,
        password,
        firstName,
        lastName,
        gender,
        organization,
        designation,
        language,
        degree,
        skills,
        interests,
        linkedIn,
        gitHub,
        availability,
      } = req.body;
      let mentor = await Mentor.findOne({ email }).select("password");
      let fetchedEmailFormDatabase = await Mentor.findOne({ email }).select(
        "passwors"
      );
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (mentor) {
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

      let newMentor = new Mentor({
        email,
        password,
        firstName,
        lastName,
        gender,
        organization,
        designation,
        language,
        degree,
        skills,
        interests,
        linkedIn,
        gitHub,
        availability,
        avatar,
      });

      const salt = await bcryptjs.genSalt(10);

      let hashedPassword = await bcryptjs.hash(password, salt);

      newMentor.password = hashedPassword;

      await newMentor.save();

      const payload = {
        mentor: {
          id: newMentor._id,
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
      let mentor = await Mentor.findOne({ email });
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      if (!mentor) {
        return res.status(404).send("User with this Email does not exist!");
      }

      let doPasswordsMatch = await bcryptjs.compare(password, mentor.password);

      if (!doPasswordsMatch) {
        return res.status(401).json("Password do not match!");
      }

      const payload = {
        mentor: {
          id: mentor._id,
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
  "/search_mentor_by_email",
  [check("emailFromSearch", "emailFromSearch is empty").not().isEmpty()],
  async (req, res) => {
    try {
      let { emailFromSearch } = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      let mentors = await Mentor.find().select("-password");
      let findMentorByEmail = mentors.filter(
        (mentor) =>
          mentor.email.toString().toLowerCase().split(" ").join("") ===
          emailFromSearch.toString().toLowerCase().split(" ").join("")
      );
      res.json(findMentorByEmail);
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error.");
    }
  }
);

// Update and save data

router.put(
  "/change_mentor_data/:mentor_data_to_change",
  authentication,
  [check("changeMentorData", "Input is Empty").not().isEmail()],
  async (req, res) => {
    try {
      const { changeMentorData } = req.body;
      let errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      let mentor = await Mentor.findById(req.mentor.id).select("-password");
      if (!mentor) return res.status(404).jason("Mentor not found!");

      let dataToChange = req.params.mentor_data_to_change.toString();

      if (mentor[dataToChange] === changeMentorData.toString())
        return res.status(401).json("Data is already in the database!");
      mentor[dataToChange] = changeMentorData.toString();

      await mentor.save();

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
      let mentor = await Mentor.findById(req.mentor.id);

      let passwordMatch = await bcryptjs.compare(passwordToCheck, mentor.password );

      if(!passwordMatch) return res.status(401).json("Password do not match!");

      res.json("Successful!");

    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Server error.");
    }
  }
)

router.put("/change_mentor_password", authentication, [check("newPassword", "New password should be between 6-12 characters!").isLength({min: 6, max: 12})], async (req,res) => {
  try {
    const { newPassword } = req.body;
    let errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    let mentor = await Mentor.findById(req.mentor.id);

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(newPassword, salt);

    mentor.password = hashedPassword;

    await mentor.save();

    res.json("Successful");

  } catch (error) {
    console.error(error.message);
    return res.status(500).send("Server error.");
  }
})

// Delete profile
router.delete(
  "/delete_mentor/:mentor_id",
  authentication,
  async (req, res) => {
    try {
      let mentor = await Mentor.findById(req.params.mentor_id);

      if (!mentor) return res.status(404).json("User not found");

      await mentor.remove();

      res.json("Profile is removed!");
    } catch (error) {
      console.error(error);
      return res.status(500).json("server error...");
    }
  }
);



module.exports = router;
