<?php 
 if($_GET['action']=='write'){
        $_clean=array();

        $_clean['email']=$_SESSION['email'];
        $_clean['titile']=$_POST['titile'];
        $_clean['commont']=$_POST['comment'];

        
    mysql_query(
            "INSERT INTO artical(
                                writer,
                                titile,
                                commont,
                                time
                                )
                         VALUES(
                                '{$_clean['email']}',
                                '{$_clean['titile']}',
                                '{$_clean['commont']}',
                                 NOW()
                                )"
                );
    if(_affect_row()==1){
        _close();
    //跳转
    _location('发帖成功', 'talk_index.php');
                        }
        else{
    _close();
    //跳转
    _location('发帖成功', 'talk_index.php');
            }
    } ?>