const { ObjectId } = require('bson');
let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let ProfSchema = Schema({
    _id : ObjectId,
    nom: String,
    image: String
    
});

ProfSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports.Prof = ProfSchema;
module.exports.ProfSchema = mongoose.model('profs',ProfSchema,'Prof');

