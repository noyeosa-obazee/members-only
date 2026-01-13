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

indexRoute.get(
  "/create-post",
  appController.isAuth,
  appController.getCreatePostForm
);
indexRoute.post("/create-post", appController.createNewPost);

module.exports = indexRoute;
