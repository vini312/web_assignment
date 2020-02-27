const express = require('express');
const router = express.Router();

//import the fake database
const DBs = require("../model/DBs");

router.get("/",(req,res)=>{

    // as a response obj argument, render the file products.handlebars
    res.render("products",{
        title: "Products",
        prodDB: DBs.fakeProdDB
    });
});

module.exports = router;