module.exports=function(app){
    //app.get是express中应用路由的一部分，用于匹配并处理一个特定的请求
    app.get('/',function(req,res){
        res.redirect('/posts')
    })
    //app.use的作用是将一个中间件绑定到应用中，参数path是一个路径前缀，用于限定中间件的作用范围，所有以该前缀开始的请求路径均是中间件的作用范围
    app.use('/signup',require('./signup'))
    app.use('/signin',require('./signin'))
    app.use('/signout',require('./signout'))
    app.use('/posts',require('./posts'))
    app.use('/conments',require('./comments'))
}