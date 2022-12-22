const validator = require("validator");
const usersCollection = require("../db").db().collection("users");
const bcrypt = require("bcryptjs");
const md5 = require("md5");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.getAvatar = function () {
  this.avatar = `https://gravatar.com/avatar/${md5(this.data.email)}?s=128`;
};

User.prototype.register = function () {
  // Step 1: Validate
  this.cleanUp();
  this.validate();

  // Step 2: If the data is having no validation errors, then save the data into database
  if (!this.errors.length) {
    let salt = bcrypt.genSaltSync(10);
    this.data.password = bcrypt.hashSync(this.data.password, salt);
    usersCollection.insertOne(this.data);
  }
};

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (
    !validator.isAlphanumeric(this.data.username) &&
    this.data.username != ""
  ) {
    this.errors.push("Username can only contain letters and numbers");
  }
  if (this.data.email == "") {
    this.errors.push("You must provide an email.");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must put a valid email.");
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password.");
  }

  if (this.data.username > 0 && this.data.username < 3) {
    this.errors.push("Username should be of atlest 3 characters.");
  }
  if (this.data.password > 0 && this.data.password < 8) {
    this.errors.push("Password should be of atlest 8 characters.");
  }
  if (this.data.password > 100) {
    this.wrrors.push("Password should be less than 100 characters.");
  }
};

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    usersCollection
      .findOne({ username: this.data.username })
      .then((attempltedUser) => {
        if (
          attempltedUser &&
          bcrypt.compareSync(this.data.password, attempltedUser.password)
        ) {
          this.getAvatar();
          resolve("Congrats");
        } else {
          reject("Invalid username/password");
        }
      })
      .catch(function (err) {
        reject("Please try again later!");
      });
  });
};

module.exports = User;

(err, attempltedUser) => {
  if (
    attempltedUser &&
    bcrypt.compareSync(this.data.password, attempltedUser.password)
  ) {
    // console.log("Congrats!");
    resolve("Congrats");
  } else {
    // console.log("Invalid username and password!");
    reject("Invalid username/password");
  }
  console.log(attempltedUser);
};

User.findByUsername = function (username) {
  return new Promise(function (resolve, reject) {
    if (typeof username != "string") {
      reject("Username should be a string");
      return;
    }
    usersCollection
      .findOne({ username: username })
      .then(function (userDoc) {
        if (userDoc) {
          userDoc = {
            _id: userDoc._id,
            username: userDoc.username,
            avatar: userDoc.avatar,
          };
          resolve(userDoc);
        } else {
          reject();
        }
      })
      .catch(function () {
        reject();
      });
  });
};
