const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true, useUnifiedTopology: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

////////////////////////////////////// Request Targeting All Articles //////////////////////////////////////

app.route("/articles")
    .get((req, res) => {
        Article.find((error, results) => {
            //console.log(results);

            if (!error) {
                res.send(results)
            } else {
                res.send(error)
            }
            
        });
    })
    .delete((req, res) => {
        Article.deleteMany((error) => {
            if (!error) {
                res.send("Successfully deleted all articles.")
            } else {
                res.send(error)
            }
        })
    })
    .post((req, res) => {
        let title = req.body.title;
        let content = req.body.content;

        const addData = new Article({
            title: title,
            content: content
        });

        addData.save((error) => {
            if(!error) {
                res.send("Successfully added a new article.")
            } else {
                res.send(error)
            }
        });
    });

////////////////////////////////////// Request Targeting A Specific Articles //////////////////////////////////////

app.route("/articles/:articleTitle")
    .get((req, res) => {
        Article.findOne({title: req.params.articleTitle}, (error, results) => {
            if (!error) {
                res.send(results);
            } else {
                res.send(`No articles found. ERROR: ${error}`);
            }
        }) 
    })
    .put((req, res) => {
        Article.update(
            {title: req.params.articleTitle},
            {title: req.body.title, content: req.body.content},
            {overwrite: true},
            (error, results) => {
                if (!error) {
                    res.send(`Successfully updated article.`);
                } else {
                    res.send(error)
                }
            }
        )
    })
    .patch((req, res) => {
        Article.update(
            {title: req.params.articleTitle},
            {$set: req.body},
            (error, results) => {
                if (!error) {
                    res.send("Successfully updated article");
                } else {
                    res.send(error);
                }
            }
        )
    })
    .delete((req, res) => {
        Article.deleteOne(
            {title: req.params.articleTitle},
            (error, results) => {
                if (!error) {
                    res.send(`Successfully deleted article ${req.params.articleTitle}`)
                } else {
                    res.send(error);
                }
            }
        )
    });
    

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on PORT 3000");
});
