//function to define authorization type according to the user type
const authorizationType = (req, res, next)=>{
        
    if(req.session.userInfo.type == "user")
    {
        res.render("login/logindashboard",{
            title: "Login Confirmation"
        });
    }
    else
    {
        res.render("login/logindashboard",{
            title: "Clerk Login"
        });
    }
}

module.exports = authorizationType;