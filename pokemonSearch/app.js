var express = require('express');
var app = express();
var Pokedex = require('pokedex-promise-v2');
var P = new Pokedex();
var bodyParser = require('body-parser');

var pokeName = "";
var pokePic = "";

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("index.ejs");
})

app.get("/huy", function(req, res){
  res.render("something.ejs");
})

app.get("/vi", function(req, res){
  res.render("vi.ejs");
})

app.post("/searchPoke", function(req, res){
  pokeName = req.body.pokeName.toLowerCase(); 
  if (pokeName == "huy") {
    res.redirect("/huy");
  } else if (pokeName =="vi") {
    res.redirect("/vi");
  } else {
    P.getPokemonByName(pokeName, function(response, err){
    if(!err) {
      pokePic = response.sprites.front_default;
      res.redirect("/pokemon"); // Doesn't work if put this outside of the {else}
   } else {
      pokePic = "";
      res.redirect("/pokemon");
    }
  }) 
  }
});

app.get("/pokemon", function(req, res){
  res.render("pokemon.ejs", {pokePic: pokePic});
});



app.listen(3000, function(){
  console.log("Sever Started!");
})