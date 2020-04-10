const express = require('express');
//import the router
const router = express.Router();
//import the model to be able to use database
const userModel = require("../model/user");
//import bcrypt
const bcrypt = require("bcryptjs");
//import custom middleware function from autSession module
const isAthenticated = require("../middleware/autSession");
//import custom middleware function from authorization module
const authorization = require("../middleware/authorization");

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

    // validation not using DB data
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

    //validation using DB data
    if(!errorFlag)
    {
        userModel.findOne({email:req.body.email})
        .then(user=>{
            // user email not found
            if(user == null){
                emailE = "! E-mail address not found.";
                errorFlag = true;
                redirectError();
            }
            // user email found
            else
            {
                // Load hash from your password DB.
                bcrypt.compare(req.body.password, user.password)
                .then(match=>{
                    if(match)
                    {
                        //create a session with the user found
                        req.session.userInfo = user;
                        //redirect to dashboard
                        res.redirect("login/logindashboard");
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

//get a request for the dashboard after successful login
router.get("/logindashboard",isAthenticated,authorization);

//logout get request to kill the session
router.get("/logout", (req, res)=>{

    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;