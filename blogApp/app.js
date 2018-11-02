var express     = require("express"),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    app         = express();

// Initial setups
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

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

app.get("/blogs", function(req, res){
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log("ERROR!");
    } else {
      res.render("index", {blogs: blogs});
    }
  })
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Server Started");           
})
    

