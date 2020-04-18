const express = require('express');
//import the router
const router = express.Router();
// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');
//import the model to be able to use database
const userModel = require("../model/user");

router.get("/",(req,res)=>{

    // as a response obj argument, render the file registration.handlebars
    res.render("registration/registration",{
        title: "Customer Registration"
    });
});

router.post("/",(req,res)=>{

    //variables to hold the error messages
    let nameE;
    let emailE;
    let passE;
    let pass2E;
    let errorFlag = false;

    //regular expressions to be used on error handler
    const testExpEmail = /.*@+.*\..*/;
    const testPasswordSize = /.{6,}/;
    const testPassword = /.*[!@#$%^&*]/
    
    //destructing
    const {custName, email, password, password2} = req.body;

    //value holder to render the page with the value entered by the user
    let formValues = {
        name: custName,
        email: email,
        password: password,
        password2: password2
    };

    //function to redirect to same page with error message
    function redirectError()
    {
        if (errorFlag)
        {
            res.render("registration/registration", {
                title : "Customer Registration",
                nameError: nameE,
                emailError: emailE,
                passError: passE,
                pass2Error: pass2E,
                formValues : formValues
            });
        }
    }
    
    //validation condition
    if(custName == "")
    {
        nameE = "! Enter your name";
        errorFlag = true;
    }

    if(email == "")
    {
        emailE = "! Enter your email.";
        errorFlag = true;
    }
    else if (!testExpEmail.test(email))
    {
        emailE = "! invalid e-mail address.";
        errorFlag = true;
    }

    if(password == "")
    {
        passE = "! Enter your password.";
        errorFlag = true;
    }
    else if (!testPasswordSize.test(password))
    {
        passE = "! Passwords must consist of at least 6 characters.";
        errorFlag = true;
    }
    else if (!testPassword.test(password))
    {
        passE = "! Passwords must have at least one special character.";
        errorFlag = true;
    }

    if(password2 != password)
    {
        pass2E = "! Passwords do not match";
        errorFlag = true;
    }

    //render the page with errors flag
    redirectError();

    //if there were no errors check if email already was used and
    //store the user, send confirmation email and redirect to dashboard

    if(!errorFlag)
    {
        userModel.findOne({email:req.body.email})
        .then((user)=>{
            if(user != null){
                emailE = "! e-mail address already being used.";
                errorFlag = true;
                redirectError();
            }
            else
            {
                const newUser = {
                    name:custName,
                    email:email,
                    password:password
                }

                const user = new userModel(newUser);
                user.save()
                .then(()=>{
                    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
                    
                    const msg = {
                        to: `${email}`,
                        from: 'amazon@confirmation.com',
                        subject: 'Registration confirmation',
                        html:   `Hello ${custName}, <br><br>
                                Thank you for registering on our web site! <br>
                                We are looking forward to offer you the best service we can. <br><br>
                                Best regards <br><br>
                                The Directory.`
                    };

                    sgMail.send(msg)
                    .then(()=>{
                        res.redirect("registration/dashboard");
                    })
                    .catch(err=>{
                        console.log(`Error sending confirmation email: ${err}`);
                    })
                })
                .catch(err=>{
                    console.log(`Error creating the user on MongoDB: ${err}`)
                });
            }
        })
        .catch(err=>{
            console.log(`Error on findOne ${err}`);
        })
    }
});

//get a request for the dashboard
router.get("/dashboard",(req,res)=>{

    // as a response obj argument, render the file home.handlebars
    res.render("registration/dashboard",{
        title: "Confirmation"
    });
});

module.exports = router;