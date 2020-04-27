var express = require("express");
var router =express.Router();
var path = require("path");

var axios = require("axios");
var cheerio = require("cheerio");

var Comment = require("../models/comments.js");
var Article = require("../models/articles.js");

router.get("/", function(req, res) {
    res.redirect("/articles");
});

router.get("/scrape", function(req, res) {
    axios.get("https://www.tennessean.com/news/").then(function(response) {
        var $ = cheerio.load(response.data);

        $(".flm-asset-link js-asset-link brand-hover-shadow-parent").each(function(i, element) {

            var result = {};

            result.title = $(this).children("span").text();
            
            result.link = $(this).children("a").attr("href");

            result.sum = $(this).children("p").text();


            db.Article.create(result)
                .then(function(dbArticle) {
                    console.log(dbArticle);
                })
                .catch(function(err) {
                    console.log(err);
                });
        });
        res.redirect("/");
    });
});

router.get("/articles", function(req,res) {
    Article.find().sort({_id: -1}).exec(function(err, doc){
        if (err) {
            console.log(err);
        }else{
            var artcl = {article: doc };
            res.render("index", artcl);
        }
    });
});

router.get("/articles-json", function(req, res) {
    Articles.find({}, function(err, doc) {
        if (err) {
            console.log(err)
        }else{
            res.json(doc);
        }
    });
});

module.exports = router;