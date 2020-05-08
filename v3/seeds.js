var mongoose = require('mongoose');
var campground = require('./models/campgrounds');
var Comment = require("./models/comments");

var data = [
	{
		name : "Cloud Creek",
		image : "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507441722a7ad6934dc5_340.jpg",
		description : "YOYOYOYO"

	},
	{
		name : "Cloud Creek",
		image : "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507441722a7ad6934dc5_340.jpg",
		description : "YOYOYOYO"

	},
	{
		name : "Cloud Creek",
		image : "https://pixabay.com/get/57e8d0424a5bae14f1dc84609620367d1c3ed9e04e507441722a7ad6934dc5_340.jpg",
		description : "YOYOYOYO"

	}
]

function seedDB(){
	campground.remove({},function(err){
		if(err){
			console.log(err);
		}
		console.log("removed campgrounds");
		data.forEach(function(seed){
		campground.create(seed,function(err,campground){
			if(err){
				console.log(err);
			}
			else{
				console.log("added campgrounds");
				//create comments
				Comment.create(
						{
							text : "Great Place !!!!",
							author : "Homie"
						},function(err,comment){
							if(err){
								console.log(err);
							}
							else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created new comment");
							}
						});
			}
		});
	});
	});

	
}

module.exports = seedDB;