<?php
namespace Admin\Controller;
use Think\Controller;
class EmptyController extends Controller {
	public function _empty(){
		header("Content-Type: text/html; charset=utf-8");
    	echo "操作错误！请拨打688880咨询";
    }
}