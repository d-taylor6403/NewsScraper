//Dependencies
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

//initialize Express app
var express = require("express");
var app = express();

//Setup Logger and Body Parser
app.use(logger("dev"));
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(express.static(process.cwd() + "/public"));
//Require set up handlebars
var Handlebars = require("handlebars");
var exphbs = require("express-handlebars");
var {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
app.engine("handlebars",exphbs({defaultLayout: "main"}));
app.engine("handlebars", exphbs({handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set("view engine", "handlebars");

//connecting to MongoDB
//mongoose.connect("mongodb://localhost/headlinenews");
//if deployed user deployed database; If not deployed use local
var db = process.env.MONGODB_URI || 'mongodb://localhost/headlinenews';

mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

mongoose.connect(db, function(error) {
    //log any conection errors
    if (error) {
        console.log(error);
    }else{
        console.log("DB connection is successful");
    }
});

var routes = require("./controller/controller.js");
app.use("/", routes);
//Create localhost port
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on PORT " + port);
});