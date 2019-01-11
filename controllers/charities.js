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
  function getIdAndTitle() {
    queries = ['movie', 'show']
    for(let j=0; j< queries.length; j++){
      var qstring = req.body.qstring;
      unirest.get(`http://api-public.guidebox.com/v2/search?type=${queries[j]}&field=title&query=${qstring}`)
        .header("Authorization", apiKey)
        .end(function (result) {
          for(let i=0; i<result.body.results.length; i++){
            let id = Number(result.body.results[i].id)
            let title = String(result.body.results[i].title)
            idArray.push(id)
            titleArray.push(title)

            if(j==0) {
              unirest.get(`http://api-public.guidebox.com/v2/movies/${id}`)
                .header("Authorization", apiKey)
                .end(function (result) {
                  // console.log(titleArray[i])
                  console.log(title)
                  console.log(result.body)
                  // res.send(result.body)
                  var tempServiceArray = []
                  try {
                    for(let j=0; j<result.body.free_web_sources.length; j++){
                      tempServiceArray.push(result.body.free_web_sources[j].display_name)
                    }
                    try {
                      for(let j=0; j<result.body.tv_everywhere_web_sources.length; j++){
                        tempServiceArray.push(result.body.tv_everywhere_web_sources[j].display_name)
                      }
                      try {
                        for(let j=0; j<result.body.subscription_web_sources.length; j++){
                          tempServiceArray.push(result.body.subscription_web_sources[j].display_name)
                        }
                        try {
                          for(let j=0; j<result.body.purchase_web_sources.length; j++){
                            tempServiceArray.push(result.body.purchase_web_sources[j].display_name)
                          }
                        }catch {
                          null
                        }}
                      catch {
                        null
                    }}
                    catch {
                      null
                  }}
                  catch {
                    null
                  }
                  // TODO: add in calling for description
                  serviceArray.push(tempServiceArray)
                });
            }

            if(j==1) {
              unirest.get(`http://api-public.guidebox.com/v2/shows/${id}/available_content`)
                .header("Authorization", apiKey)
                .end(function (result) {
                  // console.log(titleArray[i])
                  // console.log(title)
                  // console.log(result.body)
                  var tempServiceArray = []
                  try {
                    for(let j=0; j<result.body.results.web.episodes.all_sources.length; j++){
                      tempServiceArray.push(result.body.results.web.episodes.all_sources[j].display_name)
                    }
                  }catch {
                    null
                  }
                  // TODO: add in calling for description
                  serviceArray.push(tempServiceArray)
                });
            }
          }
      })
    }
  }

  function combineArrays(){
    for(let i=0; i<idArray.length; i++){
      fullResults = Object.assign({[i]: {id: idArray[i], title: titleArray[i], streaming_services: serviceArray[i]}}, fullResults)
    }
    res.redirect('/results')
  }
  getIdAndTitle()
  setTimeout(combineArrays, 10000)
})


router.get('/results', (req, res) => {
  console.log(fullResults)
  res.status(200).send(fullResults)
})

module.exports = router
