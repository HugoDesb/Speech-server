//declaration
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//for generate GUID
var uuidv4 = require("uuid/v4");

//hop

mongoose.connect('mongodb://devUser:bla1bla1@ds151461.mlab.com:51461/speech-server-polytech', function (err) {
    if(err){
        throw err;
    }else{
        console.log('mongo connected');
    }
});

var UserSchema = Schema({
    username: {type: String, unique:true},
    password : String,
    gender:{
        type: String,
        enum: ['M', 'F']
    },
    age:Number,
    language: {
        type: String,
        enum: ["Afar","Abkhazian","Avestan","Afrikaans","Akan","Amharic","Aragonese","Arabic","Assamese","Avaric","Aymara","Azerbaijani","Bashkir","Belarusian","Bulgarian","Bihari languages","Bislama","Bambara","Bengali","Tibetan","Breton","Bosnian","Catalan; Valencian","Chechen","Chamorro","Corsican","Cree","Czech","Church Slavic; Old Slavonic; Church Slavonic; Old Bulgarian; Old Church Slavonic","Chuvash","Welsh","Danish","German","Divehi; Dhivehi; Maldivian","Dzongkha","Ewe","Greek, Modern (1453-)","English","Esperanto","Spanish; Castilian","Estonian","Basque","Persian","Fulah","Finnish","Fijian","Faroese","French","Western Frisian","Irish","Gaelic; Scottish Gaelic","Galician","Guarani","Gujarati","Manx","Hausa","Hebrew","Hindi","Hiri Motu","Croatian","Haitian; Haitian Creole","Hungarian","Armenian","Herero","Interlingua (International Auxiliary Language Association)","Indonesian","Interlingue; Occidental","Igbo","Sichuan Yi; Nuosu","Inupiaq","Ido","Icelandic","Italian","Inuktitut","Japanese","Javanese","Georgian","Kongo","Kikuyu; Gikuyu","Kuanyama; Kwanyama","Kazakh","Kalaallisut; Greenlandic","Central Khmer","Kannada","Korean","Kanuri","Kashmiri","Kurdish","Komi","Cornish","Kirghiz; Kyrgyz","Latin","Luxembourgish; Letzeburgesch","Ganda","Limburgan; Limburger; Limburgish","Lingala","Lao","Lithuanian","Luba-Katanga","Latvian","Malagasy","Marshallese","Maori","Macedonian","Malayalam","Mongolian","Marathi","Malay","Maltese","Burmese","Nauru","BokmÃ¥l, Norwegian; Norwegian BokmÃ¥l","Ndebele, North; North Ndebele","Nepali","Ndonga","Dutch; Flemish","Norwegian Nynorsk; Nynorsk, Norwegian","Norwegian","Ndebele, South; South Ndebele","Navajo; Navaho","Chichewa; Chewa; Nyanja","Occitan (post 1500); ProvenÃ§al","Ojibwa","Oromo","Oriya","Ossetian; Ossetic","Panjabi; Punjabi","Pali","Polish","Pushto; Pashto","Portuguese","Quechua","Romansh","Rundi","Romanian; Moldavian; Moldovan","Russian","Kinyarwanda","Sanskrit","Sardinian","Sindhi","Northern Sami","Sango","Sinhala; Sinhalese","Slovak","Slovenian","Samoan","Shona","Somali","Albanian","Serbian","Swati","Sotho, Southern","Sundanese","Swedish","Swahili","Tamil","Telugu","Tajik","Thai","Tigrinya","Turkmen","Tagalog","Tswana","Tonga (Tonga Islands)","Turkish","Tsonga","Tatar","Twi","Tahitian","Uighur; Uyghur","Ukrainian","Urdu","Uzbek","Venda","Vietnamese","VolapÃ¼k","Walloon","Wolof","Xhosa","Yiddish","Yoruba","Zhuang; Chuang","Chinese","Zulu"],
    }
});

//Init model
var UserModel = mongoose.model('users', UserSchema);

module.exports = {

    /**
     * Adds a user in the database
     * @param {String} username 
     * @param {String} password 
     * @param {String} gender 
     * @param {Number} age 
     * @param {CallableFunction} cb 
     */
    addAccount: function(username, password, gender, age, language, cb){
        var userToAdd = new UserModel({
            username:username,
            password:password,
            gender:gender,
            age:age,
            language:language
        });
        userToAdd.save(function(err){
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
     * Obtient l'utilisateur d'après le userame et mpd 
     * @param {String} username 
     * @param {String} password 
     * @param {CallableFunction} cb 
     */
    findAccount: function(username, password, cb){
        var userToFind = {
            username: username,
            password: password
        };
        UserModel.findOne(userToFind, function (err, userSet) {
            if(err){
                throw err;
            }else{
                if(userSet == null){
                    cb({
                        success:false,
                        error : {
                            name : 'USER_NOT_FOUND',
                            info:userSet
                        }
                    });
                }else {
                    cb({
                        success : true,
                        data : {
                            user_id : userSet._id
                        }
                    })
                }
            }
        });
    },

    /**
     * 
     * @param {*} user_id 
     * @param {*} cb 
     */
    getGenderAgeAndLanguage: function(user_id, cb){
        UserModel.findById(user_id,'gender age language', function(err, ret){
            if(err){
                throw err;
            }else{
                cb({
                    success: true,
                    data : ret
                })
            }
        });
    }
};