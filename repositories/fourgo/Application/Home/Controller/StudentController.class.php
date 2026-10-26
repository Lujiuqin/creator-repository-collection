<?php
namespace Home\Controller;
use Think\Controller;
class StudentController extends CommonController {
    public function index(){

        $Student = M("xzfc");
        $count = $Student->count();
        $Page = new \Think\Page($count,6);
        $show = $Page->show();
        $list = $Student->limit($Page->firstRow.','.$Page->listRows)->select();
        $this->assign('list',$list);
        $this->assign('show',$show);

        $this->display();
    }
    public function show(){
        $this->display();
    }
}