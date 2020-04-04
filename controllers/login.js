const express = require('express');
//import the router
const router = express.Router();
//import the model to be able to use database
const userModel = require("../model/user");
//import bcrypt
const bcrypt = require("bcryptjs");

router.get("/",(req,res)=>{

    // as a response obj argument, render the file login.handlebars
    res.render("login/login",{
        title: "Sign-In"
    });
});

router.post("/",(req,res)=>{

    //variables to hold the error messages
    let emailE;
    let passE;
    let errorFlag = false;

    //regular expressions to be used on error handler
    const testExpEmail = /.*@+.*\..*/;
    const testPasswordSize = /.{6,}/;

    //value holder to render the page with the value entered by the user
    let formValues = {
        email: req.body.email,
        password: req.body.password
    };

    function redirectError(){
        if(errorFlag)
        {
            res.render("login/login", {
                title : "Sign-In",
                emailError: emailE,
                passError: passE,
                formValues : formValues
            });
        }
    }

    if(req.body.email == "")
    {
        emailE = "! Enter your email.";
        errorFlag = true;
    }
    else if (!testExpEmail.test(req.body.email))
    {
        emailE = "! invalid e-mail address.";
        errorFlag = true;
    }

    if(req.body.password == "")
    {
        passE = "! Enter your password.";
        errorFlag = true;
    }
    else if (!testPasswordSize.test(req.body.password))
    {
        passE = "! Passwords have at least 6 characters.";
        errorFlag = true;
    }

    redirectError();

    if(!errorFlag)
    {
        userModel.findOne({email:req.body.email})
        .then((user)=>{
            if(user == null){
                emailE = "! E-mail address not found.";
                errorFlag = true;
                redirectError();
            }
            else
            {
                // Load hash from your password DB.
                bcrypt.compare(req.body.password, user.password)
                .then((match)=>{
                    if(match)
                    {
                        //create a session
                        req.session.userInfo = user;
                        //redirect
                        res.redirect("/logindashboard");
                    }
                    else
                    {
                        passE = "! Wrong password.";
                        errorFlag = true;
                        redirectError();
                    }
                })
                .catch(err=>console.log(`Error decrypting password ${err}`));
            }
        })
        .catch(err=>{
            console.log(`Error on findOne ${err}`);
            errorFlag = true;
        })
    }
});

module.exports = router;