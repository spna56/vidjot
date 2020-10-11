const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const User=require("../models/User");
const bcrypt=require("bcryptjs");
const passport=require("passport");

//show login form
router.get("/users/login",function(req,res){
      res.render("users/login");
});

//show register form
router.get("/users/register",function(req,res){
    res.render("users/register");
});

//login form access
router.post("/users/login",(req,res,next)=>{
    
   passport.authenticate("local",{
        successRedirect:"/ideas",
        failureRedirect:"/users/login",
        failureFlash:true
    })(req,res,next);

});

//Access register form 
router.post("/users/register",function(req,res){
    let errors=[];
    if(req.body.password!=req.body.password2){
        errors.push({text:"Password does not match"})
    }
    if(req.body.password.length<4){
        errors.push({text:"Password must be atleast 4 character"})
    }
    if(errors.length>0){
        res.render("users/register",{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    }else{
        User.findOne({email:req.body.email})
              .then(user=>{
                  if(user){
                      req.flash("error_msg","Already registered");
                      res.redirect("/users/register");
                  }
                   else{
                            const newUser= new User({
                            name:req.body.name,
                            email:req.body.email,
                            password:req.body.password,
                            
                        });
                        bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash(newUser.password, salt, function(err, hash) {
                  if(err){
                          console.log(err);
                      }
                  else{
                           newUser.password=hash;
                           newUser.save(function(err,user){
                               if(err){
                                   console.log(err)
                               }else{
                                   req.flash("success_msg","You are now registered" );
                                   res.redirect("/users/login");
                               }
                           })
                      }
                    });
                });
               }
              })
             }
            });

//logout access
router.get("/users/logout",function(req,res){
    req.logout();
    req.flash("success_msg","You are logged out");
    res.redirect("/users/login")
});


    
module.exports=router;  
                
                
              
            
           
        
       
    








