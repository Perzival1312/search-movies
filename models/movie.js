const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  id: {type: Number, required: true},
  title: {type: String, required: true},
  services: {type: Array}
})

let movie = mongoose.model('movie', movieSchema)
module.exports = movie;
