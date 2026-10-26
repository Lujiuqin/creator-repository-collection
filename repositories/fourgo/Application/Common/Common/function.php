<?php
//格式化输出
function p($arr){
	dump($arr,1,'<pre>',0);
}
/**
 * 合并二维数组
 */
function data_merge($data,$pid = 0){
    $arr = array();
    foreach ($data as $v) {
        if ($v['pid'] == $pid) {
            $v['child'] = data_merge($data,$v['id']);
            $arr[] = $v;
        }
    }
    return $arr;
}
/**
 * 验证码检查
 */
function check_verify($code, $id = ""){
    $verify = new \Think\Verify();
    return $verify->check($code, $id);
}
//$time 时间戳
function time_format($time = NULL,$format = 'Y-m-d H:i:s'){
    $time = $time === NULL ? NOW_TIME : intval($time);
    return date($format, $time);
}
//密码MD5处理
function pwdHash($password, $type = 'md5') {
    return hash ( $type, $password );
}
//ip处理
function ipDeal($ip){
  return preg_replace('/\..+\./', '.*.*.', $ip); //192.168.1.1 preg_replace("#[^\.]*\.[^\.]*$#","*.*",$ipaddress)
}
//获取客户IP地址
function GetIP() {
    if (getenv("HTTP_CLIENT_IP") && strcasecmp(getenv("HTTP_CLIENT_IP"), "unknown")) {
      $ip = getenv("HTTP_CLIENT_IP");
    }else if (getenv("HTTP_X_FORWARDED_FOR") && strcasecmp(getenv("HTTP_X_FORWARDED_FOR"), "unknown")){
      $ip = getenv("HTTP_X_FORWARDED_FOR");
    }else if (getenv("REMOTE_ADDR") && strcasecmp(getenv("REMOTE_ADDR"), "unknown")){
      $ip = getenv("REMOTE_ADDR");
    }else if (isset($_SERVER['REMOTE_ADDR']) && $_SERVER['REMOTE_ADDR'] && strcasecmp($_SERVER['REMOTE_ADDR'], "unknown")){
      $ip = $_SERVER['REMOTE_ADDR'];
    }else {
      $ip = "114.114.114.114";
    }
    return($ip);
}
function GetAddIsp() {
    $IP = GetIP();
    //api地址
    //$url = 'http://ip.qq.com/cgi-bin/searchip?searchip1='.$IP; 腾讯ip分享计划
    $url = 'http://api.map.baidu.com/location/ip?ak=jdpj2HXG6mYg9tlzawn7BquE&ip='.$IP;
    $ipInfo = file_get_contents($url);
    $ipArr = json_decode(mb_convert_encoding($ipInfo,'UTF-8'),true);
    if($ipArr['status'] == '0'){
        return $ipArr;
    }else{
        return false;
    }
}
//获取访客地理位置，使用 Baidu 隐藏接口。
function GetAdd() {
    $Add = GetAddIsp();
    if(is_array($Add)){
      return $Add['content']['address'];
    }else{
      return false;
    }
}
//回复数更新
function upComments($id){
    $model = M('article_list');
    $result = $model->where(array('id'=>$id))->setInc('comment');//comment +1
    return $result;
}
//防灌水
function prevention($table,$ip,$time){
    $map = array('ip'=>$ip,'time'=>array(array('lt',time()),array('egt',time()-$time)));
    $count = M($table)->where($map)->count();
    return $count;
}

?>