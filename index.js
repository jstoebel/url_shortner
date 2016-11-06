var express = require('express')
var mongo = require('mongodb').MongoClient
var url = "mongodb://localhost:27017/main"
var app = express()

mongo.connect(url, function(err, db) {

    // set up a counter collection
    // var counter = db.collection('counter');
    var urlCol = db.collection('urls');
    console.log(urlCol.count())
  //   counter.insert(
  //     {
  //       _id: "urls",
  //       seq: 0
  //     }
  //   )
  //
  //   counter.findAndModify({
  //     query: {_id: "urls"},
  //     update: { $inc: { seq: 1 } },
  //     new: true
  //   })
  //
  //   counter.find({
  //     "_id" : "urls"
  //   }).toArray(function(err, documents) {
  //   console.log(documents)
  // })
  //
  //   function getNextSequence(name) {
  //      var ret = counter.findAndModify(
  //             {
  //               query: { _id: name },
  //               update: { $inc: { seq: 1 } },
  //               new: true
  //             }
  //      );
  //
  //      return ret.seq;
  //   }

    // console.log(getNextSequence("urls"))
    // console.log(getNextSequence("urls"))
    //
    app.get(/new\/(.*)/, function(req, res) {
      var url = req.params[0]
      var urlMatch = /https?:\/\/.*\..*/
      if (url.match(urlMatch)){
        // valid url
        var record = {"origUrl": url, "newUrl": urlCol.count() }
        urlCol.insert(record, function(err,createdRecord){
          if (err){
            throw err
          }
          console.log("new url created!")
          console.log(createdRecord);
        });
      } else {
        // invalud url
        console.log("invalid url")
      }
    })

})

app.listen(process.env.PORT || 3000)
