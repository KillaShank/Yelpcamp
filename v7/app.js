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


//LANDING ROUTE
app.get("/",function(req,res){
	res.render("landing");
});

//MAIN ROUTE
app.get("/campgrounds",function(req,res){

	
	 campground.find({},function(err , allcamps){
	 	if(err){
	 		console.log("Error occured : ",err);
	 	}
	 	else{
	 	res.render("campgrounds/campgrounds",{campgrounds:allcamps});	
	 	}
	 });
	
});


app.post("/campgrounds",function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var newCampground = { name : name , image : image , description : desc};
	campground.create(newCampground
	,function(err,camp){
		if(err){
			console.log("ERROR DETECTED");
		}
		else{
			res.redirect('/campgrounds');
			
		}
	}

);
	
	
});
app.get("/campgrounds/new",function(req,res){
	res.render('campgrounds/new');

});

app.get("/campgrounds/:id",function(req,res){

	campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
		if(err){
			console.log(err);
		}
		else{
			
			res.render("campgrounds/show",{campground : foundcamp});
		}
	});

});

app.get("/campgrounds/:id/comments",function(req,res){
	res.redirect("/campgrounds");
})


app.get("/campgrounds/:id/comments/new",isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	});
	
});


app.post("/campgrounds/:id",isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect("/campgrounds")
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	});
});

//AUTH ROUTES


app.get("/register",function(req,res){
	res.render('register');
});

app.post("/register",function(req,res){
	var newUser = new User({username : req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err){
			console.log(err);
			return res.render('register');
		}
		else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/campgrounds")
			});
		}
	});
});

//LOGIN

app.get('/login',function(req,res){
	res.render("login");
});


app.post('/login',passport.authenticate("local",{
	successRedirect : "/campgrounds" ,
	failureRedirect : "/login"
}),function(req,res){
	
});

//LOGOUT
app.get('/logout',function(req,res){
	req.logout();
	res.redirect('/campgrounds');
});


app.listen(3000,function(){
	console.log('YelpCamp has started!!!!');
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}

}