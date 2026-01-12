const getSignUpForm = (req, res) => {
  res.render("sign-up-form");
};

const getLogInForm = (req, res) => {
  res.render("log-in-form");
};

module.exports = { getSignUpForm, getLogInForm };
