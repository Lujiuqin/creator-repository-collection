<?php
require 'includes/common_inc.php';
define('NAME',"index");
?>
<!DOCTYPE html>
<html>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<head>
<!--Title-->
<title>主页</title>
<!--Basic page styles-->
<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="js/class_it.js"></script>
<script>
function zan(name,num){
//发送Ajax查询请求并处理
var request = new XMLHttpRequest();
request.open("POST","zan.php?name="+name,"ture");
request.send();
request.onreadystatechange = function(){
  if(request.readyState === 4){
     if(request.status === 200){
     document.getElementById(num).innerHTML = request.responseText;
     }else{
      alert("发生错误"+request.status);
     }
  }
 }
}
function no_zan(){
	alert("请先登录");
}
</script>
<!--Include flickerplate-->
<link rel="stylesheet" type="text/css" href="css/bottom.css">
<link rel="stylesheet" type="text/css" href="css/animate.css">
<link rel="stylesheet" type="text/css" href="css/header.css">
<link rel="stylesheet" type="text/css" href="css/community_content.css">
<?php
   if(@$_GET['type']=='post'){
      _query(
      	     "INSERT INTO community_comment ( 
      	                             name,
      	                             username,
      	                             content,
      	                             time)
      	                            VALUES( 
      	                             1,
      	                            '{$_SESSION['email']}',
      	                            '{$_POST['community_textarea']}',
      	                            NOW())"
      	                            );
      _location("发布成功","community_content.php");
   }
?>
<?php
   require"includes/tittle.php";
?>
</head>
<body>
<div id="hf">
<ul>
<li><a href="http://localhost/wz/">网站首页</a></li>
<li><a href="http://localhost/wz/jc.php">教程安排</a></li>

<li><a href="http://localhost/wz/insed.php">视频教学</a></li>	
<li><a href="http://localhost/wz/tw.php">图文详解</a></li>
<li><a href="http://localhost/wz/articles-list.php">球论英雄</a></li>
<li class="end"><a href="http://localhost/wz/chose.php">装备推荐</a></li>
</ul>
			<div class="community_on">
				<div class="community_on_on">
					<div class="community_on_name">
						<img src="face/face18.jpg" width="40px" height="40px"><strong>        123456:</strong>
					</div>
				</div>
				<div class="community_on_content">
					<p>
						羽毛球步法让很多初学者，倍感头疼，最大的问题是怎么也踩不到拍子上，无从知晓自己练习时正确与否，使效果大打折扣。在这里提供一点自己的亲身体会，相信会对初学者有所帮助。（以右撇子为例）
					</p>1、首先要会判断自己步法是否正确。
初学者常有这样的困惑：不知道该先出那只脚，就像赵丽蓉老师扮演的那位英雄的母亲。这一点很简单，单数的步法先出右脚，也就是需要一步、三步的出右脚。双数的步子先出左脚。瞧瞧那些顶尖高手，基本上用两步就可以丈量整个球场了。	
					</p>
					<p>实际上，羽毛球步法最重视的是最终的制动腿。无论你启动时先迈哪只脚，都需要用发力腿将身体重心升起来，移动过程中再调整，而且发力腿（同时也是制动腿）直接关系到你的击球和发力。这也有一个掌握窍门：只要你最后一步是右脚最后落地就是正确的，或者说，是右脚迈向击球方向。不论是前场上网，还是后退后场，都是如此。因为对于右撇子来说，右腿是发力腿，同时也是制动腿，右脚在前才能保证身体的稳定，为准确击球做好准备。
					</p>
                    <p>[关键点]：右脚最后落地。</p>
                    <p>[注意点]：制动脚（右撇子就是右脚）必须外撇落地，以防滑倒。</p>
                    <p>2、随时垫步。
初学者大都遇到过这种情况:眼睁睁看着羽毛球飞来，就是够不到。对于男生，遇到这种情况就是玩了命一个大跨步；女生则是用力弯下腰抻长了胳膊。这样都是错误的。
口诀如此唱道：跨大步不如垫小步。垫步是羽毛球步法中最基础的过渡步法。很多人不重视垫步，其实最基础的往往是最重要的。在无球状态下，人千万不要定定地站在原地，就是球场中心也不可以，脚下要轻轻垫步，调整好重心在发力腿上，以便随时启动。垫步的作用是让身体腾起来，迅速转换到左腿蹬地，以便能够最大幅度的跨步出去。做个简单的比喻：垫步就是用左脚轻轻去踢右脚的脚后跟，有节奏的跳跃。</p>
<p>3、启动不是迈而是跃
移动时第一个动作不是迈步子，而是双脚同时跳起来，然后再转身或是出脚。</p>
				</div>
		    </div>
		    <div class="community_bottom">
		    	<div class="community_talk_on">
		    		<div class="community_form">
				        <form method="post" action="?type=post" >
				        	<textarea name="community_textarea" cols="80" rows="3" class="community_textarea" placeholder="赶紧留下点什么吧">
				        		
				        	</textarea>
				        	<br/>
				        	<div class="community_input_right">
				        		<input class="community_input input_size1" type="submit" value="发布" />
				        	</div>
				        </form>
		    	    </div>
			    	<div class="community_talk_off">
			    	<?php
			    	$_comment = _query("SELECT * FROM community_comment");
			    	$page = ceil(mysql_num_rows($_comment)/5);
			    	$_min = 0;
			    	$_max = 5;
			    	$_zan = 0;
			    	if(!!isset($_GET['page'])){
			    	 $_min = -5+5*$_GET['page'];
			    	 $_max = 5*$_GET['page'];
			    	}
                     $_comment = _query("SELECT * FROM community_comment ORDER BY time DESC limit $_min,$_max");
							while($_comments = _fetch_array_list($_comment)){
                               $_html = array();
                               $_html['id'] = $_comments['id'];
                               $_html['name'] = $_comments['name'];
                               $_html['username'] = $_comments['username'];
                               $_html['content'] = $_comments['content'];
                               $_html['time'] = $_comments['time'];
                               $_zan++;
                               
			    	?>
			    		<div class="community_comment">
			    			<div class="comment_author">
			    				<img src="face/face10.jpg">
			    				<span>
			    					hua1995116
			    				</span>
			    			</div>
			    			<div class="comment_d">
			    				<div class="comment_top">
			    					<?php
                                     echo $_html['content'];
			    					?>
			    				</div>
			    				<div class="comment_bottom">
			    					<div class="comment_bottom_left">
			    						<?php
			    						  _time($_html['time']);
			    						?>
			    					</div>
			    					<div class="comment_bottom_right">
			    						回复
			    						<span id="<?php echo $_zan; ?>">
                                        <?php
                                      if(!!isset($_SESSION['email'])){
                                      	$_is_zan = _fetch_array("SELECT zan_user,comment_id FROM comment_zan WHERE zan_user='{$_SESSION['email']}' AND comment_id='{$_html['id']}' ");
                                        if($_is_zan['zan_user']==$_SESSION['email']){
                                        ?>
			    						<?php
                                      }else{
                                           echo '<img src="img/zan_no.jpg" onclick="zan('.$_html['id'].','.$_zan.')"/>';
                                       }
                                      }else{
                                      	?>

                                       	<?php   
                                          }
			    						?>
			    						</span>
			    					</div>
			    				</div>
			    			</div>
			    		</div>
                        <?php
                        }
                        for($i=0;$i<$page;$i){
                        	echo '<a href="community_content.php?page='.++$i.'">'.$i.'<a/>';
                        }
                        ?>
			    	</div>
		        </div>
		</div>
        
	</div>
	<div class="col-md-3">
        	<div class="community_member">
			    <div class="community_member_tittle">
			    	已参加用户
			    </div>
				<div class="community_member_example">
					<dl class="community_member_dl">
						<dd class="community_member_img">
							<img src="face/face20.jpg">
						</dd> 
						<dd class="community_member_name">
							<a href="#">hua1995116</a>
							<p>永远的乖孩子</p>
						</dd>
					</dl>
					<dl class="community_member_dl">
						<dd class="community_member_img">
							<img src="face/face12.jpg">
						</dd> 
						<dd class="community_member_name">
							<a href="#">123456</a>
							<p>永远的乖孩子</p>
						</dd>
					</dl>
					<dl class="community_member_dl">
						<dd class="community_member_img">
							<img src="face/face14.jpg">
						</dd> 
						<dd class="community_member_name">
							<a href="#">123456</a>
							<p>永远的乖孩子</p>
						</dd>
					</dl>
					<dl class="community_member_dl">
						<dd class="community_member_img">
							<img src="face/face15.jpg">
						</dd> 
						<dd class="community_member_name">
							<a href="#">hua1995116</a>
							<p>永远的乖孩子</p>
						</dd>
					</dl>
					<dl class="community_member_dl">
						<dd class="community_member_img">
							<img src="face/face16.jpg">
						</dd> 
						<dd class="community_member_name">
							<a href="#">hua1995116</a>
							<p>永远的乖孩子</p>
						</dd>
					
				</div>
			</div>
        </div>
</div>


</body>
</html>