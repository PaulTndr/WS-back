var express = require('express');
var app = express();
var http = require('http');
var bodyParser = require('body-parser');
var PORT = process.env.PORT || 5000;

const MongoClient = require('mongodb').MongoClient

//CORS Middleware
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// custom routes

var SurveysController = require('./controllers/SurveysController');
var UsersController = require('./controllers/UsersController');
var StatisticsController = require('./controllers/StatisticsController');

// Set our routes

app.use('/surveys', SurveysController);
app.use('/users', UsersController);
app.use('/stats', StatisticsController);

// Handle 404
app.use(function (req, res) {
    //res.send('404: Page not Found', 404);
    res.status(404).send({
        status: 404,
        message: '404 Not Found',
        type: 'client'
    });
});

// Handle 500
app.use(function (error, req, res, next) {
    res.status(500).send({
        status: 500,
        message: 'internal error',
        type: 'internal'
    });
});

//listen

const uri = "mongodb+srv://adminWS:adminWS@weirdsurveys-dm1eb.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    useNewUrlParser: true
});
client.connect(err => {
    if (err) return console.log(err)
    surveysDB = client.db('SurveysDB_prod')
    var httpServer = http.createServer(app);
    console.log("test")
    httpServer.listen(PORT, () => console.log(`API running on port ${PORT}`));
})