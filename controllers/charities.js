const express = require('express');
const router = express.Router();
const Code = require('../models/charity');
// get the models required in here...

// INDEX
router.get('/', (req, res) => {
  res.render('index')
});

module.exports = router
