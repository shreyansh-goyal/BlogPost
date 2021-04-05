//requiring node modules
const express = require("express");
const methodOverride = require("method-override");

//requiring application modules
const ConnectToDatabase = require("./connection");
const ArticleRouter = require('./Routes/article');
const Article = require("./models/article");


const app = express();

//setting view engine
app.set('view engine','ejs');

//setting express to parse post request
app.use(express.urlencoded({extended:false}))

//connecting to mongoose database
ConnectToDatabase();

app.use(methodOverride("_method"));

//routing all the request starting with /articles to ArticleRouter module
app.use('/articles',ArticleRouter);

//route handling the default route
app.get('/',async(req,res)=>{
    const articles = await Article.find().sort({
        createdAt:"desc"
    });
    res.render('articles/index',{articles:articles});
})

app.listen(5000,()=>{
    console.log("Server start listening on port 5000");
});