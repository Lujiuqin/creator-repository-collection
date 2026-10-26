<?php
namespace Admin\Controller;
use Think\Controller;
class VideoController extends CommonController {

    public function index(){
    	$video = M('Video');
        $count = $video->where('status=1')->count();
        $Page = new \Think\Page($count,5);
        $Page->setConfig('prev',  '<span aria-hidden="true">上一页</span>');
        $Page->setConfig('next',  '<span aria-hidden="true">下一页</span>');
        $Page->setConfig('first', '<span aria-hidden="true">首页</span>');
        $Page->setConfig('last',  '<span aria-hidden="true">尾页</span>');
        $Page->setConfig ( 'theme', '<li><a>当前%NOW_PAGE%/%TOTAL_PAGE%</a></li>  %FIRST% %UP_PAGE% %LINK_PAGE% %DOWN_PAGE% %END%' );
        $show = $Page->show();
        $list = $video->where('status=1')->order('id desc')->limit($Page->firstRow.','.$Page->listRows)->select();
        $this->assign('list',$list);
        $this->assign('page',$show);
        $this->display();
    }
    public function view(){
        $id = I('get.id');
        $video = M('Video')->field('file')->where(array('id'=>$id))->select();
        $this->videoName = $video['0']['file'];
        $this->display();
    }
    public function edit(){
        $id = I('get.id');
        if ($id == null) {
            $this->error('非法操作');
        }
        $this->display();
    }
    public function delete(){
        $id = I('get.id');
        if ($id == null) {
            $this->error('非法操作');
        }
        $video = M('Video');
        $result = $video->where(array('id'=>$id))->delete();
        if ($result) {
            $this->success('删除成功',U('Video/index'));
        }else{
            $this->error('删除失败');
        }
    }


}
