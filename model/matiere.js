const { ObjectId } = require('bson');
let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let MatiereSchema = Schema({
    _id : ObjectId,
    image: String,
    nom: String,
    imageProf : String
});

MatiereSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports.Matiere = MatiereSchema;
module.exports.MatiereSchema = mongoose.model('matiere',MatiereSchema,'Matiere');

