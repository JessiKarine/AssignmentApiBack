const { ObjectId } = require('bson');
let mongoose = require('mongoose');
const Matiere = require ('./matiere'); //mila importena rehefa anao reference amina objet
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");

let Schema = mongoose.Schema;

let AssignmentSchema = Schema({
    _id: ObjectId,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean,
    auteur : String,
    note : Number,
    remarques : String,
    matiere : { type : Schema.ObjectId , ref : 'Matiere'}
});

AssignmentSchema.plugin(aggregatePaginate);


// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);