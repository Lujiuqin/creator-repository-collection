<?php
namespace Admin\Controller;
use think\Controller;
use Think\Upload;
class ResourceController extends CommonController {
	public function index(){
		$list = M('Vocabulary')->order('id')->select();
		$this->list = $list;
    	$this->display();
    }
    public function edit(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	$vocabulary = M('Vocabulary')->where(array('id'=>$id))->select();
	    	$this->assign('vocabulary',$vocabulary);
	    	$this->display();
	    }
    }
    public function delete(){
    	$id = I('id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
	    	M('Vocabulary')->where(array('id'=>$id))->delete();
	    	R('Resource/index');
	    	$this->display('index');
	    }
    }
    public function add(){
    	$this->display();
    }
    public function addRead(){
        $this->display();
    }
    public function addSave(){
        $vocabulary = M('Vocabulary');
        $data['word'] = $_POST['word'];
        $data['phonetic'] = $_POST['phonetic'];
        $data['explain'] = $_POST['explain'];
        $data['eg1'] = $_POST['eg1'];
        $data['eg2'] = $_POST['eg2'];
        $data['eg3'] = $_POST['eg3'];
        $data['memory'] = $_POST['memory'];
        $data['important'] = $_POST['important'];
        $upload = new \Think\Upload();
        $upload->maxSize   =     10*1024*1024;
        $upload->exts      =     array('mp3');
        $upload->rootPath  =     './Uploads/';
        $upload->savePath  =     '/mp3/';
        $upload->autoSub   =     false;
        $upload->saveName  =     $data['word'];
        $info   =   $upload->upload();
        if(!$info) {
            $this->error($upload->getError());
        }else{
            foreach($info as $file){
            $data['uk'] = $file['savename'];
            $result = $vocabulary->add($data);
                if ($result) {
                    $this->success('添加成功',U('Resource/index'));
                }else{
                    $this->error($result->getError());
                }
            }
        }
    }
    public function saveRead(){
        $read = M('Read');
        $result = $read->create();
        $result = $read->add();
        if ($result) {
            $this->success('添加成功',U('Resource/read'));
        }else{
            $this->error($result->getError());
        }
    }
    public function modify(){
    	$id = I('get.id');
    	if ($id == null) {
    		$this->error('非法操作');
    	}else{
    		$vocabulary = M('Vocabulary');
    		$data['word'] = $_POST['word'];
    		$data['phonetic'] = $_POST['phonetic'];
            $data['uk'] = $data['word'].".mp3";
    		$data['explain'] = $_POST['explain'];
    		$data['eg1'] = $_POST['eg1'];
    		$data['eg2'] = $_POST['eg2'];
    		$data['eg3'] = $_POST['eg3'];
    		$data['memory'] = $_POST['memory'];
    		$data['important'] = $_POST['important'];
    		$upload = new \Think\Upload();
	    	$upload->maxSize   =     10*1024*1024;
	    	$upload->exts      =     array('mp3');
	    	$upload->rootPath  =     './Uploads/';
	    	$upload->savePath  =     '/mp3/';
	    	$upload->autoSub   =     false;
	    	$upload->saveName  =     $data['word'];
	    	$info   =   $upload->upload();
	    	$result = $vocabulary->where(array('id'=>$id))->save($data);
            if ($result) {
                $this->success('修改成功',U('Resource/index'));
            }else{
                $this->error('没有修改内容');
            }
        }
    }

    public function read(){
        $read = M('Read');
        $count = $read->count();
        $Page = new \Think\Page($count,10);
        $Page->setConfig('prev',  '<span aria-hidden="true">上一页</span>');
        $Page->setConfig('next',  '<span aria-hidden="true">下一页</span>');
        $Page->setConfig('first', '<span aria-hidden="true">首页</span>');
        $Page->setConfig('last',  '<span aria-hidden="true">尾页</span>');
        $Page->setConfig ( 'theme', '<li><a>当前%NOW_PAGE%/%TOTAL_PAGE%</a></li>  %FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%' );
        $show = $Page->show();
        $list = $read->order('time desc')->limit($Page->firstRow.','.$Page->listRows)->select();
        $this->assign('list',$list);
        $this->assign('page',$show);
        $this->display();
    }
}