<?php
include 'MonkeyPHPLibrary.php';

$usr = $_POST["un"];
$pwd = $_POST["pw"];
$sql = $_POST["q"];

$servername = "report.c27qodfdwt2r.us-east-1.rds.amazonaws.com";
$username = "webarc";
$password = "2F5BPWgt4fd3";
$dbname = "webarc";
$port = 3306;

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname, $port);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} 


$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo '{"data":[';
    $firstObj = true;
    // output data of each row
    while($row = $result->fetch_assoc()) {
            if(!$firstObj) echo ",";
        $firstObj = false;
        
        echo "{";
        $firstTime = true;
    foreach ($row as $name => $value) {
      if($firstTime){
          echo '"' . str_replace('"',"!",$name) . '"' . ':"' . str_replace('"',"!",$value) . '"';
          $firstTime = false;
      }else{
        echo ', "' . str_replace('"',"!",$name) . '"' . ':"' . str_replace('"',"!",$value)  . '"';
      };
    };
        
        echo "}";
        
    };
    echo "]}";

$conn->close();    
}else{
echo 'Cant get in';
};



?>