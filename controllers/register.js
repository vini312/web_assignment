const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{

    // as a response obj argument, render the file registration.handlebars
    res.render("registration",{
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
    const testExpEmail = /.*@+.*\.com.*/;
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

    
    if (errorFlag)
    {
        res.render("registration", {
            title : "Customer Registration",
            nameError: nameE,
            emailError: emailE,
            passError: passE,
            pass2Error: pass2E,
            formValues : formValues
        });
    }else{
        // using Twilio SendGrid's v3 Node.js Library
        // https://github.com/sendgrid/sendgrid-nodejs
        const sgMail = require('@sendgrid/mail');

        sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
        
        const msg = {
            to: `${email}`,
            from: 'amazon@example.com',
            subject: 'Registration confirmation',
            html:   `Hello ${custName}, <br><br>
                    Thank you for registering on our web site! <br>
                    We are looking forward to offer you the best service we can. <br><br>
                    Best regards <br><br>
                    The Directory.`
        };

        sgMail.send(msg)
        .then(()=>{
            res.redirect("/dashboard");
        })
        .catch(err=>{
            console.log(`Error ${err}`);
        })
    }

});

module.exports = router;