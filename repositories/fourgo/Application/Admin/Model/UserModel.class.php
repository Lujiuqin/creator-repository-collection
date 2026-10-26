<?php
namespace Admin\Model;
use Think\Model;
class UserModel extends Model {
	protected $_validate=array(
		array('username','require','用户名不能为空!',1),
		array('username','','用户名已经存在！',1,'unique',2),
		array('email','email','邮箱格式不正确!',1),
		array('age','number','年龄格式不正确!',1),
		array('telephone','require','手机号码不能为空!',1),
		array('telephone','/^1[3|4|5|8][0-9]\d{4,8}$/','手机号码错误！',1,'regex',3),
		array('qq','/\d{6,13}/','QQ号码错误！',1,'regex',3),
	);
}
?>