//function to autenticate if logged in and session is open
const isLoggedIn = (req, res, next)=>{
        
    if(req.session.userInfo)
    {
        next();
    }
    else
    {
        res.redirect("/login");
    }
}

module.exports = isLoggedIn;