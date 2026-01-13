const db = require("../db/queries");
const { formatDistanceToNow } = require("date-fns");

const { body, validationResult } = require("express-validator");
const isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

const getSignUpForm = (req, res) => {
  res.render("sign-up-form");
};

const getLogInForm = (req, res) => {
  res.render("log-in-form");
};

const logOut = () => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};

const displayAllPosts = async (req, res) => {
  const rawPosts = await db.getAllPosts();

  const posts = rawPosts.map((post) => {
    return {
      ...post,

      timestamp_formatted: formatDistanceToNow(new Date(post.timestamp), {
        addSuffix: true,
      }),
    };
  });

  res.render("posts", { posts: posts, user: req.user });
};

const validateSignUp = [
  body("fullname")
    .trim()
    .notEmpty()
    .withMessage("Full name is required.")
    .isLength({ min: 1, max: 100 })
    .withMessage("Name is too long."),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .custom(async (value) => {
      const user = await db.getUserByUsername(value);
      if (user) {
        throw new Error("Username already in use");
      }
    }),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters.")
    .matches(/[a-zA-Z]/)
    .withMessage("Password must contain at least one letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[^a-zA-Z0-9]/)
    .withMessage("Password must contain a special character (@, !, #, etc)."),

  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

const signUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).render("sign-up-form", {
      errors: errors.array(),
      oldInput: req.body,
    });
  }

  await db.createNewUser(req.body);
  res.redirect("/login");
};

const getCreatePostForm = (req, res) => {
  res.render("create-post-form");
};

const createNewPost = async (req, res) => {
  const userid = req.user.id;
  await db.createPost(req.body, userid);
  res.redirect("/posts");
};

module.exports = {
  getSignUpForm,
  getLogInForm,
  logOut,
  displayAllPosts,
  isAuth,
  validateSignUp,
  signUp,
  getCreatePostForm,
  createNewPost,
};
