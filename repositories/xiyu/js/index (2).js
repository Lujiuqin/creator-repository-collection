
$(document).ready(function () {
    $(window).scroll(function () {
    	//for(var i=1;i<3;i++){
        var a = document.getElementById("advantaged1").offsetTop;
        if (a >= $(window).scrollTop() && a < ($(window).scrollTop()+$(window).height())) {                	
             //for(var i=1 ;i<3;i++){
             	//alert(1);

        				  //$('#advantage1').removeAttr('class').attr('class', '');                          
        				  var animation = $('#advantage1').attr("data-animation");
        				  //alert('#advantage'+i);						  
        				  $('#advantage1').addClass('animated');
        				  $('#advantage1').addClass(animation);

                  var animation = $('#advantage2').attr("data-animation");
                  //alert('#advantage'+i);                        
                  $('#advantage2').addClass('animated');
                  $('#advantage2').addClass(animation);
				  
                  //var header = document.getElementById("header");
                  //alert(header);
                 // header.style.position = "relation";
                  return false;
            //  }	
        }
        var b = document.getElementById("advantaged2").offsetTop;
        if (b >= $(window).scrollTop() && b < ($(window).scrollTop()+$(window).height())) {                 
             //for(var i=3 ;i<4;i++){
                //alert(1);
                  //$('#advantage1').removeAttr('class').attr('class', '');                          
                  var animation = $('#advantage3').attr("data-animation");
                  //alert('#advantage'+i);                        
                  $('#advantage3').addClass('animated');
                  $('#advantage3').addClass(animation);
                   var advantage4 =document.getElementById("advantage4");
                   advantage4.style.display="block";
                  var animation = $('#advantage4').attr("data-animation");
                  //alert('#advantage'+i);                        
                  $('#advantage4').addClass('animated');
                  $('#advantage4').addClass(animation);
                  return false;
            //}    
        }

    	//}
        
    });
    var upimg = document.getElementById("upimg");
    var a = 0;
    timer = setInterval(function(){
      
      upimg.style.marginTop = a + "px";
      a++;
      if(parseInt(upimg.style.marginTop) ==30)
      {
        
        upimg.style.marginTop = 0 + "px";
        a=0;
      }
    },26);
    
});


