const path = require("node:path");
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/queries");
const indexRoute = require("./routes/indexRouter");
const userRoute = require("./routes/userRouter");
const { errorHandler } = require("./controllers/appControllers");
require("dotenv").config();
require("./config/passport");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

app.use("/", indexRoute);
app.use("/user", userRoute);
app.use(errorHandler);

app.listen(3000, (error) => {
  if (error) {
    throw error;
  }
  console.log("app listening on port 3000!");
});
