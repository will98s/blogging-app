const { ObjectId } = require("mongodb");

const postsCollection = require("../db").db().collection("posts");

let Post = function (data, id) {
  this.data = data;
  this.errors = [];
  this.postId = id;
};

Post.prototype.createPost = function () {
  return new Promise((resolve, reject) => {
    this.data.createdDate = new Date();
    postsCollection
      .insertOne(this.data)
      .then(function () {
        resolve();
      })
      .catch(function () {
        reject();
      });
  });
};

Post.findSingleById = function (id) {
  return new Promise(async function (resolve, reject) {
    if (typeof id != "string") {
      reject();
      return;
    }
    let post = await postsCollection.findOne({ _id: new ObjectId(id) });
    if (post) {
      resolve(post);
    } else {
      reject();
    }
  });
};

// Post.reusablePostQuery = async function () {
//   let posts = await postsCollection.aggregate([]);
// };

// Post.findByAuthorId = function (authorId) {};

Post.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      await postsCollection.findOneAndUpdate(
        { _id: new ObjectId(this.postId) },
        { $set: { title: this.data.title, body: this.data.body } }
      );
      resolve("Success!");
    } catch {
      reject();
    }
  });
};

Post.delete = function (postIdToDelete) {
  return new Promise(async (resolve, reject) => {
    // let post = await Post.findSingleById(postIdToDelete);
    postsCollection
      .deleteOne({ _id: new ObjectId(postIdToDelete) })
      .then(function () {
        resolve();
      })
      .catch(function () {
        reject();
      });
  });
};

module.exports = Post;
