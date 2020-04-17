const express = require('express');
const router = express.Router();
//import the model to be able to use database
const productModel = require("../model/product");
//import custom middleware function from isClerk module
const isClerk = require("../middleware/isClerk");
//import custom middleware function from autSession module
const isAthenticated = require("../middleware/autSession");


//import the fake database
const DBs = require("../model/DBs");

router.get("/",(req,res)=>{

    productModel.find()
    .then(products=>{
        //filter the information necessary
        const prodDB = products.map(product=>{
            return {
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
        res.render("products/products",{
            title: "Products",
            prodDB
        });
    })
    .catch(err=>console.log(`Error when finding from database ${err}`))

});

router.get("/addProducts", isAthenticated, isClerk, (req,res)=>{
    res.render("products/addProducts",{
        title:"Add new product",
        catDB:DBs
    });
});

router.post("/addProducts",(req,res)=>{
    
    //destructing
    const {pName, pPrice, pQty, pDesc, pCat, pBestSeller} = req.body;

    //value holder to render the page with the value entered by the user
    let formValues = {
        pName,
        pPrice,
        pQty,
        pDesc,
        //pImage,
        pCat
    };

    //variables to hold the error messages
    let pNameE;
    let pPriceE;
    let pQtyE;
    let pDescE;
    let pImageE;
    let pCatE;
    let errorFlag = false;

    //function to render again the page with error messages
    function redirectError(){
        if(errorFlag)
        {
            res.render("products/addProducts",{
                title:"Add new product",
                catDB:DBs,
                nameError: pNameE,
                priceError: pPriceE,
                qtyError: pQtyE,
                descError: pDescE,
                catError: pCatE,
                imageError: pImageE,
                formValues : formValues
            });
        }
    }

    // validation not using DB data
    if(pName == "")
    {
        pNameE = "! Enter a product name.";
        errorFlag = true;
    }

    if(pPrice == "")
    {
        pPriceE = "! Enter a price.";
        errorFlag = true;
    }

    if (pQty == "")
    {
        pQtyE = "! Enter a quantity.";
        errorFlag = true;  
    }

    if(pDesc == "")
    {
        pDescE = "! Enter a description.";
        errorFlag = true;
    }

    if(!pCat)
    {
        pCatE = "! Choose a category.";
        errorFlag = true;
    }
    if (req.files == null)
    {
        pImageE = "! Select an image.";
        errorFlag = true;  
    } else if (!/image\//.test(req.files.pImage.mimetype)){
        pImageE = "! Only image type file accepted (jpg, png, gif...).";
        errorFlag = true;
    }

    //if there are errors, render again the page with error messages
    if(errorFlag)
    {
        res.render("products/addProducts",{
            title:"Add new product",
            catDB:DBs,
            nameError: pNameE,
            priceError: pPriceE,
            qtyError: pQtyE,
            descError: pDescE,
            catError: pCatE,
            imageError: pImageE,
            formValues : formValues
        });
    }
    else
    {
        const newProd = {
            name:pName,
            image:`/img/products/${req.files.pImage.name}`,
            price:pPrice,
            category:pCat,
            bestSeller:pBestSeller,
            quantity:pQty,
            description:pDesc
        }

        const product = new productModel(newProd);
        product.save()
        .then(()=>{
            //flag to show the message that product was added
            let added = 1;

            req.files.pImage.mv(`public/img/products/${req.files.pImage.name}`)
            .then(()=>{
                res.render("products/addProducts",{
                    title:"Add new product",
                    catDB:DBs,
                    added
                })
            })
            .catch(err=>console.log(`Error moving the product image: ${err}`));
        })
        .catch(err=>{
            console.log(`Error creating the product on MongoDB: ${err}`)
        });
    }
});

module.exports = router;