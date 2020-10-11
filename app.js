const express=require("express");
const app=express();
const exphbs=require("express-handlebars");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const Idea=require("./models/ideas");
const methodOverride=require("method-override");
const flash=require("connect-flash");
const session=require("express-session");
const ideasroutes=require("./routes/ideas");
const usersroutes=require("./routes/users");
const User=require("./models/User");
const passport=require("passport");
const LocalStrategy=require("passport-local"); 

//MIDDLEWARE FOR HANDLEBARS
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash());

mongoose.connect("mongodb://localhost/vidjot-dev");

require("./config/passport")(passport)
 
//middleware for methodoverride
app.use(methodOverride('_method'));

//css files
app.use(express.static(__dirname+"/public"));

//express session middleware
app.use(require("express-session")({
    secret:"Fuck off",
    resave:false,
    saveUninitialized:false
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//global variables
app.use(function(req,res,next){
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error");
    res.locals.user=req.user||null;
    next();
});

//acessing the routes
app.use(ideasroutes);
app.use(usersroutes);

//INDEX ROUTE
app.get("/",function(req,res){
    res.render("index")
});

//ABOUT ROUTE
app.get("/about",function(req,res){
    res.render("about")
});



app.listen(3000,()=>{
    console.log(`Server has started`);
});