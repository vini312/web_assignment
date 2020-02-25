// declare the libraries to be used
const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require('body-parser');

const DBs = require("./model/DBs");

// create the object of type express
const app = express();

// set the engine of the express object to handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

//make express use the public folder
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }))


//get a request from http to the server to the root page
app.get("/",(req,res)=>{

    // as a response obj argument, render the file home.handlebars
    res.render("home",{
        title: "Home Page",
        catDB: DBs.fakeCatDB,
        bestDB: DBs.fakeBestDB
    });
});

app.get("/products",(req,res)=>{

    // as a response obj argument, render the file products.handlebars
    res.render("products",{
        title: "Products",
        prodDB: DBs.fakeProdDB
    });
});

app.get("/registration",(req,res)=>{

    // as a response obj argument, render the file registration.handlebars
    res.render("registration",{
        title: "Customer Registration"
    });
});

app.post("/registration",(req,res)=>{

    const messages = [];
    
    if(/\s/.test(req.body.custName))
    {
        messages.push("! Enter your name");
    }

    if(req.body.email == "")
    {
        messages.push("! Enter your email");
    }

    if(req.body.password == "")
    {
        messages.push("! Enter your password");
    }

    if(messages.length > 0)
    {
        res.render("registration", {
            title : "Customer Registration",
            error : messages
        });
    }

});

app.get("/login",(req,res)=>{

    // as a response obj argument, render the file login.handlebars
    res.render("login",{
        title: "Sign-In"
    });
});

app.post("/login",(req,res)=>{

    const messages = [];

    if(req.body.email == "")
    {
        messages.push("! Enter your email");
    }

    if(req.body.password == "")
    {
        messages.push("! Enter your password");
    }

    if(messages.length > 0)
    {
        res.render("login", {
            title : "Sign-In",
            error : messages
        });
    }
});

// create the server with its respective port
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    // message when the server starts
    console.log(` The server is runing on port ${PORT}... \n Press ctrl + c to stop it...`)
});