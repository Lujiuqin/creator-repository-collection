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
<li><a href="http://localhost/wz/articles-list.php">球论英雄</a></li>
<li><a href="http://localhost/wz/chose.php">装备推荐</a></li>
<li class="end"><a href="http://localhost/wz/qg.php">附近球馆</a></li>
</ul>
			<div class="community_on">
				<div class="community_on_on">
					<div class="community_on_name">
						<img src="face/face20.jpg" width="40px" height="40px"><strong>        hua1995116:</strong>
					</div>
				</div>
				<div class="community_on_content">
					<p>
						1.所谓热身，就是在头十分钟内先用较轻柔的力量来击球，可以拉拉半场高球、吊球、搓球、平弹球（相对于平抽球而言），逐渐才过渡到拉高球、杀球、平抽球。让球拍在拉线后先有个舒筋活络的过程，可以让线床张力分布更均匀，减少突然断线的风险。
					</p>
					<p>2.特别是拉了高磅数的球拍，因为突然断线导致拍框变形折断的情况也是经常有的。	
					</p>
					<p>
						3.需要注意的是，很多新线断裂的情况并非正常磨损所致，而是击球时击中了线床边缘接近拍框的部分，而且最多是12点的位置，这些部位的张力较中央甜区部位远高，极容易被崩断，而且因为断线后移位，很多人以为是线的质量问题，或是以为自己功力大进了，其实都是自己的击球不正造成的。
					</p>
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
			    				<img src="face/face18.jpg">
			    				<span>
			    					<?php echo $_html['name'];?>
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