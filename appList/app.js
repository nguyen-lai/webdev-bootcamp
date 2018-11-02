var express = require('express'),
    app     = express();


app.set("view engine", "ejs");
app.use(express.static("public")); // Look for stylesheets and scripts in "public" directory

//Landing page
app.get("/", function(req, res){
  res.render("home");
})

//Index page
app.get("/app", function(req, res){
  res.send("My Application List Goes Here!");
})

//Add page 
app.get("/app/new", function(req, res){
  res.send("Add Form Goes Here!");
})


// Tell Express to look for server
app.listen(3000, function(){
  console.log("Server started!");
})