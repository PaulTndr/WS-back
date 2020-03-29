var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var ObjectId = require('mongodb').ObjectID
router.use(bodyParser.json());
var mongoose = require('mongoose');


router.post('/post', function (req, res) {
    console.log("Request /users/post");
    let user = req.body
    user["dateRegistration"]=+new Date().getTime();
    surveysDB.collection('users').insertOne(user);
    res.send(user);
});

module.exports = router;