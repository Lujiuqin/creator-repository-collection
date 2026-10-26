<?php
namespace Admin\Controller;
use think\Controller;
class MessageController extends CommonController {
	public function index(){
		A('inbox');
		A('sent');
		A('draft');
		A('trash');
    	$this->display();
    }
    public function write(){
    	$user = M('User')->field('id,username')->select();
    	$this->user = $user;
		$this->display();
    }
    public function send(){
        $message = M('Message');
        $data['title'] = $_POST['title'];
        $data['content'] = $_POST['content'];
        $data['admin'] = 1;
        $data['user'] = $_POST['user'];
        $data['time'] = date('Y-m-d H:i:s');
        $data['status'] = 1;
        $result = $message->data($data)->add();
        if ($result) {
            $this->success('发送成功',U('Message/index'));
        }else{
            $this->error('发送失败');
        }
    }
    public function save(){
        $message = M('Message');
        $data['title'] = $_POST['title'];
        $data['content'] = $_POST['content'];
        $data['admin'] = 1;
        $data['user'] = $_POST['user'];
        $data['time'] = date('Y-m-d H:i:s');
        $data['status'] = 2;
        $result = $message->data($data)->add();
        if ($result) {
            $this->success('保存成功',U('Message/index'));
        }else{
            $this->error('保存失败');
        }
    }
    public function see(){
        $id = I('get.id');
        if (!$id) {
            $this->error('非法操作');
        }
        $status = M('Message')->field('status')->where(array('id'=>$id))->select();
        $message = M()->table(array('personal_message'=>'this1','personal_user'=>'this2'))->where("this1.id='$id' AND this1.user=this2.id")->field('this1.*,this2.username')->select();
        $this->message = $message;
        if ($status['0']['status'] == 0) {
            $data['status'] = 1;
            M('Message')->where(array('id'=>$id))->save($data);
        }
		$this->display();
    }
    public function delete(){
        $id = I('get.id');
        if ($id) {
            $data['status'] = 3;
            M('Message')->where(array('id'=>$id))->save($data);
            $this->success('删除成功',U('Message/index'));
        }else{
            $this->error('删除失败');
        }
    }
    public function inbox(){
		$inbox = M()->table(array('personal_message'=>'this1','personal_user'=>'this2'))->where('this1.user=this2.id AND this1.status=0')->field('this1.*,this2.username')->select();
		$this->inbox = $inbox;
		$this->display();
    }
    public function sent(){
		$sent = M()->table(array('personal_message'=>'this1','personal_user'=>'this2'))->where('this1.user=this2.id AND this1.status=1')->field('this1.*,this2.username')->select();
		$this->sent = $sent;
		$this->display();
    }
    public function draft(){
		$draft = M()->table(array('personal_message'=>'this1','personal_user'=>'this2'))->where('this1.user=this2.id AND this1.status=2')->field('this1.*,this2.username')->select();
		$this->draft = $draft;
		$this->display();
    }
    public function trash(){
		$trash = M()->table(array('personal_message'=>'this1','personal_user'=>'this2'))->where('this1.user=this2.id AND this1.status=3')->field('this1.*,this2.username')->select();
		$this->trash = $trash;
		$this->display();
    }

}