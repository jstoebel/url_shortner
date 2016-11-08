var express = require('express')
var mongo = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/main"
var app = express()

mongo.connect(url, function(err, db) {

    if (err){ throw "failed to connect to mongo db";}

    var urlCol = db.collection('urls');

    app.get("/new", function(req, res) {

      urlCol.find({}).toArray(function(err, documents) {
        var docCount = documents.length

        var url = req.query.url
        console.log(url)
        var urlMatch = /https?:\/\/.*\..*/
        if (url.match(urlMatch)){
          // valid url
          var record = {"origUrl": url, "newUrl": docCount }
          urlCol.insert(record, function(err,createdRecord){
            if (err){
              throw "could not insert record"
            }
            console.log("new url created!")
            var fullUrl = req.protocol + '://' + req.get('host') + "/" + docCount;
            var obj = JSON.stringify({
              "origUrl": url,
              "newUrl": fullUrl
            })
            res.end(obj)
          });
        } else {
          // invalud url
          var obj = JSON.stringify({
            "origUrl": url,
            "newUrl": null
          })
          console.log(obj)
          res.end(obj)
        }

      }) // collection count
    }) // get

})

app.listen(process.env.PORT || 3000)
