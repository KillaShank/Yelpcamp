var mongoose = require('mongoose');
var campground = require('./models/campgrounds');
var Comment = require("./models/comments");

var data = [
	{
		name : "Cloud Creek",
		image : "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description : "YOYOYOYO"

	},
	{
		name : "Cloud Creek",
		image : "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
		description : "YOYOYOYO"

	},
	{
		name : "Cloud Creek",
		image : "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
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