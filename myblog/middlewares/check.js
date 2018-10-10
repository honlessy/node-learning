/*
 本中间件的作用是检查用户是否登陆，用以判断是否能够进入某一页面。若用户已经登陆，则返回之前的页面，若没有登陆，则跳转到登陆页面
*/
module.exports = {
    //当用户信息不存在，即认为用户没有登陆
    checkLogin:function checkLogin(req,res,next){
        if(!req.session.user){
            req.flash('error','未登陆')
            return res.redirect('/signin')
        }
        next()
    },  
    //用户信息存在，则用户已经登陆
    checkNotLogin:function checkNotLogin(req,res,next){
    
        if(req.session.user){
            req.flash('error','已登陆')
            return res.redirect('back')
        }
        next()
    }
}