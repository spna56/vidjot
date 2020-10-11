const LocalStrategy=require("passport-local").Strategy; 
const mongoose=require("mongoose");
const User=mongoose.model("users");
const bcrypt=require("bcryptjs");

module.exports=function(passport){
    passport.use(new LocalStrategy({usernameField:"email"},
        (email,password,done)=> {
           User.findOne({
                email:email
                //match user
            }).then(sapna=>{
                if(!sapna){
                    return done(null,false,{message:"No user found"})
                }
                //match password
                bcrypt.compare(password,sapna.password,(err,isMatch)=>{  //password=unencrypted coming from the form and sapna.password is the hashed version of our password

                    if(err) throw err;
                    if(isMatch){
                        return done(null,sapna)
                    }else{
                        return done(null,false,{message:"Password incorrect"})//second parameter of done takes the user
                    }
                })     
            })
        }

        
     
        ))
        passport.serializeUser(function(user, done) {
            done(null, user.id);
          });
          
          passport.deserializeUser(function(id, done) {
            User.findById(id, function(err, user) {
              done(err, user);
            });
          });
}