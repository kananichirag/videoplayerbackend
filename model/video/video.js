const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  video: {
    type: String,
  },
  name: {
    type: String,
  },
  image: {
    type: String,
  },
});

const modal = new mongoose.model('Video', videoSchema);
module.exports = modal;
