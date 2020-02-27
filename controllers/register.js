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
    }

    if(email == "")
    {
        emailE = "! Enter your email.";
    }
    else if (!testExpEmail.test(email))
    {
        emailE = "! invalid e-mail address.";
    }

    if(password == "")
    {
        passE = "! Enter your password.";
    }
    else if (!testPasswordSize.test(password))
    {
        passE = "! Passwords must consist of at least 6 characters.";
    }
    else if (!testPassword.test(password))
    {
        passE = "! Passwords must have at least one special character.";
    }

    if(password2 != password)
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

    // using Twilio SendGrid's v3 Node.js Library
    // https://github.com/sendgrid/sendgrid-nodejs
    const sgMail = require('@sendgrid/mail');

    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
    
    const msg = {
        to: `${email}`,
        from: 'test@example.com',
        subject: 'Sending with Twilio SendGrid is Fun',
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };

    sgMail.send(msg)
    .then(()=>{
        res.redirect("/");
    })
    .catch(err=>{
        console.log(`Error ${err}`);
    })

});

module.exports = router;