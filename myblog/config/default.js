module.exports={
    port:3000,//监听端口号
    //session是express-session的的配置信息
    session:{
        secret:"myblog",
        key:"myblog",
        maxAge:2592000000,
    },
    //mongodb的地址，以mongodb：//为协议，myblog为db数据库的名称
    mongodb:'mongodb://localhost:27017/myblog'
}