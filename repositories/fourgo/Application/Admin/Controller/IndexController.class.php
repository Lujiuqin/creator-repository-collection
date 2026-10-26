<?php
namespace Admin\Controller;
use Think\Controller;
class IndexController extends CommonController {

    public function index(){
    	$website = M('Website')->where(array('id' =>1 ))->select();
    	$admin = session('admin');
    	$name = M('Admin')->where(array('name'=>$admin))->select();
    	if(!$name){
    		$this->error('请登录管理员账号',U('Login/index'));
		}else{
			$this->website = $website;
    		$this->display();
    	}
    }

}
