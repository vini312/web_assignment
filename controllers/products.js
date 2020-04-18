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
        res.render("products/products",{
            title: "Products",
            prodDB,
            catDB:DBs
        });
    })
    .catch(err=>console.log(`Error when finding from database ${err}`))
});



router.post("/",(req,res)=>{

    productModel.find({category:req.body.pCat})
    .then(products=>{
        //filter the information necessary
        const prodDB = products.map(product=>{
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
        res.render("products/products",{
            title: "Products",
            prodDB,
            catDB:DBs,
            pCat:req.body.pCat
        });
    })
    .catch(err=>console.log(`Error when finding from database ${err}`))
});

// the ":id" makes the last value on the url to be used as a parameter inside the get function
//":add" is a parameter to show if user clicked to add product to cart
router.get("/prodDetails/:add/:id", (req,res)=>{
    //flag to show message that the product was added to cart
    let added;
    if(req.params.add == 1){
        //store the id of the product to be added to prodList
       req.session.products.push(req.params.id);
       added = 1;
    }
    productModel.findById(req.params.id)
    .then(product=>{
        // as this is a single obj destructor is enough to filter the data, map applies to array of objs
        const {_id, name, image, price, description, quantity} = product;
        // as a response obj argument, render the file products.handlebars
        res.render("products/prodDetails",{
            _id,
            title: "Product",
            name,
            image,
            price,
            description,
            quantity,
            added
        });
    })
    .catch(err=>console.log(`Error when finding from database ${err}`))
});

router.get("/editProducts/:id", (req,res)=>{

    productModel.findById(req.params.id)
    .then(product=>{

        // as this is a single obj destructor is enough to filter the data, map applies to array of objs
        const {_id, name, image, price, description, quantity, category, bestSeller} = product;

        // as a response obj argument, render the file products.handlebars
        res.render("products/editProducts",{
            title: "Edit Product Details",
            _id,
            pName: name,
            pImage: image,
            pPrice: price,
            pDesc: description,
            pQty: quantity,
            pCat: category,
            pBestSeller: bestSeller,
            catDB:DBs
        });
    })
    .catch(err=>console.log(`Error when finding from database ${err}`))
});

router.put("/editProducts/:id", (req, res)=>{
    //destructing
    const {pName, pPrice, pQty, pDesc, pCat, pBestSeller} = req.body;

    //variables to hold the error messages
    let pNameE;
    let pPriceE;
    let pQtyE;
    let pDescE;
    let pCatE;
    let errorFlag = false;

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

    const product = {
        name:pName,
        price:pPrice,
        category:pCat,
        bestSeller:pBestSeller,
        quantity:pQty,
        description:pDesc
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
            pName,
            pPrice,
            pQty,
            pDesc,
            pCat,
            pBestSeller
        });
    }
    else
    {
        productModel.updateOne({_id:req.params.id},product)
        .then(()=>{
            res.redirect(`/products/prodDetails/0/${req.params.id}`);
        })
        .catch(err=>console.log(`Error updating the product: ${err}`));
    }
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

    //variables to hold the error messages
    let pNameE;
    let pPriceE;
    let pQtyE;
    let pDescE;
    let pImageE;
    let pCatE;
    let errorFlag = false;

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
            pName,
            pPrice,
            pQty,
            pDesc,
            //pImage,
            pCat,
            pBestSeller
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
                req.session.products.push(product._id);
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