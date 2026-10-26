$(window).load(function(){
  changeActive("#header2");
  $(window).scroll(function(){
    if( $("body").scrollTop() > 70 ){
      $(".left").css("position","fixed");
    }else{
      $(".left").css("position","");
    }
  });
});