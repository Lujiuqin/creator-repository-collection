<?php
@session_start();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>习羽</title>
<link rel="stylesheet" href="css/basic.css">
<link rel="stylesheet" href="css/jc.css">
</head>

<body>
<?php

if(!isset($_SESSION['user'])){
function _location($_info,$_url){
	echo "<script type='text/javascript'>alert('$_info');location.href='$_url';</script>";
	exit();
	
}
	 _location('请先登录','index.php');
	 }
require 'includes/header.inc.php';
?>
<div id="jctp">
<a href="jcc1.php">
<img  border="0" class="one" src="image/2.png"/>
</a>
<a href="jcc2.php">
<img border="0" class="two" src="image/1.png"/>
</a>
<a href="jcc3.php">
<img border="0" class="three" src="image/3.png"/>
</a>
<a href="jcc1.php" class="ex1">初级教程</a>
<a href="jcc2.php" class="ex2">中级教程</a>
<a href="jcc3.php" class="ex3">高级教程</a>
</div>
<div id="footer">
<p>版权所有 翻版必究</p>
</div>
</body>
</html>