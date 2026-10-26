<?php 
@session_start();
require 'mysql_func.php';
require 'function_func.php';
date_default_timezone_set('Asia/Shanghai');
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PWD', '123');
define('DB_NAME', 'testguest');


// 初始化数据库
_connect();//连接数据库
_select_db();//选择数据库
_set_names();//选择字符集

require 'includes/common_reg.php';
require 'includes/commonlogin_inc.php';
 ?>

