const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{

    // as a response obj argument, render the file login.handlebars
    res.render("login",{
        title: "Sign-In"
    });
});

router.post("/",(req,res)=>{

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

module.exports = router;