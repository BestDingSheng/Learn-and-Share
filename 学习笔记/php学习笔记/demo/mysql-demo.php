<?php 
//  在php5以上版本连接数据库需要用到 musqli 或者 pdo

$con = new mysqli("localhost:8889","root","root",'phpxuexi');
if (!$con)
{
	die('Could not connect: ' . mysql_error());
}else{
	echo "chenggogn";
}
$con=mysqli_set_charset($mysqli, "utf8");  // 设置编码格式

$sql = "SELECT * FROM news";
$result = $con->query($sql);

// echo $result;
// var_dump($result);

if ($result->num_rows > 0) {
    // 输出每行数据
    while($row = $result->fetch_assoc()) {
           printf ("%s %s\n", $row["newsid"], $row["newstitle"]);
    }
} else {
    echo "0 results";
}


// echo "string";
// some code







 ?>