<?php

function _check_username($_string){
	
	return $_string;
}

function _check_password($_first_pass,$_end_pass){
	if(strlen($_first_pass)<5){
		_alert_back('密码不得小于4位');
		
	}
	if($_first_pass!=$_end_pass){
	
	_alert_back('密码前后不一致');	
	}
	
	return sha1($_first_pass);
}

function _check_email($_string){
	/*if(!empty($_string)){
		return null;}
	else{
	
if(!preg_match('/^[\w\-\.]+@[\w\-\.]+(\.\w+)+$/',$_string)){
	_alert_back('邮箱格式不正确');
	
}}*/
 return $_string;
	
	
}
function _check_qq($_string){
	if(empty($_string)){
		return null;	
	}else{
		if(!preg_match('/^[1-9]{1}[\d]{4,9}$/',$_string)){
			_alert_back('QQ号码不正确!');
		}
	}
	return $_string;
}

function _check_code($_first_code,$_end_code){
	
	
	/*if($_first_code!=$_end_code){
	
	_alert_back('验证码不正确');	
	}*/
	
	
}

function _check_uniqid($_first_uniqid,$_end_uniqid){
	
	if((strlen($_first_uniqid)!=40)||($_first_uniqid!=$_end_uniqid)){
		_alert_back('唯一标识符异常');
	}
	
}


?>