let connection = null;

let Matiere = require("../model/matiere");
const prof = require("../model/prof");
const { mongo } = require("mongoose");
const ObjectId = mongo.ObjectID;

function setConnection(connect) { 
    connection = connect;
  }
  // Récupérer tous les profs (GET), AVEC PAGINATION
  function getMatieres(req, res) {
    var aggregateQuery = Matiere.aggregate([
      {
        $unwind : '$prof' // destructurer le tableau venant des documents ,, nom du colonne
      },
      {
        $lookup : {
            from : 'profs', // nom du table avec 's' parce que c'est généré automatiquement par le cloudATlas (mongodb)
            localField : 'prof',
            foreignField : '_id' , 
            as : 'prof'
        } 
      },
      {
        $project : { //mi filtrer colonne rehefa amoka resultat 1 ba 0 no miasa
          "_id" : 1,
          "nom" : 1,
          prof : { 
            $arrayElemAt : ["$prof",0],
          }
        }
      }
    ]);
    
    Matiere.aggregatePaginate(
      aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, profs) => {
        if (err) {
          res.send(err);
        }
        res.send(profs);
      }
    );
  }

  function getMatiere(req, res) {
    let matiereId = req.params.id;
    Matiere.findOne({ _id: matiereId },(err , prof) => { 
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json(prof);
    }).populate('prof'); // rehefa populate() : ny premier parametre = ilay column foreign ho soloina valeur , ny ambiny parametre dia ny colonne sélectionnena ao amlé valeur
  
  }

  function updateMatiere(req, res) {
    console.log("UPDATE recu matiere : ");
    console.log(req.body);
    Matiere.findByIdAndUpdate(
      req.body._id,
      req.body,
      { new: true },
      (err, matiere) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.json({ message: "updated" });
        }
  
        // console.log('updated ', assignment)
      }
    );
  }
  async function countMatiere(){
    return Matiere.countDocuments((err,count)=> { 
       return count;
     });
 }
 async function postMatiere(req, res) {
   console.log("requet : "+req.body.prof._id)
    let matiere = new Matiere();
    matiere._id = new ObjectId(await countMatiere());
    matiere.nom = req.body.nom;
    matiere.prof = {
      _id :  req.body.prof._id
    };
   
    matiere.image = req.body.image;
  
    console.log("POST matiere reçu :");
    console.log(matiere);
  
    matiere.save((err) => {
      if (err) {
        res.status(500).send({error :"cant post matiere : "});
      }
      else { 
        res.json({ message: `${matiere.nom} saved!` });
      }
    });
  }

  function deleteMatiere(req, res) {
    Matiere.findByIdAndRemove(req.params.id, (err, matiere) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: `${matiere.nom} deleted` });
    });
  }
  

  module.exports = {
    setConnection,
    getMatieres,
    postMatiere,
    getMatiere,
    updateMatiere,
    deleteMatiere,
  };