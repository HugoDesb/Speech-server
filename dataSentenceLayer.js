
var express = require('express');
var path = require('path');
var uuidv4 = require("uuid/v4");
var random = require('mongoose-simple-random');


var bodyParser = require('body-parser');

var app = express();
var port = 8190;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));   


app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    //Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");

    //Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-requested-with,content-type");

    next();

});

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//for generate GUID
var uuidv4 = require("uuid/v4");


mongoose.connect('mongodb://localhost/speech', function (err) {
    if(err){
        throw err;
    }else{
        console.log('mongo connected');
    }
});

//declare schema USER
var SentenceSchema = Schema({
    text: String
});
SentenceSchema.plugin(random); // plugin for retreiving documents randomly

//Init model
var SentenceModel = mongoose.model('sentences', SentenceSchema);


module.exports = {

    // GET A RANDOM Sentence
    getSentences : function(NbrDoc, cb){
        // Parameters match parameters for "find"
        SentenceModel.findRandom({}, {}, {limit: NbrDoc}, function(err, results) {
            if (err) {
                throw err;
            }else if(!results  || results.length < NbrDoc){
                cb({
                    success : true,
                    error : {
                        name : 'NOT_ENOUGH_SENTENCES'
                    }
                })
            }else{
                cb({
                    success : true,
                    data : results
                })
            }
        });
    },


};