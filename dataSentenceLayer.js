
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
    text: String,
    language: {
        type: String,
        enum: ["Afar","Abkhazian","Avestan","Afrikaans","Akan","Amharic","Aragonese","Arabic","Assamese","Avaric","Aymara","Azerbaijani","Bashkir","Belarusian","Bulgarian","Bihari languages","Bislama","Bambara","Bengali","Tibetan","Breton","Bosnian","Catalan; Valencian","Chechen","Chamorro","Corsican","Cree","Czech","Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic","Chuvash","Welsh","Danish","German","Divehi; Dhivehi; Maldivian","Dzongkha","Ewe","Greek, Modern (1453-)","English","Esperanto","Spanish; Castilian","Estonian","Basque","Persian","Fulah","Finnish","Fijian","Faroese","French","Western Frisian","Irish","Gaelic; Scottish Gaelic","Galician","Guarani","Gujarati","Manx","Hausa","Hebrew","Hindi","Hiri Motu","Croatian","Haitian; Haitian Creole","Hungarian","Armenian","Herero","Interlingua (International Auxiliary Language Association)","Indonesian","Interlingue; Occidental","Igbo","Sichuan Yi; Nuosu","Inupiaq","Ido","Icelandic","Italian","Inuktitut","Japanese","Javanese","Georgian","Kongo","Kikuyu; Gikuyu","Kuanyama; Kwanyama","Kazakh","Kalaallisut; Greenlandic","Central Khmer","Kannada","Korean","Kanuri","Kashmiri","Kurdish","Komi","Cornish","Kirghiz; Kyrgyz","Latin","Luxembourgish; Letzeburgesch","Ganda","Limburgan; Limburger; Limburgish","Lingala","Lao","Lithuanian","Luba-Katanga","Latvian","Malagasy","Marshallese","Maori","Macedonian","Malayalam","Mongolian","Marathi","Malay","Maltese","Burmese","Nauru","BokmÃ¥l, Norwegian; Norwegian BokmÃ¥l","Ndebele, North; North Ndebele","Nepali","Ndonga","Dutch; Flemish","Norwegian Nynorsk; Nynorsk, Norwegian","Norwegian","Ndebele, South; South Ndebele","Navajo; Navaho","Chichewa; Chewa; Nyanja","Occitan (post 1500); ProvenÃ§al","Ojibwa","Oromo","Oriya","Ossetian; Ossetic","Panjabi; Punjabi","Pali","Polish","Pushto; Pashto","Portuguese","Quechua","Romansh","Rundi","Romanian; Moldavian; Moldovan","Russian","Kinyarwanda","Sanskrit","Sardinian","Sindhi","Northern Sami","Sango","Sinhala; Sinhalese","Slovak","Slovenian","Samoan","Shona","Somali","Albanian","Serbian","Swati","Sotho, Southern","Sundanese","Swedish","Swahili","Tamil","Telugu","Tajik","Thai","Tigrinya","Turkmen","Tagalog","Tswana","Tonga (Tonga Islands)","Turkish","Tsonga","Tatar","Twi","Tahitian","Uighur; Uyghur","Ukrainian","Urdu","Uzbek","Venda","Vietnamese","VolapÃ¼k","Walloon","Wolof","Xhosa","Yiddish","Yoruba","Zhuang; Chuang","Chinese","Zulu"],
    }
});
SentenceSchema.plugin(random); // plugin for retreiving documents randomly

//Init model
var SentenceModel = mongoose.model('sentences', SentenceSchema);


module.exports = {

    /**
     * Renvoie *NbrDoc* phrases de la langue *language*
     * @param {Number} NbrDoc Number of sentences
     * @param {String} language The asked language
     * @param {CallableFunction} cb Callback
     */
    getSentences : function(NbrDoc, language, cb){
        // Parameters match parameters for "find"
        SentenceModel.findRandom({"language": language}, {}, {limit: NbrDoc}, function(err, results) {
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