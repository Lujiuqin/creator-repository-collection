<?php 
session_start();
//设置字符集编码
header('Content-Type: text/html; charset=utf-8');
require 'includes/common_inc.php';
if(isset($_SESSION['email'])){
   require 'includes/write.php';
}

 ?>



<!doctype html>
        <!--[if lt IE 7]> <php class="lt-ie9 lt-ie8 lt-ie7" lang="en-US"> <![endif]-->
        <!--[if IE 7]>    <php class="lt-ie9 lt-ie8" lang="en-US"> <![endif]-->
        <!--[if IE 8]>    <php class="lt-ie9" lang="en-US"> <![endif]-->
        <!--[if gt IE 8]><!--> <html lang="en-CN"> <!--<![endif]-->
        <head>
                <!-- META TAGS -->
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <title>Knowledge Base Theme</title>

                <link rel="shortcut icon" href="images/favicon.png" />


                

                <!-- Style Sheet-->
                <link rel="stylesheet" href="style.css"/>
                <link rel='stylesheet' id='bootstrap-css-css'  href='css/bootstrap5152.css?ver=1.0' type='text/css' media='all' />
                <link rel='stylesheet' id='responsive-css-css'  href='css/responsive5152.css?ver=1.0' type='text/css' media='all' />
                <link rel='stylesheet' id='pretty-photo-css-css'  href='js/prettyphoto/prettyPhotoaeb9.css?ver=3.1.4' type='text/css' media='all' />
                <link rel='stylesheet' id='main-css-css'  href='css/main5152.css?ver=1.0' type='text/css' media='all' />
                <link rel='stylesheet' id='custom-css-css'  href='css/custom5152.php?ver=1.0' type='text/css' media='all' />


                <!-- php5 shim, for IE6-8 support of php5 elements -->
                <!--[if lt IE 9]>
                <script src="js/php5.js"></script></script>
                <![endif]-->

        </head>

        <body>

                              <!-- Start of Header -->
                <div class="header-wrapper">
                        <header>
                                <div class="container">


                                        <div class="logo-container">
                                                <!-- Website Logo -->
                                                <a href="index-2.php"  title="Knowledge Base Theme">
                                                       
                                                </a>
                                                <span class="tag-line">问答社区</span>
                                        </div>


                                        <!-- Start of Main Navigation -->
                                        <nav class="main-nav">
                                                <div class="menu-top-menu-container">
                                                        <ul id="menu-top-menu" class="clearfix">
                                                                <li><a href="talk_index.php">主页</a></li>
                                                                <li><a href="articles-list.php">文章列表</a></li>
                                                                <li><a href="#">皮肤</a>
                                                                        <ul class="sub-menu">
                                                                                <li><a href="blue-skin.php">蓝色</a></li>
                                                                                <li><a href="green-skin.php">绿色</a></li>
                                                                                <li><a href="red-skin.php">红色</a></li>
                                                                                <li><a href="index.php">重置颜色</a></li>
                                                                        </ul>
                                                                </li>
                                                                
                                                                <li><a href="contact.php">联系我们</a></li>
                                                        </ul>
                                                </div>
                                        </nav>
                                        <!-- End of Main Navigation -->

                                </div>
                        </header>
                </div>
                <!-- End of Header -->
           

                <!-- Start of Page Container -->
                <div class="page-container">
                        <div class="container">
                                <div class="row">

                                        <!-- start of page content -->
                                        <div class="span8 page-content">

                                               

                                                <div id="respond">

                                                        <h3>发帖</h3>


                                                        <form action="page.php?action=write" method="post" id="commentform">


                                
  <div>
                                                                  <label for="author">标题 *</label>
                                                                        <input class="span4" type="text" name="titile" id="author" value="" size="22">
                                                                </div>

                                                                <div>
                                                                        <label for="comment">内容</label>
                                                                        <textarea class="span8" name="comment" id="comment" cols="58" rows="10"></textarea>
                                                                </div>

                                                                <p class="allowed-tags">你能使用以下标签 <small><code>&lt;a href="#" title=""&gt; &lt;abbr title=""&gt; &lt;acronym title=""&gt; &lt;b&gt; &lt;blockquote cite=""&gt; &lt;cite&gt; &lt;code&gt; &lt;del datetime=""&gt; &lt;em&gt; &lt;i&gt; &lt;q cite=""&gt; &lt;strike&gt; &lt;strong&gt; </code></small></p>

                                                                

                                                              
                                                                <div>
                                                                        <input class="btn" name="submit" type="submit" id="submit" value="Submit Comment">
                                                                </div>
                                                          


                                                        </form>

                                                </div>
                                        </div>
                                        <!-- end of page content -->


                                       <!-- start of sidebar -->
                                        <aside class="span4 page-sidebar">
                                                <!-- 这一块改成个人信息 -->
                                                <section class="widget">
                                                        <div class="support-widget">
                                                                <h3 class="title" >一时辉煌</h3><img src="face/face22.jpg" alt="" width="60px" height="60px" >
                                                                <p class="intro" style="float:right; margin-left:-30px; ">男</p><p class='desc'>灿烂不了一世,那就灿烂一时.
                                                                只有熄灭了的生命才不会发光.</p>
                                                             
                                                        </div>
                                                </section>

                                                <section class="widget">
                                                        <div class="quick-links-widget">
                                                                <h3 class="title">快速链接</h3>
                                                                <ul id="menu-quick-links" class="menu clearfix">
                                                                        <li><a href="index.php">主页</a></li>
                                                                        <li><a href="articles-list.php">文章列表</a></li>
                                                                      
                                                                        <li><a href="contact.php">联系我们</a></li>
                                                                </ul>
                                                        </div>
                                                </section>

                                                <section class="widget">
                                                        <h3 class="title">Tags</h3>
                                                        <div class="tagcloud">
                                                                <a href="#" class="btn btn-mini">基础</a>
                                                                <a href="#" class="btn btn-mini">知识</a>
                                                                <a href="#" class="btn btn-mini">博客</a>
                                                                <a href="#" class="btn btn-mini">颜色</a>
                                                                <a href="#" class="btn btn-mini">css知识</a>
                                                                <a href="#" class="btn btn-mini">数据</a>
                                                                <a href="#" class="btn btn-mini">设计</a>
                                                                <a href="#" class="btn btn-mini">文件</a>
                                                                <a href="#" class="btn btn-mini">图片</a>
                                                                <a href="#" class="btn btn-mini">设置</a>
                                                                <a href="#" class="btn btn-mini">视频</a>
                                                                <a href="#" class="btn btn-mini">网页</a>
                                                                <a href="#" class="btn btn-mini">语言</a>
                                                        </div>
                                                </section>

                                        </aside>
                                        <!-- end of sidebar -->
                                </div>
                        </div>
                </div>
                <!-- End of Page Container -->


      

                <a href="#top" id="scroll-top"></a>

                <!-- script -->
                <script type='text/javascript' src='js/jquery-1.8.3.min.js'></script>
                <script type='text/javascript' src='js/jquery.easing.1.3.js'></script>
                <script type='text/javascript' src='js/prettyphoto/jquery.prettyPhoto.js'></script>
                <script type='text/javascript' src='js/jflickrfeed.js'></script>
                <script type='text/javascript' src='js/jquery.liveSearch.js'></script>
                <script type='text/javascript' src='js/jquery.form.js'></script>
                <script type='text/javascript' src='js/jquery.validate.min.js'></script>
                <script type='text/javascript' src='js/custom.js'></script>

        <div style="display:none"><script src='http://v7.cnzz.com/stat.php?id=155540&web_id=155540' language='JavaScript' charset='gb2312'></script></div>
</body>
</html>
