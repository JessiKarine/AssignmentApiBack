let Prof = require("../model/prof");

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
    console.log(profId)
    Prof.findOne({ _id: profId }, (err, prof) => {
      if (err) {
        res.send(err);
      }
      res.json(prof);
    });
  }
  

  // Ajout d'un Prof (POST)
function postProf(req, res) {
    let prof = new Prof();
    prof.id = req.body.id;
    prof.nom = req.body.nom;
    prof.prenom = req.body.prenom;
    prof.image = req.body.image;
  
    console.log("POST prof reçu :");
    console.log(prof);
  
    prof.save((err) => {
      if (err) {
        res.send("cant post prof ", err);
      }
      res.json({ message: `${prof.nom} saved!` });
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
  