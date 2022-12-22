const Post = require("../models/Post");

exports.viewCreateScreen = function (req, res) {
  res.render("create-post.ejs", {
    username: req.session.user.username,
    avatar: req.session.user.avatar,
  });
};

exports.createPost = function (req, res) {
  req.body.author = req.session.user.username;
  console.log(req.body);
  let post = new Post(req.body);
  post.createPost();
  res.redirect("/create-post");
  // res.render("create-post.ejs", { message: "Post was successfully created" });
};

exports.viewSinglePost = async function (req, res) {
  try {
    let post = await Post.findSingleById(req.params.id);
    res.render("post.ejs", { post: post });
  } catch {
    res.render("404");
  }
};

exports.viewEditScreen = async function (req, res) {
  let post = await Post.findSingleById(req.params.id);
  res.render("edit-post", { post: post });
};

exports.editPost = function (req, res) {
  let post = new Post(req.body, req.params.id);
  post
    .update()
    .then(function () {
      res.redirect(`/post/${req.params.id}/edit`);
    })
    .catch(function () {
      res.send("You can't edit this post!");
    });
};

exports.delete = function (req, res) {
  Post.delete(req.params.id)
    .then(function () {
      req.flash("success", "Post successfully deleted!");
      req.session.save(() => {
        res.redirect(`/profile/${req.session.user.username}`);
      });
    })
    .catch(function () {
      req.flash("error", "You don't have permission to delete this post!");
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.apiCreate = function (req, res) {
  let post = new Post(req.body, req.apiUser._id);
  post
    .createPost()
    .then(function () {
      res.json("Congrats!");
    })
    .catch(function () {
      res.json("Incorrect/Insuffiecient data to create a post");
    });
  res.json;
};

exports.apiDelete = function (req, res) {
  Post.delete(req.params.id)
    .then(function () {
      res.json("Success!");
    })
    .catch(function () {
      res.json("You do not have permission to perform this operation!");
    });
};
