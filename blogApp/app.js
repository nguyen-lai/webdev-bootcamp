var express           = require("express"),
    methodOverride    = require("method-override"),
    expressSanitizer  = require("express-sanitizer"),
    bodyParser        = require("body-parser"),
    mongoose          = require("mongoose"),
    app               = express();

// Initial setups
app.set("view engine", "ejs");                          
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());                           // Must go after body-parser
app.use(methodOverride("_method"));                    // Can be anything but typically "_method"

//Connect to MongoDB
mongoose.connect("mongodb://localhost/blogApp", { useNewUrlParser: true }, function(err, db){
  if (err) {
    console.log(err);
  } else {
    console.log("Database Connected");
  }
});

//Mongoose/Model Config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {                              // Default value is current data
    type: Date, 
    default: Date.now
  } 
})

var Blog = mongoose.model(("Blog"), blogSchema);

// Blog.create({
//   title: "Test Blog",
//   image: "https://images.unsplash.com/photo-1541083722257-12eae0c885d2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=b7c869dfb56375343af5c0ed7bcf9f6d&auto=format&fit=crop&w=633&q=80",
//   body: "HELLO THIS IS A BLOG POST!"
// });

//RESTful routes
app.get("/", function(req, res){
  res.redirect("/blogs");
});

//INDEX ROUTE
app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("ERROR!");
    } else {
      res.render("index", {blogs: blogs});
    }
  })
});

//NEW ROUTE
app.get("/blogs/new", function(req, res){
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs", function(req, res){
  //Create BLOG
  req.body.blog.body = req.sanitize(req.body.blog.body);                 // Sanitize Input
  Blog.create(req.body.blog, function(err, newBlog){                     //Blog.create(data, callback)
    if (err) {
      console.log("Error!");
      res.render("new");
    } else {
      //Redirect to index
      res.redirect("/blogs");
    }
  })    
});

//SHOW ROUTE
app.get("/blogs/:id", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      console.log("Error!");
      res.redirect("/blogs");
    } else {
      res.render("show", {blog: foundBlog});
    }
  })
})

//EDIT ROUTE -- SUBMIT to correct URL AND PREFILL WITH CORRECT DATA
app.get("/blogs/:id/edit", function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err) {
      console.log("Error!");
      res.redirect("/blogs");
    } else {
      res.render("edit", {blog: foundBlog});
    }
  })
})

//UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
  req.body.blog.body = req.sanitize(req.body.blog.body);                 // Sanitize Input
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if (err) {
      console.log("Error!");
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs/"+req.params.id);
    }
  })
})

//DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if (err) {
      res.redirect("/blogs");
    } else {
      res.redirect("/blogs");
    }
  })
})

app.listen(process.env.PORT || 3000, function(){
  console.log("Server Started");           
})
    

