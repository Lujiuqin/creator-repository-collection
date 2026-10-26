<?php
namespace Home\Controller;
use Think\Controller;
class LoginController extends CommonController {
    public function resgiter(){
      $data['username'] = I('post.username');
      $data['password'] = I('post.password');
      $repassword = I('post.repassword');
      if( $repassword == $data['password'] ){
        $user = M("user");
        if( $user->add($data) ){
          session('user',$data['username']);
          $this->redirect('User/index');
        }else{
          $this->error($user->getDbError());
        }
      }else{
        $this->error("两次密码不一致！");
      }
    }

    public function login(){
      $map['username'] = I('post.username');
      $password = I('post.password');
      $user = M("user");
      $oneUser = $user->where($map)->find();
      if(isset($oneUser)){
        if( $oneUser['password'] == $password ){
          session('user',$map['username']);
          $this->redirect('User/index');
        }else{
          $this->error("密码错误！");
        }
      }else{
        $this->error("账号不存在");
      }
    }

}