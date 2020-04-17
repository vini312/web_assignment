//function to define if authorization type is clerk
const isClerk = (req, res, next)=>{
        
    if(req.session.userInfo.type == "clerk")
    {
        next();
    }
}

module.exports = isClerk;