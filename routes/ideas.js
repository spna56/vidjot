const express=require("express");
const router=express.Router();
const mongoose=require("mongoose");
const Idea=require("../models/ideas");
const {isAuthenticated}=require("../helpers/auth.js");
const User=require("../models/User");

//showing form
router.get("/ideas/add",isAuthenticated,function(req,res){ 
    res.render("ideas/add")
});

//shows idea form
router.get("/ideas",isAuthenticated,function(req,res){
    Idea.find({user:req.user.id},function(err,ideas){
        if(err){
            console.log(err)
        }else{
            
            res.render("ideas/index",{ideas:ideas})
        }
    }).sort({date:"desc"})

});

//Add idea form
router.post("/ideas",isAuthenticated,function(req,res){
    var title=req.body.title;
    var details=req.body.details;
    let errors=[];
    if(!req.body.title){
        errors.push({text:"Please enter the title"})
    }
    if(!req.body.details){
        errors.push({text:"Please add the details"})
    }
    if(errors.length>0){
        res.render("ideas/add",{errors:errors,title:title,details:details})
    }
    else{
        const newUser={
            title:title,
            details:details,
            user:req.user.id
        }
     Idea.create(newUser,function(err,newlycreate){
         if(err){
             console.log(err);
         }else{
            req.flash("success_msg","Video Idea added")
            res.redirect("/ideas");
         }
     });
           
      } 
});

//show edit form
router.get("/ideas/:id/edit",isAuthenticated,function(req,res){
    Idea.findById(req.params.id,function(err,ideas){
        if(ideas.user!=req.user.id){
            req.flash("error_msg","Not Authorized");
            res.redirect("/ideas");
        }else{
        if(err){
            console.log(err);
        
        }else{
            
            res.render("ideas/edit",{ideas:ideas})
        }
     } })
   
});

//update
router.put("/ideas/:id",isAuthenticated,function(req,res){
    Idea.findByIdAndUpdate(req.params.id,req.body.ideas,function(err,ideas){
        if(err){
            console.log(err);
        }else{
            req.flash("success_msg","Video Idea updated")
            res.redirect("/ideas")
        }
    })
});

//delete
router.delete("/ideas/:id",isAuthenticated,function(req,res){
    Idea.findByIdAndRemove(req.params.id,function(err,ideas){
        if(err){
            console.log(err);
        }else{
            req.flash("success_msg","Video Idea removed")
            res.redirect("/ideas")
        }
    })
});




module.exports=router;