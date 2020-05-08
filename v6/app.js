var express = require('express');
	app = express(),
 	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	campground = require('./models/campgrounds'),
	seeDB = require('./seeds'),
	User = require("./models/users"),
	Comment = require('./models/comments');

//ROUTES

var campgroundRoutes = require('routes/campgrounds'),
	commentRoutes = require('routes/comments'),
	indexRoutes = require('routes/index');


mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

seeDB();

//PASSPORT CONFIG
app.use(require('express-session')({
	secret: "YOYOYO YOYOYO",
	resave: false,
	saveUninitialized : false

}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id",commentRoutes);
app.use("/",indexRoutes);

app.listen(3000,function(){
	console.log('YelpCamp has started!!!!');
});


