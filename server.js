// declare the libraries to be used
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const fileUpload = require('express-fileupload');

//load environment variables from keys.env
require('dotenv').config({path:"./config/keys.env"});

// create the object of type express
const app = express();

// set the engine of the express object to handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//make middleware use the public folder
app.use(express.static("public"));

//bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));

//file upload package
app.use(fileUpload());

//express-session initialization
app.use(session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
    //cookie: { secure: true }
}));

//custom middleware function
app.use((req, res, next)=>{
    //res.locals.user is a global handlebars variable, so every handlebars file can use it
    res.locals.user = req.session.userInfo;

    //check if user is defined to create a global variable that activate admin options (Add products)
    if(req.session.userInfo && req.session.userInfo.type == "clerk"){
        res.locals.clerk = 1;
    }
    next();
})

//map express to all router objects
app.use("/", require("./controllers/general"));
app.use("/registration", require("./controllers/register"));
app.use("/login", require("./controllers/login"));
app.use("/products", require("./controllers/products"));

//mongoose connection method
mongoose.connect(process.env.MONGO_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Successfully connected to MongoDB Database`);
})
.catch(err=>console.log(`Error when trying to connect to MongoDB Database ${err}`));

// create the server
const PORT = process.env.PORT;
app.listen(PORT,()=>{
    // message when the server starts
    console.log(` The server is runing on port ${PORT}... \n Press ctrl + c to stop it...`)
});