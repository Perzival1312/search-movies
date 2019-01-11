const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');
const unirest = require('unirest');
const apiKey = "3b51888e8cf75b14ee2d39b1b5e47e59959fbf20"; //Guidebox api key
var idArray = [];
var titleArray = [];
var serviceArray = [];
var fullResults = {};

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
  var qstring = req.body.qstring;
  unirest.get(`http://api-public.guidebox.com/v2/search?type=show&field=title&query=${qstring}`)
    .header("Authorization", apiKey)
    .end(function (result) {
      // res.send(result.body);
      for(i=0; i<result.body.results.length; i++){
        var id = String(result.body.results[i].id);
        var title = String(result.body.results[i].title);
        idArray.push(id);
        titleArray.push(title);
      };
      next()
      // res.redirect('/showall')
      // res.send(`finished searching for ${qstring}`);
  });
});

router.post('/search', (req, res) => {
  var qstring = req.body.qstring;
  unirest.get(`http://api-public.guidebox.com/v2/search?type=movie&field=title&query=${qstring}`)
    .header("Authorization", apiKey)
    .end(function (result) {
      for(i=0; i<result.body.results.length; i++){
        var id = String(result.body.results[i].id)
        var title = String(result.body.results[i].title)
        idArray.push(id)
        titleArray.push(title)
      }


      // TODO: add in call for title
      // res.send(idArray)
      // console.log(idArray)
      res.redirect('/showall')
      // next()
  })
})


router.get('/showall', (req, res)=> {
  for(i=0; i<idArray.length; i++){
    // router.get(`/results/${Number(idArray[i])}`, (req, res, next) => {
      unirest.get(`http://api-public.guidebox.com/v2/shows/${Number(idArray[i])}/available_content`)
      .header("Authorization", apiKey)
      .end(function (result) {
        var tempServiceArray = []
        // res.send(result.body);//.results.web.episodes.all_sources)
        for(j=0; j<result.body.results.web.episodes.all_sources.length; j++){
          tempServiceArray.push(result.body.results.web.episodes.all_sources[j].display_name)
          // console.log(result.body.results.web.episodes.all_sources[j])
        }
        // TODO: add in calling for description
        // console.log(tempServiceArray)
        serviceArray.push(tempServiceArray)
        tempServiceArray = []
        // serviceArray.push(result.body.results.web.episodes.all_sources)
        // console.log(serviceArray)
        // console.log(result.body);//.results.web.episodes.all_sources)
        // res.send(serviceArray)
        // console.log(idArray[i])
        // next()
      });

    // })
    // res.send("helo")
    // res.redirect('/results')

  }
  function combineArrays(){
    console.log(idArray)
    console.log(titleArray)
    console.log(serviceArray)
    // console.log(serviceArray)
    for(i=0; i<idArray.length; i++){
      // console.log(serviceArray[i])
      fullResults = Object.assign({[i]: {id: idArray[i], title: titleArray[i], streaming_services: serviceArray[i]}}, fullResults)
      // fullResults.push({i: {id: idArray[i], name: serviceArray}})
      // fullResults.push()
    }
    res.redirect('/results')
  }
  setTimeout(combineArrays, 3000)
  // fullResults.push()

})

router.get('/results', (req, res) => {
  // res.send(serviceArray)
  // console.log("last")
  console.log(fullResults)
  // res.send("done")
  // res.send(fullResults)
  res.status(200).send(fullResults)
})

module.exports = router
