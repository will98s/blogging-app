const express = require("express");
const router = require("./router");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

let sessionOptions = session({
  secret: "JavaScript is so cool!",
  resave: false,
  store: new MongoStore({ client: require("./db") }),
  saveUninitialized: false,
  cookies: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true },
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/api", require("./router-api"));

app.use(express.static("public"));
app.use(sessionOptions);
app.use(flash());

app.set("views", "views");
app.set("view engine", "ejs");

app.use("/", router);

module.exports = app;
