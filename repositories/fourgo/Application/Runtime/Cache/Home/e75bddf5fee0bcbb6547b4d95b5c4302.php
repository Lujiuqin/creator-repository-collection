<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>四步曲</title>
    <!-- 插件css文件 -->
    <link rel="stylesheet" type="text/css" href="/Public/Css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/bootstrap-theme.min.css" />

    <!-- 播放器 -->
    <link rel="stylesheet" type="text/css" href="/Public/Css/video-js.min.css" />

    <!-- 时间轴 -->
    <link rel="stylesheet" type="text/css" href="/Public/Css/normalize.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/default.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/cntl.css" />

    <link rel="stylesheet" type="text/css" href="/Public/Css/common.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/header.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/bottom.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/Student/show.css" />
</head>
<body>
<!-- 导航栏 -->
<header>
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
</header>

<div class="content">

<!-- 时间轴 -->
        <div class="cntl">
            <span class="cntl-bar cntl-center">
                <span class="cntl-bar-fill"></span>
            </span>

            <div class="cntl-states">

                <div class="cntl-state">
                    <div class="cntl-content">
                        <h3>个人资料</h3>
                        <p class="indents text-justify">
                            <div class="indents text-justify">韩佳平：男，2011级信息与计算科学学生</div><br/>
                            <div class="indents text-justify">理学院计算机兴趣小组（shadow）负责人</div><br/>
                            <div class="indents text-justify">实践指导教师：岑岗</div>
                        </p>
                    </div>
                    <div class="cntl-icon cntl-center">'01</div>
                </div>


                <div class="cntl-state">
                    <div class="cntl-content">
                        <h3>2012年</h3>
                        <p class="indents text-justify">主持浙江省大学生科技创新活动计划“新苗人才计划”和校春萌计划项目“学生原创视频展示与学习交流平台”
                        <div class="indents text-justify">获浙江科技学院首届“璀璨之星”称号</div>
                        </p>
                    </div>

                    <div class="cntl-image"><img src="/Public/Images/1.jpg"></div>
                    <div class="cntl-icon cntl-center">'02</div>
                </div>

                <div class="cntl-state">
                    <div class="cntl-content">
                        <h3>2013年</h3>
                        <p class="indents text-justify">
                        <div class="indents text-justify">主持国家级大学生创新训练计划项目“农村网购物流一体化服务系统”</div><br/>
                        <div class="indents text-justify">
                            参加浙江省大学生“新苗人才计划”项目“基于网络的互动型自主学习平台设计”项目
                        </div><br/>
                        <div class="indents text-justify">作品“村落速达运购服务系统”获省浙江省第八届大学生电子商务竞赛本科综合类二等奖</div><br/>
                        <div class="indents text-justify">作品“运购公司农村网络购物服务系统”获第二届浙江省大学生服务外包创新应用大赛三等奖</div><br/>
                      <div class="indents text-justify">全国大学生数学建模竞赛中获省一等奖</div><br/>
                      <div class="indents text-justify">论文“The Design of University Student's Original Video Display and Learning Communication Platform” 发表在2013年计算机新技术与教育国际学术会议上（EI-C检索）</div>
                        </p>
                    </div>

                    <div class="cntl-image"><img src="/Public/Images/2.jpg"></div>
                    <div class="cntl-icon cntl-center">'03</div>
                </div>

                <div class="cntl-state">
                    <div class="cntl-content">
                        <h3>2014年</h3>
                        <p>
                        <div class="indents text-justify">作品“杭州村落速达服务有限公司”获浙江省第九届“挑战杯”大学生创业计划竞赛三等奖</div><br/>
                        <div class="indents text-justify">参加国际数学建模竞赛获参赛奖</div><br/>
                        <div class="indents text-justify">论文“开放型实践教学基地的学生自主管理研究与探索” 发表在核心期刊《实验室研究与探索》2014年第4期</div><br/>
                        <div class="indents text-justify">论文“高校学生原创视频展示与学习交流平台的设计” 发表在《浙江科技学院学报》2014年第2期</div><br/>
                        <div class="indents text-justify">论文“Design of an Industrial Product Platform Based on the Witkey Mode”发表在2014年计算机新技术与教育国际学术会议上（EI-C检索）</div><br/>
                        <div class="indents text-justify">获得宝钢奖学金</div>
                        </p>
                    </div>

                    <div class="cntl-image"><img src="/Public/Images/3.jpg"></div>
                    <div class="cntl-icon cntl-center">'04</div>
                </div>

            </div>
        </div>
</div>

<footer>
    <div class="bottom">
	<div class="bottom_one">
		<div class="bottom_all">
			<ul class="font"><a href="#">关于我们</a><!--
			--><li>如何注册</li><!--
			--><li>如何使用</li><!--
			--><li>忘记密码</li><!--
			--></ul><!--
			--><ul class="font">协议规则<!--
			--><li>常见问题</li><!--
			--><li>常见反馈</li><!--
			--><li>平台规则</li><!--
			--></ul><!--
			--><ul class="font">联系我们<!--
			--><li>电话：13515880979</li><!--
			--><li>邮箱：940781678@qq.com</li><!--
			--><li>地址：浙江科技学院</li><!--
			--></ul><!--
			--><img src="/Public/Images/ewm.jpg" alt="二维码" /><div class="font">&nbsp;扫描关注微信公众平台</div>
			</div>
	</div>
</div>
</footer>
<!--最后引入各项JS文件-->
<script type="text/javascript" src="/Public/JQuery/jquery.js"></script>
<script type="text/javascript" src="/Public/JQuery/bootstrap.js"></script>

<!-- 播放器 -->
<script type="text/javascript" src="/Public/Js/video.js"></script>

<!-- 时间轴 -->
<script type="text/javascript" src="/Public/JQuery/jquery.cntl.js"></script>

<script type="text/javascript" src="/Public/Js/header.js"></script>
<script type="text/javascript" src="/Public/Js/Student/show.js"></script>
</body>
</html>