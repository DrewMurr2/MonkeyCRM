<?php



function checkUserNameAndPassword($un,$pw){
$returnBool = false;
$sql = "Select * From Users Where USR = '" . $un . "';";
$serverName = "roilfirstsqlserver.database.windows.net"; //serverName\instanceName, portNumber (default is 1433)
$connectionInfo = array( "Database"=>"MonkeyDB", "UID"=>"roilservices", "PWD"=>"Roil111111");
$conn = sqlsrv_connect( $serverName, $connectionInfo);
$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
     return false;
}else{
    while($obj = sqlsrv_fetch_object( $stmt)){
    foreach ($obj as $name => $value) {
        echo $name;
      if("$name"=="PW"){
        if($value==$pw){
     $returnBool = true;
        }else{
            return false;
        }
      }
    };  
    };
    return $returnBool;
};
};



function queryToJSON($sql){
$serverName = "roilfirstsqlserver.database.windows.net"; //serverName\instanceName, portNumber (default is 1433)
$connectionInfo = array( "Database"=>"MonkeyDB", "UID"=>"roilservices", "PWD"=>"Roil111111");
$conn = sqlsrv_connect( $serverName, $connectionInfo);
$stmt = sqlsrv_query( $conn, $sql);
if( $stmt === false ) {
     echo "<li><a>Nope</a></li>";
}else{
    echo '{"data":[';
    $firstObj = true;
    while($obj = sqlsrv_fetch_object( $stmt)){
        if(!$firstObj) echo ",";
        $firstObj = false;
        
        echo "{";
        $firstTime = true;
    foreach ($obj as $name => $value) {
      if($firstTime){
          echo '"' . $name . '"' . ':"' . $value . '"';
          $firstTime = false;
      }else{
        echo ', "' . $name . '"' . ':"' . $value . '"';
      };
    };
        echo "}";
        
    };
    echo "]}";

};
};
?>