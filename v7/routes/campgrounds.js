var express = require('express');
var router = express.Router();
var campground = require('../models/campgrounds');

router.get("/",function(req,res){

	
	 campground.find({},function(err , allcamps){
	 	if(err){
	 		console.log("Error occured : ",err);
	 	}
	 	else{
	 	res.render("campgrounds/campgrounds",{campgrounds:allcamps});	
	 	}
	 });
	
});


router.post("/",function(req,res){
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
router.get("/new",function(req,res){
	res.render('campgrounds/new');

});

router.get("/:id",function(req,res){

	campground.findById(req.params.id).populate("comments").exec(function(err, foundcamp){
		if(err){
			console.log(err);
		}
		else{
			
			res.render("campgrounds/show",{campground : foundcamp});
		}
	});

});

module.exports = router;