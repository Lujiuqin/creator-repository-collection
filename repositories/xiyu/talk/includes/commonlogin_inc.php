<?php


//开始处理登录状态
if(!isset($_SESSION['email'])){

if(@$_GET['action']=='login'){
	$_login=array();
	$_login['email']=$_POST['email'];
	$_login['password']=$_POST['password'];
	//到数据库验证
	
	if(!!$_rows=_fetch_array("SELECT email,password  FROM members WHERE email='{$_login['email']}' and password= '{$_login['password']}' LIMIT 1")){
			_close();
		//生成session
		$_SESSION['email']=$_rows['email'];
		 _location('','class_it.php');
	}else{
		_close();
		_location('用户名密码不正确或未激活!','class_it.php');

	}
 }
}
?>