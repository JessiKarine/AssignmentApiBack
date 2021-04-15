// Assignment est le "modèle mongoose", il est connecté à la base de données
let connection = null;

let Assignment = require("../model/assignment");
const { mongo } = require("mongoose");
const ObjectId = mongo.ObjectID;

/* Version sans pagination */
// Récupérer tous les assignments (GET)
/*
function getAssignments(req, res){
    Assignment.find((err, assignments) => {
        if(err){
            res.send(err)
        }

        res.send(assignments);
    });
}
*/
function setConnection(connect) { 
  connection = connect;
}
// Récupérer tous les assignments (GET), AVEC PAGINATION
function getAssignments(req, res) {
  var aggregateQuery = Assignment.aggregate([
    {
      $unwind : '$matiere' // destructurer le tableau venant des documents ,, nom du colonne
    },
    {
      $lookup : {
          from : 'matieres', // nom du table avec 's' parce que c'est généré automatiquement par le cloudATlas (mongodb)
          localField : 'matiere',
          foreignField : '_id' , 
          as : 'matiere'
      } 
    },
    {
      $unwind : '$prof'
    },
    { 
      $lookup : {   // manao jointure amlé collection visena
        from : 'profs' , 
        localField : 'prof', 
        foreignField : '_id',
        as : 'prof'
      }
    },
    {
      $project : { //mi filtrer colonne rehefa amoka resultat 1 ba 0 no miasa
        "_id" : 1,
        "dateDeRendu" : 1,
        "nom": 1, 
        "rendu" : 1,
        "eleve" :1 ,
        "note" : 1,
        "remarques" :1 ,
        matiere : { 
          $arrayElemAt : ["$matiere",0],
        },
        prof : { 
          $arrayElemAt : ["$prof",0]
        }
      }
    }
  ]);
  
  Assignment.aggregatePaginate(
    aggregateQuery,
    {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
    },
    (err, assignments) => {
      if (err) {
        res.send(err);
      }
      res.send(assignments);
    }
  );
}

// Récupérer un assignment par son id (GET)
/* 
  populate : 
    premier parametre : nom du colonne a remplacer par l'objet
    reste du paramter : choix des attribut de l'objet a afficher
*/
function getAssignment(req, res) {
  let assignmentId = req.params.id;
  Assignment.findOne({ _id: assignmentId },(err , assignment) => { 
    if (err) {
      console.log(err);
      res.send(err);
    }
    res.json(assignment);
  }).populate("matiere").populate('prof'); // rehefa populate() : ny premier parametre = ilay column foreign ho soloina valeur , ny ambiny parametre dia ny colonne sélectionnena ao amlé valeur

}

async function countAssignment(){
  return Assignment.countDocuments((err,count)=> { 
     return count;
   });
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
  console.log("HEllo");
  let assignment = new Assignment();
  assignment._id = new ObjectId(await countAssignment());
  assignment.id = req.body.id;
  assignment.nom = req.body.nom;
  assignment.dateDeRendu = req.body.dateDeRendu;
  assignment.rendu = req.body.rendu;
  assignment.note = req.body.note;
  assignment.matiere = req.body.matiere;
  assignment.prof = req.body.prof;
  assignment.remarques = req.body.remarques;
  assignment.eleve = req.body.eleve;

  console.log("POST assignment reçu :");
  console.log(assignment);

  assignment.save((err) => {
    if (err) {
      console.log(err)
      res.send({error : "cant post assignment "});
    }
    else{
    res.json({ message: `${assignment.nom} saved!` });
    }
  });
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
  console.log("UPDATE recu assignment : ");
  console.log(req.body);
  Assignment.findByIdAndUpdate(
    req.body._id,
    req.body,
    { new: true },
    (err, assignment) => {
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

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {
  Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: `${assignment.nom} deleted` });
  });
}

module.exports = {
  setConnection,
  getAssignments,
  postAssignment,
  getAssignment,
  updateAssignment,
  deleteAssignment,
};
