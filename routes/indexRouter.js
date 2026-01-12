const { Router } = require("express");
const appController = require("../controllers/appControllers");
const indexRoute = Router();

indexRoute.get("/signup", appController.getSignUpForm);

indexRoute.get("/login", appController.getLogInForm);

module.exports = indexRoute;
