const { ObjectId } = require('bson');
let mongoose = require('mongoose');
const Matiere = require ('./matiere'); //mila importena rehefa anao reference amina objet
const Eleve = require ('./eleve');
const Prof = require ('./prof');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    _id : ObjectId,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    eleve : { type : Schema.ObjectId , ref : 'Eleve'} ,
    note : Number,
    remarques : String,
    matiere : { type : Schema.ObjectId , ref : 'Matiere'},
    prof : { type : Schema.ObjectId , ref : 'Prof'}
});

AssignmentSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);