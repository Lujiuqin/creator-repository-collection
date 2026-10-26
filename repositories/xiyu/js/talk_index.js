$(document).ready(function(){
	$("#zx").click(function(){
		$("#zxh ul li").slideToggle();
	});
	$("#fx").click(function(){

	$("#fxh ul li").slideToggle();

	});
$("#js").click(function(){

$("#jsh ul li").slideToggle();
	});
});
window.onload=function(){
for(var i=0;i<7;i++){
  var Li1=document.getElementById(i);
 Li1.style.backgroundColor=getColor();
					}
    function getColor()
	{
    return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).slice(-6);
	}
						}