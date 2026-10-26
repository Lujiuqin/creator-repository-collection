<?php 
if(!function_exists('_alert_back')){
	exit('_alert_back()函数不存在。请检查');
	}
	//判断函数是否存在
if(!function_exists('_mysql_string')){
		exit('mysql_string()函数不存在。请检查');
	}

function _check_username($_string){
	$_string=trim($_string);
	if(mb_strlen($_string,'utf-8') < 2||mb_strlen($_string,'utf-8') > 20)
	{
		_alert_back('用户名格式错误');
	}
	return $_string;
}
function _check_password($_first_pass,$_end_pass,$_min_num=6,$_max_num=20){
	//判断密码
	if(strlen($_first_pass)<$_min_num){
		_alert_back('密码不得小于'.$_min_num.'位!');
	}
	if(strlen($_first_pass)>$_max_num){
		_alert_back('密码不得大于'.$_max_num.'位!');
	}
	//密码确认必须一致
	if($_first_pass!=$_end_pass){
		_alert_back('密码和确认密码不一致');
	}
	//把密码返回
	return $_first_pass;
	
}



 ?>
