<?php 
if(@$_GET['action']=='register'){
	include 'includes/register_func.php';
	$_clean=array();
	$_clean['username']=_check_username($_POST['username']); 
	$_clean['password']=_check_password($_POST['password'], $_POST['repassword']); 
	$_clean['email']=$_POST['email'];

	_is_repeat(
				"SELECT username FROM members WHERE username='{$_clean['username']}' LIMIT 1",
				'对不起，此用户已被注册'
	);
	//新增用户//在双引号里直接放变量是可以的但如果是数组标量就必须加上{}
mysql_query(
			"INSERT INTO members(
								username,
								password,
								email,
								regtime
								)
						 VALUES(
						 		'{$_clean['username']}',
						 		'{$_clean['password']}',
						 		'{$_clean['email']}',
						 		 NOW()
						 		)"
);
	if(_affect_row()==1){
		_close();
	//跳转
	_location('注册成功', 'class_it.php');}
		else{
	_close();
	//跳转
	_location('注册失败', 'class_it.php');
  }
}



 ?>