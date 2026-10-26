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
    <link rel="stylesheet" type="text/css" href="/Public/Css/common.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/header.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/bottom.css" />
    <link rel="stylesheet" type="text/css" href="/Public/Css/Study/index.css" />
</head>
<body>
<!-- 导航栏 -->
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
<div class="content">
   <ol class="breadcrumb">
      <li><a href="#">四步曲研究</a></li>
      <li>研究介绍</li>
    </ol> 
    <div class="left">
      <ul class="list-group">
        <a href="#"><li class="list-group-item">前言</li></a>
        <a href="#2"><li class="list-group-item">内容介绍</li></a>
        <a href="#3"><li class="list-group-item">研究团队</li></a>
        <a href="#4"><li class="list-group-item">理论研究</li></a>
        <a href="#5"><li class="list-group-item">研究活动</li></a>
      </ul>
    </div>
    <div class="right">
        <!-- 前言开始 -->
        <h2 id="1">前言</h2><div class="indents text-justify">浙江科技学院是以工科为主，集理、文、经济、管理、教育为一体的多学科全日制省属本科院校。学校明确培养具有国际化背景的高层次应用型人才，着重培养面向地方和企业的“学以致用、全面发展”的高层次应用型人才。“借鉴德国应用技术学院的经验，培养高层次应用型人才”已成为浙江科技学院的办学理念。</div><div class="indents text-justify" id="2">基于学校的定位和办学特色，教育技术学专业经过几年努力，逐渐地探索出了一种较具特色与成效的教学模式――开放型项目教学模式。开放型项目教学这一特殊的教学模式成为教育技术学专业提高学生学习主动性，促进学生学风建设，提高学生综合素质和能力培养等方面比较有特色的教学实践活动。经过200多位以教育技术学专业为主的学生和20余位专业教师的共同努力，5年的实践，开放型项目教学实践充分地得到了肯定，获得了浙江省教学成果二等奖及浙江科技学院教学成果一等奖，取得了丰硕的成果。</div>
        <!-- 前言结束 -->

        <!-- 内容介绍开始 -->
        <h2>内容介绍</h2><div class="indents text-justify">借鉴德国应用型人才培养的项目教学模式,结合我国国情和本校的教学工作实际情况,提出了“开放型项目教学” ——这一符合我国及我校实际情况的新模式，并进行了五年的实践。经过200多位以教育技术学专业为主的学生和20余位专业教师的共同努力,成果获得浙江省教学成果二等奖及浙江科技学院教学成果一等奖。</div>
        <h4>1．教学研究的背景</h4><div class="indents text-justify">浙江科技学院以教育技术学专业教师为主的一些教师，根据学校的定位和办学特色，在项目教学模式的基础上，在教育技术学专业为主的学生中，开展了一项具有特色的教学与实践活动。即在2005年提出“开放型项目教学模式”，经过几年努力，逐渐探索出一种较具特色与成效的教学方式——开放型项目教学模式。</div>
        <h4>2．教学模式的内容</h4><div class="indents text-justify">开放型项目教学：是以学生为中心，让学生结合所学专业，在项目教学模式的基础上，将教学计划内的学习拓展到第二课堂（课余时间），并自主选择项目、合作伙伴、指导教师、学习环境等等。</div>
        <h4>3．实践的项目</h4><div class="indents text-justify">实践项目来源主要有三类：(1) 教师科研、教研项目(2)学生自主设计的项目(3) 学生参与学科竞赛的项目。</div><div class="indents text-justify">2005年以来，参加开放型项目教学实践的学生，共主持浙江省科技厅新苗人才培养计划项目8项，校级科技创新项目85项，学生自主选择或设计项目30余项。参加教师的研究项目10余项。</div>
        <h4>4．实践的实施</h4><div class="indents text-justify">将开放型项目教学分为项目选择、团队构成、项目实施、成果评价四个阶段展开实施。</div>
        <h4>5．模式的特点</h4><div class="indents text-justify">（1）角色的转变：构建了学习者学习角色转变环境。教师的作用是起组织、引导、激励、促进作用。</div>
        <div class="indents text-justify">（2）形式的开放：项目教学模式在起止的时间、环境选择的空间、项目内容的开放、伙伴与导师的自主选择。</div><div class="indents text-justify">（3）自主协作的学习环境：创设自主、协作的学习环境。一方面，学生自主地选择项目、学习伙伴、指导教师、学习环境等等；另一方面，学习是以小组为单位通过协作学习模式开展。</div>
        <h4>6．实践的原则</h4><div class="indents text-justify">实践遵循普及性、倡导性、发展性和收益性的原则。</div>
        <h4>7．实践的对象</h4><div class="indents text-justify">以2003级教育技术学专业开始起共10个班级作为主要实践对象，其他各专业学生有30余人与教育技术学专业学生一起参加了开放型项目型教学实践。</div>
        <h4 id="3">8．实践的成果</h4><div class="indents text-justify">项目获奖：浙江省大学生多媒体设计竞赛等省市级竞赛获奖24项，其中一等奖5项。</div>
        <div class="indents text-justify">拟定论文：正式发表论文25篇，其中被ISTP收录4篇，荣获一级学会优秀论文一等奖2项、二等奖1项、优秀奖1项。</div>
        <div class="indents text-justify">促进学风：在03至08级教育技术学专业10个班中，共产生2个校特优学风示范班、3个校特优学风班，1个优良学风班，2个优良学风寝室，1位校年度人物，2位国家奖学金获得者。</div>
        <div class="indents text-justify">促进就业：成果也提高了学生的就业竞争力，03级、04级和05级的一次性就业率分别达到90%、100%和100%。</div>
        <!-- 内容介绍结束 -->

        <!-- 研究团队开始 -->
        <h2>研究团队</h2>
        <!-- 项目主持 -->
        <h4>1. 项目主持：</h4>
        <div class="indents text-justify">岑  岗：男，教授，高级工程师（双职称，双师型教师），1959年6月生于杭州，祖籍浙江象山。现任浙江科技学院理学院院长，浙江省高校教学名师、浙江省优秀教师。中国民主同盟盟员，民盟浙江省第十届委员会委员，民盟浙江科技学院支步主任委员。浙江省教育类专业教学指导委员会委员、全国高校计算机基础教育研究会理事、华东高校计算机基础教育研究会理事、浙江省高校计算机教育学会理事、浙江省计算机用户协会理事等。目前主要从事计算机应用、教育技术学学科的教学和研究工作。</div>
        <div class="indents text-justify">1982年杭州大学物理系毕业后在企业工作，1985年5月调入杭州高等专科学校（浙江科技学院前身），1989年起主持校计算中心、现代教育技术中心、教育信息技术学系步门工作，2005年7月任信息与电子工程学院副院长，2008年7月起任理学院的主持工作副院长、院长。</div>
        <div class="indents text-justify">教学上：主持的大学计算机基础、计算机辅助教育两门课先后通过了学校优秀课程验收。1999年起负责筹建学校教育技术学专业。主讲有：“大学计算机基础”、“计算机程序设计语言”、“计算机辅助教育”、“教育技术学导论”等十余门本科生课程。主持浙江省精品课程—“计算机辅助教育”。主编或参编浙江省重点教材《计算机绘图基础-AutoCAD 2007》等正式出版的教材12步。</div>
        <div class="indents text-justify">科研上：主持浙江省哲学社会科学规划课题等6项，参加省自然科学基金项目等省级、厅级科研项目10余项，发表学术论文90余篇，其中一级和三大检索论文20余篇，</div>
        <div class="indents text-justify">获奖上：主持或作为主要成员参加的项目曾获省教委科技进步三等奖，浙江省教学成果二等奖，学校教学成果一等奖3次、二等奖1次、优秀奖1次，校优秀教学奖。</div>
        <div class="indents text-justify">荣誉奖：2004年获“浙江省优秀教师”、浙江省“三育人”先进个人；2006年被学生评为浙江科技学院首届“我心目中的好老师”，2007年获省高等学校优秀学生社团指导教师，2008年被评为第三届浙江省高校教学名师，2009年获首届浙江省“师德”先进个人。</div>
        <div class="indents text-justify">在开放型项目教学研究中，主持与本成果相关教学研究项目：浙江省新世纪高校教育教学改革项目“开放型项目学习的应用研究”和中国高等教育学会“十一五”教育教学规划课题项目“开放性项目学习的应用研究”；浙江省级精品课程：“计算机辅助教育”课程建设。组织研究开发了开放型项目教学管理系统一套。构建教育技术学专业开放型项目教学的具体实施方案。撰写本成果相关论文“开放型项目教学促进应用能力培养研究与探索”等11篇，其中EI，ISTP收录4篇，优秀论文一、二等奖各1篇。</div>
        <!-- 研究成员 -->
        <h4>2. 研究成员：</h4>
        <div class="indents text-justify">开放型项目教学模式研究除了有负责人岑岗参加外，参加研究并写出研究论文或相关论文的教师还有林雪芬、魏英、唐伟、莫云峰、孙晓勇等老师，文献民、雷运发、鲍宗亮、周健吉、林丽等教师先后参加步分研究工作。</div>
        <h4>（1）林雪芬：</h5>
        <div class="indents text-justify">女，1980年12月生，讲师，硕士。主要从事教育技术学专业教学与研究工作。参加项目5项，其中省级项目2项，参加省精品课程建设1项，参加的1项课程建设为校优秀课程，近年来正式发表论文近10篇，其中三大检索论文3篇。参加编写教材2步。</div>
        <div class="indents text-justify">在开放型项目教学研究中，作为主要核心成员参加与本项目相关的项目研究，撰写与本成果相关论文“开放型项目学习的活动形式研究”等5篇，其中三大检索论文3篇。参加了教育技术学专业开放型项目教学具体实施方案的设计。</div>
        <h4>（2）唐  伟：</h5>
        <div class="indents text-justify">男，1981年1月生，工程师，硕士。主要从事教育技术学实践教学与研究工作。主持或参加项目6项，其中主持厅级1项，参与省级2项，省精品课程建设1项，近年来正式发表论文10余篇，其中EI、ISTP收录6篇，核心期刊2篇。参加编写教材4步。</div>
        <div class="indents text-justify">在开放型项目教学研究中，作为主要成员参加与本项目相关的项目研究，撰写与本成果相关论文“开放性项目教学在计算机公共课教学中的研究与应用”。</div>
        <h4>（3）莫云峰：</h5>
        <div class="indents text-justify">男，1977年9月生，讲师，硕士。主要从事教育技术学专业教学与研究工作。主持或参加项目10项，其中主持教育厅项目1项，参加省精品课程建设1项，主持学校重点课程建设项目1项，参加的2项课程建设均为校优秀课程。参加省厅级项目7项。近年来正式发表论文10余篇，其中三大检索论文3篇，核心期刊1篇，参加编写教材2步。</div>
        <div class="indents text-justify">在开放型项目教学研究中，作为主要成员参加与本项目相关的项目研究。</div>
        <h4>（4）魏  英：</h5>
        <div class="indents text-justify">男，1976年10月生，副教授，硕士。第二届浙江省教坛新秀。主要从事计算机教育和计算机应用的教学与研究工作。主持或参加项目20项，其中参加省精品课程建设2项，主持学校重点课程建设项目1项，参加的3 项课程建设均为校优秀课程，主持教育厅项目1项，参加省级研究项目3项，近年来正式发表论文20余篇，其中三大检索论文1篇，核心期刊6篇，主编或副主编教材3步，参编教材12步。</div>
        <div class="indents text-justify">在开放型项目教学研究中，作为主要成员参加与本项目相关的项目研究。</div>
        <h4>（5）孙晓勇：</h5>
        <div class="indents text-justify">男，1979年9月生，讲师，硕士。主要从事计算机辅助教育和计算机应用教学与研究工作。主持学校重点课程建设项目1项，参加的2 项校课程建设均为校优秀课程。参加科研教研项目13项，其中省级项目2项，教育厅项目1项，省精品课程建设1项。近年来正式发表论文12篇，参加编写教材2步。</div>
        <div class="indents text-justify">在开放型项目教学研究中，作为主要成员参加与本项目相关的项目研究，参与开放型项目教学模式在浙江科技学院教育技术学专业中进行了教学实践。撰写与本成果相关论文“开放型项目教学中量的研究”。</div>
        <h4>（6）文献民：</h5>
        <div class="indents text-justify">男，1962年10月生。教授，博士。在担任学校教务处副处长时，负责学校学生的实践教学和学科竞赛工作。在开放型项目教学研究中，作为主要成员参加与本项目相关的项目研究，积极推动开放型项目教学研究与实践活动，组织和指导项目教学的计划和实施，多媒体设计竞赛的策划，指导学生项目学习，推动了开放型项目教学实践进行。</div>
        <h4>（7）雷运发：</h5>
        <div class="indents text-justify">男，1957年3月生，副教授，硕士。教育技术学系主任，浙江省高教学会教育技术专业委员会理事。主要从事教育技术学的教学与研究工作。主持校重点课程建设项目1项，主持或参加科研教研项目10余项，其中参加省级6项，省精品课程建设1项。近年来正式发表论文多篇。主编或参加编写教材4步。</div>
        <div class="indents text-justify">在开放型项目教学研究中，作为主要成员参加与本项目相关的项目研究，负责实践教学的计划与实施。</div>
        <h4 id="4">（8）鲍宗亮：</h5><div class="indents text-justify">男，1980年10月生，工程师，在读硕士。主要从事教育技术学及数字媒体技术专业的实践教学与研究工作。在开放型项目教学研究中，参加初期的研究工作。</div>
        <h4>（9）周健吉：</h5>
        <div class="indents text-justify">女，1963年生，讲师。主要从事计算机专业教学和教务管理工作。在开放型项目教学研究中。参与步分研究工作。</div>
        <h4>（10）林  丽：</h5>
        <div class="indents text-justify">女，1973年9月生，助理研究员，硕士。在开放型项目教学研究中。参与步分研究工作。</div>
        <!-- 研究团队结束 -->

        <!-- 理论研究开始 -->
        <h2>理论研究</h2>
        <h4>1．项目支持</h4>
        <div class="indents text-justify">开放型项目教学研究自2004年3月在2003级教育技术学专业学生中开始进行探索。</div>
        <div class="indents text-justify">（1）2006年：浙江省新纪高等教育教学改革研究项目（编号：yb0678）项目。</div>
        <div class="indents text-justify">（2）2006年：中国高等教育学会教育科学“十一五”规划项目(编号:06AIJ0070029）项目的立项资助。</div>
        <div class="indents text-justify">（3）2008年：浙江省精品课程----“计算机辅助教育”。</div>
        <h4>2．研究论文</h4>
        <div class="indents text-justify">项目研究课题组成员已在国内撰写并正式发表了“开放型项目教学的研究与实践”、“开放型项目学习的活动形式研究”等11篇论文，其中被EI、ISTP收录3篇，获优秀论文一等奖、二等奖各1篇。</div>
        <div class="indents text-justify">(1) 岑岗.开放型项目教学促进应用能力培养研究与探索.应用型人才培养的理论与实践—首届中德论坛(杭州)文集, 高等教育出版社.2008.9.:453-460。</div>
        <div class="indents text-justify">(2) 岑岗,林雪芬.开放型项目学习的活动形式研究.浙江科技学院学报.2008(2):129-132。</div>
        <div class="indents text-justify">(3) 陈洁,岑岗.开放型项目学习促进计算机应用能力培养的探索.计算机时代. 2007(8):9-11。</div>
        <div class="indents text-justify">(4) 岑岗,陈洁. 开放型项目教学提高计算机应用能力的实践.全国高校计算机基础教育研究会2008年学术年会论文集（一级学会论文集），清华大学出版社.2008.11.:224-229. 优秀论文一等奖。</div>
        <div class="indents text-justify">(5) 岑岗,陈洁,林雪芬. Improing Computer Application Ability with Open-ended Project Teaching Method．The 3st International Conference on Computer Science and Education, 厦门大学出版社. 2008.7.：1362-1365．ISTP收录。</div>
        <div class="indents text-justify">(6) 孙晓勇,岑岗.开放型项目教学中量的研究. 第七届教育技术国际论坛(ETIF2008)论文集:挑战、机遇与发展:应用教育技术促进教育创新. 山东师范大学出版社. 2008.9:55-58。</div>
        <div class="indents text-justify">(7) 岑岗，唐伟.开放性项目教学在计算机公共课教学中的研究与应用.大学计算机课程报告论坛论文集2006.高等教育出版社，2007.6:326-329。</div>
        <div class="indents text-justify">(8) Cen Gang（岑岗），Lin Xuefeng（林雪芬）．A Study of Inter-school Open-ended Project Instruction．Proceedings of 2009 4th International Conference on Computer Science & Education（第四届国际计算机新科技与教育学术会议论文集）,厦门大学出版社（ISBN 978-1-4244-3519-7）, 2009.7.：1591-1594．EI和ISTP收录。</div>
        <div class="indents text-justify" id="5">(9) 岑岗，林雪芬．校际开放型项目教学模式研究．第8届教育技术国际论坛(ETIF2009)论文集：信息化时代教育技术应用与创新，电子工业出版社 优秀论文二等奖。</div>
        <div class="indents text-justify">(10) Cen Gang（岑岗），Lin Xuefeng（林雪芬）．Theoretical Framework Research of Open-ended Project-based Instruction。Proceedings of 2010 5th International Conference on Computer Science & Education（第五届国际计算机新科技与教育学术会议论文集）, 2010.8.：438-441．EI和ISTP收录。</div>
        <div class="indents text-justify">(11) 岑岗,林雪芬.开放型项目教学的研究与实践.浙江科技学院学报.2010(5)。</div>
        <!-- 理论研究结束 -->

        <!-- 研究活动开始 -->
        <h2 id="5">研究活动</h2>
        <div class="yjhd">
            <div><img src="/Public/Images/Study/C21.jpg" alt=""><div class="indents text-justify">2005年8月项目组成员岑岗、雷运发、刘省权、吴纯在江西省南昌市参加第四届教育技术国际会议，项目组师生共有3篇论文在会上进行交流，其中03级教育技术学学生项城与教师合作的论文被会议录用。</div></div>
            <div><img src="/Public/Images/Study/C23.jpg" alt=""><div class="indents text-justify">2005年10月岑岗在杭州参加华东高校计算机基础教育研究会学术年会时在会上发言，项目组成员岑岗在会上当选为研究会理事</div></div>
            <div><img src="/Public/Images/Study/C24.jpg" alt=""><div class="indents text-justify">2005年11月浙江科技学院教育技术学系组织首届在杭高校教育技术学专业教师交流会，参加会议的有浙江大学、杭州电子科技大学、浙江工业大学、杭州师范学院等高校教师，探讨教育技术学人才培养模式。</div></div>
            <div><img src="/Public/Images/Study/C25.jpg" alt=""><div class="indents text-justify">2006年7月项目组成员岑岗、莫云峰、林雪芬、唐伟参加在厦门大学举行的首届计算机新技术与教育国际学术会议会，项目组教师有2篇论文录用并被ISTP收录。</div></div>
            <div><img src="/Public/Images/Study/C26.jpg" alt=""><div class="indents text-justify">2006年7月魏英在吉林省长春市参加全国计算机基础教育研究会学术年会作报告。岑岗参加会议。项目组成员和学生共有6篇论文被收录论文集，有2篇获一等奖，2篇获优秀奖。其中参加开放型项目教学的03级教育技术学学生周程、项城与老师合作结合项目学习撰写的2篇论文被学术会议录用，并分别获一等奖和优秀奖。</div></div>
            <div><img src="/Public/Images/Study/C27.jpg" alt=""><div class="indents text-justify">2006年11月项目组成员岑岗、雷运发、鲍宗亮和03教育技术学学生朱贵在湖北武汉华中科技大学参加第五届教育技术国际会议，师生共4篇论文在会上进行交流。其中参加开放型项目教学的03级教育技术学学生朱贵、童喆的结合项目学习撰写的2篇论文被论坛会议录用。</div></div>
            <div><img src="/Public/Images/Study/C28.jpg" alt=""><div class="indents text-justify">2006年11月,项目组成员岑岗在杭州师范大学举行的第二次在杭高校教育技术学专业教师交流会发言，林雪芬、唐伟等参加了交流会。</div></div>
            <img src="/Public/Images/Study/C29.jpg" alt=""><div class="indents text-justify">2006年11月11日，岑岗在宁波大学参加浙江省大学生多媒体设计竞赛研讨会上发言。</div>
            <div><img src="/Public/Images/Study/C29-B.jpg" alt=""><div class="indents text-justify">2006年11月11日研讨会专家在观摩由浙江科技学院教育技术学龚彪陈洁等人创作的一等奖作品DV片“那年夏天”。</div></div>
            <div><img src="/Public/Images/Study/C30.jpg" alt=""><div class="indents text-justify">2006年11月18日，岑岗、唐伟在江苏省南京市参加第二届大学计算机课程报告论坛会，岑岗、唐伟的“开放性项目教学在计算机公共课教学中的研究与应用”论文被论坛会收录论文集。</div></div>
            <div><img src="/Public/Images/Study/C32.jpg" alt=""><div class="indents text-justify">2007年4月项目组负责人岑岗随学校考察团访问德国汉诺威应用技术学院进行为期一周的考察。</div></div>
            <div><img src="/Public/Images/Study/C35.jpg" alt=""><div class="indents text-justify">2007年7月,项目组成员张银南在湖北武汉参加第二届计算机新技术与教育国际学术会议，项目组成员有4篇论文录用并被ISTP收录。</div></div>
            <div><img src="/Public/Images/Study/C36.jpg" alt=""><div class="indents text-justify">2007年8月7日至9日，岑岗、张银南在安徽黄山参加华东高校计算机基础教育研究会学术年会。岑岗在会上作了“开放型项目学习促进计算机应用能力培养的探索”学术报告，获得了与会专家的肯定与好评。</div></div>
            <div><img src="/Public/Images/Study/C37.jpg" alt=""><div class="indents text-justify">2007年8月，唐伟参加在香港举行的“2007 International Conference on Machine Learning and Cybernetics”会议，撰写的论文被会议收录，并被EI检索。</div></div>
            <div><img src="/Public/Images/Study/C39.jpg" alt=""><div class="indents text-justify">2007年9月，岑岗参加高层次应用型人才培养—首届中德论坛，岑岗的“开放型项目教学促进应用能力培养的研究与探索”论文收录高教出版社出版的“应用型人才培养的理论与实践—首届中德论坛(杭州)文集”。</div></div>
            <div><img src="/Public/Images/Study/C40.jpg" alt=""><div class="indents text-justify">2007年11月3-4日，项目组负责人岑岗在丽水参加省教育技术专业委员会学术年会。</div></div>
            <div><img src="/Public/Images/Study/C42.jpg" alt=""><div class="indents text-justify">2008年7月，岑岗与05教育技术学学生陈洁与全国高校计算机教育研究会会长袁开榜教授在河南省开封市召开的第三届计算机新技术与教育国际学术会议上，岑岗等的“促进计算机基础教育的开放型项目教学模式”等2篇论文录用并被ISTP收录。</div></div>
            <div><img src="/Public/Images/Study/C44.jpg" alt=""><div class="indents text-justify">2008年9月，项目组成员岑岗、覃伟参加山东省济南市参加第七届教育技术学国际论坛会。孙晓勇、岑岗的“开放型项目教学中量的研究.”和05级学生赵佰城、徐君等的“普通话学习系统的功能设计与实现”2篇论文收录论文集。</div></div>
            <div><img src="/Public/Images/Study/C46.jpg" alt=""><div class="indents text-justify">2008年11月7至11日，岑岗在广西桂林召开的全国计算机基础教育研究会学术年会会上当选为研究会理事，在会上与新当选的理事长王路江教授。项目组合影。项目组成员有2篇论文被收录论文集，其中岑岗等的“开放型项目教学提高计算机应用能力的实践”论文获优秀论文一等奖。</div></div>
            <div><img src="/Public/Images/Study/C47.jpg" alt=""><div class="indents text-justify">2009年7月项目组成员岑岗、张银南在广西南宁参加第四届计算机新技术与教育国际学术会议时与袁开榜教授合影。项目组成员岑岗、林雪芬的“A Study of Inter-school Open-ended Project Instruction”等2篇论文录用并被EI和ISTP同时收录。</div></div>
            <div><img src="/Public/Images/Study/C48.jpg" alt=""><div class="indents text-justify">2009年8月，莫云峰参加华东计算机基础教育研究会学术年会与华东高校计算机教育研究会理事长张森教授合影，教育技术学师生共有4篇论文被录用。</div></div>
            <div><img src="/Public/Images/Study/C49.jpg" alt=""><div class="indents text-justify">2009年8月，项目组成员岑岗与06教育技术学学生余建伟在江苏省徐州参加第八届教育技术学国际论坛会。项目组成员有2篇论文收录论坛论文集，另有06级教育技术学学生李炜、陈吉波等的2篇论文被录用。</div></div>
        </div>
        <!-- 研究活动结束 -->
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
<script type="text/javascript" src="/Public/Js/header.js"></script>
<script type="text/javascript" src="/Public/Js/Study/index.js"></script>
</body>
</html>