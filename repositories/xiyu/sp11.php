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
<p>首页&gt;视频教学&gt;网前基础球</p>
</div>
<div id="spjc">
        <div class="maincon">
            <script type="text/javascript" src="js/swfobject.js"></script>            
            <div id="flashcontent"><a href="http://www.macromedia.com/go/getflashplayer">Get the Flash Player</a> to see this player.</div>
			<script type="text/javascript">
                var so = new SWFObject("flvplayer.swf","single", "1000","400","8");
                so.addVariable("allowfullscreen","true");
				so.addParam("wmode", "transparent");
                so.addVariable("file","sp11.flv");
                so.addVariable("image","images/preview.jpg");
                so.addVariable("width","1000");
                so.addVariable("height","400");
				so.addVariable("autostart","false");
                so.write("flashcontent");
            </script>
            </div>

</div>
<div id="cnxh">
<a class="sp_a" href="insed.php">更多&gt;&gt;</a>
<h1>猜你喜欢</h1>
<dl>
<dd class="yc_1"><a href="sp1.php"><img  class="tp_1" src="image/sp3.jpg" alt="第一" /></a><div id="yc"><a href="sp3.php"><img src="image/tb_1.png" /></a></div></dd>
<dt>高远球步伐（基础步伐）</dt>
</dl>
<dl>
<dd class="yc_1"><a href="sp2.php"><img  class="tp_1" src="image/sp2.jpg" alt="第一" /></a><div id="yc"><a href="sp2.php"><img src="image/tb_1.png" /></a></div></dd>
<dt>高远球步伐（高级步伐）</dt>
</dl>
<dl>
<dd class="yc_1"><a href="#"><img  class="tp_1" src="image/sp4.jpg" alt="第一" /></a><div id="yc"><a href="sp4.php"><img src="image/tb_1.png" /></a></div></dd>
<dt>双打反手接杀</dt>
</dl>
<dl>
<dd class="yc_1"><a href="#"><img  class="tp_1" src="image/sp6.jpg" alt="第一" /></a><div id="yc"><a href="sp6.php"><img src="image/tb_1.png" /></a></div></dd>
<dt>中场接杀钩对角</dt>
</dl>
</div>
<?
require 'includes/footer.inc.php';
?>

</body>
</html>