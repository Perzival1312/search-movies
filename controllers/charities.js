const express = require('express');
const router = express.Router();
const Code = require('../models/charity');
const unirest = require('unirest');
const apiKey = "3b51888e8cf75b14ee2d39b1b5e47e59959fbf20"; //Guidebox api key
var resultArray = [];
var resultsArray = [];
var fullResults = [];

// "http://api-public.guidebox.com/v2/{endpoint}"
// "https://api.guidebox.com/docs"

router.get('/callsleft', (req, res) => {
  unirest.get("http://api-public.guidebox.com/v2/quota")
  .header("Authorization", apiKey)
  .end(function (result) {
    res.send(result)
  })
})

router.get('/', (req,res) => {
  res.render('index')
})

// INDEX
router.post('/search', (req, res, next) => {
  var qstring = req.body.qstring
  unirest.get(`http://api-public.guidebox.com/v2/search?type=show&field=title&query=${qstring}`)
    .header("Authorization", apiKey)
    .end(function (result) {
      for(i=0; i<result.body.results.length; i++){
        var id = String(result.body.results[i].id)
        resultArray.push(id)
      }
      // next()
      // res.redirect('/showall')
      res.send(`finished searching for ${qstring}`)
  });
});

// router.get('/search', (req, res, next) => {
//   unirest.get("http://api-public.guidebox.com/v2/search?type=movie&field=title&query=elementary")
//     .header("Authorization", apiKey)
//     .end(function (result) {
//       for(i=0; i<result.body.results.length; i++){
//         var id = String(result.body.results[i].id)
//         resultArray.push(id)
//       }
//       // res.send(resultArray)
//       console.log(resultArray)
//       // res.redirect('/results')
//       next()
//   })
// })


router.get('/showall', (req, res)=> {
  for(i=0; i<resultArray.length; i++){
    // router.get(`/results/${Number(resultArray[i])}`, (req, res, next) => {
      unirest.get(`http://api-public.guidebox.com/v2/shows/${Number(resultArray[i])}/available_content`)
      .header("Authorization", apiKey)
      .end(function (result) {
        // res.send(result.body);//.results.web.episodes.all_sources)
        for(j=0; j<result.body.results.web.episodes.all_sources.length; j++){
          resultsArray.push(result.body.results.web.episodes.all_sources[j].display_name)
          // console.log(result.body.results.web.episodes.all_sources[j])
        }
        // resultsArray.push(result.body.results.web.episodes.all_sources)
        // console.log(resultsArray)
        // console.log(result.body);//.results.web.episodes.all_sources)
        // res.send(resultsArray)
        // console.log(resultArray[i])
        // next()
      });

    // })
    // res.send("helo")
    // res.redirect('/results')

  }
  for(i=0; i<resultArray.length; i++){
    fullResults.push(resultArray[i])
    fullResults.push(resultsArray[i])
  }
  // fullResults.push()
  res.redirect('/results')
})

router.get('/results', (req, res) => {
  // res.send(resultsArray)
  console.log("last")
  console.log(fullResults)
  // res.send("done")
  // res.send(fullResults)
  res.status(200).send([String(resultArray), resultsArray])
})

module.exports = router
