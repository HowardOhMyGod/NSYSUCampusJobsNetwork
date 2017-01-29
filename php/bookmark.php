<?php
// 設置資料類型 json，編碼格式 utf-8
header('Content-Type: application/json; charset=UTF-8');

// 判斷如果是 GET 請求，則進行搜尋；如果是 POST 請求，則進行新建
// $_SERVER['REQUEST_METHOD'] 返回訪問頁面使用的請求方法
if($_SERVER['REQUEST_METHOD'] == "POST"){
	if($_POST['status'] != 'clear'){
		save();
	}else{
		clear();
	}
    
}


//存標籤
function save(){
	$info_block = $_POST['info'];
	$save_status = $_POST['status'];
	$current_post = $_POST['current_info_id'];
	$account = $_POST['account'];

	// MongoDB 伺服器設定
	$dbhost = 'localhost';
	$dbname = 'campus';

	// 連線到 MongoDB 伺服器
	$mongoClient = new MongoClient('mongodb://' . $dbhost);
	$db = $mongoClient->$dbname;
	//使用user collection
	$cUser = $db->user;

	//加入收藏夾
	if($save_status == "false"){
		
		//加上儲存方塊到user的save array
		$cUser -> update(array('account'=> $account), array('$push' => array('save' => json_decode($info_block))));
		
		//一定要回傳值!!!
		echo json_encode(array('status' => 1));
	} 
	//從收藏夾刪除
	else if($save_status == "true"){

		$cUser -> update(array('account'=> $account), array('$pull' => array('save' => array('post_id' => $current_post))));

		echo json_encode(array("status" => 0));
	}
	
}

function clear(){
	$account = $_POST['account'];

	// MongoDB 伺服器設定
	$dbhost = 'localhost';
	$dbname = 'campus';

	// 連線到 MongoDB 伺服器
	$mongoClient = new MongoClient('mongodb://' . $dbhost);
	$db = $mongoClient->$dbname;
	//使用user collection
	$cUser = $db->user;

	$cUser -> update(array('account'=> $account),array('$set'=>array('save' => [])));
	echo json_encode(array("status" => 'clear'));
}


