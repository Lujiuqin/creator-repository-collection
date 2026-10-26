<?php

function _connect(){
	//global  表示的是全局变量的意思,意图是此变量在函数外也能访问
	global $_conn;
	if(!$_conn=@mysql_connect(DB_HOST,DB_USER,DB_PWD)){
		exit('数据库连接失败');
	}
}

function _select_db(){
	
	if(!mysql_select_db(DB_NAME))
	{
		exit('找不到指定数据库');
	}
}
function _set_names(){
	if(!mysql_query('SET NAMES UTF8')){
		exit('字符集错误');
	}
}

function _query($_sql){
	if(!$_result=mysql_query($_sql)){
		exit('SQL执行失败');
	}
     return $_result;
}


function _close(){
	if(!mysql_close()){
		exit('数据库关闭异常');
	}
	
	
}
function _alert_back($_info){
	echo "<script type='text/javascript'>alert('$_info');history.back();</script>";
	exit();
}

function _location($_info,$_url){
	echo "<script type='text/javascript'>alert('$_info');location.href='$_url';</script>";
	exit();
	
}
?>