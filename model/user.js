const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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

//model allows CRUD operations on the collections
const userModel = mongoose.model('user', userSchema);

//export the object of the model
module.exports = userModel;