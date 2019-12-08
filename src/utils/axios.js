const axios = require('axios');

module.exports = axios.create({
  validateStatus: function(status) {
    return status >= 200 && status < 300;
  },
});
