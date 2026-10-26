<?php
@session_start();
require 'mysql.func.php';

@header("Content-type:text/html;charset=utf-8");
define('DB_HOST','localhost');
define('DB_USER','root');
define('DB_PWD','root');
define('DB_NAME','testguest');

_connect();
_select_db();
_set_names();
?>