<?php
session_start();
$_md_code=4;
for($i=0;$i<$_md_code;$i++){
	$_nmsg .=dechex(mt_rand(0,15));
}
$_SESSION['code']=$_nmsg;

$_width=75;
$_height=25;

$_img=imagecreatetruecolor($_width,$_height);

$_white=imagecolorallocate($_img,255,255,255);
imagefill($_img,0,0,$_white);

$_flag=false;
if($_flag){

$_black=imagecolorallocate($_img,mt_rand(0,255),mt_rand(0,255),mt_rand(0,255));
imagerectangle($_img,0,0,$_width-1,$_height-1,$_black);
}

for($i=0;$i<6;$i++){
	$_md_color=imagecolorallocate($_img,mt_rand(0,255),mt_rand(0,255),mt_rand(0,255));
	imageline($_img,mt_rand(0,$_width),mt_rand(0,$_height),mt_rand(0,$_width),mt_rand(0,$_height),$_md_color);
}


for($i=0;$i<100;$i++){
	$_md_color=imagecolorallocate($_img,mt_rand(200,255),mt_rand(200,255),mt_rand(200,255));
	imagestring($_img,1,mt_rand(1,$_width),mt_rand(1,$_height),'*',$_md_color);	
}

for($i=0;$i<strlen($_SESSION['code']);$i++){
	$_md_color=imagecolorallocate($_img,mt_rand(0,100),mt_rand(0,150),mt_rand(0,255));
	imagestring($_img,5,$i*$_width/$_md_code+mt_rand(1,10),mt_rand(1,$_height/2),$_SESSION['code'][$i],$_md_color);
}

header('Content-Type:image/png');
imagepng($_img);
imagedestory($_img);











?>