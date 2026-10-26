<?php
namespace Home\Controller;
use Think\Controller;
class ResultController extends CommonController {
    public function index(){
      //竞赛成果
      $JsResult = M("jscg");
      $JsCount = $JsResult->count();
      $JsPage = new \Think\Page($JsCount,6);
      $JsShow = $JsPage->show();
      $JsList = $JsResult->limit($JsPage->firstRow.','.$JsPage->listRows)->select();
      $this->assign('JsList',$JsList);
      $this->assign('JsShow',$JsShow);

      //论文成果
      $LwResult = M("lwcg");
      $LwCount = $LwResult->count();
      $LwPage = new \Think\Page($LwCount,6);
      $LwShow = $LwPage->show();
      $LwList = $LwResult->limit($LwPage->firstRow.','.$LwPage->listRows)->select();
      $this->assign('LwList',$LwList);
      $this->assign('LwShow',$LwShow);

      $this->display();
    }
    public function show(){
        $this->display();
    }
}