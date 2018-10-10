//app是一个express应用程序，而在这里的router是express的一个迷你应用程序，从层级上来说，app>router

const express = require("express")
const router = express.Router()

const checkLogin = require("../middlewares/check").checkLogin

//以下是按照RESTful风格设计的路由
router.get('/',function(req,res,next){
    res.send("主页")
})

router.post('create',checkLogin,function(req,res,next){
    res.send("发表文章")
})

router.get('create',checkLogin,function(req,res,next){
    res.send("发表文章页")
})

router.get('/:postId',function(req,res,next){
    res.send("文章详情页")
})

router.get('/:postId/edit',function(req,res,next){
    res.send("更新文章页")
})

router.post('/:postId/edit',function(req,res,next){
    res.send("更新文章")
})

router.get('/:postId/remove',function(req.res,next){
    res.send("删除文章")
})

module.exports = router