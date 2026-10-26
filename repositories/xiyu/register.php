<?php
require 'includes/header.inc.php';
require 'includes/register.func.php';
if(@$_GET['action']=='register'){

   _check_code($_POST['code'],$_SESSION['code']);
   
   $_clean=array();
   $_clean['username']=_check_username($_POST['username']);
   $_clean['password']=_check_password($_POST['password'],$_POST['notpassword']);
   $_clean['sex']=$_POST['sex'];
   $_clean['email']=_check_email($_POST['email']);
   $_clean['qq']=_check_qq($_POST['qq']);
   _query("INSERT INTO tg_user(
                           tg_username,
					       tg_password,
					        tg_sex,
							tg_email,
							tg_qq
                            ) VALUES (
							'{$_clean['username']}',
							'{$_clean['password']}',
							'{$_clean['sex']}',
							'{$_clean['email']}',
							'{$_clean['qq']}'
						
							)");
					mysql_close();
							
	_location('恭喜你，注册成功！','index.php');
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>习羽</title>
<link rel="stylesheet" href="css/basic.css">
<link rel="stylesheet" href="css/hread.css">
<link rel="stylesheet" href="css/register.css">
</head>

<body>
<div id="zhuce">
<h1>新用户注册</h1>
<form method="post" action="register.php?action=register">
<input type="hidden" name="uniqid" value="<?php echo $_uniqid?>"/>
<dl>
<dd>用 户 名：<input type="text" name="username" class="text"/></dd>
<dd>设置密码：<input type="password" name="password" class="text"/></dd>
<dd>确认密码：<input type="password" name="notpassword" class="text"/></dd>
<dd>性  别：<input type="radio" name="sex" value="男" checked="checked"/>男<input type="radio" name="sex" value="女"/>女</dd>
<dd class="spsc">视频上传:</dd>
<dd class="sm"><input type="file" name="file" class="v_btn"></dd>
<dt>*上传视频后我们会审核，并发您成绩单，以便您了解自己的水平从而进行进一步学习。</dt>
<dd>电子邮件：<input type="text" name="email" class="text"/></dd>
<dd>Q   Q 号码：<input type="text" name="qq" class="text"/></dd> 
<dd>验 证 码：<input type="text" name="code" class="text yzm"/><img src="code.php" id="code" onclick="javascript:this.src='code.php?tm='+Math.random()"/></dd>
<dd><input type="submit" class="submit" name="submit" value="立即注册"/></dd>
</dl>
</form>
</div>
</body>
</html>