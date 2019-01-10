const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charitySchema = new Schema({
  name: {type: String, required:true},
})
let charity = mongoose.model('charity', charitySchema)

module.exports = charity;
