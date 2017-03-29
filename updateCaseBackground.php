<?php
$token = $_REQUEST["token"];
$id = $_POST['id'];
$background = $_POST["backgroundinfo"];


$URL = 'https://legalmonkeys.highrisehq.com/kases/' . $id . '.xml';

$xmlPUT = '<kase><background>'. $background .'</background></kase>';
$xml = simplexml_load_string($xmlPUT);

$username=$token;
$password='x';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$URL);
    curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
curl_setopt($ch, CURLOPT_HTTPHEADER, array('X-HTTP-Method-Override: PUT','Accept: application/xml', 'Content-Type: application/xml'));  

//curl_setopt($ch, CURLOPT_TIMEOUT, 30); //timeout after 30 seconds
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
//curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS,$xml);//http_build_query($xml));
//curl_setopt($curl,CURLOPT_SSL_VERIFYPEER,0);
//curl_setopt($curl,CURLOPT_SSL_VERIFYHOST,0);  
$xmlstr=curl_exec($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);   //get status code
echo $status_code;
curl_close ($ch);
//echo $xmlstr;

?>