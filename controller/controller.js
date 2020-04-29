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

        $(".flm-asset").each(function(i, element) {

            var result = {};

            result.title = $(this).find("span").text().trim("\n");
            
            result.link = $(this).find("a").attr("href");

            result.summary = $(this).find(".flm-summary").text().trim();

            console.log(result);




            Article.create(result)
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
    Article.find({})
    
    .exec(function(err, doc){
        if (err) {
            console.log(err);
        }else{
            var artcl = {article: doc };
            res.render("index", artcl);
        }
    });
});

router.get("/articles-json", function(req, res) {
    Article.find({}, function(err, doc) {
        if (err) {
            console.log(err)
        }else{
            res.json(doc);
        }
    });
});

router.get("/clearAll", function(req,res) {
    Article.remove({}, function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all articles");
        }
    });
    res.redirect("/");
});

router.get("/readArticle/:id", function(req, res) {
    var hbsObj = {
        title2:[],
        body:[]
    };

    Article.findOne({ _id: req.params.id })
    .populate("comment")
    .then(function(doc) {
        hbsObj.article = doc;
        var link = ("https://tennessean.com" + doc.link)

        axios.get(link).then(function(response) {
            var $ = cheerio.load(response.data);

            $(".asset").each(function(i, element) {
                
                hbsObj.title2 = $(this).find(".asset-headline").text();

                hbsObj.body = $(this).find(".p-text").text();

               return console.log(hbsObj);
              
            });
            
            res.render("article", hbsObj);
        });
        
        
    })
    .catch(function(err) {
        console.log(err);
    });
});

router.post("/comment/:id", function(req, res) {
    var user = req.body.name;
    var content = req.body.comment;
    var articleId = req.params.id;

    var commentObj = {
        name: user,
        body: content
    };

    var newComment = new Comment(commentObj);

    newComment.save(function(err, doc) {
        if (err) {
            console.log(err);
        }else {
            console.log(doc._id);
            console.log(articleId);

            Article.findOneAndUpdate(
                { _id: req.params.id},
                { $push: {comment: doc._id} },
                { new: true }
            ).exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else{
                    res.redirect(`/readArticle/${articleId}`);
                }
            });
        }
    });
});


module.exports = router;