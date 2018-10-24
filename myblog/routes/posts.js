//app是一个express应用程序，而在这里的router是express的一个迷你应用程序，从层级上来说，app>router

const express = require("express")
const router = express.Router()
const PostModel = require('../models/posts')
const checkLogin = require("../middlewares/check").checkLogin
const CommentsModel = require('../models/comments')
//以下是按照RESTful风格设计的路由
router.get('/',function(req,res,next){
    const author = req.query.author
    PostModel.getPosts(author).then(function(posts){
        res.render('posts',{
            posts:posts
        })
    }).catch(next)
})

router.post('/create',checkLogin,function(req,res,next){
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content
    //校验参数
    try{
        if(!title.length){
            throw new Error ('请填写标题')
        }
        if(!content.length){
            throw new Error('请填写内容')
        }
    }catch(e){
        req.flash('error',e.message)
        return res.redirect('back')
    }

    let post = {
        author:author,
        title:title,
        content:content
    }
    PostModel.create(post).then(function(result){
        //此post是插入mongodb后的值，包含_id
        post = result.ops[0]
        req.flash('success','发表成功')
        res.redirect(`/posts/${post._id}`)
    }).catch(next)
})

router.get('/create',checkLogin,function(req,res,next){
    res.render('create')
})

router.get('/:postId', function (req, res, next) {
    const postId = req.params.postId
  
    Promise.all([
      PostModel.getPostById(postId), // 获取文章信息
      CommentsModel.getComments(postId),
      PostModel.incPv(postId)// pv 加 1
    ])
      .then(function (result) {
        const post = result[0]
        const comments = result[1]
        if (!post) {
          throw new Error('该文章不存在')
        }
  
        res.render('post', {
          post: post,
          comments:comments
        })
      })
      .catch(next)
  })

router.get('/:postId/edit',function(req,res,next){
    const postId = req.params.postId
    const author = req.session.user._id

    PostModel.getRawPostById(postId).then(function (post){
        if(!post ){
            throw new Error ('该文章不存在')
        }
        if(author.toString() !== post.author._id.toString()){
            throw new Error ('权限不足')
        }
        res.render('edit',{post:post})
    }).catch(next)
})

router.post('/:postId/edit',function(req,res,next){
    const postId = req.params.postId
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    try{
        if(!title.length){
            throw new Error ('请填写标题')
        }
        if(!content.length){
            throw new Error ('请填写内容')
        }
    }catch(e){
        req.flash('error',e.message)
        return res.redirect('back')
    }

    PostModel.getRawPostById(postId).then(function (post){
        if(!post){
            throw new Error('文章不存在')
        }
        if(author.toString() !== post.author._id.toString()){
            throw new Error ('权限不足')
        }
        PostModel.updatePostById(postId,{title:title},{content:content}).then(function(){
            req.flash('success','编辑文章成功')
        }).catch(next)
    })
})

router.get('/:postId/remove',checkLogin,function(req,res,next){
    const postId = req.params.postId
    const author = req.session.user._id
    PostModel.getRawPostById(postId).then(function (post){
        if(!post){
            throw new Error ('该文章不存在')
        }
        if(post.author.toString() !== author.toString()){
            throw new Error('没有权限')    
        }
        PostModel.delPostById(postId).then(function (){
            req.flash('success','删除成功')
            res.redirect('/posts')
        }).catch(next)
    })
})

module.exports = router
