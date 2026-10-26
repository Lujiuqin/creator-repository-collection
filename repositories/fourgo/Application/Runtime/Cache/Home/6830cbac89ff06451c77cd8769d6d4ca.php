<?php if (!defined('THINK_PATH')) exit();?><!doctype html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>四部曲</title>
    <!-- 插件css文件 -->
    <link rel="stylesheet" type="text/css" href="/Public/Css/bootstrap.min.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/bootstrap-theme.min.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/common.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/header.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/bottom.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/User/index.css" />
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
<div class="top">
        <img src="/Public/Images/User/1.jpg" alt=""/>
</div>
<div class="content">
    
    <div class="head">
        <div class="info"><span class="glyphicon glyphicon-cog" aria-hidden="true"></span></div>
        <img src="/Public/Images/head/1.jpg" alt=""/><br/><br/>
        <ul class="list-group">
            <span class="s_color1 a no_1"><li class="list-group-item"><span class="glyphicon glyphicon-blackboard" aria-hidden="true"></span><span class="b">开放实验</span><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></li></span>
            <span class="s_color2 a no_2"><li class="list-group-item"><span class="glyphicon glyphicon-apple" aria-hidden="true"></span><span class="b">科技创新</span><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></li></span>
            <span class="s_color2 a"><li class="list-group-item"><span class="glyphicon glyphicon-education" aria-hidden="true"></span><span class="b">学科竞赛</span><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></li></span>
            <span class="s_color2 a"><li class="list-group-item"><span class="glyphicon glyphicon-grain" aria-hidden="true"></span><span class="b">成果获取</span><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></li></span>
            <span class="s_color2 a"><li class="list-group-item"><span class="glyphicon glyphicon-user" aria-hidden="true"></span><span class="b">我的伙伴</span><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></li></span>
            <span class="s_color2 a no_3"><li class="list-group-item"><span class="glyphicon glyphicon-certificate" aria-hidden="true"></span><span class="b">我的导师</span><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></li></span>
             <span class="s_color2 a no_4"><li class="list-group-item"><span class="glyphicon glyphicon-certificate" aria-hidden="true"></span><span class="b">我的课表</span><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></li></span>
        </ul>
    </div>
    <div class="main">
      
        <div id="no">
            <div class="no1"><div id="no2_header">
                    <ul>
                    <li class="no2_xmlb">
                        项目类别
                    </li>
                    <li class="no2_xmmc">
                        项目名称
                    </li>
                    <li class="no2_fzr">
                        负责人
                    </li>
                    <li class="no2_zdls">
                        指导老师
                    </li>
                    <li class="no2_cz">
                        操作
                    </li>
                </ul>
                <ul>
                    <li class="no2_xmlb">
                        开放实验
                    </li>
                    <li class="no2_xmmc">
                        office高级应用
                    </li>
                    <li class="no2_fzr">
                        胡晓峰
                    </li>
                    <li class="no2_zdls">
                        岑岗
                    </li>
                    <li class="no2_cz">
                        <button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#">在研</button>
                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#"><a class="no2_bj" target="_blank" color="#fff" href="/index.php/Home/FourstepsSecond/edit/id/1.html">编辑</a></button>
                    </li>
                </ul>
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
                </div>
            </div>
            <div class="no2">
                <div id="no2_header">
                    <ul>
                    <li class="no2_xmlb">
                        项目类别
                    </li>
                    <li class="no2_xmmc">
                        项目名称
                    </li>
                    <li class="no2_fzr">
                        负责人
                    </li>
                    <li class="no2_zdls">
                        指导老师
                    </li>
                    <li class="no2_cz">
                        操作
                    </li>
                </ul>
                <ul>
                    <li class="no2_xmlb">
                        新苗
                    </li>
                    <li class="no2_xmmc">
                        基于Android的四步曲项目教学平台
                    </li>
                    <li class="no2_fzr">
                        胡晓峰
                    </li>
                    <li class="no2_zdls">
                        岑岗
                    </li>
                    <li class="no2_cz">
                        <button class="btn btn-danger btn-xs" data-toggle="modal" data-target="#">在研</button>
                        <button class="btn btn-success btn-xs" data-toggle="modal" data-target="#"><a class="no2_bj" target="_blank" color="#fff" href="/index.php/Home/FourstepsSecond/edit/id/1.html">编辑</a></button>
                    </li>
                </ul>
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
                </div>
            </div>
            <div class="no3">
                <div class="no3_images">
                    <img src="/Public/Images/User/B1cg.jpg">
                </div>
                <span class="no3_name">岑岗:</span>
                <div class="no3_information">
                    男，教授，高级工程师（双职称，双师型教师），1959年6月生于杭州，祖籍浙江象山。现任浙江科技学院理学院院长，浙江省高校教学名师、浙江省优秀教师。中国民主同盟盟员，民盟浙江省第十届委员会委员，民盟浙江科技学院支部主任委员。浙江省教育类专业教学指导委员会委员、全国高校计算机基础教育研究会理事、华东高校计算机基础教育研究会理事、浙江省高校计算机教育学会理事、浙江省计算机用户协会理事等。目前主要从事计算机应用、教育技术学学科的教学和研究工作。
                </div>
            </div>
            <div class="no4">

                <table class="table table-hover">
                    <tr>
                      <td>时间</td>
                      <td>课程</td>
                      <td>&nbsp;&nbsp;</td>
                      <td>时间</td>
                      <td>课程</td>
                      <td>&nbsp;&nbsp;&nbsp;</td>
                      <td>时间</td>
                      <td>课程</td>
                    </tr>
                     <tr class="no4_1">
                      <td>5月1日</td>
                      <td>胡晓峰来A2商讨论文</td>
                      <td></td>
                      <td>5月6.7.8.9日</td>
                      <td>艺竹相关人员准备申请软件著作权</td>
                      <td></td>
                      <td>5月11日</td>
                      <td>准备联系申请专利</td>
                    </tr>
                    <tr class="no4_1">
                      <td>5月15.16.17日</td>
                      <td>陈璇准备撰写论文</td>
                      <td></td>
                      <td>5月28日</td>
                      <td>陈璇来A4讨论论文</td>
                      <td></td>
                      <td>5月29日</td>
                      <td>陈璇来A4讨论论文</td>
                    </tr>
                    <tr>
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                      <td></td>
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                      <td></td>
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                    </tr>
                    <tr class="no4_1">
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                      <td></td>
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                      <td></td>
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                    </tr>
                    <tr class="no4_1">
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                      <td></td>
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                      <td></td>
                      <td>&nbsp;&nbsp;</td>
                      <td>&nbsp;&nbsp;</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</div>
<div id="withe">
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
<script type="text/javascript" src="/Public/Js/header.js"></script>
<script type="text/javascript" src="/Public/Js/User/index.js"></script>
</body>
<script type="text/javascript">
$(function(){
    var a=$(".list-group-item");
    a.each(function(){
        $(this).bind("click",function(){
            $("#withe").css({
                top:$(this).offset().top+2+"px"
            });
        });
        var color=$(".a");
        color.each(function(){
            $(this).bind("click",function(){
                    var red=$(".s_color1");
            red.addClass(".s_color2");
            $(".s_color2").removeClass(".s_color1");
            $(this).addClass(".s_color1");
            $(this).removeClass("s_color2");

            })
        
        })
    });
    $(".no_2").bind("click",function(){
        $(".no1").hide();
        $(".no3").hide();
        $(".no4").hide();
        $(".no2").show();

    })
        $(".no_3").bind("click",function(){
        $(".no1").hide();
        $(".no2").hide();
        $(".no4").hide();
        $(".no3").show();
    })
        $(".no_1").bind("click",function(){
        $(".no3").hide();
        $(".no2").hide();
        $(".no4").hide();
        $(".no1").show();
    })
        $(".no_4").bind("click",function(){
        $(".no3").hide();
        $(".no2").hide();
        $(".no1").hide();
        $(".no4").show();
    })
});
$(function(){
            var s=$(".b");
        s.each(function(){
            $(this).bind("click",function(){
                s.css({"color":"#787d82"})
                $(this).css({"color":"red"})
            })
        })
})
</script>
</html>