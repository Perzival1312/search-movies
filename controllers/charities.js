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

router.post('/search', (req, res) => {
  queries = ['movie', 'show']
  for(vals of queries) {
    var qstring = req.body.qstring;
    unirest.get(`http://api-public.guidebox.com/v2/search?type=${vals}&field=title&query=${qstring}`)
      .header("Authorization", apiKey)
      .end(function (result) {
        for(i=0; i<result.body.results.length; i++){
          var id = String(result.body.results[i].id)
          var title = String(result.body.results[i].title)
          idArray.push(id)
          titleArray.push(title)
        }
    })
  }
  res.redirect('/showall')

})


router.get('/showall', (req, res)=> {
  for(i=0; i<idArray.length; i++){
      unirest.get(`http://api-public.guidebox.com/v2/shows/${Number(idArray[i])}/available_content`)
      .header("Authorization", apiKey)
      .end(function (result) {
        var tempServiceArray = []
        for(j=0; j<result.body.results.web.episodes.all_sources.length; j++){
          tempServiceArray.push(result.body.results.web.episodes.all_sources[j].display_name)
        }
        // TODO: add in calling for description
        serviceArray.push(tempServiceArray)
        tempServiceArray = []
      });
  }

  function combineArrays(){
    console.log(idArray)
    console.log(titleArray)
    console.log(serviceArray)
    for(i=0; i<idArray.length; i++){
      fullResults = Object.assign({[i]: {id: idArray[i], title: titleArray[i], streaming_services: serviceArray[i]}}, fullResults)
    }
    res.redirect('/results')
  }
  setTimeout(combineArrays, 3000)
  // fullResults.push()
})

router.get('/results', (req, res) => {
  console.log(fullResults)
  res.status(200).send(fullResults)
})

module.exports = router
