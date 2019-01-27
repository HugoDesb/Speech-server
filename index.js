var express = require('express');
var path = require('path');
const ffmpeg = require('fluent-ffmpeg');
var uuidv4 = require("uuid/v4");
const fileUpload = require('express-fileupload');
var fs = require('fs');
//var generator = require('generate-password');


var bodyParser = require('body-parser');

var dataUserLayer = require('./dataUserLayer.js')
var dataAudioLayer = require('./dataAudioLayer.js');

var app = express();
var port = 8095;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit:'50mb'}));
app.use(bodyParser.raw({type: 'audio/wav', limit:'50mb'}));
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }))



app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    //Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    //Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-requested-with,content-type");

    next();

});


/***
 * =====================================================================================
 * 
 *                                  USER SILO
 * 
 * =====================================================================================
 */

/**
 * ---------------------------------------------------- POST
 * 
 * Create user
 * 
 */
app.post('/api/users/', function(req,res){

    if(!req.body.username || !req.body.password || !req.body.gender || !req.body.age){
        res.send({
            success:false,
            error:{name : 'ONE_OR_MORE_FIELD_IS_EMPTY'}
        });
    }else{
        dataUserLayer.addAccount(req.body.username, req.body.password, req.body.gender, req.body.age, function(ret){
            res.send(ret);
        });
    }
}); 

/**
 * ---------------------------------------------------- POST
 * 
 * FIND ACCOUNT
 * 
 * Renvoie l'id
 */
app.post('/api/connect/', function (req, res) {
    if(!req.body.username || !req.body.password){
        res.send({
            success:false,
            error:{name : 'ONE_OR_MORE_FIELD_IS_EMPTY'}
        });
    }else{
        dataUserLayer.findAccount(req.body.username, req.body.password, function(ret){
            res.send(ret);
        });
    }
});



/***
 * =====================================================================================
 * 
 *                                  SAMPLE SILO
 * 
 * =====================================================================================
 */

/**
 * VOTE FOR A SAMPLE
 * 
 * Si le paramètre body "vote" >=1 --> UPVOTE sinon DOWNVOTE
 */
app.put('/api/sample/:audio_id', function(req,res){

    if(!req.params.audio_id, !req.body.vote){
        res.send({
            success:false,
            error:{
                name :'ONE_OR_MORE_FIELD_IS_MISSING'
            }
        });
    }else{
        if(req.body.vote >= 1){
            dataAudioLayer.upVote(req.params.audio_id, function(ret){
                res.send(ret);
            })
        }else{
            dataAudioLayer.downVote(req.params.audio_id, function(ret){
                res.send(ret);
            })
        }
    }
}); 


/**
 * INSERT A NEW SAMPLE
 * 
 * Expected res.body format 
 * {text, geo_lattitude, geo_longitude, user_id}
 */
app.post('/api/sample/', function(req, res){
    //console.dir(req.files);
    if(!req.files.sample){
        res.send({
            success:false,
            error:{
                name :'SAMPLE_NOT_FOUND'
            }
        });
    }else if(!req.body.text || !req.body.geo_lattitude || !req.body.geo_longitude || !req.body.user_id){
        res.send({
            success:false,
            error:{
                name :'MISSING_BODY_PARAMETERS'
            }
        });
    }else{
        // Get the temporary location of the file
        var tmp_path = req.files.sample.path;
        // Set where the file should actually exists - in this case it is in the "audio" directory.
        var filename = 'sample-' + uuidv4() + '.mp3'
        target_path = './audio/' + filename;

        req.files.sample.mv('./audio/' + filename , function(err) {
            if(err){
                throw err;
            }else{
                dataUserLayer.getGenderAndAge(req.body.user_id, function(ret1){
                    if(ret1.success){
                        var geo = {
                            lattitude : req.body.geo_lattitude,
                            longitude : req.body.geo_longitude,
                        }
                        dataAudioLayer.addSample(filename, req.body.text, req.body.age, req.body.gender, geo, function(ret){
                            if(ret.success){
                                //Enlever la phrase du dico de référence
                            }
                            res.send(ret);
                        });
                    }else{
                        res.send({
                            success:false,
                            error:{
                                name :'USER_NOT_FOUND',
                                info: ret1
                            }
                        });
                    }
                })
            }
    
       });
       /*
    
        // copy the file to a new location
        fs.rename(tmp_path, target_path, function (err) {
            if (err) throw err;
            // you may respond with another html page
            
            //res.write('File uploaded and moved!');
            //res.end();
        });

        /*
        ffmpeg(tmp_path)
        .toFormat('mp3')
        .on('error', (err) => {
            res.send({
                success:false,
                error:{
                    name :'ERROR_WHILE_CONVERTING_FILE_TO_MP3',
                    info: err
                }
            });
        })
        .on('progress', (progress) => {
            console.log('Processing: ' + progress.targetSize + ' KB converted');
        })
        .on('end', () => {
            
        })
        .save(target_path);//path where you want to save your file
        */
    }
})

/**
 * 
 */
app.get('/api/sample/:samples_number', function(req, res){
    if(!req.params.samples_number){
        res.send({
            success:false,
            error:{
                name :'SAMPLES_NUMBER_IS_MISSING'
            }
        });
    }else{
        dataAudioLayer.getSamples(req.params.samples_number, function(ret){
            res.send(ret);
        });
    }
})


////////////////
console.log("Server started port 8095");
app.listen(port);