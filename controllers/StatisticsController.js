var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID
router.use(bodyParser.json());
var mongoose = require('mongoose');

router.get('/nbrUsers', function (req, res) {
    console.log("Request /stats/nbrUsers");
    surveysDB.collection('users').find().toArray(function(err, results) {
        res.json({"value":results.length});
    })
});

router.get('/nbrSurveys', function (req, res) {
    console.log("Request /stats/nbrSurveys");
    surveysDB.collection('surveys').find().toArray(function(err, results) {
        console.log(results.length)
        res.json({"value":results.length});
    })
});

router.get('/surveyStats', function (req, res) {
    console.log("Request /stats/surveyStats");
    surveysDB.collection('surveys').find().toArray(function(err, results) {
        nbrVote=0;
        nbrLike=0;
        results.forEach((survey)=>{
            nbrVote+=survey.participations
            nbrLike+=survey.likes
        })
        res.json({"nbrVote":nbrVote, "nbrLike":nbrLike});
    })
});

router.get('/userEvolution', function (req, res) {
    console.log("Request /stats/userEvolution");
    let userEvolution=[]
    let currentDateTs=(new Date()).getTime();

    let listTs =[]
    for(var k=0; k<30;k++){
        listTs.push(currentDateTs-(k*24*60*60*1000))
    }
    console.log(listTs)

    listTs.forEach((ts)=>{
        surveysDB.collection('users').find(
            { dateRegistration: { $lt: ts } }
        ).toArray(function(err, results) {
            userEvolution.push({
                "ts":ts,
                "value": results ? results.length :0
            })
            if (userEvolution.length==30){
                userEvolution.sort(function (a, b) {
                    return +a["ts"] - +b["ts"];
                });
                res.json({"value":userEvolution});
               
            }
        })
    })
    
});

module.exports = router;