const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//import bcrypt to be able to encypt password
const bcrypt = require("bcryptjs");

//create the schema for this document
const userSchema = new Schema({
  name:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true
  },

  password:{
    type:String,
    required:true
  },

  dateCreated:{
    type:Date,
    default:Date.now()
  }
});

//to use bcryptjs on model file instead of register controller
userSchema.pre("save",function(next){
  //random generated characters (10) is the level
  bcrypt.genSalt(10)
  .then((salt)=>{
    //encrypting the password with the salt
    bcrypt.hash(this.password, salt)
    .then((encryptedPassword)=>{
      this.password = encryptedPassword;
      //to make the program continue we call next
      next();
    })
    .catch(err=>console.log(`Error during the hashing: ${err}`));
  })
  .catch(err=>console.log(`Error during the salting: ${err}`));
})

//model allows CRUD operations on the collections
const userModel = mongoose.model('user', userSchema);

//export the object of the model
module.exports = userModel;