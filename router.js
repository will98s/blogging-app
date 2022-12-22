const express = require("express");
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

const router = express.Router();

// User related routes
router.get("/", userController.home);

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

// Post related routes
router.get(
  "/create-post",
  userController.mustBeLoggedIn,
  postController.viewCreateScreen
);

router.post(
  "/create-post",
  userController.mustBeLoggedIn,
  postController.createPost
);

router.get("/post/:id", postController.viewSinglePost);

// Profile related routes
router.get(
  "/profile/:username",
  userController.ifUserExists,
  userController.profilePostsScreen
);

router.get(
  "/post/:id/edit",
  userController.mustBeLoggedIn,
  postController.viewEditScreen
);

router.post("/post/:id/edit", postController.editPost);

router.post("/post/:id/delete", postController.delete);

module.exports = router;