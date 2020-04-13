const network = require("./network.js");
const promise = require("./promise.js");

module.exports = {
  get: promise(network.get),
  post: promise(network.post)
};
