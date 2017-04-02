//提交评论
var prepage=5;
var page=1;
var pages=0;
var comments=[];

$('#messageBtn').on('click',function(){
	console.log(111);
	$.ajax({
		type:"post",
		url:"/api/comment/post",
		data:{
			contentid: $("#contentId").val(),
			content: $("#messageContent").val()
		},
		success: function(responseData){
//			console.log(successData);
			$("#messageContent").val('');
			comments=responseData.data.comments.reverse();
			renderComment();
		}
	});
});

//页面初始加载显示评论(页面每次刷新加载显示)
$.ajax({
//		type:"post",
		url:"/api/comment",
		data:{
			contentid: $("#contentId").val()
		},
		success: function(responseData){
//			console.log(successData);
			comments=responseData.data.reverse();
			$("#messageContent").val('');
			renderComment();
		}
	});
	
$('.pager').delegate('a','click',function(){
	if($(this).parent().hasClass('previous')){
		page--;
	}else{
		page++;
	}
	renderComment();
})

function renderComment(){	
	//获取总的评论数
//	pages=Math.max(comments.length/prepage,1);
	pages=Math.ceil(comments.length/prepage);	
	var start=Math.max(0,(page-1)*prepage);
	var end=Math.min(start+prepage,comments.length);
	var $lis=$('.pager li');
	$lis.eq(1).html(page+' / '+pages);
	
	if(page<=1){
		page=1;
		$lis.eq(0).html('<span>没有上一页了</span>');
	}else{
		$lis.eq(0).html('<a href="javascript:;">上一页</a>')
	}
	if(page>=pages){
		page=pages;
		$lis.eq(2).html('<span>没有下一页了</span>');
	}else{
		$lis.eq(2).html('<a href="javascript:;">下一页</a>');
	}
	
	$('.messageCount').html(comments.length);
	if(comments.length==0){
		$('.messageList').html('<div class="messageBox"><p>还没有评论</p></div>');		
	}else {
		var html='';
		for(var i=start;i<end;i++){
			html+='<div class="messageBox">'
						+'<p class="name clear">'
							+'<span class="fl">'+comments[i].username+'</span>'
							+'<span class="fr">'+formatDate(comments[i].postTime)+'</span>'			
						+'</p>'
						+'<p>'+comments[i].content+'</p>'
					+'</div>';
		}
		$('.messageList').html(html);
	}
}

function formatDate(d){
	var date1=new Date(d);
	return date1.getFullYear()+'-'+(date1.getMonth()+1)+'-'+date1.getDay()+' '+date1.getHours()+':'+date1.getMinutes()+':'+date1.getSeconds();
}
