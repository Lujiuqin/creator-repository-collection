<?php
require 'common.inc.php';
  if(@!!$_GET['type']=='logic'){
	 $_html = array();
	 $_html['username'] = $_POST['username'];  
	 $_html['possword'] = $_POST['user_possword'];
	 $data = _query("SELECT	* FROM 	tg_user WHERE tg_username='{$_html['username']}'");
	 $datas = mysql_fetch_array($data, MYSQL_ASSOC);
	 if($datas['tg_password']==sha1($_html['possword'])){
	     	 $_SESSION['user'] = $_html['username'];
			 _location('登录成功！','index.php');
     }
  }
?>
<script type="text/javascript" src="js/jquery.easydrag.handler.beta2.js"></script>
<script type="text/javascript" src="js/jquery.js"></script>

<script type="text/javascript">
$(document).ready(function(){
	
	$('.one').click(function(){
		
		$('.box2').show();
		
		
		});
			
	$('.login5 a').click(function(){
		
		
		$('.box2').hide();
		
		
		});
		
	$('.box').easydrag();
	
	
	});
</script>
 <script type="text/javascript" src="js/jquery.1.10.2.js"></script>
 
    <script type="text/javascript">

        $(function () {
            var container = $('#container');
            var list = $('#list');
            var buttons = $('#buttons span');
            var prev = $('#prev');
            var next = $('#next');
            var index = 1;
            var len = 5;
            var interval = 3000;
            var timer;


            function animate (offset) {
                var left = parseInt(list.css('left')) + offset;
                if (offset>0) {
                    offset = '+=' + offset;
                }
                else {
                    offset = '-=' + Math.abs(offset);
                }
                list.animate({'left': offset}, 300, function () {
                    if(left > -0){
                        list.css('left', -1000 * len);
                    }
                    if(left < (-800 * len)) {
                        list.css('left', 0);
                    }
                });
            }

            function showButton() {
                buttons.eq(index-1).addClass('on').siblings().removeClass('on');
            }

            function play() {
                timer = setTimeout(function () {
                    next.trigger('click');
                    play();
                }, interval);
            }
            function stop() {
                clearTimeout(timer);
            }

            next.bind('click', function () {
                if (list.is(':animated')) {
                    return;
                }
                if (index == 5) {
                    index = 1;
                }
                else {
                    index += 1;
                }
                animate(-1000);
                showButton();
            });

            prev.bind('click', function () {
                if (list.is(':animated')) {
                    return;
                }
                if (index == 1) {
                    index = 5;
                }
                else {
                    index -= 1;
                }
                animate(1000);
                showButton();
            });

            buttons.each(function () {
                 $(this).bind('click', function () {
                     if (list.is(':animated') || $(this).attr('class')=='on') {
                         return;
                     }
                     var myIndex = parseInt($(this).attr('index'));
                     var offset = -600 * (myIndex - index);

                     animate(offset);
                     index = myIndex;
                     showButton();
                 })
            });

            container.hover(stop, play);

            play();

        });
    </script>
<style type="text/css">
#username{
	line-height:70px;
	padding-left:20px;
	margin-top:-20px;
	font-size:14px;
    font-family:微软雅黑;
}
.img{
	margin:0 auto;
	padding:8px;
	border-radius:50%;
	overflow:hidden;
}

*{ padding:0px; margin:0px;}
a{ text-decoration:none;}
ul{ list-style-type:none;}
.box{ float:left;position:relative; padding:1px; top:10%;  opacity:0.5;z-index:4;  opacity:1; }
.box_bg{}
.box2{ width:100%; height:100%; display:none; z-index:5; position:fixed; background:rgba(0, 0, 0, 0.52) none repeat scroll 0% 0%; opacity:1;margin-left:-860px;
margin-top:-420px;}
.login5{ width:380px; height:65px; background:#ccc; text-align:center; position:relative; margin:50px auto 0px auto;}
.login5 h2{ font-size:30px; line-height:65px; color:#ffffff;}
.login5 a{ background:url(image/login_reg.png) 0px 0px no-repeat; position:absolute; width:16px; height:16px; right:10px; top:25px;}
.login51{ width:300px; padding:40px 40px 50px; margin:0 auto; background:#EFEFEF; height:300px; }
.login5left{ float:left; width:300px; height:200px; font-size:13px;}

.login5left1{ width:100%; margin-bottom:22px; float:left; position:relative; display:block;}
.login5left1 input{ text-indent:10px; width:296px; color:#999; font-size:13px; height:40px; line-height:40px; border:1px solid #999; border-radius:5px;}
.login5left2{ height:45px; line-height:45px; width:100%; margin-bottom:22px; float:left;
 position:relative; display:block;}
.login5left2 .dl{ float:right; width:97px; height:45px;
line-height:45px; text-align:center; background:none repeat scroll 0% 0% #55ACEF; color:#fff; border-radius:5px; display:inline-block; font-size:14px; outline:medium none;
cursor:pointer;}
.nologin{
    width: 40px;
    display: block;
    float: right;
	margin-top:50px;
}
</style>
<div id="container">
    <div id="list" style="left: -1000px;">
        <img src="image/0.5.jpg" alt="1"/>
        <img src="image/0.1.jpg" alt="2"/>
        <img src="image/0.2.jpg" alt="3"/>
        <img src="image/0.3.jpg" alt="4"/>
        <img src="image/0.4.jpg" alt="5"/>
    </div>
    <div id="buttons">
        <span index="1" class="on"></span>
        <span index="2"></span>
        <span index="3"></span>
        <span index="4"></span>
        <span index="5"></span>
    </div>
    <a href="javascript:;" id="prev" class="arrow">&lt;</a>
    <a href="javascript:;" id="next" class="arrow">&gt;</a>
</div>
<div id="hf">
<ul>
<li><a href="index.php">网站首页</a></li>
<li><a href="jc.php">教程安排</a></li>

<li><a href="insed.php">视频教学</a></li>	
<li><a href="articles-list.php">球论英雄</a></li>
<li><a href="chose.php">装备推荐</a></li>
<li class="end"><a href="qg.php">附近球馆</a></li>
</ul>
<?php
   if(!isset($_SESSION['user'])){
?>
<a class="zc" href="register.php">注册</a>
<a href="#" class="one">登录</a>

<?php
   }else{
	  echo '<img src="face/face18.jpg" height="50px" width="50px" class="img"/><span id="username">'.$_SESSION['user'].'</span><div class="nologin"><a href="delete.php">退出</a></div>';  
	}
?>

<div class="box">
<div class="box2">
	<div class="login5">
    	<h2>登录</h2>
        <a class="close"></a>
    </div>
    <div class="login51">
    	<form name="login5form" action="?type=logic" method="post">
        	<div class="login5left">
            	
                <div class="login5left1">
                	<input type="text" name="username" placeholder="用户名/手机号/邮箱" /></input>
                </div>
                <div class="login5left1">
                	<input type="password" name="user_possword" placeholder="密码" /></input>
                </div>
                <div class="login5left2">
                	<input class="dl" name="dl" type="submit" value="登录"></input>
                </div>
            </div>
         
        </form>
    </div>
</div>
</div>
</div>
