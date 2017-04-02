// 加载express
var express=require('express');
//创建app应用，相当于=>Node.js Http.createServer();
var app=express();

//加载数据库模块
var mongoose=require('mongoose');

var bodyParser=require('body-parser');

var Cookies=require('cookies');
var User=require('./models/User');//获取用户权限
app.use('/public',express.static(__dirname+'/public'));

//监听http请求
var swig=require('swig');
app.engine('html',swig.renderFile);
app.set('views','./views');
app.set('view engine','html');
swig.setDefaults({cache:false});

app.use(bodyParser.urlencoded({extended:true}));
//设置cookie
app.use(function(req,res,next){
    req.cookies=new Cookies(req,res);
    //console.log(req.cookies.get('userInfo'));
    req.userInfo={};
    //解析登录用户的cookies信息
    if(req.cookies.get('userInfo')){
        try{
            req.userInfo=JSON.parse(req.cookies.get('userInfo'));
            // 获取当前登录用户是否是管理员
            User.findById(req.userInfo._id).then(function(userInfo){
                req.userInfo.isAdmin=Boolean(userInfo.isAdmin);
                next();
            });
        }catch(e){
            next();
        }
    }else{
        next();
    }
});

//app.get('/',function(req,res,next){
    //res.send('<h1>欢迎光临我的博客！</h1>');
//    res.render('index');
//});
app.use('/admin',require('./routers/admin'));
app.use('/api',require('./routers/api'));
app.use('/',require('./routers/main'));

mongoose.connect('mongodb://localhost:6869/blog',function(err){
    if(err){
        console.log('数据库连接失败');
    }else{
        console.log('数据库连接成功');
        app.listen(6868);
    }
});
