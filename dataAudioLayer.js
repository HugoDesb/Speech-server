
var express = require('express');
var path = require('path');
var uuidv4 = require("uuid/v4");
var random = require('mongoose-simple-random');
 
//var generator = require('generate-password');

var bodyParser = require('body-parser');

var app = express();

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


mongoose.connect('mongodb://devUser:bla1bla1@ds151461.mlab.com:51461/speech-server-polytech', function (err) {
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
    geo_lattitude: String,
    geo_longitude: String,
    language: {
        type: String,
        enum: ["Afar","Abkhazian","Avestan","Afrikaans","Akan","Amharic","Aragonese","Arabic","Assamese","Avaric","Aymara","Azerbaijani","Bashkir","Belarusian","Bulgarian","Bihari languages","Bislama","Bambara","Bengali","Tibetan","Breton","Bosnian","Catalan; Valencian","Chechen","Chamorro","Corsican","Cree","Czech","Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic","Chuvash","Welsh","Danish","German","Divehi; Dhivehi; Maldivian","Dzongkha","Ewe","Greek, Modern (1453-)","English","Esperanto","Spanish; Castilian","Estonian","Basque","Persian","Fulah","Finnish","Fijian","Faroese","French","Western Frisian","Irish","Gaelic; Scottish Gaelic","Galician","Guarani","Gujarati","Manx","Hausa","Hebrew","Hindi","Hiri Motu","Croatian","Haitian; Haitian Creole","Hungarian","Armenian","Herero","Interlingua (International Auxiliary Language Association)","Indonesian","Interlingue; Occidental","Igbo","Sichuan Yi; Nuosu","Inupiaq","Ido","Icelandic","Italian","Inuktitut","Japanese","Javanese","Georgian","Kongo","Kikuyu; Gikuyu","Kuanyama; Kwanyama","Kazakh","Kalaallisut; Greenlandic","Central Khmer","Kannada","Korean","Kanuri","Kashmiri","Kurdish","Komi","Cornish","Kirghiz; Kyrgyz","Latin","Luxembourgish; Letzeburgesch","Ganda","Limburgan; Limburger; Limburgish","Lingala","Lao","Lithuanian","Luba-Katanga","Latvian","Malagasy","Marshallese","Maori","Macedonian","Malayalam","Mongolian","Marathi","Malay","Maltese","Burmese","Nauru","BokmÃ¥l, Norwegian; Norwegian BokmÃ¥l","Ndebele, North; North Ndebele","Nepali","Ndonga","Dutch; Flemish","Norwegian Nynorsk; Nynorsk, Norwegian","Norwegian","Ndebele, South; South Ndebele","Navajo; Navaho","Chichewa; Chewa; Nyanja","Occitan (post 1500); ProvenÃ§al","Ojibwa","Oromo","Oriya","Ossetian; Ossetic","Panjabi; Punjabi","Pali","Polish","Pushto; Pashto","Portuguese","Quechua","Romansh","Rundi","Romanian; Moldavian; Moldovan","Russian","Kinyarwanda","Sanskrit","Sardinian","Sindhi","Northern Sami","Sango","Sinhala; Sinhalese","Slovak","Slovenian","Samoan","Shona","Somali","Albanian","Serbian","Swati","Sotho, Southern","Sundanese","Swedish","Swahili","Tamil","Telugu","Tajik","Thai","Tigrinya","Turkmen","Tagalog","Tswana","Tonga (Tonga Islands)","Turkish","Tsonga","Tatar","Twi","Tahitian","Uighur; Uyghur","Ukrainian","Urdu","Uzbek","Venda","Vietnamese","VolapÃ¼k","Walloon","Wolof","Xhosa","Yiddish","Yoruba","Zhuang; Chuang","Chinese","Zulu"],
    },
    duration:Number
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
     * @param {String} language 
     * @param {CallableFunction} cb 
     */
    addSample : function(filename, text, age, gender, geo_lattitude, geo_longitude,language,duration, cb){
        var sampleToAdd = new SampleModel({
            filename:filename,
            text:text,
            up_votes: 0,
            down_votes: 0,
            gender:gender,
            age:age,
            geo_lattitude:geo_lattitude,
            geo_longitude: geo_longitude,
            language: language,
            duration: duration
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

    /**
     * Send *NbrDoc* samples for the specified *language*  
     * @param {Number} NbrDoc Number of samples
     * @param {String} language Default : English
     * @param {CallableFunction} cb Callback
     */
    getSamples : function(NbrDoc, language, cb){
        if(language == null){
            language = "English"
        }
        // Parameters match parameters for "find"
        SampleModel.findRandom({"language": language}, {}, {limit: NbrDoc}, function(err, results) {
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