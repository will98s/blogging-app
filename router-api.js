const express = require("express");
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");

const apiRouter = express.Router();

apiRouter.post("/login", userController.apiLogin);
apiRouter.post(
  "/create-post",
  userController.apiMustBeLoggedIn,
  postController.apiCreate
);

apiRouter.delete(
  "/post/:id",
  userController.apiMustBeLoggedIn,
  postController.apiDelete
);

module.exports = apiRouter;
