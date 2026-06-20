const axios = require("axios");

module.exports = {
  async get(url, options = {}) {
    try {
      const response = await axios.get(url, options);
      return response.data;
    } catch (err) {
      console.log("API GET ERROR:", err.message);
      return null;
    }
  },

  async post(url, data = {}, options = {}) {
    try {
      const response = await axios.post(
        url,
        data,
        options
      );
      return response.data;
    } catch (err) {
      console.log("API POST ERROR:", err.message);
      return null;
    }
  }
};
