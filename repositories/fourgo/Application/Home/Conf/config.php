<?php
return array(
  //数据库配置
  'DB_TYPE'      => 'mysql',
  'DB_HOST'      => 'localhost',
  'DB_NAME'      => 'foursteps',
  'DB_USER'      => 'root',
  'DB_PWD'       => '123456',
  'DB_PORT'      => '3306',
  'DB_PREFIX'    => '',
  'DB_CHARSET'   => 'utf8',

  //模板替换
  'TMPL_PARSE_STRING' => array(
    '__PUBLIC__'     => __ROOT__.'/Public',
    '__JS__'     => __ROOT__.'/Public/Js',
    '__JQUERY__' => __ROOT__.'/Public/JQuery',
    '__CSS__'    => __ROOT__.'/Public/Css',
    '__IMG__'    => __ROOT__.'/Public/Images',
    '__TPL__'  => __ROOT__.'/Application/Home/View',
  ),
);