module.exports={
    isAuthenticated:function(req,res,next){
        if(req.isAuthenticated()){
            next();
        }else{
            req.flash("error_msg","You are not authorized");
            res.redirect("/users/login")
        }
    }
}