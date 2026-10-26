$(window).load(function(){
    //注册登录框系列
    $(".register,.load").click(function(){
        $(".hidden-all").fadeIn();
        $(".registerBox").fadeIn(500).css("top",($(window).height()-400)/2+"px");
        //修改高度时自动居中
        $(window).resize(function(){
            $(".registerBox").css("top",($(window).height()-400)/2+"px");
        });
        $(".closeBox").click(function(){
            $(".registerBox").fadeOut();
            $(".hidden-all").fadeOut();
            $(window).unbind(); //解除window绑定的事件，减少浏览器内存
        });
    });
    //注册框系列
    $(".register,.topButton").click(function(){
        $(".topButton").removeClass("unclickButton").addClass("clickButton");
        $(".bottomButton").removeClass("clickButton").addClass("unclickButton");
        $(".loginBody").fadeOut(100,function(){
            $(".registerBody").fadeIn();
        });
    });
    //登陆框系列
    $(".load,.bottomButton").click(function(){
        $(".topButton").removeClass("clickButton").addClass("unclickButton");
        $(".bottomButton").removeClass("unclickButton").addClass("clickButton");
        $(".registerBody").fadeOut(100,function(){
            $(".loginBody").fadeIn();
        });
       
    });
});
function changeActive(id){
  $(".nav").children(".active").attr("class","dropdown");
  $(id).attr("class","active");
}
