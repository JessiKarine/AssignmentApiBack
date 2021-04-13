const { ObjectId } = require('bson');
let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let UserSchema = Schema({
    _id : ObjectId,
    isAdmin : Boolean , 
    nom : String ,
    prenom : String , 
    image : String  , 
    username : String , 
    password : String

});

UserSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('User',UserSchema);
