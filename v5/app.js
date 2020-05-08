var express = require('express');
	app = express(),
 	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	campground = require('./models/campgrounds'),
	seeDB = require('./seeds'),
	Comment = require('./models/comments');

seeDB();
mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));




app.get("/",function(req,res){
	res.render("landing");
});
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


app.get("/campgrounds/:id/comments/new",function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	});
	
});


app.post("/campgrounds/:id",function(req,res){
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


app.listen(3000,function(){
	console.log('YelpCamp has started!!!!');
});