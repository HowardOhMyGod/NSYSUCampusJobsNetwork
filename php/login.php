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
$password = $_POST['psd'];

$query = array(
	'account' => $account,
	'password' => $password
);

$show = array(
		'_id' => 0
	);
$result = $cUser -> find($query, $show);


if($result != NULL){

	$store = [];

	foreach($result as $item){
		$store[] = $item;
	}

	print_r(json_encode($store, JSON_UNESCAPED_UNICODE));

}
?>