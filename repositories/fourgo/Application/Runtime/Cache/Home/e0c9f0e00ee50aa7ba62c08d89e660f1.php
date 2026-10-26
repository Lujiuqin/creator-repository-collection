<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html lang="ch">

	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
		<meta name="format-detection" content="telephone=no">
		<title>四步曲</title>
		<script src="/Application/Home/View/FourstepsSecond/js/jquery.min.js"></script>
		<script src="/Application/Home/View/FourstepsSecond/js/bootstrap.min.js"></script>
		<script>
			$(function() {
				$(".meun-item").click(function() {
					$(".meun-item").removeClass("meun-item-active");
					$(this).addClass("meun-item-active");
					var itmeObj = $(".meun-item").find("img");
					itmeObj.each(function() {
						var items = $(this).attr("src");
						items = items.replace("_grey.png", ".png");
						items = items.replace(".png", "_grey.png")
						$(this).attr("src", items);
					});
					var attrObj = $(this).find("img").attr("src");;
					attrObj = attrObj.replace("_grey.png", ".png");
					$(this).find("img").attr("src", attrObj);
				});
				$("#topAD").click(function() {
					$("#topA").toggleClass(" glyphicon-triangle-right");
					$("#topA").toggleClass(" glyphicon-triangle-bottom");
				});
				$("#topBD").click(function() {
					$("#topB").toggleClass(" glyphicon-triangle-right");
					$("#topB").toggleClass(" glyphicon-triangle-bottom");
				});
				$("#topCD").click(function() {
					$("#topC").toggleClass(" glyphicon-triangle-right");
					$("#topC").toggleClass(" glyphicon-triangle-bottom");
				});
                $("#topDD").click(function() {
                    $("#topD").toggleClass(" glyphicon-triangle-right");
                    $("#topD").toggleClass(" glyphicon-triangle-bottom");
                });
                $("#topAD1").click(function() {
                    $("#topA1").toggleClass(" glyphicon-triangle-right");
                    $("#topA1").toggleClass(" glyphicon-triangle-bottom");
                });
                $("#topBD1").click(function() {
                    $("#topB1").toggleClass(" glyphicon-triangle-right");
                    $("#topB1").toggleClass(" glyphicon-triangle-bottom");
                });
                $("#topCD1").click(function() {
                    $("#topC1").toggleClass(" glyphicon-triangle-right");
                    $("#topC1").toggleClass(" glyphicon-triangle-bottom");
                });
                $("#topDD1").click(function() {
                    $("#topD1").toggleClass(" glyphicon-triangle-right");
                    $("#topD1").toggleClass(" glyphicon-triangle-bottom");
                });
				$(".toggle-btn").click(function() {
					$("#leftMeun").toggleClass("show");
					$("#rightContent").toggleClass("pd0px");
				})
			})
		</script>
		<!--[if lt IE 9]>
          <script src="/Application/Home/View/FourstepsSecond/js/html5shiv.min.js"></script>
          <script src="/Application/Home/View/FourstepsSecond/js/respond.min.js"></script>
        <![endif]-->
		<link href="/Application/Home/View/FourstepsSecond/css/bootstrap.min.css" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="/Application/Home/View/FourstepsSecond/css/common.css" />
		<link rel="stylesheet" type="text/css" href="/Application/Home/View/FourstepsSecond/css/slide.css" />
		<link rel="stylesheet" type="text/css" href="/Application/Home/View/FourstepsSecond/css/bootstrap.min.css" />
		<!-- <link rel="stylesheet" type="text/css" href="/Application/Home/View/FourstepsSecond/css/flat-ui.min.css" /> -->
		<link rel="stylesheet" type="text/css" href="/Application/Home/View/FourstepsSecond/css/jquery.nouislider.css">
        <!-- <link rel="stylesheet" type="text/css" href="/Public/Css/header.css" /> -->
        <link rel="stylesheet" type="text/css" href="/Public/Css/StepTwo/fileinput.css">
<!--         <script type="text/javascript" src="/Public/Js/header.js"></script> -->
        <script type="text/javascript" src="/Public/Js/StepTwo/fileinput.js"></script>
        
        <style type="text/css">
            body{
                font-family: "Microsoft Yahei";
            }
            .public_header{
                display: none;
            }
            .row a,.check-div a{
                color: white;
                text-decoration: none;
            }
            .face img{
                    height: 40px;
                    width: auto;
                    border-radius: 50%;
                    margin-top: 5px;
                    margin-right: 30px;
                    margin-left: 20px;
                    box-shadow:  0 0 10px #ccc;
            }
            .cxx{
                display: none;
            }
        </style>
	</head>

	<body>
    <div class="hidden-all"></div>
<div class="container-fluid cxx">
    <div class="row">
        <div class="col-xs-10 col-xs-offset-1 col-md-6 col-md-offset-3 registerBox">
            <div class="relatives">
                <div class="container-fluid reallyBox">
                    <!-- 关闭标识 -->
                    <span class="closeBox"></span>
                    <!-- 注册本体 -->
                    <div class="row">
                        <!-- 左侧 -->
                        <div class="col-xs-12 col-sm-2 col-md-2 boxLeft">
                            <div class="clickButton topButton"><span>注册</span></div>
                            <div class="unclickButton bottomButton"><span>登陆</span></div>
                        </div>
                        <!-- 右侧 -->
                        <div class="col-xs-12 col-sm-10 col-md-10 boxRight">
                            <div class="registerBody">
                                <form action="<?php echo U('Login/resgiter');?>" method="post">
                                    <div class="input-group input-group-lg">
                                       <span class="input-group-addon" id="basic-addon1">&nbsp;&nbsp;账&nbsp;&nbsp;&nbsp;号&nbsp;&nbsp;</span>
                                       <input name="username" type="text" class="form-control" placeholder="账号" aria-describedby="basic-addon1">
                                    </div>
                                    <div class="input-group input-group-lg">
                                       <span class="input-group-addon" id="basic-addon1">&nbsp;&nbsp;密&nbsp;&nbsp;&nbsp;码&nbsp;&nbsp;</span>
                                       <input name="password" type="password" class="form-control" placeholder="密码" aria-describedby="basic-addon1">
                                    </div>
                                    <div class="input-group input-group-lg">
                                       <span class="input-group-addon  qrmm" id="basic-addon1">确认密码</span>
                                       <input name="repassword" type="password" class="form-control" placeholder="确认密码" aria-describedby="basic-addon1">
                                    </div>
                                    <div class="input-group input-group-lg forbottom">
                                       <span class="input-group-addon" id="basic-addon1">&nbsp;验&nbsp;证&nbsp;码&nbsp;</span>
                                       <input name="yzm" type="text" class="form-control" placeholder="验证码" aria-describedby="basic-addon1">
                                    </div>
                                    <button type="submit" class="btn btn-success btn-lg">注&nbsp;册</button>
                                    <span class="gray"><input name="" type="checkbox" checked="checked">我已仔细阅读并接受fourgo注册条款</span>  
                                </form> 
                            </div>
                            <div class="loginBody">
                                <form action="<?php echo U('Login/login');?>" method="post">
                                    <div class="input-group input-group-lg">
                                       <span class="input-group-addon" id="basic-addon1">账号</span>
                                       <input name="username" type="text" class="form-control" placeholder="账号" aria-describedby="basic-addon1">
                                    </div>
                                    <div class="input-group input-group-lg forbottom">
                                       <span class="input-group-addon" id="basic-addon1">密码</span>
                                       <input name="password" type="password" class="form-control" placeholder="密码" aria-describedby="basic-addon1">
                                    </div>
                                    <button type="submit" class="btn btn-success btn-lg">登陆</button>
                                    <span class="gray"><input name="" type="checkbox" checked="checked">下次自动登陆忘记密码</span>

                                    <div class="otherLogin">
                                        <span>其它方式登陆：</span>
                                        <a href=""></a>  
                                        <a href="" class="loginCenter"></a>
                                        <a href=""></a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="<?php echo U('Index/index');?>"><img src="/Public/Images/logo.png" alt="logo" style="margin-top: -10px;"></a>
        </div>
        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <!-- 首页 -->
                <li class="dropdown" id="header1"><a href="<?php echo U('Index/index');?>">首页<span class="sr-only">(current)</span></a></li>
                <!-- 四部曲研究 -->
                <li class="dropdown" id="header2">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">四步曲研究<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="<?php echo U('Study/index');?>">前言</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="<?php echo U('Study/index#2');?>">内容介绍</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="<?php echo U('Study/index#3');?>">研究团队</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="<?php echo U('Study/index#4');?>">理论研究</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="<?php echo U('Study/index#5');?>">研究活动</a></li>
                    </ul>
                </li>
                <!-- 四部曲实践 -->
                <li class="dropdown" id="header3">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">四步曲实践<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">开放实验</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="<?php echo U('FourstepsSecond/index');?>">科技创新</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">学科竞赛</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">成果获取</a></li>
                    </ul>
                </li>
                <!-- 组队合作 -->
                <!-- <li><a href="#">组队合作</a></li> -->
                <!-- 实践成果 -->
                <li class="dropdown" id="header4"><a href="<?php echo U('Result/index');?>">实践成果<span class="sr-only">(current)</span></a></li>
                <!-- 风采荣誉 -->
                <li class="dropdown" id="header5"><a href="<?php echo U('Student/index');?>">学子风采<span class="sr-only">(current)</span></a></li>
                <!-- 学习园地 -->
                <!-- <li class="dropdown" id="header6">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">学习园地<span class="caret"></span></a>
                    <ul class="dropdown-menu">
                        <li><a href="#">学习资料</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">学习工具</a></li>
                        <li role="separator" class="divider"></li>
                        <li><a href="#">专题工具</a></li>
                    </ul>
                </li> -->
            </ul>
            <ul class="nav navbar-nav navbar-right">
                <?php if(session('?user')): ?><div class="face"><a href="<?php echo U('User/index');?>"><img src="/Public/Images/head/1.jpg" alt=""></a></div>
                <?php else: ?>
                    <li><a class="register">注册</a></li>
                    <li><a class="load">登陆</a></li><?php endif; ?>
            </ul>
            <form class="navbar-form navbar-right" role="search" method="post" action="#">
                <div class="form-group">
                    <input type="text" class="form-control" placeholder="搜索">
                    <input type="submit" style="display: none;" id="submit">
                    <label for="submit"><span class="glyphicon glyphicon-search"></span></label>
                </div>
            </form>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
</nav>
		<div style="margin-top: 50px" id="wrap">

			<div class="leftMeun" id="leftMeun">

				<div class="meun-title">科技创新</div>
                <div class="meun-item meun-item-active" href="#chan" aria-controls="chan" role="tab" data-toggle="tab"><img src="/Application/Home/View/FourstepsSecond/images/icon_source.png">科研介绍</div>
				<div class="meun-item" href="#sour" aria-controls="sour" role="tab" data-toggle="tab"><img src="/Application/Home/View/FourstepsSecond/images/icon_user_grey.png">项目申报</div>
				<div class="meun-item" href="#char" aria-controls="char" role="tab" data-toggle="tab"><img src="/Application/Home/View/FourstepsSecond/images/icon_chara_grey.png">项目管理</div>
				<div class="meun-item" href="#user" aria-controls="user" role="tab" data-toggle="tab"><img src="/Application/Home/View/FourstepsSecond/images/icon_change_grey.png">结题总结</div>
				
			</div>

			<div id="rightContent">
				<a class="toggle-btn" id="nimei">
					<i class="glyphicon glyphicon-align-justify"></i>
				</a>

				<div class="tab-content">

					<div role="tabpanel" class="tab-pane active" id="chan">
						<div class="check-div form-inline">
							<div class="col-xs-6">
                                <input type="text" class="form-control input-sm" placeholder="输入文字搜索">
                                <button class="btn btn-white btn-xs ">查 询 </button>
                            </div>
                            <div class="col-lg-3 col-lg-offset-3 col-xs-3" style=" padding-right: 40px;text-align: right;">
                                <label for="paixu">排序:&nbsp;</label>
                                <select class=" form-control">
                                    <option> -- </option>
                                    <option>按级别</option>
                                    <option>按时间</option>
                                </select>
                            </div>
						</div>
						<div class="data-div">
                            <div class="row tableHeader">
                                <div class="col-xs-3 ">
                                    项目名称
                                </div>
                                <div class="col-xs-3">
                                    科研级别
                                </div>
                                <div class="col-xs-3">
                                    申报时间
                                </div>
                                <div class="col-xs-3">
                                    操作
                                </div>
                            </div>
                            <div class="tablebody">

                                <div class="row">
                                    <div class="col-xs-3">
                                        课外自主研究项目
                                    </div>
                                    <div class="col-xs-3">
                                        无
                                    </div>
                                    <div class="col-xs-3">
                                        无
                                    </div>
                                    <div class="col-xs-3">
                                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#">详情</button>
                                        
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-xs-3">
                                        “春萌”计划项目
                                    </div>
                                    <div class="col-xs-3">
                                        校级
                                    </div>
                                    <div class="col-xs-3">
                                        每年12月
                                    </div>
                                    <div class="col-xs-3">
                                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#">详情</button>
                                        <button class="btn btn-info btn-xs" data-toggle="modal" data-target="#addSource1">申报</button>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-xs-3">
                                        “新苗人才”计划项目
                                    </div>
                                    <div class="col-xs-3">
                                        省部级
                                    </div>
                                    <div class="col-xs-3">
                                        每年1月
                                    </div>
                                    <div class="col-xs-3">
                                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#">详情</button>
                                        <button class="btn btn-info btn-xs" data-toggle="modal" data-target="#addSource2">申报</button>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-xs-3">
                                        大学生创新创业训练项目
                                    </div>
                                    <div class="col-xs-3">
                                        国家级
                                    </div>
                                    <div class="col-xs-3">
                                        每年4月
                                    </div>
                                    <div class="col-xs-3">
                                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#"><a target="_blank" href="<?php echo U('FourstepsSecond/detail');?>">详情</a></button>
                                        <button class="btn btn-info btn-xs" data-toggle="modal" data-target="#addSource3">申报</button>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-xs-3">
                                        教师科研项目
                                    </div>
                                    <div class="col-xs-3">
                                        省部级、国家级
                                    </div>
                                    <div class="col-xs-3">
                                        无
                                    </div>
                                    <div class="col-xs-3">
                                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#">详情</button>
                                        <button class="btn btn-info btn-xs" data-toggle="modal" data-target="#">参与</button>
                                    </div>
                                </div>

                            </div>

                        </div>
						<!--页码块-->
						<footer class="footer">
							<ul class="pagination">
								<li>
									<select>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
										<option>6</option>
										<option>7</option>
										<option>8</option>
										<option>9</option>
										<option>10</option>
									</select>
									页
								</li>
								<li class="gray">
									共1页
								</li>
								<li>
									<i class="glyphicon glyphicon-menu-left">
										</i>
								</li>
								<li>
									<i class="glyphicon glyphicon-menu-right">
										</i>
								</li>
							</ul>
						</footer>
	                       <!--弹出窗口 添加资源-->
                        <div class="modal fade" id="addSource1" role="dialog" aria-labelledby="gridSystemModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title" id="gridSystemModalLabel">春萌申报</h4>
                                    </div>
                                    <form enctype="multipart/form-data" class="form-horizontal" method="post" autocomplete="off" action="<?php echo U('FourstepsSecond/declares');?>">
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <input type="hidden" name="sort" value="1">
                                                <div class="form-group ">
                                                    <label for="sName" class="col-xs-3 control-label">名称：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sName" placeholder="" name="title">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sLink" class="col-xs-3 control-label">负责人：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sLink" placeholder="" name="student">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sOrd" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sOrd" placeholder="" name="tel">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">指导教师：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder="" name="teacher">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder=""
                                                        name="telephone">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInput1" class="col-xs-3 control-label">上传文件：</label>
                                                    <div class="col-xs-7">
                                                        <input id="file-Portrait1" type="file" class="file" name="file">
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-xs btn-xs btn-white" data-dismiss="modal">取 消</button>
                                        <button type="button submit" class="btn btn-xs btn-xs btn-green">申 报</button>
                                    </div>
                                    </form>
                                </div>
                                <!-- /.modal-content -->
                            </div>
                            <!-- /.modal-dialog -->
                        </div>
                        <!-- /.modal -->
                        <!--弹出窗口 添加资源-->
                        <div class="modal fade" id="addSource2" role="dialog" aria-labelledby="gridSystemModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title" id="gridSystemModalLabel">新苗申报</h4>
                                    </div>
                                    <form enctype="multipart/form-data" class="form-horizontal" method="post" autocomplete="off" action="<?php echo U('FourstepsSecond/declares');?>">
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <input type="hidden" name="sort" value="2">
                                                <div class="form-group ">
                                                    <label for="sName" class="col-xs-3 control-label">名称：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sName" placeholder="" name="title">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sLink" class="col-xs-3 control-label">负责人：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sLink" placeholder="" name="student">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sOrd" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sOrd" placeholder="" name="tel">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">指导教师：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder="" name="teacher">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder=""
                                                        name="telephone">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInput1" class="col-xs-3 control-label">上传文件：</label>
                                                    <div class="col-xs-7">
                                                        <input id="file-Portrait1" type="file" class="file" name="file">
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-xs btn-xs btn-white" data-dismiss="modal">取 消</button>
                                        <button type="button submit" class="btn btn-xs btn-xs btn-green">申 报</button>
                                    </div>
                                    </form>
                                </div>
                                <!-- /.modal-content -->
                            </div>
                            <!-- /.modal-dialog -->
                        </div>
                        <!-- /.modal -->
                        <!--弹出窗口 添加资源-->
                        <div class="modal fade" id="addSource3" role="dialog" aria-labelledby="gridSystemModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title" id="gridSystemModalLabel">国创申报</h4>
                                    </div>
                                    <form enctype="multipart/form-data" class="form-horizontal" method="post" autocomplete="off" action="<?php echo U('FourstepsSecond/declares');?>">
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <input type="hidden" name="sort" value="3">
                                                <div class="form-group ">
                                                    <label for="sName" class="col-xs-3 control-label">名称：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sName" placeholder="" name="title">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sLink" class="col-xs-3 control-label">负责人：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sLink" placeholder="" name="student">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sOrd" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sOrd" placeholder="" name="tel">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">指导教师：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder="" name="teacher">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder=""
                                                        name="telephone">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInput1" class="col-xs-3 control-label">上传文件：</label>
                                                    <div class="col-xs-7">
                                                        <input id="file-Portrait1" type="file" class="file" name="file">
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-xs btn-xs btn-white" data-dismiss="modal">取 消</button>
                                        <button type="button submit" class="btn btn-xs btn-xs btn-green">申 报</button>
                                    </div>
                                    </form>
                                </div>
                                <!-- /.modal-content -->
                            </div>
                            <!-- /.modal-dialog -->
                        </div>
                        <!-- /.modal -->
					</div>

                    <div role="tabpanel" class="tab-pane" id="sour">
                        <div class="check-div form-inline">
                            <div class="col-xs-6">
                            <button class="btn btn-success btn-xs-2" data-toggle="modal" data-target="#addSource11">春萌申报</button>
                            <button class="btn btn-primary btn-xs-2" data-toggle="modal" data-target="#addSource21">新苗申报</button>
                            <button class="btn btn-info btn-xs-2" data-toggle="modal" data-target="#addSource31">国创申报</button>
                            </div>
                            <div class="col-xs-6">
                                <input type="text" class="form-control input-sm" placeholder="输入文字搜索">
                                <button class="btn btn-white btn-xs ">查 询 </button>
                            </div>
                        </div>
                        <div class="data-div">
                            <div class="row tableHeader">
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 ">
                                    项目分类
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 ">
                                    项目编号
                                </div>
                                <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4">
                                    项目名称
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                    立项时间
                                </div>
                                <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                    负责人
                                </div>
                                <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                    结题状况
                                </div>
                            </div>
                            <div class="tablebody">
                                <div class="row text-primary">
                                    <div id="topAD" class="col-lg-2 col-md-2 col-sm-2 col-xs-2" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSystem" aria-expanded="true" aria-controls="collapseOne">
                                        <span id="topA" class="glyphicon  glyphicon-triangle-bottom  "></span> <span>2014</span>
                                    </div>
                                    <div id="topBD" onClick="changeA()" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 levl2" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseAccount" aria-expanded="true" aria-controls="collapseOne">
                                        <span onClick="changeB()" id="topB" class="glyphicon glyphicon-triangle-bottom"></span> <span>春萌项目（共立项135项）</span>
                                    </div>
                                    <div id="topCD" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 levl2" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSchool" aria-expanded="true" aria-controls="collapseOne">
                                        <span id="topC" onClick="changeC()" class="glyphicon glyphicon-triangle-bottom"></span><span> 新苗项目（共立项36项）</span>
                                    </div>
                                    
                                    <div id="topDD" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 levl2" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseCor" aria-expanded="true" aria-controls="collapseOne">
                                        <span id="topD" onClick="changeD()" class="glyphicon glyphicon-triangle-bottom"></span><span> 国创项目（共立项20项）</span>
                                    </div>
                                    
                                </div>

                                <!--系统管理折叠狂-->

                                <div id="collapseSystem" class="collapse in" aria-expanded="true">
                                    <!--用户管理折叠狂-->
                                    <div id="collapseAccount" class="collapse in" aria-expanded="true">
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                校级
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                201410005
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4  levl3">
                                                <span class=""> &nbsp;</span><span>大学生微创意展示交流合作平台设计</span>
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                2014
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                华益峰
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                                <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#changeSource">已结题</button>
                                                
                                            </div>
                                        </div>
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                校级
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                201410006
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4  levl3">
                                                <span class=""> &nbsp;</span><span>大学生筑梦支教交流协作平台设计</span>
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                2014
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                高云
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                                <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#changeSource">已结题</button>
                                                
                                            </div>
                                        </div>
                                    </div>

                                
                                    <!--地区管理折叠狂-->
                                    <div id="collapseSchool" class="collapse in" aria-expanded="true">
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                省部级
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                R201411057022
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4  levl3">
                                                <span class=""> &nbsp;</span><span>基于移动端的大学生户外活动安全管理系统设计</span>
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                2014
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                方孙权
                                            </div>
                                            <div class="col-lg-2 col-md-1 col-sm-1 col-xs-1">
                                                <button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#changeSource">在研</button>
                                                
                                            </div>
                                        </div>
                                    </div>

                                    <!--地区管理折叠狂-->
                                    <div id="collapseCor" class="collapse in" aria-expanded="true">
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2  levl3">
                                                国家级
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                201411057008
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4  levl3">
                                                <span class=""> &nbsp;</span><span>响应式自助微课学习平台设计</span>
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                2014
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                陈璇
                                            </div>
                                            <div class="col-lg-2 col-md-1 col-sm-1 col-xs-1">
                                                <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#changeSource">已结题</button>
                                                
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div class="tablebody">
                                <div class="row text-primary">
                                    <div id="topAD1" class="col-lg-2 col-md-2 col-sm-2 col-xs-2" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSystem1" aria-expanded="true" aria-controls="collapseOne">
                                        <span id="topA1" class="glyphicon  glyphicon-triangle-bottom  "></span> <span>2015</span>
                                    </div>
                                    <div id="topBD1" onClick="changeA()" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 levl2" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseAccount1" aria-expanded="true" aria-controls="collapseOne">
                                        <span onClick="changeB()" id="topB1" class="glyphicon glyphicon-triangle-bottom"></span> <span>春萌项目（共立项142项）</span>
                                    </div>
                                    <div id="topCD1" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 levl2" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseSchool1" aria-expanded="true" aria-controls="collapseOne">
                                        <span id="topC1" onClick="changeC()" class="glyphicon glyphicon-triangle-bottom"></span><span> 新苗项目（共立项35项）</span>
                                    </div>
                                    
                                    <div id="topDD1" class="col-lg-3 col-md-3 col-sm-3 col-xs-3 levl2" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseCor1" aria-expanded="true" aria-controls="collapseOne">
                                        <span id="topD1" onClick="changeD()" class="glyphicon glyphicon-triangle-bottom"></span><span> 国创项目（共立项20项）</span>
                                    </div>
                                    
                                </div>

                                <!--系统管理折叠狂-->

                                <div id="collapseSystem1" class="collapse in" aria-expanded="true">
                                    <!--用户管理折叠狂-->
                                    <div id="collapseAccount1" class="collapse in" aria-expanded="true">
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                校级
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                201510101
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4  levl3">
                                                <span class=""> &nbsp;</span><span>微信客户端的二次应用</span>
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                2015
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                李强
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2">
                                                <button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#changeSource">在研</button>
                                                
                                            </div>
                                        </div>
                                        
                                    </div>

                                
                                    <!--地区管理折叠狂-->
                                    <div id="collapseSchool1" class="collapse in" aria-expanded="true">
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                省部级
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                R201511057016
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4  levl3">
                                                <span class=""> &nbsp;</span><span>基于Android的四步曲项目教学平台</span>
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                2015
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                胡晓峰
                                            </div>
                                            <div class="col-lg-2 col-md-1 col-sm-1 col-xs-1">
                                                <button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#changeSource">在研</button>
                                                
                                            </div>
                                        </div>
                                    </div>

                                    <!--地区管理折叠狂-->
                                    <div id="collapseCor1" class="collapse in" aria-expanded="true">
                                        <div class="row">
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2  levl3">
                                                国家级
                                            </div>
                                            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 levl3 ">
                                                201511057010
                                            </div>
                                            <div class="col-lg-4 col-md-4 col-sm-4 col-xs-4  levl3">
                                                <span class=""> &nbsp;</span><span>“互联网+课堂”个人技能
分享交易平台的设计与实现</span>
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                2015
                                            </div>
                                            <div class="col-lg-1 col-md-1 col-sm-1 col-xs-1">
                                                胡晓峰
                                            </div>
                                            <div class="col-lg-2 col-md-1 col-sm-1 col-xs-1">
                                                <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#changeSource">已结题</button>
                                                
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--页码块-->
                        <footer class="footer">
                            <ul class="pagination">
                                <li>
                                    <select>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </select>
                                    页
                                </li>
                                <li class="gray">
                                    共1页
                                </li>
                                <li>
                                    <i class="glyphicon glyphicon-menu-left">
                                        </i>
                                </li>
                                <li>
                                    <i class="glyphicon glyphicon-menu-right">
                                        </i>
                                </li>
                            </ul>
                        </footer>
                        <!--弹出窗口 添加资源-->
                        <div class="modal fade" id="addSource11" role="dialog" aria-labelledby="gridSystemModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title" id="gridSystemModalLabel">春萌申报</h4>
                                    </div>
                                    <form enctype="multipart/form-data" class="form-horizontal" method="post" autocomplete="off" action="<?php echo U('FourstepsSecond/declares');?>">
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <input type="hidden" name="sort" value="1">
                                                <div class="form-group ">
                                                    <label for="sName" class="col-xs-3 control-label">名称：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sName" placeholder="" name="title">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sLink" class="col-xs-3 control-label">负责人：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sLink" placeholder="" name="student">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sOrd" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sOrd" placeholder="" name="tel">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">指导教师：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder="" name="teacher">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder=""
                                                        name="telephone">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInput1" class="col-xs-3 control-label">上传文件：</label>
                                                    <div class="col-xs-7">
                                                        <input id="file-Portrait1" type="file" class="file" name="file">
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-xs btn-xs btn-white" data-dismiss="modal">取 消</button>
                                        <button type="button submit" class="btn btn-xs btn-xs btn-green">申 报</button>
                                    </div>
                                    </form>
                                </div>
                                <!-- /.modal-content -->
                            </div>
                            <!-- /.modal-dialog -->
                        </div>
                        <!-- /.modal -->
                        <!--弹出窗口 添加资源-->
                        <div class="modal fade" id="addSource21" role="dialog" aria-labelledby="gridSystemModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title" id="gridSystemModalLabel">新苗申报</h4>
                                    </div>
                                    <form enctype="multipart/form-data" class="form-horizontal" method="post" autocomplete="off" action="<?php echo U('FourstepsSecond/declares');?>">
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <input type="hidden" name="sort" value="2">
                                                <div class="form-group ">
                                                    <label for="sName" class="col-xs-3 control-label">名称：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sName" placeholder="" name="title">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sLink" class="col-xs-3 control-label">负责人：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sLink" placeholder="" name="student">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sOrd" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sOrd" placeholder="" name="tel">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">指导教师：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder="" name="teacher">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder=""
                                                        name="telephone">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInput1" class="col-xs-3 control-label">上传文件：</label>
                                                    <div class="col-xs-7">
                                                        <input id="file-Portrait1" type="file" class="file" name="file">
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-xs btn-xs btn-white" data-dismiss="modal">取 消</button>
                                        <button type="button submit" class="btn btn-xs btn-xs btn-green">申 报</button>
                                    </div>
                                    </form>
                                </div>
                                <!-- /.modal-content -->
                            </div>
                            <!-- /.modal-dialog -->
                        </div>
                        <!-- /.modal -->
                        <!--弹出窗口 添加资源-->
                        <div class="modal fade" id="addSource31" role="dialog" aria-labelledby="gridSystemModalLabel">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                        <h4 class="modal-title" id="gridSystemModalLabel">国创申报</h4>
                                    </div>
                                    <form enctype="multipart/form-data" class="form-horizontal" method="post" autocomplete="off" action="<?php echo U('FourstepsSecond/declares');?>">
                                    <div class="modal-body">
                                        <div class="container-fluid">
                                            <input type="hidden" name="sort" value="3">
                                                <div class="form-group ">
                                                    <label for="sName" class="col-xs-3 control-label">名称：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sName" placeholder="" name="title">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sLink" class="col-xs-3 control-label">负责人：</label>
                                                    <div class="col-xs-9 ">
                                                        <input type="text" class="form-control input-sm duiqi" id="sLink" placeholder="" name="student">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sOrd" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sOrd" placeholder="" name="tel">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">指导教师：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder="" name="teacher">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="sKnot" class="col-xs-3 control-label">电话：</label>
                                                    <div class="col-xs-9">
                                                        <input type="text" class="form-control input-sm duiqi" id="sKnot" placeholder=""
                                                        name="telephone">
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label for="exampleInput1" class="col-xs-3 control-label">上传文件：</label>
                                                    <div class="col-xs-7">
                                                        <input id="file-Portrait1" type="file" class="file" name="file">
                                                    </div>
                                                </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-xs btn-xs btn-white" data-dismiss="modal">取 消</button>
                                        <button type="button submit" class="btn btn-xs btn-xs btn-green">申 报</button>
                                    </div>
                                    </form>
                                </div>
                                <!-- /.modal-content -->
                            </div>
                            <!-- /.modal-dialog -->
                        </div>
                        <!-- /.modal -->

                    </div>

					<div role="tabpanel" class="tab-pane" id="char">

						<div class="check-div">
                            <button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#addChar">待审项目</button>
							
                            <button class="btn btn-info btn-xs" data-toggle="modal" data-target="#addChar">在研项目</button>

                            <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#addChar">结题项目</button>
						</div>
						<div class="data-div">
							<div class="row tableHeader">
								<div class="col-xs-1 ">
									项目类别
								</div>
								<div class="col-xs-3">
									项目名称
								</div>
								<div class="col-xs-3">
									负责人
								</div>
                                <div class="col-xs-3">
                                    指导教师
                                </div>
								<div class="col-xs-2">
									操作
								</div>
							</div>
							<div class="tablebody">
                            <?php if(is_array($list)): foreach($list as $key=>$vo): ?><div class="row">
									<div class="col-xs-1 ">
										<?php if($vo["sort"] == 1): ?>春萌
                                        <?php elseif($vo["sort"] == 2): ?>新苗 <?php elseif($vo["sort"] == 3): ?>国创<?php endif; ?>

									</div>
									<div class="col-xs-3">
										<?php echo ($vo["title"]); ?>
									</div>
                                    <div class="col-xs-3">
                                        <?php echo ($vo["student"]); ?>
                                    </div>
									<div class="col-xs-3">
										<?php echo ($vo["teacher"]); ?>
									</div>
									<div class="col-xs-2">
										<button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#">在研</button>
                                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#"><a target="_blank" href="<?php echo U('FourstepsSecond/edit',array('id'=>$vo['id']));?>">编辑</a></button>
										
									</div>
								</div><?php endforeach; endif; ?>
							</div>

						</div>
						<!--页码块-->
						<footer class="footer">
							<ul class="pagination">
								<li>
									<select>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
										<option>6</option>
										<option>7</option>
										<option>8</option>
										<option>9</option>
										<option>10</option>
									</select>
									页
								</li>
								<li class="gray">
									共20页
								</li>
								<li>
									<i class="glyphicon glyphicon-menu-left">
										</i>
								</li>
								<li>
									<i class="glyphicon glyphicon-menu-right">
										</i>
								</li>
							</ul>
						</footer>
						
					</div>

					<div role="tabpanel" class="tab-pane" id="user">
						<div class="check-div form-inline">
							<div class="col-xs-6">
								<input type="text" class="form-control input-sm" placeholder="输入文字搜索">
								<button class="btn btn-white btn-xs ">查 询 </button>
							</div>
							<div class="col-lg-6 col-xs-6" style=" padding-right: 40px;text-align: right;">
								<label for="paixu">排序:&nbsp;</label>
								<select class=" form-control">
									<option> -- </option>
									<option>按级别</option>
									<option>按时间</option>
									
								</select>
							</div>
						</div>
						<div class="data-div">
							<div class="row tableHeader">
								<div class="col-xs-1 ">
									项目类别
								</div>
								<div class="col-xs-4">
									项目名称
								</div>
								<div class="col-xs-1">
									结题时间
								</div>
								<div class="col-xs-2">
									负责人
								</div>
                                <div class="col-xs-2">
                                    结题状况
                                </div>
								<div class="col-xs-2">
									操作
								</div>
							</div>
							<div class="tablebody">

                            <?php if(is_array($volist)): foreach($volist as $key=>$vo): ?><div class="row">
                                    <div class="col-xs-1 ">
                                        <?php if($vo["sort"] == 1): ?>春萌
                                        <?php elseif($vo["sort"] == 2): ?>新苗 <?php elseif($vo["sort"] == 3): ?>国创<?php endif; ?>

                                    </div>
                                    <div class="col-xs-4">
                                        <?php echo ($vo["title"]); ?>
                                    </div>
                                    <div class="col-xs-1">
                                        2016-04-21
                                    </div>
                                    <div class="col-xs-2">
                                        <?php echo ($vo["student"]); ?>
                                    </div>
                                    <div class="col-xs-2">
                                        良好结题
                                    </div>
                                    <div class="col-xs-2">
                                        <button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#">已结题</button>
                                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#"><a target="_blank" href="<?php echo U('FourstepsSecond/edit',array('id'=>$vo['id']));?>">详情</a></button>
                                        
                                    </div>
                                </div><?php endforeach; endif; ?>

							</div>

						</div>
						<!--页码块-->
						<footer class="footer">
							<ul class="pagination">
								<li>
									<select>
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
										<option>6</option>
										<option>7</option>
										<option>8</option>
										<option>9</option>
										<option>10</option>
									</select>
									页
								</li>
								<li class="gray">
									共1页
								</li>
								<li>
									<i class="glyphicon glyphicon-menu-left">
										</i>
								</li>
								<li>
									<i class="glyphicon glyphicon-menu-right">
										</i>
								</li>
							</ul>
						</footer>

						

					</div>
					
				</div>
			</div>
		</div>

		<script src="/Application/Home/View/FourstepsSecond/js/jquery.nouislider.js"></script>

		<script>
			function huadong(my, unit, def,max) {
				$(my).noUiSlider({
					range: [0, max],
					start: [def],
					handles: 1,
					connect: 'upper',
					slide: function() {
						var val =Math.floor($(this).val());
						$(this).find(".noUi-handle").text(
							val + unit
						);
						console.log($(this).find(".noUi-handle").parent().parent().html());
					},
					set: function() {
						var val =Math.floor($(this).val());
						$(this).find(".noUi-handle").text(
							val + unit
						);
					}
				});
				$(my).val(def, true);
			}
			huadong('.slider-minmax1', "分钟", "5",30);
			huadong('.slider-minmax2', "分钟", "6",15);
			huadong('.slider-minmax3', "分钟", "10",60);
			huadong('.slider-minmax4', "次", "2",10);
			huadong('.slider-minmax5', "天", "3",7);
			huadong('.slider-minmax6', "天", "8",10);
		</script>
	</body>

</html>