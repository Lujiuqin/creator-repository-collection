<?php
namespace Admin\Controller;
use Think\Controller;
use Org\Net\IpLocation;
use Think\Upload;
class ManageController extends CommonController {

    public function index(){
		$list = M('User')->order('id')->select();
		$this->list = $list;
    	$this->display();
    }
    public function teacher(){
		$list = M('Teacher')->order('id')->select();
		$this->list = $list;
    	$this->display();
    }
    public function admin(){
		$list = M('Admin')->order('id')->select();
		$this->list = $list;
    	$this->display();
    }
    public function edit(){
    	$Ip = new \Org\Net\IpLocation('UTFWry.dat');
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$user = M('User')->where(array('id'=>$id))->select();
            $ip = $Ip->getlocation($user['0']['login_ip']);
            $user['0']['login_ip'] = $ip['country']." ".$ip['area'];
	    	$this->assign('user',$user);
	    	$study = M('Study')->where(array('userid'=>$id))->select();
	    	if ($study['0']['listen']<60) {
	    		$study['0']['listen']=60;
	    	}
	    	if ($study['0']['speak']<60) {
	    		$study['0']['speak']=60;
	    	}
	    	if ($study['0']['read']<60) {
	    		$study['0']['read']=60;
	    	}
	    	if ($study['0']['write']<60) {
	    		$study['0']['write']=60;
	    	}
	    	$this->assign('study',$study);
	    	$this->display();
	    }
    }
    public function editTeacher(){
        $Ip = new \Org\Net\IpLocation('UTFWry.dat');
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$teacher = M('Teacher')->where(array('id'=>$id))->select();
            $subject = M('Subject')->select();
            $this->subject = $subject;
            $ip = $Ip->getlocation($teacher['0']['login_ip']);
            $teacher['0']['login_ip'] = $ip['country']." ".$ip['area'];
	    	$this->assign('teacher',$teacher);
	    	$this->display();
	    }
    }
    public function editAdmin(){
        $Ip = new \Org\Net\IpLocation('UTFWry.dat');
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$admin = M('Admin')->where(array('id'=>$id))->select();
            $ip = $Ip->getlocation($admin['0']['login_ip']);
            $admin['0']['login_ip'] = $ip['country']." ".$ip['area'];
	    	$this->assign('admin',$admin);
	    	$this->display();
	    }
    }
    public function changeInfo(){
    	$id = I('get.id');
    	if ($id == null && $_POST['submit']) {
    		$this->error('非法操作');
    	}else{
	    	$user = D('User');
            if (!$user->create()){
                exit($user->getError());
            }
            $username = $_POST['username'];
            $num = $user->where(array('username'=>$username))->select();
            if ($num) {
                $this->error('用户名已存在');
            }else{
                $user->where(array('id'=>$id))->save($data);
            }
	    	R('Manage/edit',array('id'=>$id));
	    	$this->display('edit');
    	}
    }
    public function changeInfoTeacher(){
    	$id = I('get.id');
    	if ($id == null && $_POST['submit']) {
    		$this->error('非法操作');
    	}else{
	    	$teacher = D('Teacher');
            if (!$teacher->create()){
                exit($teacher->getError());
            }
            $username = $_POST['name'];
            $num = $teacher->where(array('name'=>$username))->select();
            if ($num) {
                $this->error('用户名已存在');
            }else{
                $teacher->where(array('id'=>$id))->save($data);
            }
	    	R('Manage/editTeacher',array('id'=>$id));
	    	$this->display('editTeacher');
    	}
    }
    public function changeInfoAdmin(){
    	$id = I('get.id');
    	if ($id == null && $_POST['submit']) {
    		$this->error('非法操作');
    	}else{
	    	$admin = D('Admin');
            if (!$admin->create()){
                exit($admin->getError());
            }
	    	$admin->where(array('id'=>$id))->save($data);
	    	R('Manage/editAdmin',array('id'=>$id));
	    	$this->display('editAdmin');
    	}
    }
    public function changePassword(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$data['password'] = md5($_POST['password']);
	    	$user = M('User');
	    	$result = $user->where(array('id'=>$id))->save($data);
            if ($result) {
                $this->success('修改成功');
            }else{
                $this->error('修改失败');
            }
	    	R('Manage/edit',array('id'=>$id));
	    	$this->display('edit');
    	}
    }
    public function changePasswordTeacher(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$data['password'] = md5($_POST['password']);
	    	$teacher = M('Teacher');
	    	$result = $teacher->where(array('id'=>$id))->save($data);
            if ($result) {
                $this->success('修改成功');
            }else{
                $this->error('修改失败');
            }
	    	R('Manage/editTeacher',array('id'=>$id));
	    	$this->display('editTeacher');
    	}
    }
    public function changePasswordAdmin(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$data['password'] = md5($_POST['password']);
	    	$admin = M('Admin');
	    	$result = $admin->where(array('id'=>$id))->save($data);
            if ($result) {
                $this->success('修改成功');
            }else{
                $this->error('修改失败');
            }
            R('Manage/editAdmin',array('id'=>$id));
            $this->display('editAdmin');
        }
    }
    public function changeLockPasswordAdmin(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$data['lock_password'] = md5($_POST['lock_password']);
	    	$admin = M('Admin');
	    	$result = $admin->where(array('id'=>$id))->save($data);
            if ($result) {
                $this->success('修改成功');
            }else{
                $this->error('修改失败');
            }
	    	R('Manage/editAdmin',array('id'=>$id));
	    	$this->display('editAdmin');
    	}
    }
    public function changeImage(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$upload = new \Think\Upload();
	    	$upload->maxSize   =     10*1024*1024;
	    	$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg','bmp');
	    	$upload->rootPath  =     './Uploads/';
	    	$upload->savePath  =     '/image/user/';
	    	$upload->autoSub   =     false;
	    	$upload->saveName  =     time().'_'.mt_rand();
	    	$info   =   $upload->upload();
    	    if(!$info) {
    	    	$this->error($upload->getError());
    	    }else{
    	    	foreach($info as $file){
    	    	$data['face'] = $file['savename'];
    	    	M('User')->where(array('id'=>$id))->save($data);
    	    	R('Manage/edit',array('id'=>$id));
	    		$this->display('edit');
    	    	}
    	    }
    	}
    }
    public function changeImageTeacher(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$upload = new \Think\Upload();
	    	$upload->maxSize   =     10*1024*1024;
	    	$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg','bmp');
	    	$upload->rootPath  =     './Uploads/';
	    	$upload->savePath  =     '/image/teacher/';
	    	$upload->autoSub   =     false;
	    	$upload->saveName  =     time().'_'.mt_rand();
	    	$info   =   $upload->upload();
    	    if(!$info) {
    	    	$this->error($upload->getError());
    	    }else{
    	    	foreach($info as $file){
    	    	$data['face'] = $file['savename'];
    	    	M('Teacher')->where(array('id'=>$id))->save($data);
    	    	R('Manage/editTeacher',array('id'=>$id));
	    		$this->display('editTeacher');
    	    	}
    	    }
    	}
    }
    public function changeImageAdmin(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$upload = new \Think\Upload();
	    	$upload->maxSize   =     10*1024*1024;
	    	$upload->exts      =     array('jpg', 'gif', 'png', 'jpeg','bmp');
	    	$upload->rootPath  =     './Uploads/';
	    	$upload->savePath  =     '/image/admin/';
	    	$upload->autoSub   =     false;
	    	$upload->saveName  =     time().'_'.mt_rand();
	    	$info   =   $upload->upload();
    	    if(!$info) {
    	    	$this->error($upload->getError());
    	    }else{
    	    	foreach($info as $file){
    	    	$data['face'] = $file['savename'];
    	    	M('Admin')->where(array('id'=>$id))->save($data);
    	    	R('Manage/editAdmin',array('id'=>$id));
	    		$this->display('editAdmin');
    	    	}
    	    }
    	}
    }
    public function delete(){
    	$id = I('id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	M('User')->where(array('id'=>$id))->delete();
	    	R('Manage/index');
	    	$this->display('index');
	    }
    }
    public function deleteTeacher(){
    	$id = I('id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	M('Teacher')->where(array('id'=>$id))->delete();
	    	R('Manage/teacher');
	    	$this->display('teacher');
	    }
    }
    public function deleteAdmin(){
    	$id = I('id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	M('Admin')->where(array('id'=>$id))->delete();
	    	R('Manage/admin');
	    	$this->display('admin');
	    }
    }
    public function ban(){
    	$id = I('id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
    		$status = I('status');
	    	if ($status) {
	    		$data['status'] = 0;
	    	}else{
	    		$data['status'] = 1;
	    	}
	    	M('User')->where(array('id'=>$id))->save($data);
	    	R('Manage/index');
	    	$this->display('index');
    	}
    }
    public function banTeacher(){
    	$id = I('id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
    		$status = I('status');
	    	if ($status) {
	    		$data['status'] = 0;
	    	}else{
	    		$data['status'] = 1;
	    	}
	    	M('Teacher')->where(array('id'=>$id))->save($data);
	    	R('Manage/teacher');
	    	$this->display('teacher');
    	}
    }
    public function banAdmin(){
    	$id = I('id');
    	$rank = I('rank');
    	$name = session('admin');
    	$result = M('Admin')->where(array('name'=>$name))->select();
    	if ($id == null) {
    		$this->error('非法操作');
    	}
    	elseif($rank>=$result['0']['rank']){
    		$this->error('您的权限不够');
    	}else{
    		$status = I('status');
	    	if ($status) {
	    		$data['status'] = 0;
	    	}else{
	    		$data['status'] = 1;
	    	}
	    	M('Admin')->where(array('id'=>$id))->save($data);
	    	R('Manage/admin');
	    	$this->display('admin');
    	}
    }

}
