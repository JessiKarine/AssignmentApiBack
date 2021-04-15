let connection = null;

let Matiere = require("../model/matiere");

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
    let profId = req.params.id;
    Prof.findOne({ _id: profId },(err , prof) => { 
      if (err) {
        console.log(err);
        res.send(err);
      }
      res.json(prof);
    }).populate('prof'); // rehefa populate() : ny premier parametre = ilay column foreign ho soloina valeur , ny ambiny parametre dia ny colonne sélectionnena ao amlé valeur
  
  }

  module.exports = {
    setConnection,
    getMatieres,
   // postAssignment,
    getMatiere,
    //updateAssignment,
    //deleteAssignment,
  };