const { ObjectId } = require('bson');
let mongoose = require('mongoose');
const Prof = require('./prof'); 
var aggregatePaginate = require("mongoose-aggregate-paginate-v2");
const Assignment = require('./assignment');

let Schema = mongoose.Schema;

let MatiereSchema = Schema({
    _id : ObjectId,
    image: String,
    nom: String,
    prof : {type : Schema.ObjectId , ref : 'Prof'}
});

MatiereSchema.plugin(aggregatePaginate);

MatiereSchema.pre('remove',function(next){ 
    Assignment.remove({matiere : this._id}).exec();
    next();
});
// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Matiere',MatiereSchema);

