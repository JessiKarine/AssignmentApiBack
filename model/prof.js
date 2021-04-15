const { ObjectId } = require('bson');
let mongoose = require('mongoose');
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Matiere = require('./matiere');

let Schema = mongoose.Schema;

let ProfSchema = Schema({
    _id : ObjectId,
    nom: String,
    prenom : String,
    image: String
    
});

ProfSchema.plugin(aggregatePaginate);

ProfSchema.pre('remove',function(next){ 
    Matiere.remove({prof : this._id}).exec();
    next();
});

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Prof',ProfSchema);

