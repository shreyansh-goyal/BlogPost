//requiring node modules
const express = require("express");
const methodOverride = require("method-override");
const bodyParser= require("body-parser");
const session=require('express-session');
const MongoDBSession=require('connect-mongodb-session')(session);

//requiring application modules
const ConnectToDatabase = require("./connection");
const ArticleRouter = require('./Routes/article');
const Blog = require("./models/article");
const User=require("./models/user");
const user = require("./models/user");

//defining app based constant values
const app = express();
const store= new MongoDBSession({
    uri:'mongodb://localhost:27017/session',
    collection:'mySession'
})

//using the body parser
app.use(bodyParser.json());


//using the sessions
app.use(session({
    secret:'My Secret',
    resave:false,
    saveUninitialized:false,
    store
}));

//setting view engine
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

//setting express to parse post request
app.use(express.urlencoded({extended:true}))

//connecting to mongoose database
ConnectToDatabase();

app.use(methodOverride("_method"));

//routing all the request starting with /articles to ArticleRouter module
app.use('/articles',ArticleRouter);

app.use((req,res,next)=>{
    if(req.url=="/"&&req.session.isAuth){
        res.redirect('articles');
    }
    next();
})

app.get('/',(req,res)=>{
    res.render('articles/signIn')
})

app.get('/register',(req,res)=>{
    res.render('articles/signup');
})
//route handling the default route
app.get('/articles',async(req,res)=>{
    const articles = await Blog.find().sort({
        createdAt:"desc"
    });
    console.log(req.session.username);
    res.render('articles/index',{articles:articles,user:req.session.username});
})


//logging users 
app.post('/users/login',(req,res)=>{
    const {username,password} = req.body;
    User.find({username}).then(data=>{
        if(data){
            if(data[0].password==password){
                req.session.isAuth=true;
                req.session.username=username;
                res.status(301).redirect('/articles')
            }
            else{
                req.session.isAuth=false;
                res.status(401).redirect("/");
            }
        }
        else{
            res.status(401).send('user not found');
        }
    })
})

//signin the users
app.post('/users/register',(req,res)=>{
    const user={username:req.body.username,password:req.body.password};
    User.create(user).then(data=>{
        res.redirect('/');
    })
    .catch(err=>{
        res.status(500).redirect('/register');
    });
})

app.post('/logout',(req,res)=>{
    req.session.isAuth=false;
    res.redirect('/');
})

app.listen(5000,()=>{
    console.log("Server start listening on port 5000");
});