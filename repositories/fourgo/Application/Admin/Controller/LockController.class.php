<?php
namespace Admin\Controller;
use think\Controller;
class LockController extends CommonController {
	public function index(){
		$admin = M('Admin');
		$name = session('admin');
		$data = $admin->field('name,lock_password')->where(array('name'=>$name))->select();
		$this->display();
    }
}