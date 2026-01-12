const { Router } = require("express");
const appController = require("../controllers/appControllers");
const passport = require("passport");
const indexRoute = Router();

indexRoute.get("/signup", appController.getSignUpForm);
indexRoute.get("/login", appController.getLogInForm);
indexRoute.get("/logout", appController.logOut);
indexRoute.get("/posts", appController.isAuth, appController.displayAllPosts);
indexRoute.post("/signup", appController.validateSignUp, appController.signUp);
indexRoute.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/login",
  })
);

module.exports = indexRoute;
