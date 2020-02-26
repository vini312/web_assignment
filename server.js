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

    //variables to hold the error messages
    let nameE;
    let emailE;
    let passE;
    let pass2E;

    //regular expressions to be used on error handler
    const testExpEmail = /.*@+.*\.com.*/;
    const testPasswordSize = /.{6,}/;
    const testPassword = /.*[!@#$%^&*]/
    
    //value holder to render the page with the value entered by the user
    let formValues = {
        name: req.body.custName,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2
    };
    
    if(req.body.custName == "")
    {
        nameE = "! Enter your name";
    }

    if(req.body.email == "")
    {
        emailE = "! Enter your email.";
    }
    else if (!testExpEmail.test(req.body.email))
    {
        emailE = "! invalid e-mail address.";
    }

    if(req.body.password == "")
    {
        passE = "! Enter your password.";
    }
    else if (!testPasswordSize.test(req.body.password))
    {
        passE = "! Passwords must consist of at least 6 characters.";
    }
    else if (!testPassword.test(req.body.password))
    {
        passE = "! Passwords must have at least one special character.";
    }

    if(req.body.password2 != req.body.password)
    {
        pass2E = "! Passwords do not match";
    }

    res.render("registration", {
        title : "Customer Registration",
        nameError: nameE,
        emailError: emailE,
        passError: passE,
        pass2Error: pass2E,
        formValues : formValues
    });

});

app.get("/login",(req,res)=>{

    // as a response obj argument, render the file login.handlebars
    res.render("login",{
        title: "Sign-In"
    });
});

app.post("/login",(req,res)=>{

    //variables to hold the error messages
    let emailE;
    let passE;

    //regular expressions to be used on error handler
    const testExpEmail = /.*@+.*\.com.*/;
    const testPasswordSize = /.{6,}/;

    //value holder to render the page with the value entered by the user
    let formValues = {
        email: req.body.email,
        password: req.body.password
    };

    if(req.body.email == "")
    {
        emailE = "! Enter your email.";
    }
    else if (!testExpEmail.test(req.body.email))
    {
        emailE = "! invalid e-mail address.";
    }

    if(req.body.password == "")
    {
        passE = "! Enter your password.";
    }
    else if (!testPasswordSize.test(req.body.password))
    {
        passE = "! Passwords have at least 6 characters.";
    }

    res.render("login", {
        title : "Sign-In",
        emailError: emailE,
        passError: passE,
        formValues : formValues
    });

});

// create the server with its respective port
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    // message when the server starts
    console.log(` The server is runing on port ${PORT}... \n Press ctrl + c to stop it...`)
});