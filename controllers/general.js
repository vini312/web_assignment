const express = require('express');
const router = express.Router();
//import the model to be able to use database
const productModel = require("../model/product");

//import the fake database
const DBs = require("../model/DBs");

//get a request from http to the server to the root page
router.get("/",(req,res)=>{

    productModel.find({bestSeller:true})
    .then(bestSellers=>{
        //filter the information necessary
        const bestSellerDB = bestSellers.map(bestSeller=>{
            return {
                name: bestSeller.name,
                image: bestSeller.image,
                price: bestSeller.price,
                category: bestSeller.category,
                bestSeller: bestSeller.bestSeller,
                quantity: bestSeller.quantity,
                description: bestSeller.description
            }
        });
        // as a response obj argument, render the file home.handlebars
        res.render("general/home",{
            title: "Home Page",
            catDB: DBs,
            bestDB: bestSellerDB
        });
    })
    .catch(err=>console.log(`Error when finding from database ${err}`))
});

router.get("/userProdList",(req,res)=>{
    if(req.session.products == null || req.session.products == ''){
        res.render("general/userProdList",{
            title: "Your products",
            empty: 1
        });
    }
    else{
        productModel.find({_id: req.session.products})
        .then(products=>{
            //filter the information necessary
            const prodList = products.map(product=>{
                return {
                    _id:product._id,
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    category: product.category,
                    bestSeller: product.bestSeller,
                    quantity: product.quantity,
                    description: product.description
                }
            });
            
            // as a response obj argument, render the file products.handlebars
            res.render("general/userProdList",{
                title: "Your products",
                prodList
            });
        })
        .catch(err=>console.log(`Error when finding from database ${err}`))
    }
});

module.exports = router;