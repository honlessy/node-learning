const Post = require('../lib/mongo').Post
const marked = require('marked')

Post.plugin('contentToHtml',{
    afterFind:function(posts){
        return posts.map(function(post){
            post.content = marked(post.content)
            return post
        })
    },
    afterFindOne:function(post){
        if(post){
            post.content = marked(post.content)
        }
        return post
    }
})


module.exports = {
    //创建文章
    create:function create(post){
        return Post.create(post).exec()
    },
    //通过文章id获取文章
    getPostById:function getPostById(postId){
        return Post.findOne({_id:postId}).populate({path:'author',model:'User'}).addCreatedAt().contentToHtml().exec()
    },
    //按创建的时间降序获取所有用户文章或者某个特定用户的所有文章
    getPosts: function getPosts (author) {
        const query = {}
        if (author) {
          query.author = author
        }
        return Post
          .find(query)
          .populate({ path: 'author', model: 'User' })
          .sort({ _id: -1 })
          .addCreatedAt()
          .contentToHtml()
          .exec()
      },
    //通过文章id给pv加1
    incPv:function incPv(postId){
        return Post.update({_id:postId},{ $inc:{ pv:1 }}).exec()
    },
    //通过文章id获取原生文章
    getRawPostById: function getRawPostById (postId) {
        return Post
          .findOne({ _id: postId })
          .populate({ path: 'author', model: 'User' })
          .exec()
      },

    updatePostById:function updatePostById(postId,data){
        return Post.update({_id:postId},{$set:data}).exe()
    },
    //通过文章id删除一篇文章
    delPostById:function delPostById(postId){
        return Post.deleteOne({_id:postId}).exe()
    }
}