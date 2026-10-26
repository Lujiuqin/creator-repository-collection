<?php
namespace Home\Controller;
use Think\Controller;
class FourstepsSecondController extends Controller {
    public function index(){
    	$list = M('Step2')->where('status=1')->order('id')->select();
    	$this->list = $list;
    	$volist = M('Step2')->where('status=2')->order('id')->select();
    	$this->volist = $volist;
        $this->display();
    }
    public function detail(){
        $this->display();
    }
    public function declares(){
    	$step2 = M('Step2');
    	$data['title'] = $_POST['title'];
    	$data['student'] = $_POST['student'];
    	$data['tel'] = $_POST['tel'];
    	$data['teacher'] = $_POST['teacher'];
    	$data['telephone'] = $_POST['telephone'];
    	$data['file'] = time().'_'.mt_rand();
    	$data['time'] = date('Y-m-d H:i:s');
    	$data['sort'] = $_POST['sort'];
    	$data['status'] = 0;
    	$upload = new \Think\Upload();
        $upload->maxSize   =     50*1024*1024;
        $upload->exts      =     array('doc','docx');
        $upload->rootPath  =     './Uploads/';
        $upload->savePath  =     '/doc/';
        $upload->autoSub   =     false;
        $upload->saveName  =     $data['file'];
        $info   =   $upload->upload();
        if(!$info) {
            $this->error($upload->getError());
        }else{
        	$result = $step2->add($data);
            if ($result) {
                $this->success('提交申报成功',U('FourstepsSecond/index'));
            }else{
                $this->error($result->getError());
            }
        }
    }

    public function edit(){
    	$_id = I('id');
    	$list = M('Step2_do')->where(array('sid' => $_id ))->order('id','desc')->select();
    	$this->list = $list;
        $this->display();
    }

}