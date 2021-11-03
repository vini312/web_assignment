const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create the schema for this document
const productSchema = new Schema({
  name:{
    type:String,
    required:true
  },

  image:{
    type:String,
    required:true
  },

  price:{
    type:Number,
    required:true
  },

  category:{
      type:String,
      required:true
  },

  bestSeller:{
      type:Boolean,
      default:false
  },

  quantity:{
      type:Number,
      default:0
  },

  description:{
      type:String,
      required:true
  },

  dateCreated:{
    type:Date,
    default:Date.now()
  },
  type:{
    type:String,
    default:"product"
  }
});


//model allows CRUD operations on the collections
const productModel = mongoose.model('products', productSchema);

//export the object of the model
module.exports = productModel;
