const express = require('express');
const router = express.Router();
const Code = require('../models/charity');
const unirest = require('unirest');
const apiKey = "3b51888e8cf75b14ee2d39b1b5e47e59959fbf20" //Guidebox api key

// "http://api-public.guidebox.com/v2/{endpoint}"
// "https://api.guidebox.com/docs"

// INDEX
router.get('/', (req, res) => {
  unirest.get("http://api-public.guidebox.com/v2/search?type=show&field=title&query=elementar")
    .header("Authorization", apiKey)
    .end(function (result) {
      var id = String(result.body.results[0].id);
      res.redirect(`/results/${id}`)
  });
});

router.get('/results/:id', (req, res) => {
  unirest.get(`http://api-public.guidebox.com/v2/shows/${Number(req.params.id)}/available_content`)
  .header("Authorization", apiKey)
  .end(function (result) {
    res.send(result.body);//.results.web.episodes.all_sources)
  });
})

module.exports = router
