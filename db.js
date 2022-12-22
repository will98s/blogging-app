const mongodb = require("mongodb").MongoClient;
const dotenv = require("dotenv");

dotenv.config();

mongodb.connect(
  process.env.CONNECTION_STRING,
  { useNewUrlParser: true },
  function (err, client) {
    if (err) {
      console.log(err);
    } else {
      module.exports = client;
      console.log("MongoDB is connected!");
      const app = require("./app");
      app.listen(process.env.PORT, function () {
        console.log("Server is running on port 3000");
      });
    }
  }
);