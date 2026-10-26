-- phpMyAdmin SQL Dump
-- version 2.10.3
-- http://www.phpmyadmin.net
-- 
-- 主机: localhost
-- 生成日期: 2015 年 09 月 21 日 12:50
-- 服务器版本: 6.0.4
-- PHP 版本: 6.0.0-dev

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- 数据库: `testguest`
-- 

-- --------------------------------------------------------

-- 
-- 表的结构 `artical`
-- 

CREATE TABLE `artical` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '//ID',
  `writer` varchar(20) NOT NULL COMMENT '//发帖人',
  `commont` varchar(200) NOT NULL COMMENT '//内容',
  `titile` varchar(20) NOT NULL COMMENT '//标题',
  `level` tinyint(1) unsigned DEFAULT '0' COMMENT '//是否加精',
  `view` int(6) unsigned DEFAULT '0' COMMENT '//浏览量',
  `type` varchar(5) DEFAULT '问答' COMMENT '//文章类别',
  `time` date NOT NULL COMMENT '//发出时间',
  `ip` varchar(20) NOT NULL COMMENT '//发出地址',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=4 ;

-- 
-- 导出表中的数据 `artical`
-- 

INSERT INTO `artical` VALUES (1, '976736530@qq.com', '', '12313', 0, 0, '问答', '2015-08-13', '');
INSERT INTO `artical` VALUES (2, '976736530@qq.com', '', '第一次问答', 0, 0, '问答', '2015-08-13', '');
INSERT INTO `artical` VALUES (3, '976736530@qq.com', 'dsadsadasdasdasdasds', 'asdasdasdasda', 0, 0, '问答', '2015-08-13', '');

-- --------------------------------------------------------

-- 
-- 表的结构 `class`
-- 

CREATE TABLE `class` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT COMMENT '//编号',
  `upEmail` varchar(20) NOT NULL COMMENT '//上传者邮箱',
  `class_way` varchar(2) NOT NULL COMMENT '//课程方式',
  `class_type` varchar(4) NOT NULL COMMENT '//课程类型',
  `class_video` varchar(200) NOT NULL COMMENT '//视频地址',
  `class_photo` varchar(200) NOT NULL COMMENT '//封面地址',
  `city` varchar(10) NOT NULL COMMENT '//开课城市',
  `class_name` varchar(20) NOT NULL COMMENT '//课程名称',
  `introduce_1` varchar(1000) NOT NULL COMMENT '//学生在这堂课能得到什么',
  `introduce_2` varchar(1000) NOT NULL COMMENT '//向学生介绍一下你自己',
  `introduce_3` varchar(1000) NOT NULL COMMENT '//为什么会开这节课',
  `content` varchar(2000) NOT NULL COMMENT '//内容',
  `notes` varchar(200) NOT NULL COMMENT '//注意事项',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

-- 
-- 导出表中的数据 `class`
-- 

INSERT INTO `class` VALUES (1, '', '线下', '基础教育', '', '', '', '问答', '					    	    			\r\n			阿斯达阿达 		    	    		', '					    	    			\r\n					    	    		', '					    	    			\r\n					    	    		', '', '					    	    			\r\n					    	    		');
INSERT INTO `class` VALUES (2, '', '线下', 'IT学习', '', '', '北京', '', '					    	    			\r\n					    	    		', '					    	    			\r\n					    	    		', '					    	    			\r\n					    	    		', '', '					    	    			\r\n					    	    		得瑟得瑟实打实');

-- --------------------------------------------------------

-- 
-- 表的结构 `comment_zan`
-- 

CREATE TABLE `comment_zan` (
  `id` int(100) NOT NULL AUTO_INCREMENT,
  `zan_user` varchar(10) NOT NULL,
  `comment_id` int(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

-- 
-- 导出表中的数据 `comment_zan`
-- 

INSERT INTO `comment_zan` VALUES (3, '123123', 7);
INSERT INTO `comment_zan` VALUES (2, '123123', 7);
INSERT INTO `comment_zan` VALUES (4, '123123', 7);
INSERT INTO `comment_zan` VALUES (5, '123123', 6);
INSERT INTO `comment_zan` VALUES (6, '123123', 5);

-- --------------------------------------------------------

-- 
-- 表的结构 `community_comment`
-- 

CREATE TABLE `community_comment` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `username` varchar(20) NOT NULL,
  `content` varchar(100) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=23 ;

-- 
-- 导出表中的数据 `community_comment`
-- 

INSERT INTO `community_comment` VALUES (1, '1', '123123', '斯蒂芬斯蒂芬', '2015-08-16 19:51:59');
INSERT INTO `community_comment` VALUES (2, '1', '123123', '				        		\r\n				        	傻傻的发呆时', '2015-08-16 19:52:05');
INSERT INTO `community_comment` VALUES (3, '1', '123123', '未完全俄武器', '2015-08-16 19:52:12');
INSERT INTO `community_comment` VALUES (4, '1', '123123', '似懂非懂三分得手', '2015-08-16 19:52:19');
INSERT INTO `community_comment` VALUES (5, '1', '123123', '喂喂喂日', '2015-08-16 19:52:28');
INSERT INTO `community_comment` VALUES (6, '1', '123123', '似懂非懂三分地', '2015-08-16 19:52:35');
INSERT INTO `community_comment` VALUES (7, '1', '123123', '去问问企鹅', '2015-08-16 19:54:56');
INSERT INTO `community_comment` VALUES (8, '1', '', '				        		\r\n				        	任何地方和', '2015-09-20 10:04:54');
INSERT INTO `community_comment` VALUES (9, '1', '', '				        		\r\n				        	', '2015-09-20 10:09:14');
INSERT INTO `community_comment` VALUES (10, '1', '', '				        		\r\n				        	阿斯', '2015-09-20 10:33:40');
INSERT INTO `community_comment` VALUES (11, '1', '', '				        		\r\n				        	接发', '2015-09-20 23:02:12');
INSERT INTO `community_comment` VALUES (12, '1', '', '				        		\r\n				        	法国队', '2015-09-21 11:11:08');
INSERT INTO `community_comment` VALUES (13, '1', '', '				        		\r\n				        	的功夫', '2015-09-21 11:28:46');
INSERT INTO `community_comment` VALUES (14, '1', '', '	是否			        		\r\n				        	', '2015-09-21 13:45:15');
INSERT INTO `community_comment` VALUES (15, '1', '', '				        		\r\n	阿斯发			        	', '2015-09-21 14:02:29');
INSERT INTO `community_comment` VALUES (16, '1', '', '				        		\r\n				        	第三个', '2015-09-21 14:09:36');
INSERT INTO `community_comment` VALUES (17, '1', '', '				        		\r\n				        	的功夫', '2015-09-21 14:09:45');
INSERT INTO `community_comment` VALUES (18, '1', '', '				        		\r\n				        	水电费', '2015-09-21 14:09:51');
INSERT INTO `community_comment` VALUES (19, '1', '', '				        		\r\n				        	是否', '2015-09-21 14:09:57');
INSERT INTO `community_comment` VALUES (20, '1', '', '				        		\r\n				        	科技园', '2015-09-21 14:59:40');
INSERT INTO `community_comment` VALUES (21, '1', '', '				        		\r\n	更加快乐就国际化飞机而飞机人人哦普金润发', '2015-09-21 15:00:23');
INSERT INTO `community_comment` VALUES (22, '1', '', '				        		\r\n				        	东方红', '2015-09-21 15:33:05');

-- --------------------------------------------------------

-- 
-- 表的结构 `members`
-- 

CREATE TABLE `members` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '//id',
  `username` varchar(20) NOT NULL COMMENT '//用户名',
  `password` varchar(20) NOT NULL COMMENT '//密码',
  `email` varchar(20) NOT NULL COMMENT '//邮箱',
  `sex` tinyint(1) unsigned NOT NULL COMMENT '//性别',
  `face` varchar(20) NOT NULL COMMENT '//头像',
  `regtime` date NOT NULL COMMENT '//注册时间',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COMMENT='会员信息' AUTO_INCREMENT=9 ;

-- 
-- 导出表中的数据 `members`
-- 

INSERT INTO `members` VALUES (1, '123321', '601f1889667efaebb33b', '1231231', 0, '', '2015-08-12');
INSERT INTO `members` VALUES (2, '123123', '601f1889667efaebb33b', '123123', 0, '', '2015-08-12');
INSERT INTO `members` VALUES (5, '一时辉煌', '9624526', '976736530@qq.com', 0, 'face/face21.jpg', '2015-08-12');
INSERT INTO `members` VALUES (6, '123', '123123', '123123', 0, '', '2015-08-16');
INSERT INTO `members` VALUES (7, 'afasfas', '520123', 'wgq544520279wgq@qq.c', 0, '', '2015-08-20');
INSERT INTO `members` VALUES (8, 'huajej', 'hyf510', '461249104@qq.com', 0, '', '2015-08-20');

-- --------------------------------------------------------

-- 
-- 表的结构 `tg_user`
-- 

CREATE TABLE `tg_user` (
  `tg_id` int(8) NOT NULL AUTO_INCREMENT COMMENT '//用户自动编号',
  `tg_username` varchar(20) NOT NULL COMMENT '//用户名',
  `tg_password` char(40) NOT NULL COMMENT '//密码',
  `tg_email` varchar(40) DEFAULT NULL COMMENT '//邮件',
  `tg_qq` varchar(15) DEFAULT NULL COMMENT '//qq',
  `tg_sex` char(1) NOT NULL COMMENT '//性别',
  PRIMARY KEY (`tg_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

-- 
-- 导出表中的数据 `tg_user`
-- 

INSERT INTO `tg_user` VALUES (1, '', '7c4a8d09ca3762af61e59520943dc26494f8941b', '', '', '男');
INSERT INTO `tg_user` VALUES (2, '', '7c4a8d09ca3762af61e59520943dc26494f8941b', '', '', '男');
INSERT INTO `tg_user` VALUES (3, '', '7c4a8d09ca3762af61e59520943dc26494f8941b', '', '', '男');
INSERT INTO `tg_user` VALUES (4, '', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '940781678@qq.com', '', '男');
INSERT INTO `tg_user` VALUES (5, '', '601f1889667efaebb33b8c12572835da3f027f78', '940781678@qq.com', '', '男');
INSERT INTO `tg_user` VALUES (6, '阿斯大时代', '601f1889667efaebb33b8c12572835da3f027f78', '940781678@qq.com', '940781678', '男');
INSERT INTO `tg_user` VALUES (7, '123', '40bd001563085fc35165329ea1ff5c5ecbdbbeef', '123', '798978778', '男');
INSERT INTO `tg_user` VALUES (8, '123456', '7c4a8d09ca3762af61e59520943dc26494f8941b', '', '', '男');
INSERT INTO `tg_user` VALUES (9, '123456', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'wgq544520279wgq@qq', '544520279', '男');
INSERT INTO `tg_user` VALUES (10, 'hua1995116', '7c4a8d09ca3762af61e59520943dc26494f8941b', 'wgq544520279wgq@qq.cpm', '544520279', '男');
