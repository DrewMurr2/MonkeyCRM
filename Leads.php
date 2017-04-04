<?php
$token = '09b1d28b10c0c242bd3a898bd8da72a7';//$_REQUEST["token"];
function get_xml_from_url($URL,$token){
$username=$token;
$password='XYZ';

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL,$URL);
curl_setopt($ch, CURLOPT_TIMEOUT, 30); //timeout after 30 seconds
curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
curl_setopt($ch, CURLOPT_HTTPAUTH, CURLAUTH_ANY);
curl_setopt($ch, CURLOPT_USERPWD, "$username:$password");
$xmlstr=curl_exec ($ch);
$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);   //get status code
curl_close ($ch);

    return $xmlstr;

}

    
$xmlstr = get_xml_from_url("https://legalmonkeys.highrisehq.com/companies.xml?tag=Lead",$token);

$xmlobj = new SimpleXMLElement($xmlstr);
echo '{"data":[' . json_encode($xmlobj) . ']}' 


?>