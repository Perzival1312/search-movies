const express = require('express');
const router = express.Router();
const Code = require('../models/charity');
const unirest = require('unirest');
// const apiKey = "oFuGss0yoxmshRmwtTTloScfpjxxp1Fr3oGjsn2PW3x7xFCqxO" //Utelly
const apiKey = "3b51888e8cf75b14ee2d39b1b5e47e59959fbf20" //Guidebox
// get the models required in here...

// "http://api-public.guidebox.com/v2/{endpoint}"
// "https://api.guidebox.com/docs"

// INDEX
// router.get('/', (req, res) => {
//   unirest.get("https://utelly-tv-shows-and-movies-availability-v1.p.mashape.com/lookup?country=us&term=elementary")
//     .header("X-Mashape-Key", apiKey)
//     .header("Accept", "application/json")
//     .end(function (result) {
//       res.send(result.body);
//   });
// });

router.get('/', (req, res) => {
  unirest.get("http://api-public.guidebox.com/v2/shows?channel=hbo")
    .header("Authorization", apiKey)
    .end(function (result) {
      res.send(result.body);
  });
});

module.exports = router
