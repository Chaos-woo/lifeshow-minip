const util = require("./util.js");

const serverUrl = util.localServerUrl;

function get(options) {
  let url = serverUrl + options.url,
    data = options.data,
    success = options.success,
    fail = options.fail;

  wx.request({
    url: url,
    data: data,
    header: { "content-type": "application/json" },
    method: "GET",
    success: res => {
      if (res.statusCode == 200) {
        if (success) {
          success(res.data);
        }
      } else {
        if (fail) {
          fail(res);
        }
      }
    },
    fail: res => {
      if (fail) {
        fail(res);
      }
    }
  });
}

function post(options) {
  var url = serverUrl + options.url,
    data = options.data,
    success = options.success,
    fail = options.fail;

  wx.request({
    url: url,
    data: data,
    header: { "content-type": "application/x-www-form-urlencoded" },
    method: "POST",
    success: res => {
      if (res.statusCode == 200) {
        if (success) {
          success(res.data);
        }
      } else {
        if (fail) {
          fail(res);
        }
      }
    },
    fail: res => {
      if (fail) {
        fail(res);
      }
    }
  });
}

module.exports = {
  get: get,
  post: post
};
