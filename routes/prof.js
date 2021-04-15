let Prof = require("../model/prof");
const { mongo } = require("mongoose");
const ObjectId = mongo.ObjectID;

function getProfs(req, res) {
    var aggregateQuery = Prof.aggregate();
    
    Prof.aggregatePaginate(
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
  
  // Récupérer un prof par son id (GET)
  function getProf(req, res) {
    let profId = req.params.id;
    Prof.findOne({ _id: profId }, (err, prof) => {
      if (err) {
        res.send(err);
      }
      res.json(prof);
    });
  }
  
  async function countProf(){
    return Prof.countDocuments((err,count)=> { 
       return count;
     });
 }
  // Ajout d'un Prof (POST)
  async function postProf(req, res) {
    let prof = new Prof();
    prof._id = new ObjectId(await countProf());
    prof.nom = req.body.nom;
    prof.prenom = req.body.prenom;
    prof.image = req.body.image;
  
    console.log("POST prof reçu :");
    console.log(prof);
  
    prof.save((err) => {
      if (err) {
        console.log(err)
        res.send({error : "cant post prof "});
      }
      else{
      res.json({ message: `${prof.nom} saved!` });
      }
    });
  }
  
  // Update d'un prof (PUT)
  function updateProf(req, res) {
    console.log("UPDATE recu Prof : ");
    console.log(req.body);
    Prof.findByIdAndUpdate(
      req.body._id,
      req.body,
      { new: true },
      (err, prof) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.json({ message: "updated" });
        }
  
        // console.log('updated ', prof)
      }
    );
  }
  
  // suppression d'un Prof (DELETE)
  function deleteProf(req, res) {
    Prof.findByIdAndRemove(req.params.id, (err, prof) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: `${prof.nom} deleted` });
    });
  }

  
  
  module.exports = {
    getProfs,
    postProf,
    getProf,
    updateProf,
    deleteProf,
  };
  