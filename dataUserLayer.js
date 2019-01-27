//declaration
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

var UserSchema = Schema({
    username: {type: String, unique:true},
    password : String,
    gender:{
        type: String,
        enum: ['M', 'F']
    },
    age:Number
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
    addAccount: function(username, password, gender, age, cb){
        var userToAdd = new UserModel({
            username:username,
            password:password,
            gender:gender,
            age:age
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
    getGenderAndAge: function(user_id, cb){
        UserModel.findById(user_id,'gender age', function(err, ret){
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