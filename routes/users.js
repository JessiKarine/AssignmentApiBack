const jwt = require ("jsonwebtoken");
const bcrypt = require ('bcryptjs');
const config = require("../config");
const { mongo } = require("mongoose");
const ObjectId = mongo.ObjectID;
let Users = require ("../model/user");
const user = require("../model/user");


function countByEmail(req , res) { 
  let email = req.body.email;
    if(req.body.email !=null && req.body.email.trim()!==""){
      email = req.body.email;
    }
    else{
      return ; 
    }
    Users.count({ email : email},(err , number)=> { 
        return number;
    })
}
function getUsers(req, res) {
    var aggregateQuery = Users.aggregate();
    
    Users.aggregatePaginate(
      aggregateQuery,
      {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10,
      },
      (err, users) => {
        if (err) {
          res.send(err);
        }
        res.send(users);
      }
    );
}

// for Login , use Post 

async function login(req, res) {
  try{
    const request = { 
        username : null 
    }
    if(req.body.username!== undefined && req.body.username.trim()!=="") {
        request.username = req.body.username;
    }
    else { 
      throw new Error("Nom d'utilisateur non valide");
    }
    const user = await Users.findOne(request); 
    if(user == undefined){ 
      throw new Error ("Utilisateur ou mot de passe non valide");
    }
    let passValid  = false;
    if(req.body.password !== undefined && req.body.password!==""){
      passValid = bcrypt.compareSync(req.body.password , user.password);
    }
    if(!passValid){
        throw new Error(" Utilisateur ou mot de passe non valide");
    }
    const token = jwt.sign({ id : user.id},config.secret, { expiresIn : 86400});
    res.status(200).send({auth : true ,isAdmin : user.isAdmin , token : token});
  }
  catch(e){
      res.send({auth :false , token : null ,error : e.message});
  }
}
async function countUser(){
   return Users.countDocuments((err,count)=> { 
      return count;
    });
}

async function register(req,res){
    try{
        const {username , password , prenom , nom , image , isAdmin} = req.body;
        const id = await countUser();
        const numberUser = await Users.countDocuments({username : username});
        if(numberUser>0){
          throw new Error("user déja existant");
        }
        const hashedPassword = bcrypt.hashSync(password , 8);
        Users.create({
          _id : new ObjectId(id),
          username : username,
          password : hashedPassword , 
          prenom : prenom , 
          nom : nom , 
          image : image,
          isAdmin : isAdmin
        }, (err , user)=>{
            if(err){ 
                console.log(err);
                throw new Error("Il y a  un erreur pour l'enregistrement du nouveau utilisateur");
            }
            let token = jwt.sign({ id : user._id }, config.secret , { expiresIn : 86400});
            res.status(200).send({
              auth : true , 
              token : token , 
              error : null , 
              isAdmin : user.isAdmin
            })
        });
    }
    catch(e){
      res.status(500).send({auth : false , token :null , error : e.message});
    }
}
module.exports = {
   login,
   register
  };
  