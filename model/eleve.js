const { ObjectId } = require('bson');
let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let EleveSchema = Schema({
    nom: String
});

EleveSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports.Eleve = EleveSchema;
module.exports.EleveSchema = mongoose.model('Eleve',EleveSchema);

