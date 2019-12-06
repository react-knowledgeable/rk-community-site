import axios from 'axios';

export default axios.create({
  validateStatus: function(status) {
    return status >= 200 && status < 300;
  },
});
