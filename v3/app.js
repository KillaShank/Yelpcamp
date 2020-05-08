var express = require('express');
	app = express(),
 	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	campground = require('./models/campgrounds');
	seeDB = require('./seeds')

seeDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");





app.get("/",function(req,res){
	res.render("landing");
});
app.get("/campgrounds",function(req,res){
	
	 campground.find({},function(err , allcamps){
	 	if(err){
	 		console.log("Error occured : ",err);
	 	}
	 	else{
	 	res.render("campgrounds",{campgrounds:allcamps});	
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
	res.render('new');

});

app.get("/campgrounds/:id",function(req,res){

	campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
		if(err){
			console.log(err);
		}
		else{
			
			res.render("show",{campground : foundcamp});
		}
	});

});


app.listen(3000,function(){
	console.log('YelpCamp has started!!!!');
});