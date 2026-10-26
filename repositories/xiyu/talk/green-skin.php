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
                <link rel='stylesheet' id='green-skin-css'  href='css/green-skin5152.css?ver=1.0' type='text/css' media='all' />
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
                                                                        <li class="article-entry standard">
                                                                                <h4><a href="single.php">WEB的基础</a></h4>
                                                                                <span class="article-meta">2013 10 月 25 <a href="#" title="">
                                                                                        服务和数据
                                                                                </a></span>
                                                                                <span class="like-count">66</span>
                                                                        </li>
                                                                       
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
                                                                <h3 class="title">Support</h3>
                                                                <p class="intro">Need more support? If you did not found an answer, contact us for further help.</p>
                                                        </div>
                                                </section>

                                                <section class="widget">
                                                        <div class="quick-links-widget">
                                                                <h3 class="title">快速链接</h3>
                                                                <ul id="menu-quick-links" class="menu clearfix">
                                                                        <li><a href="index.php">主页</a></li>
                                                                        <li><a href="articles-list.php">文章列表</a></li>
                                                                        <li><a href="faq.php">常见问题解答</a></li>
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