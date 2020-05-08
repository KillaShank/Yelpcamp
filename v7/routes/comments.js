var express = require('express');
var router = express.Router({mergeParams : true});
var campground = require('../models/campgrounds');
var Comment = require('../models/comments');

router.get("/comments",function(req,res){
	res.redirect("/campgrounds");
})


router.get("/comments/new",isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	});
	
});


router.post("/",isLoggedIn,function(req,res){
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
					console.log(req.body.comment);
					console.log(comment);
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})
		}
	});
});

function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}
	else{
		res.redirect("/login");
	}

}

module.exports = router;
