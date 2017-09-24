<?php
date_default_timezone_set('America/Los_Angeles');
$minutes = date('h')*60 + date('i');
$slot  = round($minutes/5);
if (!file_exists("data/".date("Ymd"))) {
    mkdir('data/'.date("Ymd"), 0777, true);
}
$file = "data/".date("Ymd")."/data".$slot.".json";
$globalfile = "data/".date("Ymd")."/gdata".$slot.".json"; // getting global stats total marketcapital
if(file_exists($file)){
	exit();
}
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, 'https://api.coinmarketcap.com/v1/ticker/?convert=INR');
$result = curl_exec($ch);
curl_close($ch);
$obj = json_decode($result);

if(!file_exists($file)) {	
	$fp = fopen($file, 'w');
	fwrite($fp, json_encode($obj));
	fclose($fp);
}

$gch = curl_init();
curl_setopt($gch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($gch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($gch, CURLOPT_URL, 'https://api.coinmarketcap.com/v1/global/?convert=INR');
$gresult = curl_exec($gch);
curl_close($gch);

$gobj = json_decode($gresult);

if(!file_exists($globalfile)) {	
	$gfp = fopen($globalfile, 'w');
	fwrite($gfp, json_encode($gobj));
	fclose($gfp);
}

?>