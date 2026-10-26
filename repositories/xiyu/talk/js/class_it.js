$(document).ready(function(){
	$("#class_click").click(function(){

		$("#ul_class").slideToggle();
	});
	var o2o = document.getElementById("class_o2o");
	o2o.onclick=function(){
		var class_example_ul1 = document.getElementById("class_example_ul1");
		timer = setInterval(function(){
            var i=-1;
           
			class_example_ul1.style.marginLeft = i +"px";
			 i--;
			if(parseInt(class_example_ul1.style.marginLeft)==1200){
				//clearInterval(timer);
			}
		
		},30);
	}
	
});
