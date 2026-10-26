<?php if (!defined('THINK_PATH')) exit();?><!DOCTYPE html>

<!--[if IE 8]> <html lang="en" class="ie8"> <![endif]-->

<!--[if IE 9]> <html lang="en" class="ie9"> <![endif]-->

<!--[if !IE]><!--> <html lang="en"> <!--<![endif]-->

<!-- BEGIN HEAD -->

<head>

	<meta charset="utf-8" />

	<title>Learning</title>

	<meta content="width=device-width, initial-scale=1.0" name="viewport" />

	<meta content="" name="description" />

	<meta content="" name="author" />

	<!-- BEGIN GLOBAL MANDATORY STYLES -->

	<link href="/Application/Admin/View/media/css/bootstrap.min.css" rel="stylesheet" type="text/css"/>

	<link href="/Application/Admin/View/media/css/bootstrap-responsive.min.css" rel="stylesheet" type="text/css"/>

	<link href="/Application/Admin/View/media/css/font-awesome.min.css" rel="stylesheet" type="text/css"/>

	<link href="/Application/Admin/View/media/css/style-metro.css" rel="stylesheet" type="text/css"/>

	<link href="/Application/Admin/View/media/css/style.css" rel="stylesheet" type="text/css"/>

	<link href="/Application/Admin/View/media/css/style-responsive.css" rel="stylesheet" type="text/css"/>

	<link href="/Application/Admin/View/media/css/default.css" rel="stylesheet" type="text/css" id="style_color"/>

	<link href="/Application/Admin/View/media/css/uniform.default.css" rel="stylesheet" type="text/css"/>

	<!-- END GLOBAL MANDATORY STYLES -->

	<!-- BEGIN PAGE LEVEL STYLES -->

	<link href="/Application/Admin/View/media/css/login.css" rel="stylesheet" type="text/css"/>

	<!-- END PAGE LEVEL STYLES -->

	<link rel="shortcut icon" href="/Application/Admin/View/media/image/favicon.ico" />
	<script type="text/javascript">
		function flashVerify(){
			var url = document.getElementById('verify');
			if(url){
			   url.src="<?php echo U('Login/verify_c',array());?>";
			}
		}
	</script>
</head>

<!-- END HEAD -->

<!-- BEGIN BODY -->

<body class="login">

	<!-- BEGIN LOGO -->

	<div class="logo">

		<img src="/Application/Admin/View/media/image/logo-big.png" alt="" />

	</div>

	<!-- END LOGO -->

	<!-- BEGIN LOGIN -->

	<div class="content">

		<!-- BEGIN LOGIN FORM -->

		<form class="form-vertical login-form" method="post" autocomplete="off" action="<?php echo U('Login/loginCheck');?>">

			<h3 class="form-title"><strong>管理员登录</strong></h3>

			<div class="alert alert-error hide">

				<button class="close" data-dismiss="alert"></button>

				<span>请正确输入用户名、密码、验证码</span>

			</div>

			<div class="control-group">

				<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->

				<label class="control-label visible-ie8 visible-ie9">用户名</label>

				<div class="controls">

					<div class="input-icon left">

						<i class="icon-user"></i>

						<input class="m-wrap placeholder-no-fix" type="text" placeholder="用户名" name="username" maxlength="10" />

					</div>

				</div>

			</div>

			<div class="control-group">

				<label class="control-label visible-ie8 visible-ie9">密码</label>

				<div class="controls">

					<div class="input-icon left">

						<i class="icon-lock"></i>

						<input class="m-wrap placeholder-no-fix" type="password" placeholder="密码" name="password" maxlength="16" />

					</div>

				</div>

			</div>
			<div class="control-group">
				<div class="input-icon left">

					<i class="icon-exclamation-sign"></i>

					<input class="m-wrap placeholder-no-fix cx-wrap" type="text" placeholder="验证码" name="verify" maxlength="4" />
					<a href="javascript:flashVerify();">
					<img width="30%" class="verify" id="verify" height="50" alt="验证码" src="<?php echo U('Login/verify_c',array());?>" title="点击刷新">
					</a>
				</div>
			</div>
			<div class="form-actions">

				<label class="checkbox">

				<input type="checkbox" name="remember" value="1"/> 记住我！

				</label>

				<button type="submit" class="btn green pull-right">

				登录 <i class="m-icon-swapright m-icon-white"></i>

				</button>

			</div>

			<div class="forget-password">

				<h4>忘记密码？</h4>

				<p>

					点击 <a href="javascript:;" class="" id="forget-password">这里</a> 找回密码

				</p>

			</div>

			<!-- <div class="create-account">

				<p>

					还没有账号？&nbsp;

					<a href="javascript:;" id="register-btn" class="">创建新用户</a>

				</p>

			</div> -->

		</form>

		<!-- END LOGIN FORM -->

		<!-- BEGIN FORGOT PASSWORD FORM -->

		<form class="form-vertical forget-form" autocomplete="off" action="<?php echo U('Login/index');?>">

			<h3 class="">忘记了密码？</h3>

			<p>请输入你注册时的邮箱地址</p>

			<div class="control-group">

				<div class="controls">

					<div class="input-icon left">

						<i class="icon-envelope"></i>

						<input class="m-wrap placeholder-no-fix" type="text" placeholder="邮箱地址" name="email" />

					</div>

				</div>

			</div>

			<div class="form-actions">

				<button type="button" id="back-btn" class="btn">

				<i class="m-icon-swapleft"></i> 返回

				</button>

				<button type="submit" class="btn green pull-right">

				提交 <i class="m-icon-swapright m-icon-white"></i>

				</button>

			</div>

		</form>

		<!-- END FORGOT PASSWORD FORM -->

		<!-- BEGIN REGISTRATION FORM -->

		<form class="form-vertical register-form" action="index.html">

			<h3 class="">注册新用户</h3>

			<p>请输入新用户信息</p>

			<div class="control-group">

				<label class="control-label visible-ie8 visible-ie9">用户名</label>

				<div class="controls">

					<div class="input-icon left">

						<i class="icon-user"></i>

						<input class="m-wrap placeholder-no-fix" type="text" placeholder="用户名" name="username" maxlength="10" />

					</div>

				</div>

			</div>

			<div class="control-group">

				<label class="control-label visible-ie8 visible-ie9">密码</label>

				<div class="controls">

					<div class="input-icon left">

						<i class="icon-lock"></i>

						<input class="m-wrap placeholder-no-fix" type="password" id="register_password" placeholder="密码" name="password" maxlength="16" />

					</div>

				</div>

			</div>

			<div class="control-group">

				<label class="control-label visible-ie8 visible-ie9">确认密码</label>

				<div class="controls">

					<div class="input-icon left">

						<i class="icon-ok"></i>

						<input class="m-wrap placeholder-no-fix" type="password" placeholder="确认密码" name="rpassword" maxlength="16" />

					</div>

				</div>

			</div>

			<div class="control-group">

				<!--ie8, ie9 does not support html5 placeholder, so we just show field title for that-->

				<label class="control-label visible-ie8 visible-ie9">邮箱地址</label>

				<div class="controls">

					<div class="input-icon left">

						<i class="icon-envelope"></i>

						<input class="m-wrap placeholder-no-fix" type="text" placeholder="邮箱地址" name="email"/>

					</div>

				</div>

			</div>

			<div class="control-group">

				<div class="controls">

					<label class="checkbox">

					<input type="checkbox" name="tnc"/>我同意<a href="#">服务条件</a> 和 <a href="#">隐私政策</a>

					</label>

					<div id="register_tnc_error"></div>

				</div>

			</div>

			<div class="form-actions">

				<button id="register-back-btn" type="button" class="btn">

				<i class="m-icon-swapleft"></i>  返回

				</button>

				<button type="submit" id="register-submit-btn" class="btn green pull-right">

				注册 <i class="m-icon-swapright m-icon-white"></i>

				</button>

			</div>

		</form>

		<!-- END REGISTRATION FORM -->

	</div>

	<!-- END LOGIN -->

	<!-- BEGIN COPYRIGHT -->

	<div class="copyright">

		2015 &copy; Learning.

	</div>

	<!-- END COPYRIGHT -->

	<!-- BEGIN JAVASCRIPTS(Load javascripts at bottom, this will reduce page load time) -->

	<!-- BEGIN CORE PLUGINS -->

	<script src="/Application/Admin/View/media/js/jquery-1.10.1.min.js" type="text/javascript"></script>

	<script src="/Application/Admin/View/media/js/jquery-migrate-1.2.1.min.js" type="text/javascript"></script>

	<!-- IMPORTANT! Load jquery-ui-1.10.1.custom.min.js before bootstrap.min.js to fix bootstrap tooltip conflict with jquery ui tooltip -->

	<script src="/Application/Admin/View/media/js/jquery-ui-1.10.1.custom.min.js" type="text/javascript"></script>      

	<script src="/Application/Admin/View/media/js/bootstrap.min.js" type="text/javascript"></script>

	<!--[if lt IE 9]>

	<script src="/Application/Admin/View/media/js/excanvas.min.js"></script>

	<script src="/Application/Admin/View/media/js/respond.min.js"></script>  

	<![endif]-->   

	<script src="/Application/Admin/View/media/js/jquery.slimscroll.min.js" type="text/javascript"></script>

	<script src="/Application/Admin/View/media/js/jquery.blockui.min.js" type="text/javascript"></script>  

	<script src="/Application/Admin/View/media/js/jquery.cookie.min.js" type="text/javascript"></script>

	<script src="/Application/Admin/View/media/js/jquery.uniform.min.js" type="text/javascript" ></script>

	<!-- END CORE PLUGINS -->

	<!-- BEGIN PAGE LEVEL PLUGINS -->

	<script src="/Application/Admin/View/media/js/jquery.validate.min.js" type="text/javascript"></script>

	<!-- END PAGE LEVEL PLUGINS -->

	<!-- BEGIN PAGE LEVEL SCRIPTS -->

	<script src="/Application/Admin/View/media/js/app.js" type="text/javascript"></script>

	<script src="/Application/Admin/View/media/js/login.js" type="text/javascript"></script>      

	<!-- END PAGE LEVEL SCRIPTS --> 

	<script>

		jQuery(document).ready(function() {     

		  App.init();

		  Login.init();

		});

	</script>

	<!-- END JAVASCRIPTS -->

</body>

<!-- END BODY -->

</html>