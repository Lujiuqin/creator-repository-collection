<?php 
session_start();
//设置字符编码
header('Content-Type: text/html; charset=utf-8');
require 'includes/common_inc.php';

 ?>


<!doctype html>
        <!--[if lt IE 7]> <php class="lt-ie9 lt-ie8 lt-ie7" lang="en-US"> <![endif]-->
        <!--[if IE 7]>    <php class="lt-ie9 lt-ie8" lang="en-US"> <![endif]-->
        <!--[if IE 8]>    <php class="lt-ie9" lang="en-US"> <![endif]-->
        <!--[if gt IE 8]><!--> <html lang="en-CN"> <!--<![endif]-->
<?php
   require"includes/tittle.php";
?>
        <head>
                <!-- META TAGS -->
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <title>问答社区</title>

                


                

                <!-- Style Sheet-->

                <link rel="stylesheet" type="text/css" href="css/talkindex.css">
                <link rel='stylesheet' id='responsive-css-css'  href='css/responsive5152.css?ver=1.0' type='text/css' media='all' />
                <link rel='stylesheet' id='pretty-photo-css-css'  href='js/prettyphoto/prettyPhotoaeb9.css?ver=3.1.4' type='text/css' media='all' />
                <link rel='stylesheet' id='main-css-css'  href='css/main5152.css?ver=1.0' type='text/css' media='all' />
                  
                <link rel='stylesheet' id='bootstrap-css-css'  href='css/bootstrap5152.css?ver=1.0' type='text/css' media='all' />
                <link rel='stylesheet' id='responsive-css-css'  href='css/responsive5152.css?ver=1.0' type='text/css' media='all' />


        </head>
        <body>

<?php require"includes/header.php";
?>
<div class="community_header">
    <div class="container_community">
        <div class="h1">
                无限社区
        </div>
        <a href="community.php">
                讲座
        </a>
        <a href="talk_index.php">
                问答
        </a>
    </div>
</div>
                <!-- End of Header -->

                <!-- Start of Search Wrapper -->
                <div class="search-area-wrapper">
                        <div class="search-area container">
                                <h3 class="search-header">有问题?</h3>
                                <p class="search-tag-line">有问题请搜索</p>

                                <form id="search-form" class="search-form clearfix" method="get" action="#" autocomplete="off">
                                        <input class="search-term required" type="text" id="s" name="s" placeholder="请输入搜索内容" title="" />
                                        <input class="search-btn" type="submit" value="搜索" />
                                        <div id="search-error-container"></div>
                                </form>
                        </div>
                </div>
                <!-- End of Search Wrapper -->

                <!-- Start of Page Container -->
                <div class="page-container">
                        <div class="container">
                                <div class="row">

                                        <!-- start of page content -->
                                        <div class="span8 page-content">

                                                <!-- Basic Home Page Template -->
                                                <div class="row separator">
                                                        <section class="span4 articles-list">
                                                                <h3>推荐文章</h3>
                                                                <ul class="articles">
                                                                <?php 
                                                                $_row=_query("SELECT * FROM artical LIMIT 3");
                                                                   while(!! $_rows=_fetch_array_list($_row)){
                                                                    

                                                                    $_html=array();
                                                                    $_html['title'] = $_rows['titile'];
                                                                    $_html['commont'] = $_rows['commont'];
                                                                    $_html['type'] = $_rows['type'];
                                                                    $_html['time'] = $_rows['time'];
                                                                    $_html['view'] = $_rows['view'];
                                                                    
                                                                       if($_html['type']=="问答") {
                                                                        $_type='standard';
                                                                       } 
                                                                         if($_html['type']=="教学") {
                                                                        $_type='video';
                                                                       } 
                                                                         if($_html['type']=="分享") {
                                                                        $_type='image';
                                                                       } 


                                                                 ?>

                                                                        <li class="article-entry <?php echo  $_type;?> " >
                                                                                <h4><a href="single.php"><?php echo $_html['title']; ?></a></h4>
                                                                                <span class="article-meta"><?php echo $_html['time']; ?> <a href="#" title="">
                                                                                        <?php echo $_html['type']  ?>
                                                                                </a></span>
                                                                                <span class="like-count"><?php echo $_html['view']; ?></span>
                                                                       </li>
                                                                  <?php 
                                                                  }
                                                                   ?>     
                                                                        <li class="article-entry video">
                                                                                <h4><a href="single.php">标签的使用</a></h4>
                                                                                <span class="article-meta">23 Feb, 2013 in <a href="#" title="">网页设计</a></span>
                                                                                <span class="like-count">8</span>
                                                                        </li>
                                                                        <li class="article-entry image">
                                                                                <h4><a href="single.php">语言的设计</a></h4>
                                                                                <span class="article-meta">22 Feb, 2013 in <a href="#" title="">广告技巧</a></span>
                                                                                <span class="like-count">6</span>
                                                                        </li>
                                                                       
                                                                </ul>
                                                        </section>

                                                        <section class="span4 articles-list">
                                                                <h3>最新帖子</h3>
                                                                <ul class="articles">
                                                                        
                                                                        <li class="article-entry standard">
                                                                                <h4><a href="single.php">使用JS</a></h4>
                                                                                <span class="article-meta">25 Feb, 2013 in <a href="#" title="">技术</a></span>
                                                                                <span class="like-count">18</span>
                                                                        </li>
                                                                        <li class="article-entry image">
                                                                                <h4><a href="single.php">图片的使用</a></h4>
                                                                                <span class="article-meta">25 Feb, 2013 in <a href="#" title="">美化设计</a></span>
                                                                                <span class="like-count">7</span>
                                                                        </li>
                                                                        <li class="article-entry video">
                                                                                <h4><a href="single.php">Video 的使用技巧</a></h4>
                                                                                <span class="article-meta">24 Feb, 2013 in <a href="#" title="">美化设计</a></span>
                                                                                <span class="like-count">7</span>
                                                                        </li>
                                                                        
                                                                </ul>
                                                        </section>
                                                </div>

                                                <div class="row home-category-list-area">
                                                        <div class="span8">
                                                                <h2>分类</h2>
                                                        </div>
                                                </div>

                                                <div class="row-fluid top-cats">

                                                        <section class="span4">
                                                                <h4 class="category"><a href="#">提问专区</a></h4>
                                                                <div class="category-description">
                                                                        <p>提问专用社区</p>
                                                                </div>
                                                        </section>

                                                        <section class="span4">
                                                                <h4 class="category"><a href="#">文章专区</a></h4>
                                                                <div class="category-description">
                                                                        <p>分享文章专区</p>
                                                                </div>
                                                        </section>

                                                        <section class="span4">
                                                                <h4 class="category"><a href="#">成果专区</a></h4>
                                                                <div class="category-description">
                                                                        <p>分享自己的成果专区</p>
                                                                </div>
                                                        </section>
                                                </div>
                                                <div class="row-fluid top-cats">

                                                        <section class="span4">
                                                                <h4 class="category"><a href="#">感谢专区</a></h4>
                                                                <div class="category-description">
                                                                        <p>感谢教导自己的老师</p>
                                                                </div>
                                                        </section>

                                                        <section class="span4">
                                                                <h4 class="category"><a href="#">投诉专区</a></h4>
                                                                <div class="category-description"><p>有任何需要投诉的请发帖在这</p>
                                                                </div>
                                                        </section>
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
