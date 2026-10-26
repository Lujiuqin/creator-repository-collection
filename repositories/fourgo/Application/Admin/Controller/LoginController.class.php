<?php
namespace Admin\Controller;
use Think\Controller;
class LoginController extends CommonController {

    public function index(){
    	$this->display();
    }

    public function loginCheck(){
    	$verify = I('verify','','htmlspecialchars');
   		if(!check_verify($verify)){
		    $this->error("验证码错误",U('index'));
		}else{
			$admin = M('Admin');
			$where['name'] = $_POST['username'];
			$data = $admin->field('name,password,status,face')->where($where)->select();
			$user['password'] = md5($_POST['password']);
			if ($data['0']['password'] != $user['password'] || $data['0']['status']==0) {
				$this->error("用户名或密码错误亦或许用户权限被限制！",U('index'));
			}else{
				session('admin',$data['0']['name']);
				session('face',$data['0']['face']);
				$this->redirect('Index/index');
			}
		}
    }

    public function loginOut(){
	    if(!empty($_SESSION['admin'])){
            unset($_SESSION['admin']);
            $this->success('退出成功',U('index'));
        }else{
            $this->error('已经退出了',U('index'));
        }
	}

	public function changeLogin(){
		unset($_SESSION['admin']);
		$this->redirect('Login/index');
	}

	public function unlock(){
		$admin = M('Admin');
		$where['name'] = session('admin');
		$data = $admin->field('lock_password')->where($where)->select();
		$user['password'] = md5($_POST['password']);
		if ($data['0']['lock_password'] != $user['password']) {
			$this->error("密码错误",U('Lock/index'));
		}else{
			$this->redirect('Index/index');
		}
	}

	public function forget(){
		unset($_SESSION['admin']);
		$this->display();
	}

	/**
	 *
	 * 验证码生成
	 */
	public function verify_c($id=""){
	    $Verify = new \Think\Verify();
		$Verify->fontSize = 24;
		$Verify->length   = 4;
		$Verify->useNoise = false;
		//$Verify->zhSet = '们以我到他会作时要动国产的一是工就年阶义发成部民可出能方进在了不和有大这里而好生恩它风雨电娃';
		$Verify->codeSet = '0123456789';
		$Verify->imageW = 180;
		$Verify->imageH = 70;
		$Verify->useImgBg = false;
		//$Verify->expire = 600;
		//$Verify->useZh = true;
		$Verify->entry($id);
	}

}
