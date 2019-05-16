var express     =require("express");
var app         =express();
var bodyParser  =require("body-parser");
var mongoose    =require("mongoose");
var methodOverride=require("method-override");
var expressSanitizer=require("express-sanitizer")
mongoose.connect("mongodb://localhost/blog_app");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
})
var Blog=mongoose.model("Blog", blogSchema)
// Blog.create({
//     title:"Test Blog",
//     image: "https://www.tripadvisor.in/Hotel_Review-g297913-d589623-Reviews-Four_Points_by_Sheraton_Arusha_The_Arusha_Hotel-Arusha_Arusha_Region.html",
//     body: "This is a very good place" , 

// })
//Restful Routes
app.get("/",function(req,res){
    res.redirect("/blogs");
})
app.get("/blogs",function(req,res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else{
            res.render("index", {blogs : blogs});
        }
    });
})
app.post("/blogs",function(req,res){

    req.body.blog.body =req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/blogs");
        }
    })
})
app.get("/blogs/new",function(req,res){
    res.render("new");
})
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.render("edit", {blog: foundBlog});
        }
    })

})
app.put("/blogs/:id",function(req,res){
    req.body.blog.body =req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBLog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
});

app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{
            res.render("show",{blog: foundBlog});
        }
    })
})
app.delete("/blogs/:id", function(req,res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs");
        }
    })
    
})
app.listen(3000,function(){
    console.log("server running on 3000");
});