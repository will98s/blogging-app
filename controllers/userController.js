const User = require("../models/User");
const Post = require("../models/Post");

const jwt = require("jsonwebtoken");

exports.home = function (req, res) {
  if (req.session.user) {
    res.render("home-logged-in", {
      username: req.session.user.username,
      avatar: req.session.user.avatar,
    });
  } else {
    res.render("home-guest", {
      errors: req.flash("errors"),
      regErrors: req.flash("regErrors"),
    });
  }
};
exports.register = function (req, res) {
  console.log(req.body);
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
    req.flash("regErrors", user.errors);
    req.session.save(function () {
      res.redirect("/");
    });
  } else {
    res.send("Congrats, there are no errors!");
  }
};

exports.login = function (req, res) {
  let user = new User(req.body);
  console.log(req.body);
  user
    .login()
    .then(function (message) {
      // res.send(message);
      req.session.user = {
        username: user.data.username,
        avatar: user.avatar,
        favColor: "red",
      };
      req.session.save(function () {
        res.redirect("/");
      });
    })
    .catch(function (error) {
      req.flash("errors", error);
      req.session.save(function () {
        res.redirect("/");
      });
    });
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/");
};

exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.flash("errors", "You must be logged in");
    req.session.save(function () {
      res.redirect("/");
    });
  }
};

exports.ifUserExists = function (req, res, next) {
  User.findByUsername(req.params.username)
    .then(function (userDocument) {
      req.profileUser = userDocument;
      next();
    })
    .catch(function () {
      res.render("404");
    });
};

exports.profilePostsScreen = function (req, res) {
  // Post.findByAuthorId(req.profileUser._id)
  //   .then(function (posts) {
  //   })
  //   .catch(function () {
  //     res.render("404");
  //   });
  res.render("profile-posts", {
    profileUsername: req.profileUser.username,
    profileAvatar: req.profileUser.avatar,
  });
};

exports.apiLogin = function (req, res) {
  console.log(req.body);
  let user = new User(req.body);
  user
    .login()
    .then(function (result) {
      res.json(
        jwt.sign({ _id: user.data._id }, process.env.JWTSECRET, {
          expiresIn: "7d",
        })
      );
    })
    .catch(function (e) {
      res.json("Login credentials are not correct");
    });
};

exports.apiMustBeLoggedIn = function (req, res, next) {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET);
    next();
  } catch {
    res.json("Sorry your token is wrong!");
  }
};
