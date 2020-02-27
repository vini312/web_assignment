const express = require('express');
const router = express.Router();

//import the fake database
const DBs = require("../model/DBs");

//get a request from http to the server to the root page
router.get("/",(req,res)=>{

    // as a response obj argument, render the file home.handlebars
    res.render("home",{
        title: "Home Page",
        catDB: DBs.fakeCatDB,
        bestDB: DBs.fakeBestDB
    });
});

module.exports = router;