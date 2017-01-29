<?php
// MongoDB 伺服器設定
$dbhost = 'localhost';
$dbname = 'campus';

// 連線到 MongoDB 伺服器
$mongoClient = new MongoClient('mongodb://' . $dbhost);
$db = $mongoClient->$dbname;

// 取得 demo 這個 collection
$cUser = $db->user;

$account = $_POST['account'];
$psd = $_POST['password'];


$queryAccount = array(
	'account' => $account
);

$queryPsd = array(
	'password' => $psd
);
//檢查有沒有重複帳號或密碼
$accountRepeat = $cUser -> findOne($queryAccount);
$psdRepeat = $cUser -> findOne($queryPsd);

//沒有重複
if($accountRepeat == NULL && $psdRepeat == NULL){
	// 要儲存的資料
	$user_info = array(
	 "account" => $account,
	 "password" => $psd,
	 "save" => array()
	);

	$cUser -> insert($user_info);

	echo(json_encode(array('finish' => '1')));
}else if($accountRepeat != NULL){
	echo(json_encode(array('finish' => 'account')));
}else if($psdRepeat != NULL){
	echo(json_encode(array('finish' => 'psd')));
}


?>