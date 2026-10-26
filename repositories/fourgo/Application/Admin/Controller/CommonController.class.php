<?php
namespace Admin\Controller;
use Think\Controller;
use Think\Session\Driver;
class CommonController extends Controller {

	public function _initialize() {
		empty($_COOKIE['color'])?cookie('color','default',time()+3600*24*30):C('color',$_COOKIE['color']);
		empty($_COOKIE['layout'])?cookie('layout','fluid',time()+3600*24*30):C('layout',$_COOKIE['layout']);
		empty($_COOKIE['header'])?cookie('header','fixed',time()+3600*24*30):C('header',$_COOKIE['header']);
		empty($_COOKIE['sidebar'])?cookie('sidebar','default',time()+3600*24*30):C('sidebar',$_COOKIE['sidebar']);
		empty($_COOKIE['footer'])?cookie('footer','default',time()+3600*24*30):C('footer',$_COOKIE['footer']);
		empty($_COOKIE['style_color'])?cookie('style_color','default',time()+3600*24*30):C('style_color',$_COOKIE['style_color']);
		// $bd_style['color'] = C('color');
		// $bd_style['layout'] = C('layout');
		// $bd_style['header'] = C('header');
		// $bd_style['sidebar'] = C('sidebar');
		// $bd_style['footer'] = C('footer');
		// $bd_style['style_color'] = C('style_color');
		// $this->bd_style = $bd_style;

		//if(!isset(session("uid"))){
            //$this->error("没有登录");
		// $this->theme('default');
		// if (!isset($_SESSION[C('USER_AUTH_KEY')])) {
 	// 		$this->redirect('Admin/Login/login');
 	// 	}
 	// 	$notAuth=in_array(MODULE_NAME, explode(',', C('NOT_AUTH_MODULE'))) || in_array(ACTION_NAME, explode(',', C('NOT_AUTH_ACTION')));
		// //echo($notAuth);die();
 	// 	if (C('USER_AUTH_ON') && !$notAuth) {
 	// 		import('ORG.Util.RBAC');
 	// 		RBAC::AccessDecision(GROUP_NAME) || $this->error('没有权限');//分组模式必须加该参数
 	// 	}

	    // if(!Session::is_set(C('USER_AUTH_KEY'))){
	    // 	$msg="用户没有登录";
	    // }else{
	    // 	$msg=Session::get(C('USER_AUTH_KEY'))."欢迎你回来！";
	    // }
	    // $this->assign('msg',$msg);
	    // $this->display('Index/show');
	}
	//空操作
	public function _empty(){
		$this->redirect("Admin/Index/index");
	}

	public function insert(){
		header("Content-Type:text/html; charset=utf-8");//防止出现乱码
		$user=$_POST['user'];
		$this->verifyCheck();
		$Pagemodel = D("user");
		$vo = $Pagemodel->create();
		if(false === $vo) die($Pagemodel->getError());
		$topicid = $Pagemodel->add(); //add方法会返回新添加的记录的主键值
		if($topicid){
		//$_SESSION[C('USER_AUTH_KEY')]=$user;//不知为什么用此句不成功
		Session::set(C("USER_AUTH_KEY"),$user);//将用户名写入Session
		echo "<script>alert('数据库添加成功');</script>";
		}
		else throw_exception("<script>alert('数据库添加失败');history.back();</script>");
	}

}
?>
