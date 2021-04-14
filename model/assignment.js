const { ObjectId } = require('bson');
let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
let { Matiere }  = require('./matiere');
let  Prof   = require('./prof');
let { Eleve }  = require('./eleve');

let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    _id : ObjectId,
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    eleve : Eleve,
    note : Number,
    remarques : String,
    matiere : Matiere,
    prof : {type : Schema.Types.ObjectId , ref : 'prof'}
});

AssignmentSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('assignment', AssignmentSchema,'assignment');
