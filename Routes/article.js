const express = require("express");
const Article = require("../models/article")

//creating express router to handle http request
const router = express.Router();

//route handling the request to edit form
router.get('/edit/:id',async(req,res)=>{
    try{
        const article = await Article.findById(req.params.id);
        res.render('articles/edit',{article});     
    }
    catch(e){
        res.redirect(301,'/');
    }
})

//route handling the request to create new blog
router.get("/new",(req,res)=>{
    let article = new Article();
    res.render("articles/new",{article});
})

//route displaying a particular blog
router.get('/:id',async(req,res)=>{
    try{
        let article = await Article.findById(req.params.id);
        res.render('articles/show',{article});
    }
    catch(e){
        res.redirect(301,"/");
    }
})

router.delete('/:id',async(req,res)=>{
    try{
        await Article.findByIdAndDelete(req.params.id);
        res.redirect("/");
    }
    catch(e){
        res.send("unable to delete blogpost please try again");
    }
})

//route handling the request to create new blog
router.post('/',async(req,res,next)=>{
    req.article=new Article();
    next();
},saveArticleAndRedirect("new"));


//route handling the edit request 
router.put('/edit/:id',async(req,res,next)=>{
    req.article = await Article.findById(req.params.id);
    next();
},saveArticleAndRedirect(`edit\${req.params.id}`));

//This common funtion is used saving the articles
function saveArticleAndRedirect(path){
    
    return async(req,res)=>{
        
        //unfolding the article object present in the req
        let article = req.article;
        article.title=req.body.title;
        article.markdown=req.body.markdown;
        article.description=req.body.description;
        
        try{
           await article.save();
           res.redirect(`/articles/${article.id}`);
        }
        catch(e){
            res.render(`articles/${path}`,{article:article});
        }
    }
}

module.exports = router;
