<?php

$usr = $_REQUEST["usr"];
$pwd = $_REQUEST["pwd"];
if ($usr == "monkey" && $pwd == "madness"){
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

$sql = "SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES;";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // output data of each row
    while($row = $result->fetch_assoc()) {
            echo "<li><a onClick=",'"',"importTable('",$row["TABLE_NAME"],"')",'">';
        echo $row["TABLE_NAME"];
          echo "</a></li>";
    }
} else {
       echo "<li><a>";
    echo "1 results";
      echo "</a></li>";
}
$conn->close();    
} else {
    echo "Wrong username or password.";
}


?>