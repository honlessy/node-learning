const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')

const app = express()


//设置模板目录
app.set('views',path.join(__dirname,'views'))

//设置模板引擎
app.set('view engine','ejs')

//设置静态文件目录
app.use(express.static(path.join(__dirname,'public')))
//session中间件
app.use(session({
    name:config.session.key,
    secret:config.session.secret,
    resave:true,
    saveUninitialized:false,
    cookie:{
        maxAge:config.session.maxAge
    },
    store:new MongoStore({
        url:config.mongodb
    })
}))

app.use(flash())

//处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir:path.join(__dirname,'public/img'),//上传头像的位置
    keepExtensions:true//是否保留后缀
}))


// 设置模板全局常量
app.locals.blog = {
    title: pkg.name,
    description: pkg.description
  }
  
  // 添加模板必需的三个变量
  app.use(function (req, res, next) {
    res.locals.user = req.session.user
    res.locals.success = req.flash('success').toString()
    res.locals.error = req.flash('error').toString()
    next()
  })

routes(app)

app.listen(config.port,function(){
    console.log(`${pkg.name} listening on port ${config.port}`)
})