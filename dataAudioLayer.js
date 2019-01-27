
var express = require('express');
var path = require('path');
var uuidv4 = require("uuid/v4");
var random = require('mongoose-simple-random');
 
//var generator = require('generate-password');

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
var SampleSchema = Schema({
    filename: {type: String, unique:true},
    text: String,
    up_votes : Number,
    down_votes: Number,
    age: Number,
    gender:{
        type: String,
        enum: ['M', 'F']
    },
    geo: {
        lattitude : String,
        longitude : String
    }
});
SampleSchema.plugin(random); // plugin for retreiving documents randomly

//Init model
var SampleModel = mongoose.model('samples', SampleSchema);


module.exports = {
    /**
     * Add an UP vote to the specified sample
     * @param {String} audio_id 
     * @param {CallableFunction} cb 
     */
    upVote: function(audio_id,cb){
        SampleModel.updateOne({"_id": audio_id}, {$inc :{"up_votes":1}},function(err, res){
            if(err){
                throw err;
            }else if(res.nModified != 1){
                cb({
                    success : false,
                    error : {
                        name : "AUDIO_NOT_FOUND",
                        info : res
                    }
                });
            }else{
                cb({
                    success : true,
                    data : res
                });
            }
        })
    },

    /**
     * Add a DOWN vote to the specified sample
     * @param {String} audio_id 
     * @param {CallableFunction} cb 
     */
    downVote: function(audio_id,cb){
        SampleModel.updateOne({"_id": audio_id}, {$inc :{"down_votes":1}},function(err, res){
            if(err){
                throw err;
            }else if(res.nModified != 1){
                cb({
                    success : false,
                    error : {
                        name : "AUDIO_NOT_FOUND",
                        info : res
                    }
                });
            }else{
                cb({
                    success : true,
                    data : res
                });
            }
        })
    },

    /**
     * Ajoute un sample 
     * @param {String} filename 
     * @param {Strig} text 
     * @param {Number} age 
     * @param {String} gender 
     * @param {CallableFunction} cb 
     */
    addSample : function(filename, text, age, gender, geo_lattitude, geo_longitude, cb){
        var sampleToAdd = new SampleModel({
            filename:filename,
            text:text,
            up_votes: 0,
            down_votes: 0,
            gender:gender,
            age:age,
            geo_lattitude:String,
            geo_longitude: String
        });
        sampleToAdd.save(function(err){
            if(err){
                cb({success: false,
                    error : {
                        name: "UKNOWN",
                        info: err
                    }
                });
            }else{
                cb({success: true});
            }
        });
    },

    // GET X RANDOM FILES
    getSamples : function(NbrDoc, cb){
        // Parameters match parameters for "find"
        SampleModel.findRandom({}, {}, {limit: NbrDoc}, function(err, results) {
            if (err) {
                throw err;
            }else if(!results  || results.length < NbrDoc){
                cb({
                    success : true,
                    error : {
                        name : 'NOT_ENOUGH_SAMPLES'
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