/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50626
Source Host           : localhost:3306
Source Database       : foursteps

Target Server Type    : MYSQL
Target Server Version : 50626
File Encoding         : 65001

Date: 2016-05-11 19:11:00
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for admin
-- ----------------------------
DROP TABLE IF EXISTS `admin`;
CREATE TABLE `admin` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `email` varchar(30) NOT NULL,
  `face` varchar(30) NOT NULL,
  `lock_password` varchar(32) NOT NULL,
  `login_ip` varchar(30) NOT NULL,
  `login_time` datetime NOT NULL,
  `name` varchar(10) NOT NULL,
  `password` varchar(32) NOT NULL,
  `reg_time` datetime NOT NULL,
  `rank` tinyint(1) NOT NULL,
  `qq` bigint(12) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `telephone` bigint(12) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of admin
-- ----------------------------
INSERT INTO `admin` VALUES ('1', 'cx265@vip.qq.com', '1442630044_986947517.jpg', '21232f297a57a5a743894a0e4a801fc3', '', '2015-09-01 12:02:10', 'admin', '21232f297a57a5a743894a0e4a801fc3', '2015-09-01 05:10:09', '2', '1224603766', '1', '13588326202');
INSERT INTO `admin` VALUES ('2', '1243897434@qq.com', '1442630044_986947517.jpg', '21232f297a57a5a743894a0e4a801fc3', '', '2015-09-01 12:02:10', 'admin1', '21232f297a57a5a743894a0e4a801fc3', '2015-09-01 05:10:09', '1', '674295323', '1', '13588345853');

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS `article`;
CREATE TABLE `article` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `time` datetime NOT NULL,
  `title` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of article
-- ----------------------------
INSERT INTO `article` VALUES ('1', 'Chinese gardens can be divided into two categories, the imperial the private, and sometimes landscape gardens are considered. The former are seen in northern China , while most of the latter can be found in the south, especially in Suzhou, Wuxi and Nanjing.\r\n中回林可分为御花酬私家花园两类，有时人们也会加上风景园林。御花园都在北方，私家花园则多见于南方，尤以苏州、无锡和南京三地最多。\r\nSmall and delicate, cleverly laid out and pleasing to the eye, the streams, bridges, rockeries and pavilion of a private Chinese garden reveal a natural beauty of their own. Most of the bridges in these gardens are of stone, including straight, winding and arched ones. The straight bridge consists of just one stone slab without any decoration, and is usually leveled with the riverbank or with the river to make the visitors feel as if they are surrounded by water. The winding bridges have low balustrades and the Nine Winding Bridge in Xihu Lake is one of them. The arch bridges can be divided into the single-arch and the multi-arch varieties. Streams in these gardens do not cover a large area, but fit in well with bridges and islets to yield a uniformed effect.\r\n南方私家花园中的溪、桥、山、亭小巧玲珑，布局精明，尽显其自然美，令人赏心悦目。桥大多为石桥，有直桥、曲桥、拱桥。直桥其实是一块不加装饰的石板，通常与河岸或河水齐高，给人一种临水的感觉。曲桥设有低栏杆，西湖上的九曲桥就属此桥。拱桥可分为单拱桥和多拱桥两种。园内的小溪虽占地不多，却同小桥与石屿相得益彰，浑然一体。', '2015-09-01 05:07:27', 'Chinese Gardens中国园林');
INSERT INTO `article` VALUES ('2', 'On a reporting expedition to Los Angeles recently, I realized I could stop renting cars.\r\n\r\n在一次前往洛杉矶做报道的过程中，我意识到自己可以不用租车了。\r\nI would never again have to brave the L.A. freeway behind the wheel. I would never have to obsess, like the characters in the “Saturday Night Live” skit, “The Californians,” about taking the 101 to the 110 and Canyon View Drive over to San Vincente to the 10, then switching over to the 405 North and getting dumped out onto Mulholland.\r\n我永远无需再勇敢地在洛杉矶的高速公路驾车行驶了。我永远无需再像《周六夜现场》(Saturday Night Live)短剧《加州人》(The Californians)中的角色那样，迷恋于从101道开到110道和峡谷景观道，到圣文森特，再到10道，然后转入405北道，再到穆赫兰下车了。\r\nI had Uber.\r\n因为我有了优步(Uber)。\r\n怎样成为受欢迎的优步乘客\r\nEven in the land of movie stars, you could feel like a movie star when your Uber chauffeur rolled up. Standing in front of the Sunset Tower Hotel, I tapped my Uber app and saw five little cars swarming around my location. But, suddenly, they scattered in the opposite direction. I stood in the driveway, perplexed. Finally, a car pulled up, and the driver waved me in.\r\n在电影明星的地界，当你的优步司机开车过来时，你也会觉得自己有点像个电影明星。站在日落塔酒店(Sunset Tower Hotel)的门前，我点了点优步应用，看到五辆车围在附近。但是，突然间，他们向相反的方向四散而去。我站在车道上，茫然不知所措。最后终于有辆车停下了，司机挥手让我上车。', '2015-09-02 08:06:12', 'I had Uber. 因为我有了优步(Uber)。');
INSERT INTO `article` VALUES ('3', 'At first glance Esther Okade seems like a normal 10-year-old. She loves dressing up as Elsa from \"Frozen,\" playing with Barbie dolls and going to the park or shopping.\r\n第一眼看上去，十岁的埃丝特·奥卡德好像和同龄孩子没什么不一样。她喜欢打扮成《冰雪奇缘》里的艾尔莎，喜欢芭比娃娃，也喜欢去公园和商场。\r\nBut what makes the British-Nigerian youngster stand out is the fact that she\'s also a university undergraduate。\r\n但与众不同的是，这个尼日利亚裔英国小女孩其实已是一名大学本科生了。\r\nEsther, from Walsall, an industrial town in the UK\'s West Midlands region, is one of the country\'s youngest college freshmen。\r\n埃丝特，来自英国西米德兰兹郡的工业城市沃尔索尔，已经成为了英国年龄最小的大学生之一。\r\nThe talented 10-year-old enrolled at the Open University, a UK-based distance learning college, in January and is already top of the class, having recently scored 100% in a recent exam。\r\n今年1月份，这位10岁的天才少女进入了英国的一所远程教育大学——开放大学。她现在已经在班里名列前茅，最近一次考试得了满分。', '2015-09-01 09:17:24', 'book书本');
INSERT INTO `article` VALUES ('4', 'Among the books, periodicals and letters found in Osama bin Laden’s hide-out in Pakistan was a copy of the former C.I.A. officer Michael Scheuer’s 2004 book, “Imperial Hubris: Why the West Is Losing the War on Terror,” which describes the founder of Al Qaeda as “the most respected, loved, romantic, charismatic and perhaps able figure in the last 150 years of Islamic history.”\r\n奥萨马·本·拉登(Osama bin Laden)在巴基斯坦藏匿期间的书籍、期刊和信件中，有一本前中情局官员迈克尔·朔伊尔(Michael Scheuer)2004年的著作《帝国的傲慢：西方为何在反恐战争中失败》(Imperial Hubris: Why the West Is Losing the War on Terror)，书中把这位基地组织(Al Qaeda)的创始人描述为“近150年来的伊斯兰历史上最受尊敬与热爱，最浪漫，最有人格魅力，或许也是最有能力的人物”。\r\n本·拉登的阅读书单\r\nAlso in his library was a copy of Michel Chossudovsky’s conspiracy-minded book “America’s ‘War on Terrorism,’ ” which argued that the Sept. 11, 2001, attacks were simply a pretext for American incursions into the Middle East, and that Bin Laden was nothing but a boogeyman created by the United States.\r\n他的藏书中还有一本米歇尔·科塞多夫斯基(Michel Chossudovsky)的《美国的“反恐战争”》(America’s ‘War on Terrorism)。这本书持阴谋论观点，认为2001年9月11日的恐怖袭击只是美国入侵中东的借口，本·拉登只是被美国凭空创造出来的恶魔。\r\nThese books and others, along with dozens of journal articles and magazine clippings, were found when a Navy SEAL team raided Bin Laden’s compound in Abbottabad, Pakistan, in 2011. Declassified on Wednesday, they highlight the Qaeda leader’s fascination with the West. They also illustrate the efforts he made to understand America (the better to fight it) and his need to confirm his own beliefs about its rapacity and corruption (perhaps to justify his terrorist attacks).\r\n2011年，海豹突击队袭击了本·拉登在巴基斯坦阿伯塔巴德藏匿的院落，除了这两本书，他们还发现了其他书籍以及数十份期刊文章和杂志剪贴。上周三，这些资料得到解密，它们表明了本·拉登对西方世界的兴趣，也证明他试图理解美国（并且更好地与之战斗），并且需要借着美国的腐败与贪婪来确认自身的信仰（或许也需要它们来将自己的恐怖主义袭击正当化）。', '2015-09-02 11:16:22', '奥萨马·本·拉登(Osama bin Laden)');

-- ----------------------------
-- Table structure for danmu
-- ----------------------------
DROP TABLE IF EXISTS `danmu`;
CREATE TABLE `danmu` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` varchar(50) NOT NULL,
  `time` datetime NOT NULL,
  `userid` int(10) NOT NULL,
  `videoid` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of danmu
-- ----------------------------

-- ----------------------------
-- Table structure for group
-- ----------------------------
DROP TABLE IF EXISTS `group`;
CREATE TABLE `group` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `face` varchar(30) NOT NULL,
  `time` datetime NOT NULL,
  `title` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of group
-- ----------------------------
INSERT INTO `group` VALUES ('1', 'topic1.jpg', '2015-09-01 03:16:15', '考研英语讨论');
INSERT INTO `group` VALUES ('2', 'topic2.jpg', '2015-09-01 16:22:15', '交际能力');
INSERT INTO `group` VALUES ('3', 'topic3.jpg', '2015-09-02 04:10:00', '作文技巧');
INSERT INTO `group` VALUES ('4', 'topic4.jpg', '2015-09-03 10:17:16', '口语发音纠正');
INSERT INTO `group` VALUES ('5', 'topic5.jpg', '2015-09-03 10:17:16', '英语角');
INSERT INTO `group` VALUES ('6', 'topic6.jpg', '2015-09-03 15:31:27', '聊聊英语');

-- ----------------------------
-- Table structure for groupuser
-- ----------------------------
DROP TABLE IF EXISTS `groupuser`;
CREATE TABLE `groupuser` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `groupid` int(10) NOT NULL,
  `userid` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of groupuser
-- ----------------------------
INSERT INTO `groupuser` VALUES ('1', '1', '1', '1');
INSERT INTO `groupuser` VALUES ('2', '1', '2', '1');
INSERT INTO `groupuser` VALUES ('3', '1', '3', '1');
INSERT INTO `groupuser` VALUES ('4', '2', '1', '1');
INSERT INTO `groupuser` VALUES ('5', '2', '3', '1');
INSERT INTO `groupuser` VALUES ('6', '2', '4', '1');
INSERT INTO `groupuser` VALUES ('7', '3', '1', '1');
INSERT INTO `groupuser` VALUES ('8', '3', '4', '1');

-- ----------------------------
-- Table structure for jscg
-- ----------------------------
DROP TABLE IF EXISTS `jscg`;
CREATE TABLE `jscg` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '标题',
  `info` varchar(255) DEFAULT NULL COMMENT '简介',
  `img` varchar(255) DEFAULT NULL COMMENT '缩略图路径',
  `video` varchar(255) DEFAULT NULL COMMENT '视频路径',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COMMENT='实践成果';

-- ----------------------------
-- Records of jscg
-- ----------------------------
INSERT INTO `jscg` VALUES ('1', '“日货风波”', 'DV片制作；主要参加人员：严立刚(03教育技术学)、邵文飞(03教育技术学)、龚彪(04教育技术学) ；指导教师：杨晓艳、吴纯、岑岗；成果：作品获2005年省大学生多媒体作品设计竞赛二等奖。', '/Public/Images/Result/F5.jpg', null);
INSERT INTO `jscg` VALUES ('2', '“那年夏天”', 'DV片制作；主要参加人员：龚  彪(04教育技术学)、陈  洁(05教育技术学)；指导教师：鲍宗亮、岑  岗；成果：作品获2006年省大学生多媒体设计作品大赛一等奖，同时获浙江科技学院多媒体作品设计竞赛一等奖。', '/Public/Images/Result/F7.jpg', null);
INSERT INTO `jscg` VALUES ('3', '“再现彩虹”', 'DV片制作；参加人员：鲍米娜(03教育技术学)、干伟伟(03教育技术学)、陈佩佩(03教育技术学)；指导教师：吴  纯、于  芬；成果：作品获2006年浙江省大学生多媒体设计竞赛优秀奖。', '/Public/Images/Result/F17.jpg', null);
INSERT INTO `jscg` VALUES ('4', '“中国当代画家”', '网站设计；参加人员：骆燕青(04教育技术学)、朱昱颖(04教育技术学)、马海斌(04教育技术学）指导教师：莫云峰；作品获2006年省大学生多媒体作品设计竞赛二等奖。', '/Public/Images/Result/F10.jpg', null);
INSERT INTO `jscg` VALUES ('5', '“饮食营养与健康”', '网站设计；参加人员：王盈盈(03教育技术学)、王乐艳(03教育技术学；指导教师：唐伟、莫云峰、林雪芬；成果：作品获2006年省大学生多媒体作品设计竞赛二等奖。', '/Public/Images/Result/F11.jpg', null);
INSERT INTO `jscg` VALUES ('6', '“野生动物园”', '课件制作；参加人员：乐海依(03教育技术学)、贾  丹(03环艺)、郑京(04电科)；指导教师：岑  岗、唐  伟、孙晓勇；作品获2006年省大学生多媒体设计作品大赛二等奖。', '/Public/Images/Result/F13.jpg', null);
INSERT INTO `jscg` VALUES ('7', '“野生动物园”', '课件制作；参加人员：乐海依(03教育技术学)、贾  丹(03环艺)、郑京(04电科)；指导教师：岑  岗、唐  伟、孙晓勇；成果：作品获2006年省大学生多媒体设计作品大赛二等奖。', '/Public/Images/Result/F13.jpg', null);

-- ----------------------------
-- Table structure for lwcg
-- ----------------------------
DROP TABLE IF EXISTS `lwcg`;
CREATE TABLE `lwcg` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `img` varchar(255) DEFAULT NULL,
  `info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of lwcg
-- ----------------------------
INSERT INTO `lwcg` VALUES ('1', '/Public/Images/Result/F1.jpg', '周程(03教育技术)、孙晓勇.在实践教学环节中加强计算机应用能力培养. 全国高校计算机基础教育研究会2006年学术年会论文集，清华大学出版社，2006.7.（一级学会论文集，优秀论文一等奖）.');
INSERT INTO `lwcg` VALUES ('2', '/Public/Images/Result/F2.jpg', '项城(03教育技术)、孙晓勇、覃伟. 网页设计课程教学的改革尝试. 全国高校计算机基础教育研究会2006年学术年会论文集，清华大学出版社，2006.7.（一级学会论文集，优秀论文奖）.');
INSERT INTO `lwcg` VALUES ('3', '/Public/Images/Result/F3.jpg', '岑岗、陈洁(05教育技术).开放型项目教学提高计算机应用能力的实践.全国高校计算机基础教育研究会2008年学术年会论文集，清华大学出版社，2008.7.（一级学会论文集，优秀论文一等奖）');
INSERT INTO `lwcg` VALUES ('4', '/Public/Images/Result/F4.jpg', '徐  君(05教育技术)、唐伟、赵佰城(05计算机). 普通话CAI自主学习系统设计.全国高校计算机基础教育研究会2008年学术年会论文集,清华大学出版社,2008.11.（一级学会论文集，优秀论文二等奖）');
INSERT INTO `lwcg` VALUES ('5', '/Public/Images/Result/F4.jpg', '徐  君(05教育技术)、唐伟、赵佰城(05计算机). 普通话CAI自主学习系统设计.全国高校计算机基础教育研究会2008年学术年会论文集,清华大学出版社,2008.11.（一级学会论文集，优秀论文二等奖）');
INSERT INTO `lwcg` VALUES ('6', '/Public/Images/Result/F4.jpg', '徐  君(05教育技术)、唐伟、赵佰城(05计算机). 普通话CAI自主学习系统设计.全国高校计算机基础教育研究会2008年学术年会论文集,清华大学出版社,2008.11.（一级学会论文集，优秀论文二等奖）');
INSERT INTO `lwcg` VALUES ('7', '/Public/Images/Result/F4.jpg', '徐  君(05教育技术)、唐伟、赵佰城(05计算机). 普通话CAI自主学习系统设计.全国高校计算机基础教育研究会2008年学术年会论文集,清华大学出版社,2008.11.（一级学会论文集，优秀论文二等奖）');

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `admin` int(10) NOT NULL,
  `user` int(10) NOT NULL,
  `content` text NOT NULL,
  `extra` varchar(30) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `time` datetime NOT NULL,
  `title` varchar(30) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES ('1', '1', '1', '学习平台新功能更新了，快点试试吧！', '', '1', '2015-09-01 11:18:19', '更新通知');
INSERT INTO `message` VALUES ('2', '1', '2', '2015考研英语试题发布了~~~~~', '', '1', '2015-09-01 13:18:19', '试题');
INSERT INTO `message` VALUES ('3', '1', '3', '2015考研英语试题发布了~~~~~', '', '2', '2015-09-01 13:18:19', '2015考研');
INSERT INTO `message` VALUES ('4', '0', '1', '谢谢平台的英语试题，我过CET-6了', '', '3', '2015-09-02 13:18:19', '今天开心');
INSERT INTO `message` VALUES ('5', '1', '2', '你好，平台是免费学习的吗？', '', '0', '2015-09-02 13:18:19', '疑问？');
INSERT INTO `message` VALUES ('6', '1', '1', '学习中', '', '0', '2015-09-01 14:16:30', '考研2015');
INSERT INTO `message` VALUES ('7', '1', '5', '', '', '3', '2015-09-20 16:01:40', '');

-- ----------------------------
-- Table structure for personal_user
-- ----------------------------
DROP TABLE IF EXISTS `personal_user`;
CREATE TABLE `personal_user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  `age` smallint(3) NOT NULL,
  `face` varchar(30) NOT NULL,
  `email` varchar(30) NOT NULL,
  `qq` bigint(12) NOT NULL,
  `rank` tinyint(1) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `telephone` bigint(12) NOT NULL,
  `login_ip` varchar(30) NOT NULL,
  `login_time` datetime NOT NULL,
  `reg_time` datetime NOT NULL,
  `password` varchar(32) NOT NULL,
  `sex` tinyint(1) NOT NULL,
  `username` varchar(10) NOT NULL,
  `introduce` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of personal_user
-- ----------------------------
INSERT INTO `personal_user` VALUES ('1', '王明', '16', '1442644308_214264867.jpg', '534234523@qq.com', '534234523', '0', '1', '13784326575', '122.56.213.23', '2015-09-02 10:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '小天使', '学习英语真开心');
INSERT INTO `personal_user` VALUES ('8', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '0', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('9', '吴天', '19', '1442644308_214264867.jpg', '5678523@qq.com', '123413523', '1', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '0', '二货', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('10', '许晶晶', '21', '1442644308_214264867.jpg', '67513523@qq.com', '123413523', '0', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '0', '天天', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('11', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('12', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('13', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('14', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('15', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('16', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('17', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('18', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '0', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('19', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '0', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('20', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('21', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('22', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('23', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('24', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('25', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('26', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('27', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('28', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('29', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('30', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('31', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('32', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('33', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('34', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('35', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('36', '张建', '19', '1442644308_214264867.jpg', '123413523@qq.com', '123413523', '2', '1', '13523465370', '121.156.83.63', '2015-09-01 12:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', '大美女', '学习\r\n\r\n');
INSERT INTO `personal_user` VALUES ('37', 'guest', '22', '1442644308_214264867.jpg', '534234523@qq.com', '534234523', '1', '1', '13784326575', '122.56.213.23', '2015-09-02 10:06:10', '2015-09-01 11:12:25', '084e0343a0486ff05530df6c705c8bb4', '1', 'guest', '我是测试用户，个性网站不错~');

-- ----------------------------
-- Table structure for read
-- ----------------------------
DROP TABLE IF EXISTS `read`;
CREATE TABLE `read` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `chinese` text NOT NULL,
  `english` text NOT NULL,
  `face` varchar(30) NOT NULL,
  `read` int(10) NOT NULL,
  `time` datetime NOT NULL,
  `title` varchar(30) NOT NULL,
  `change` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of read
-- ----------------------------
INSERT INTO `read` VALUES ('1', '格雷戈里·范韦斯(Gregory Fenves)最近晋升要职，从德州大学奥斯汀分校(University of Texas at Austin)教务长升任校长。此次升职是包含加薪的。他目前的基础薪俸约为42.5万美元（约合263万元人民币），校方开出100万美元。\r\n但他拒绝了——理由是太高。\r\n“鉴于对行政支出、负担能力、学费等诸多问题的担忧与考量，这样的薪俸将影响校长与德州议会(Texas Legislature)的合作，”范韦斯在一封致某大学官员的电子邮件中写道，该信由《奥斯汀美国政治家》(The Austin American-Statesman)获得，并于上周刊发。\r\n大学校长该拿天价薪水吗', 'Gregory Fenves recently got a big promotion, from provost to president of the University of Texas at Austin. A raise came with it. Instead of his current base of about $425,000, he was offered $1 million.\r\nAnd he rejected it — as too much.\r\n“With many issues and concerns about administrative costs, affordability and tuition, such a salary will affect the ability of the president to work with the Texas Legislature,” Fenves wrote to a university official, in an email obtained by The Austin American-Statesman and published last week.', '4.jpg', '2', '2015-09-02 07:07:10', 'A raise came', '23');
INSERT INTO `read` VALUES ('2', '对朝鲜驻俄罗斯东部使节Im Cheon Il来说，没有比眼下更适合邀请俄罗斯孩子到朝鲜青少年夏令营度假的时机了。\r\n这名外交官说：“我们两国间政治关系的发展比以往任何时候都更有成效。”本周，他向来自俄东北部雅库特(Yakutia)的官员提出了上述建议，雅库特政府则在其网站上发布了上述谈话。\r\n朝鲜与俄罗斯：孤立中的牵手。\r\n还有很多人像Im Cheon Il一样注意到了朝俄关系的明显深化。外交和经济问题正促使这两个国家投入彼此的怀抱。', 'For diplomat Im Cheon Il, there has never been a better time to invite Russian children to spend their holidays at a North Korean youth camp.\r\n“The political relationship between our countries is developing more productively than ever before,” said Mr Im, an envoy based in eastern Russia, after making the proposal this week to officials from the northeastern territory of Yakutia, which published the remarks on its website.\r\nHe is one of many to have observed a marked deepening of ties between the countries, as shared diplomatic and economic problems push them into each other’s arms.', '5.jpg', '4', '2015-09-01 13:15:26', 'Yakutia', '22');
INSERT INTO `read` VALUES ('3', '与其他任何“语言”相比，表情符号的采用速度要快得多，现在80%的人在使用多种多样的表情符号进行交流。\r\n为了证明表情符号的流行度，一位语言学教授进行了一项名为“表情符号智商”的研究，旨在探寻是什么人，在如何使用这类表情图片，这类研究尚属首次。\r\n语言学教授创建了一个在线测试，看受测者是否能区分“困惑”的表情及“愤怒”的表情，以确定受测者是否是一位表情符号达人。\r\n测试包含10个问题，皆在让受试者识别某些表情符号的含义以及如何运用表情符号编写句子。', 'Emoji are being adopted at a faster rate than any other \'language\' - and eight in 10 of us now use the colourful symbols to communicate.\r\nTo plot this popularity, a linguistics professor has conducted the first \'Emoji IQ\' study looking at how the pictures are used and by whom.\r\nAnd she has created an online test to determine how well you know your \'confused\' face from your \'angry\' face to determine if you\'re an emoji master.\r\nThe test contains 10 questions that ask users to identify the meaning of certain symbols, and how they would write sentences using emoji.', '6.jpg', '12', '2015-09-02 12:22:26', 'Emoji test', '21');

-- ----------------------------
-- Table structure for sentence
-- ----------------------------
DROP TABLE IF EXISTS `sentence`;
CREATE TABLE `sentence` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `answer1` text NOT NULL,
  `answer2` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sentence
-- ----------------------------

-- ----------------------------
-- Table structure for step2
-- ----------------------------
DROP TABLE IF EXISTS `step2`;
CREATE TABLE `step2` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `student` varchar(10) NOT NULL,
  `tel` bigint(11) NOT NULL,
  `teacher` varchar(10) NOT NULL,
  `telephone` bigint(11) NOT NULL,
  `file` varchar(100) NOT NULL COMMENT '上传申报书内容',
  `time` datetime NOT NULL,
  `sort` tinyint(1) NOT NULL COMMENT '0：春萌；1：新苗；2：国创；3：教师科研；4：自主课外实践',
  `status` tinyint(1) NOT NULL COMMENT '0：未审批；1：未完成；:2：完成',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of step2
-- ----------------------------
INSERT INTO `step2` VALUES ('1', '基于Android的四步曲项目教学平台', '胡晓峰', '13588367263', '岑岗', '13588237434', '1462340442_1125087937', '2016-05-04 13:40:42', '2', '1');
INSERT INTO `step2` VALUES ('2', '“互联网+课堂”个人技能\r\n分享交易平台的设计与实现', '胡晓峰', '13515880979', '岑岗', '13600528370', '', '2016-05-03 03:20:09', '3', '2');

-- ----------------------------
-- Table structure for step2_do
-- ----------------------------
DROP TABLE IF EXISTS `step2_do`;
CREATE TABLE `step2_do` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NOT NULL COMMENT '关联step2 id',
  `target` varchar(100) NOT NULL,
  `content` text NOT NULL COMMENT '下载附件内容',
  `time` datetime NOT NULL COMMENT '完成时间',
  `result` tinyint(1) NOT NULL COMMENT '0：未完成；1：完成',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of step2_do
-- ----------------------------
INSERT INTO `step2_do` VALUES ('1', '1', '项目调研', '', '2015-08-03 08:13:20', '1');
INSERT INTO `step2_do` VALUES ('2', '1', '数据库设计', '', '2015-10-03 15:24:10', '1');
INSERT INTO `step2_do` VALUES ('3', '1', '平台架构设计', '', '2016-01-10 02:06:10', '1');
INSERT INTO `step2_do` VALUES ('4', '1', '平台具体功能实现', '', '2016-04-04 09:10:11', '1');
INSERT INTO `step2_do` VALUES ('5', '1', '平台试运行', '', '2016-05-04 12:13:00', '0');
INSERT INTO `step2_do` VALUES ('6', '1', '平台后期检查报告', '', '2016-05-04 16:25:12', '0');
INSERT INTO `step2_do` VALUES ('7', '1', '撰写发表论文', '', '2016-05-04 17:21:16', '0');
INSERT INTO `step2_do` VALUES ('8', '1', '撰写结题报告', '', '2016-05-05 01:05:14', '0');
INSERT INTO `step2_do` VALUES ('9', '2', '项目调研', '', '2015-02-04 05:07:24', '1');
INSERT INTO `step2_do` VALUES ('10', '2', '项目设计报告', '', '2015-05-04 08:10:06', '1');
INSERT INTO `step2_do` VALUES ('11', '2', '平台开发', '', '2015-12-04 19:24:22', '1');
INSERT INTO `step2_do` VALUES ('12', '2', '平台试运行', '', '2016-02-04 06:07:14', '1');
INSERT INTO `step2_do` VALUES ('13', '2', '撰写发表论文', '', '2016-05-03 06:07:14', '1');
INSERT INTO `step2_do` VALUES ('14', '2', '科技竞赛获奖', '', '2016-05-04 07:12:11', '1');
INSERT INTO `step2_do` VALUES ('15', '2', '撰写结题报告', '', '2016-05-04 13:16:20', '1');

-- ----------------------------
-- Table structure for study
-- ----------------------------
DROP TABLE IF EXISTS `study`;
CREATE TABLE `study` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `listen` float(5,3) NOT NULL,
  `speak` float(5,3) NOT NULL,
  `read` float(5,3) NOT NULL,
  `write` float(5,3) NOT NULL,
  `userid` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of study
-- ----------------------------
INSERT INTO `study` VALUES ('1', '68.450', '78.240', '88.760', '67.450', '1');
INSERT INTO `study` VALUES ('2', '78.840', '62.340', '77.380', '68.660', '2');
INSERT INTO `study` VALUES ('3', '88.450', '67.800', '73.230', '70.120', '3');
INSERT INTO `study` VALUES ('4', '66.430', '68.560', '73.240', '74.340', '4');
INSERT INTO `study` VALUES ('5', '67.450', '68.420', '83.240', '73.230', '5');
INSERT INTO `study` VALUES ('6', '62.430', '65.340', '71.340', '73.240', '6');

-- ----------------------------
-- Table structure for subject
-- ----------------------------
DROP TABLE IF EXISTS `subject`;
CREATE TABLE `subject` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` varchar(30) NOT NULL,
  `time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of subject
-- ----------------------------
INSERT INTO `subject` VALUES ('1', '交际英语', '2015-09-01 04:07:01');
INSERT INTO `subject` VALUES ('2', '职场英语', '2015-09-02 00:00:00');
INSERT INTO `subject` VALUES ('3', '专业英语', '2015-09-02 00:00:00');
INSERT INTO `subject` VALUES ('4', '考研英语', '2015-09-02 03:03:16');

-- ----------------------------
-- Table structure for teacher
-- ----------------------------
DROP TABLE IF EXISTS `teacher`;
CREATE TABLE `teacher` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `face` varchar(30) NOT NULL,
  `name` varchar(10) NOT NULL,
  `password` varchar(32) NOT NULL,
  `age` smallint(3) NOT NULL,
  `email` varchar(30) NOT NULL,
  `telephone` bigint(12) NOT NULL,
  `login_ip` varchar(30) NOT NULL,
  `login_time` datetime NOT NULL,
  `reg_time` datetime NOT NULL,
  `rank` tinyint(1) NOT NULL,
  `sex` tinyint(1) NOT NULL,
  `subject` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `qq` bigint(12) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of teacher
-- ----------------------------
INSERT INTO `teacher` VALUES ('1', '1442641873_2092685598.jpg', '李明', '8d788385431273d11e8b43bb78f3aa41', '24', '23432415@qq.com', '13765487543', '122.224.150.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '1', '1', '2', '1', '123435634');
INSERT INTO `teacher` VALUES ('3', '1442657362_1944633073.jpg', '李强', '8d788385431273d11e8b43bb78f3aa41', '34', '141242415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '1', '1', '0', '0', '123435634');
INSERT INTO `teacher` VALUES ('4', '1442641873_2092685598.jpg', '王应明', '8d788385431273d11e8b43bb78f3aa41', '42', 'qym42321415@qq.com', '13965423443', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '1', '1', '0', '1', '123435634');
INSERT INTO `teacher` VALUES ('6', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('7', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('8', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('9', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('10', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('11', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('12', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('13', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('14', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('15', '1442641873_2092685598.jpg', '张东', '8d788385431273d11e8b43bb78f3aa41', '25', '23432415@qq.com', '13765487543', '144.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '0', '1', '1', '1', '123435634');
INSERT INTO `teacher` VALUES ('16', '1442641873_2092685598.jpg', '古晓月', '8d788385431273d11e8b43bb78f3aa41', '25', '863232425@qq.com', '13565487543', '34.34.130.23', '2015-09-02 03:05:27', '2015-09-01 05:18:25', '1', '0', '0', '1', '123435634');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) DEFAULT NULL,
  `password` varchar(20) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `sex` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('1', 'hxf', '123', '21', '9407816782qq.com', null, '1');
INSERT INTO `user` VALUES ('2', 'hxf2', '123', '20', '772130872@qq.com', null, '0');

-- ----------------------------
-- Table structure for video
-- ----------------------------
DROP TABLE IF EXISTS `video`;
CREATE TABLE `video` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `discuss` text NOT NULL,
  `face` varchar(30) NOT NULL,
  `file` varchar(30) NOT NULL,
  `pageview` int(10) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `title` varchar(30) NOT NULL,
  `upload_time` datetime NOT NULL,
  `upload_user` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of video
-- ----------------------------
INSERT INTO `video` VALUES ('1', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '1.png', 'file1.mp4', '23', '1', '句子解读(1)', '2015-09-02 06:10:10', '1');
INSERT INTO `video` VALUES ('2', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '2.png', 'file2.mp4', '14', '1', '句子解读(2)', '2015-09-02 06:10:10', '2');
INSERT INTO `video` VALUES ('3', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '3.png', 'file3.mp4', '43', '1', '句子解读(3)', '2015-09-02 06:10:10', '1');
INSERT INTO `video` VALUES ('4', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '4.png', 'file4.mp4', '44', '1', '单词记读(1)', '2015-09-02 06:10:10', '3');
INSERT INTO `video` VALUES ('5', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '5.png', 'file5.mp4', '2', '1', '单词记读(2)', '2015-09-02 06:10:10', '2');
INSERT INTO `video` VALUES ('6', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '6.png', 'file6.mp4', '6', '1', '单词记读(3)', '2015-09-02 06:10:10', '3');
INSERT INTO `video` VALUES ('7', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '7.png', 'file7.mp4', '34', '1', '作文写作(1)', '2015-09-02 06:10:10', '3');
INSERT INTO `video` VALUES ('8', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '8.png', 'file8.mp4', '37', '1', '作文写作(2)', '2015-09-02 06:10:10', '1');
INSERT INTO `video` VALUES ('9', '梁老师将解英语句子，深入解读词句关系。', '不错的英语学习视频哦！', '9.png', 'file9.mp4', '3', '1', '作文写作(3)', '2015-09-02 06:10:10', '3');

-- ----------------------------
-- Table structure for videocomment
-- ----------------------------
DROP TABLE IF EXISTS `videocomment`;
CREATE TABLE `videocomment` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `time` datetime NOT NULL,
  `userid` int(10) NOT NULL,
  `videoid` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of videocomment
-- ----------------------------

-- ----------------------------
-- Table structure for videoview
-- ----------------------------
DROP TABLE IF EXISTS `videoview`;
CREATE TABLE `videoview` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `time` datetime NOT NULL,
  `userid` int(10) NOT NULL,
  `videoid` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of videoview
-- ----------------------------

-- ----------------------------
-- Table structure for vocabulary
-- ----------------------------
DROP TABLE IF EXISTS `vocabulary`;
CREATE TABLE `vocabulary` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `word` varchar(30) NOT NULL,
  `explain` varchar(100) NOT NULL,
  `phonetic` varchar(30) NOT NULL,
  `eg1` varchar(100) NOT NULL,
  `eg2` varchar(100) NOT NULL,
  `eg3` varchar(100) NOT NULL,
  `important` text NOT NULL,
  `memory` text NOT NULL,
  `uk` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of vocabulary
-- ----------------------------
INSERT INTO `vocabulary` VALUES ('1', 'jacket', 'n.短上衣，夹克；', '[ˈdʒækɪt]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('3', 'eraser', 'n.<主美>橡皮擦，板擦', '[ˈeɪa]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('4', 'chalk', 'n.粉笔，白垩；', '[tʃɔ:k]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('5', 'backpack', 'n.（指登山者、步行者使用或背小孩时使用的）背包', '[ˈbækpæk]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('6', 'stationery', 'n.文具； 办公用品； 信纸，信封； 文房四宝；', '[ˈsteiʃənəri]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('7', 'appropriate', 'adj.适当的； 恰当的； 合适的\r\nv.盗用； 侵吞； 拨（专款等）', '[əˈprəʊpriət]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('8', 'qualifications', 'n.资格，条件； 合格证书', '[kwɒlɪfɪ\'keɪʃnz]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('9', 'daytime', 'n.白天，日间；', '[ˈdeɪtaɪm]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('10', 'chalk', 'n.粉笔，白垩；', '[tʃɔ:k]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('11', 'qualifications', 'n.资格，条件； 合格证书', '[kwɒlɪfɪ\'keɪʃnz]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('12', 'school', 'n.学校，学院； 学业； 学派； 学科；', '[sku:l]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('13', 'terrible', 'adj.可怕的； 危害极大的； <非正>很糟的； 劣质的；', '[ˈterəbl]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');
INSERT INTO `vocabulary` VALUES ('14', 'backpack', 'n.（指登山者、步行者使用或背小孩时使用的）背包', '[ˈbækpæk]', 'Will you lend me your jacket for a little while?你能把上衣借给我穿一会儿吗？', 'He took his flashlight from his jacket pocket and switched it on.	他从夹克口袋里拿出手电筒，打开开关。', 'With her was a youngish man in a dinner jacket.	和她在一起的是一个略显年轻、身着无尾礼服的男人。', 'a short coat', '唱片套 A record jacket is the cover in which a record is kept.', 'jacket.mp3');

-- ----------------------------
-- Table structure for website
-- ----------------------------
DROP TABLE IF EXISTS `website`;
CREATE TABLE `website` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `income` float(8,2) NOT NULL,
  `talk` int(10) NOT NULL,
  `upload` int(10) NOT NULL,
  `visit` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of website
-- ----------------------------

-- ----------------------------
-- Table structure for xzfc
-- ----------------------------
DROP TABLE IF EXISTS `xzfc`;
CREATE TABLE `xzfc` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '名字',
  `info1` varchar(255) DEFAULT NULL COMMENT '简介1',
  `info2` varchar(255) DEFAULT NULL,
  `info3` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL COMMENT '缩略图',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of xzfc
-- ----------------------------
INSERT INTO `xzfc` VALUES ('1', '韩佳平', '主持国家级大学生创新训练计划项目“农村网购物流一体化服务系统”', '作品“村落速达运购服务系统”获省浙江省第八届大学生电子商务竞赛二等奖', '获得2014年宝钢奖学金', '/Public/Images/Student/hjp.jpg');
INSERT INTO `xzfc` VALUES ('2', '茅梓成', '网站作品“衣恋”获全国大学生计算机设计竞赛二等奖', '作品“橙果秀”获浙江省大学生多媒体作品设计竞赛一等奖', '2014年赴德国留学', '/Public/Images/Student/mzc.jpg');
INSERT INTO `xzfc` VALUES ('3', '夏剑雄', '作品“杭州返客有限责任公司”获浙江省第八届“挑战杯”大赛二等奖', '作品《返利网》获浙江省第七届大学生电子商务竞赛中荣获本科综合类三等奖', '浙江省蓝桥杯创业大赛省二等奖', '/Public/Images/Student/xjx.jpg');
INSERT INTO `xzfc` VALUES ('4', '代成雷', '主持国家级创业训练项目“基于Java的仓储一体化与车辆智能化的软件开发”', '作品“低碳战略视角下的安吉物流设计方案”获全国国大学生物流设计大赛二等奖', '参加全国大学生数学建模竞赛中获浙江赛区一等奖，国际三等奖', '/Public/Images/Student/dcl.jpg');
INSERT INTO `xzfc` VALUES ('5', '晏春明', '参加浙江省大学生“新苗人才计划”项目“太阳能照明和驱虫智能系统的开发”', '参加浙江省大学生创新物理竞赛三等奖', '申请专利四项：发明专利防摔式笔尖（2010.5.4）；实用新型专利一种防笔尖摔坏的笔、太阳能照明驱虫系统等', '/Public/Images/Student/ycm.jpg');
INSERT INTO `xzfc` VALUES ('6', '范玉凤', '主持浙江省科技厅“新苗人才计划”项目《基于波形对比的音乐学习系统》', '作品“音乐学习软件”获第七届浙江省大学生多媒体设计竞赛课件设计三等奖', '作品《8008》获多媒体作品设计DV三等奖（2008）', '/Public/Images/Student/fyf.jpg');
INSERT INTO `xzfc` VALUES ('7', '范玉凤', '主持浙江省科技厅“新苗人才计划”项目《基于波形对比的音乐学习系统》', '作品“音乐学习软件”获第七届浙江省大学生多媒体设计竞赛课件设计三等奖', '作品《8008》获多媒体作品设计DV三等奖（2008）', '/Public/Images/Student/fyf.jpg');
