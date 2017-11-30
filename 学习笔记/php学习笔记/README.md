### php基础语法

php需要写在<?php ?>环境里

定义变量 $a = 'a';

isset()方法判断这个变量是否存在

echo 'a'  打印方法

```php
	$a = 'hah';
    // 函数内部拿不到 外面的变量需要添加 global 才能拿到
	function ding(){
		global $a;
		echo $a;
	}
	 ding()
```

### php引入外部文件的方法

1 include_once() 引入文件错误程序依然会执行

2 require_once() 文件如果错误整个程序就不会执行

3 require() 

### 数组

```php
    $arry = array('msg'=>'hah')
    $arry = array('0'=>'hah')
```
json_encode() 这个方法可以把数组转换成json

### session
session_start() 回话机制

$_SESSION['key'] = value;

### get post 

$GET['username']

$POST['username']

$REQUEST['username'] get和post的数组都能拿到


### php-mysql
参考文档 http://www.w3school.com.cn/php/php_mysql_connect.asp


```php
<?php
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
```

### 打印log

echo普通字符串和变量

var_dump 打印出对象

 printf(%s %s,'ding','sheng') // ding sheng
 
## 02php面向对象

软件危机 软件工程学

重用 灵活 扩展

**特点**

封装 继承 多态


### 面向对象有三个主要特性：

1对象的行为

2对象的状态

3对象的标识

### 如何抽象一个类

类的声明

成员属性 

成员方法

### php类的语法语法

```php
class Person{

	public $age;
	public function say($word){
		echo "she say {$word}";
	}

	public function info(){
		$this->say('Hi');
		return $this->age;
	}
}

$xiaohong = new Person();
$xiaohong->age=12;
$age = $xiaohong->info();

echo $age;
```

### 构造函数和析构函数


```php

<?php 

class Person{

	//  构造方法
	public function __construct($name,$age){
	// 当这个类new的时候自动执行
		echo ($name.'hello');
		echo "<hr/>";
		$this->name=$name;
		$this->age = $age;
	}

	public function data(){
		return $this->age;
	}
	// 析构方法
	public function __destruct(){
           //  用途 可以进行资源的释放操作 数据库关闭
           // 对象呗销货的时候执行 没有代码再去运行了
		echo "bey bey  {$this->name}";
	}


}

$xiaowang= new Person('ding',30);
$xiaohong= new Person('hong',30);
// echo $xiaowang->data();



?>
```


