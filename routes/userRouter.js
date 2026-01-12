const { Router } = require("express");
const userController = require("../controllers/userControllers");
const userRoute = Router();

userRoute.post("/signup", userController.validateSignUp, userController.signUp);
userRoute.post("/login", userController.logIn);

module.exports = userRoute;
