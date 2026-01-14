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

indexRoute.get(
  "/join-club",
  appController.isAuth,
  appController.getJoinClubForm
);
indexRoute.post("/join-club", appController.addToClub);
indexRoute.post("/delete-post/:postid", appController.deletePost);

indexRoute.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

module.exports = indexRoute;
