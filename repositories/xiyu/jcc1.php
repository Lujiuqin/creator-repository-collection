<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>习羽</title>
<link rel="stylesheet" href="css/basic.css">
<link rel="stylesheet" href="css/hread.css">
<link rel="stylesheet" href="css/jcc.css">
<script type="text/javascript" src="js/jquery-1.8.1.min.js"></script>
</head>

<body>
<?php
require 'includes/header.inc.php';
?>
<div id="ant">
<p>首页&gt;教程安排&gt;初级教程</p>
</div>
<div id="spjc">
        <div class="maincon">
            <script type="text/javascript" src="js/swfobject.js"></script>            
            <div id="flashcontent"><a href="http://www.macromedia.com/go/getflashplayer">Get the Flash Player</a> to see this player.</div>
			<script type="text/javascript">
                var so = new SWFObject("flvplayer.swf","single", "1000","400","8");
                so.addVariable("allowfullscreen","true");
				so.addParam("wmode", "transparent");
                so.addVariable("file","sp1.flv");
                so.addVariable("image","images/preview.jpg");
                so.addVariable("width","1000");
                so.addVariable("height","400");
				so.addVariable("autostart","false");
                so.write("flashcontent");
            </script>
            </div>

</div>
<div id="cove">
<div id="h_1">教程安排
</div>
<p><a href="jcc1.php" class="a1" id="prim">初级教程</a></p>
<p><a href="jcc2.php" class="a" id="mid">中级教程</a></p>
<p><a href="jcc3.php" class="a" id="hight">高级教程</a></p>
</div>
<div id="jcin">
<dl>
<dt>课时列表</dt>
<dd><a href="jcc1.php">羽毛球拍基本握法</a></dd>
<dd><a href="jcc2.php">基础步伐</a></dd>
<dd><a href="jcc3.php">近远发球</a></dd>
<dd><a href="jcc4.php">高远球</a></dd>
</dl>
</div>
<?
require 'includes/footer.inc.php';
?>
<script>
window.onload=function(){
	var prim=document.getElementById('prim');
	var mid=document.getElementById('mid');
	var hight=document.getElementById('hight');
	
			prim.onclick=function(){
		prim.className="a1";
		mid.className="a";
		hight.className="a";
		};
			mid.onclick=function(){
		mid.className="a1";
		prim.className="a";
		hight.className="a";
		};
			hight.onclick=function(){
		hight.className="a1";
		mid.className="a";
		prim.className="a";
		};
}
</script>
</body>
</html>