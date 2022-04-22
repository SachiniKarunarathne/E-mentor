const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
require("dotenv").config();


// define the PORT
const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());




//connect Database
const URL = process.env.MONGODB_URL;

mongoose.connect(URL)

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB Connection success!");
})

//access Mentors.js in routes
const mentorRouter = require("./routes/Mentors");
const menteeRouter = require("./routes/Mentees");
const postRouter = require("./routes/Posts");
const friendRouter = require("./routes/Friends");

app.use("/mentor", mentorRouter);
app.use("/mentee", menteeRouter);
app.use("/post", postRouter);
app.use("/friend", friendRouter);

app.listen(PORT, ()=>{
  console.log((`Server is up and running on port: http://localhost:${PORT}`));
})

