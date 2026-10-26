changeActive("#header4");
var width = $(window).width();
$("video").attr("width",width);
var myPlayer = videojs('example_video_1');
videojs("example_video_1").ready(function(){
    var myPlayer = this;
    myPlayer.play();
});
$(window).load(function(){
  $(window).resize(function(){
    var width = $(window).width();
    myPlayer.width(width);
  });

});

// $("#submit").click(function(){
//   alert("1");
// });
$(".comment").children("#submit").eq(0).click(function(){
  var text = $("#com").val();
  $("#info").html(text);
  $("#qwe").show();
});