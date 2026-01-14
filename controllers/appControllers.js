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

const logOut = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
};

const displayAllPosts = async (req, res) => {
  try {
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
  } catch (err) {
    console.error(err);
    res.render("posts", {
      user: req.user,
      posts: [],
      error: "Unable to load posts from the database.",
    });
  }
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

  try {
    await db.createNewUser(req.body);
    res.redirect("/login");
  } catch (err) {
    res.render("sign-up-form", {
      error: "System Error: Unable to create account. Please try again later.",
      errors: [],
      oldInput: req.body,
    });
  }
};

const getCreatePostForm = (req, res) => {
  res.render("create-post-form");
};

const createNewPost = async (req, res) => {
  try {
    const userid = req.user.id;
    await db.createPost(req.body, userid);
    res.redirect("/posts");
  } catch (err) {
    res.render("create-post-form", {
      user: req.user,
      error: "Network error: Could not send your post. Please try again.",
      oldInput: req.body,
    });
  }
};

const getJoinClubForm = (req, res) => {
  res.render("join-club", { user: req.user });
};

const addToClub = async (req, res) => {
  const { passcode } = req.body;
  const secretCode = process.env.CLUB_PASSCODE;
  if (passcode === secretCode) {
    try {
      await db.setMemberStatus(req.user.id);

      res.redirect("/posts");
    } catch (err) {
      next(err);
    }
  } else {
    res.render("join-club", {
      user: req.user,
      error: "Incorrect passcode. Access denied.",
    });
  }
};

const deletePost = async (req, res) => {
  try {
    await db.deletePost(req.params.postid);

    res.redirect("/posts");
  } catch (err) {
    next(err);
  }
};

const errorHandler = (req, res, next) => {
  res.status(404).render("404");
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
  getJoinClubForm,
  addToClub,
  deletePost,
  errorHandler,
};
