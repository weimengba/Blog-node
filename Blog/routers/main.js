/**
 * Created by Administrator on 2017/3/27.
 */
var express=require('express');
var router=express.Router();
var Category=require('../models/Category');
var Content=require('../models/Content');

var data;

router.use(function(req,res,next){
	data={
		userInfo: req.userInfo,
		categories: []
	}
	Category.find().then(function(categories){
		data.categories=categories;
		next();
	});
});

//首页
router.get('/',function (req,res,next) {
	data.category=req.query.category||'';
	data.count=0;
	data.page=Number(req.query.page||1);
	data.limit=2;
	data.pages=0;
	var where={};//判断是否传递类的ID值
	if(data.category){
		where.category=data.category;
	}
	
//  res.send('Home');
//  console.log('Show:'+req.userInfo); 
    //读取所有的分类信息
    Content.where(where).count().then(function(count){
    	data.count=count;
    	data.pages=Math.ceil(data.count/data.limit);
    	data.page=Math.min(data.page,data.pages);
    	data.page=Math.max(data.page,1);
    	var skip=(data.page-1)*data.limit;
    	   	
    	
    	return Content.find().where(where).limit(data.limit).skip(skip).populate(['category','user']).sort({addTime:-1});
    }).then(function(contents){
    	data.contents=contents;
//  	console.log(data);
    	res.render('main/index',data);
    });
});

//查看全文
router.get('/view',function(req,res){
	var contentId=req.query.contentid||'';
	Content.findOne({
		_id:contentId
	}).then(function(content){
		data.content=content;
		content.views++;
		content.save();
		res.render('main/view',data);
	})
})

module.exports=router;