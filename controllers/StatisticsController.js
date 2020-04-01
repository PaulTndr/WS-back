var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID
router.use(bodyParser.json());
var mongoose = require('mongoose');

router.get('/nbrUsers', function (req, res) {
    console.log("Request /stats/nbrUsers");
    surveysDB.collection('users').find().toArray(function (err, results) {
        res.json({
            "value": results.length
        });
    })
});

router.get('/nbrSurveys', function (req, res) {
    console.log("Request /stats/nbrSurveys");
    surveysDB.collection('surveys').find().toArray(function (err, results) {
        console.log(results.length)
        res.json({
            "value": results.length
        });
    })
});

router.get('/surveyStats', function (req, res) {
    console.log("Request /stats/surveyStats");
    surveysDB.collection('surveys').find().toArray(function (err, results) {
        nbrVote = 0;
        nbrLike = 0;
        results.forEach((survey) => {
            nbrVote += survey.participations
            nbrLike += survey.likes
        })
        res.json({
            "nbrVote": nbrVote,
            "nbrLike": nbrLike
        });
    })
});

router.get('/userEvolution', function (req, res) {
    console.log("Request /stats/userEvolution");
    let userEvolution = []
    let currentDate = new Date();
    currentDate.setHours(23)
    currentDate.setMinutes(59)
    currentDate.setSeconds(59)
    let currentDateTs = currentDate.getTime()

    let listTs = []
    for (var k = 0; k < 30; k++) {
        listTs.push(currentDateTs - (k * 24 * 60 * 60 * 1000))
    }

    listTs.forEach((ts) => {
        surveysDB.collection('users').find({
            dateRegistration: {
                $lt: ts
            }
        }).toArray(function (err, results) {
            userEvolution.push({
                "ts": ts,
                "value": results ? results.length : 0
            })
            if (userEvolution.length == 30) {
                userEvolution.sort(function (a, b) {
                    return +a["ts"] - +b["ts"];
                });
                res.json({
                    "value": userEvolution
                });

            }
        })
    })

});

router.get('/visitorEvolution', function (req, res) {
    console.log("Request /stats/visitorEvolution");

    surveysDB.collection('statistics').findOne({
        name: "visitors"
    }, function (findErr, stat) {
        res.json(stat);
    });


});

router.get('/addImpression', function (req, res) {
    console.log("Request /stats/addImpression");

    surveysDB.collection('statistics').findOne({
        name: "visitors"
    }, function (findErr, stat) {
        listDayVisitors = stat.value;
        console.log(listDayVisitors)
        console.log("test")
        let today = new Date().getUTCDate() + "/" + (new Date().getUTCMonth() + 1) + "/" + new Date().getUTCFullYear()
        console.log(today)
        //Si il existe une entrée pour la journée en cours alors on implémente son nombre d'impression
        isIn = false;
        listDayVisitors.forEach((dayVisitors) => {
            if (dayVisitors.day === today) {
                dayVisitors.value += 1
                isIn = true;
            }
        })
        //Sinon on ajoute une entrée avec une impression
        if (!isIn) {
            listDayVisitors.push({
                day: today,
                value: 1
            })
        }
        stat.value = listDayVisitors;

        surveysDB.collection('statistics').update({
            name: "visitors"
        }, stat);
    });
    res.json();
});

module.exports = router;