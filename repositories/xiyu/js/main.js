requirejs.config({
paths:{
	jquery:'jquery-1.7.2.min'
}
			});
requirejs(['jquery','backtop'],function($,backtop){
	// new backtop.BackTop($('#backTop'),{
	// 	mode:'move',
	// 	dest:100,
	// 	pos:100,
	// 	speed:800
	// });
	

$('#backTop').backtop({

	mode:'move',
	pos:$(window).height(),
});







	// var scroll = new scrollto.ScrollTo({
	// 	dest:0,
	// 	speed:800
	// });

	// $('#backTop').on('click',$.proxy(scroll.move,scroll));

	// $(window).on('scroll',function(){
	// 	checkPosition($(window).height());
	// });

	// checkPosition($(window).height());

	// function move(){
	// 	$('html,body').animate({
	// 		scrollTop:0
	// 	},800);
	// }

	// function go(){
	// 	$('html,body').animate({
	// 		scrollTop:0
	// 	},0);
	// }

	// function checkPosition(pos){
	// 	if($(window).scrollTop()>pos){
	// 		$('#backTop').fadeIn();
	// 	}
	// 	else{
	// 		$('#backTop').fadeOut();
	// 	}
	// }
});