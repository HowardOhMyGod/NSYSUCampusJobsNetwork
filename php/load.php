<?php

// MongoDB 伺服器設定
$dbhost = 'localhost';
$dbname = 'campus';

// 連線到 MongoDB 伺服器
$mongoClient = new MongoClient('mongodb://' . $dbhost);
$db = $mongoClient->$dbname;

$data = $_GET["get_info"];
$filter = (int) $_GET["filter"];

//讀取全部打工資訊
if($data == "jobs"){
	
	// 取得 parttime 這個 collection
	$collection = $db->parttime;
	$query = array();

	//查詢條件
	if($filter == 0){
		$query = array();
	}else if($filter == 1){
		$query = array(
			"time_type" => "長期"
		);
	}else if($filter == 2){
		$query = array(
			"time_type" => "短期"
		);
	}else{
		$query = array(
			"agent_type" => $filter
		);
	}

	//不要顯示ID
	$show = array(
		'_id' => 0
	);

	$result = $collection->find($query, $show);
	$store = [];

	foreach($result as $item){
		$store[] = $item;
	}

	print_r(json_encode($store, JSON_UNESCAPED_UNICODE));


//讀取Folder檔案
}else if($data == "intern"){
	$collection = $db->intern;

	//不要顯示ID
	$show = array(
		'_id' => 0
	);

	$result = $collection->find(array(), $show);
	$store = [];

	foreach($result as $item){
		$store[] = $item;
	}
	print_r(json_encode($store, JSON_UNESCAPED_UNICODE));
}
	
?>