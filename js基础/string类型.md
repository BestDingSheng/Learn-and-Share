# string类型   
字符串(string)是一组由16位值组成的不可变的有序列表，每个字符通常来自于Unicode字符集。
Javascript通过字符串类型来表示文本。字符串的长度(length)是其所含16位值的个数，
javascript字符串(和其数组)的索引从零开始：第一个字符的位置是0，第二个字符的位置是1，
以此类推。空字符串(empty string)长度为0

    *在javascript的真是环境中，0.3-0.2=0.09999999999999998
##string属性  
    string.length  
    字符串长度索引值从0开始，最后一个的索引值为s.length-1
    string.length属性是一个只读的整数，指明指定的字符串string中的字符个数。对任意字符串string来说，最后一个字符的所以都是string.length-1。字符串的length属性不会在for/in循环中枚举，也不可通过delete操作符删除
##string方法  
    var s = "hello,world"       //定义一个字符串  
    s.charAt(0)                 // ==> "h":第一个字符
    s.charAt(s.length-1)        // ==> "d":最后一个字符  
    s.substring(1,4)            // ==> "ell":第2~4个字符  
    s.slice(1,3)                // ==> "ell":第2~4个字符  
    s.slice(-3)                 // ==> "rld":最后三个字符  
    s.indexOf("l")              // ==> 2:字符首次出现的位置  
    s.lastIndexOf("l")          // ==> 10:字符串最后一次出现的位置  
    s.split(",")                // ==> ["hello","world"] 分割成子串  
    s.replace("h","H")          // ==> "Hello,world":全文字符替换  
    s.toUpperCase()             // ==> "HELLO,WORLD"     
###charAt()取出一个字符串中指定位置的字符
####String.chatAt()返回字符串string中的第n个字符。字符串的第一个字符的编号为0.如果n不在0~string.length-1之间，这个方法将返回一个空字符串。主义，Javascript中没有字符数据类型，所以返回的字符实际上是一个长度为1的字符串
    var s="hello javascript";   //定义一个字符串
    s.charAt(1);                // ==> "e":第二个字符
    s.charAt(0);                 // ==> "h":第一个字符
    s.charAt(-1);               // ==> 返回空值
    s.charAt(20);               // ==> 返回空值
###charCodeAt()返回一个字符串中指定位置的字符的编码
    string.charCodeAt(n);
####返回string中第n个字符的Unicode编码。返回的值是一个16位的整数，值在0~65535之间。charCodeAt()类似charAt()，不同之处是它返回指定位置的字符编码，而不返回包含该字符串的子串。如果n为负数或大于等于字符串的长度，则charCodeAt()将返回NaN。
    var s="hello javascript";   //定义一个字符串
    s.charCodeAt(0);            // ==> 104:h的unicode编码为104
    s.charCodeAt(s.length-1);   // ==> 116:t的unicode编码为116
    s.charCodeAt(5);            // ==> 32: 空格的unicode编码为32
    s.charCodeAt(-1);           // ==> NaN:n超出范围返回NaN
    s.charCodeAt(20);           // ==> NaN:n超出范围返回NaN
###fromCharCode()从字符编码创建一个字符串
    string.fromCharCode(c1,c2,...)
    参数c1,c2,...为指定待创建字符串中的字符的unicode编码，一个或多个整数
    返回一个新的字符串，内容为指定编码对应的字符
####这个静态方法提供一个通过指定每个字符的unicode编码数字来创建字符串的方式。注意，作为一个静态方法，fromCharCode()是String（）构造函数的一个属性，实际上不是字符串或String对象的方法，与string。charCodeAt()与这个方法对应，它提供一个取得指定字符串中单个字符的编码的方法
    //创建字符串"hello"
    var s =String.fromCharCode(104,101,108,108,111);   //==>hello
    var s=String.fromCharCode(120,121,101);            //==>xye
###concat()将一个或多个值连接成一个字符串
    string.concat(value,...)
    value,...//一个或多个待链接为字符串的值
    返回：由每个参数链接为string而组成的新的字符串
####concat()将它的每个参数转换为字符串（如果必要的话）并将他们按顺序追加到string的末尾。它返回最后的连接结果。注意string本身没有被改变。String.concat()与Array.concat()类似。注意使用“+”操作符来执行字符串连接经常更简单一些。
    var s="hello";
    var t="javascript";
    var r="!";              //定义三个字符串
    s.concat(t,r)    //==> hellojavascript!
    t.concat(s,t)    // ==>javascripthello!
    r.concat(s,t)    // ==>!hellojavascript
###indexOf()在指定字符串中寻找一个字符或子串
    string.indexOf(substring)
    string.indexOf(substing.start)
    参数：substing必需，要在string中搜索的子串
    start 可选，指定该次搜索在字符串string中的开始位置。合法的值为0~string.length-1.如果这个参数忽略了，则搜索将从给定字符串的第一个字符开始
    返回，在字符串中string中start位置之后，substing第一次出现的位置，如果没有找到则返回-1
####String.indexOf()搜索指定的字符串string，从前到后搜索，检查它是否包含指定的子串subsring。搜索开始于string中的start位置，如果没有指定start则从string的开头开始搜索，如果发现了子串substring，则String.indexOf()将返回substring在string中第一次出现的第一个字符所在的位置。string中字符的位置从0开始编号。如果在string中没有找到substing，则返回-1
    var s="hello javascript!";          //定义一个字符串    
    s.indexOf("a");                       //==>7
    s.indexOf("l");                       //==>2
    s.indexOf(" ");                       //==>5
    s.indexOf("!");                       //==>16
###lastIndexOf()在指定字符串中向后寻找一个字符或子串
    string.lastIndexOf(substring)
    string.lastIndexOf(substring,start)
    参数substing 必需，要在字符串string中搜索的子串
    start 可选，指定string中搜索开始的位置。合法值为0到string.length-1。如果省略该参数，它将从字符串string的最后一个字符开始搜索。
    返回，子串substing在字符串string的start位置之前之后一次出现的位置，如果没有找到则返回-1
####string.lastIndexOf()从字符串string的结尾开始搜索到开头，检查它是否包含子串substring。搜索开始与字符串string中的start位置，如果没有指定start则开始于string的尾部。如果找到子串substing，则string.lastIndexOf()将返回该子串的第一个字符的位置。由于本方法从字符串string的末尾搜索到开头，因此找到的第一个匹配子串就是string的start位置前的最后一个匹配，如果没有找到指定的子串，则string.lastIndexOf()将返回-1
    注意：虽然string.lastIndexOf()从字符串string的末尾搜索到开始，它仍然将string中的字符从开头开始编号。string的第一个字符的位置为0，最后一个位置为string.length-1   
    var s="hello javascript!";          //定义一个字符串    
    s.lastIndexOf("a");                 //==>9
    s.lastIndexOf("l");                 //==>3
    s.lastIndexOf(" ");                 //==>5
    s.lastIndexOf("!");                 //==>16
    s.lastIndexOf("c");                 //==>11
###localeCompare()使用本地定义的顺序比较字符串
    string.localeCompare(target)
    参数：target要与string使用区分地区设置的方式比较字符串。
    返回：一个表示结果的数字。如果string比target“小”，则localeCompare()将返回一个比0小的数。如果string比target"大"，则本方法将返回一个比0大的数。如果这两个字符串相同，或者根据本地顺序约定无法区分，则本方法返回0
####当在字符串上使用"<"或">"操作符时，他们只比较这些字符的unicode编码，而不考虑本地的顺序。这中方式产生的顺序并不总是正确。比如，在西班牙语中，字母"ch"习惯上当做一个单独的字母，排在字符"c"和"d"之间，localeCompare()提供一个根据默认的本地排序来比较字符串的方法。ECMAScript标准没有指定本地化比较如何完成，这个函数利用底层的操作系统提供的排序。
    下面的代码将使用本地化顺序来排序一个字符串数组：
    var strings;                 //待排序的字符串数组
    strings.sort(function(a,b){
            retrun a.localeCompare(b)
        });

###match()使用正则表达式执行模式匹配 
    string.match(regexp)
    参数：regexp，一个指定要匹配的模式的regExp对下你给，如果这个参数不是一个RgeExp对象，则它将先被传入RegExp()构造函数，后转换为RegExp对象
    返回：一个包含匹配结果的数组。数组的内容取决于regexp是否设置g（全局匹配）属性。
    var s="1 plus 2 equals 3 and 4 inner 5";
    s.match(/\d+/g);          //==>返回["1", "2", "3", "4", "5"]
    s.match(/\d+/);          //==>返回["1"]
    s.match(/\D+/g);          //==>返回[" plus ", " equal ", " and ", " inner "]
    s.match(/\D+/);          //==>返回[" plus "]
    s.match(/\w+/g);         //==>返回["1", "plus", "2", "equal", "3", "and", "4", "inner", "5"]
    s.match(/\w+/);         //==>返回["1"]
    
###replace()使用正则表达式执行查找与替换操作  
    string.replace(regexp,replacement)
    参数：regexp指定了要替换的模式的RegExp对象，如果这个蚕食是一个字符串，它将用作一个要搜索的直接量文本模式；它将不会先转化为RegExp对象
    replacement一个内容为替换文本的字符串，或者一个函数，用于在调用时生成对应的替换文本
    返回：一个新的字符串，其中匹配RegExp的第一或所有的地方已替换为replacement。
    var s="hello javascript!"           //==>定义一个字符串
    s.replace(/a/,"A");                 //==>返回：hello jAvascript！
    s.replace(/a/g,"C");                //==>返回：hello jAvAscript！
    s.replace(/ /,"");                  //==>返回:hellojavascript!
###search()在一个字符串中查找匹配某个正则表达式的子串
    string.search(regexp)
    参数：regexp,一个RegExp对象，指定要在字符串string中查找的模式。如果这个参数不是一个RegExp，它将先传入RegExp()构造函数，后转换为一个RegExp对象。
    返回：string中第一个匹配regexp的子串的开始位置，如果没有找到匹配则返回-1。
####search()在string中寻找匹配regexp子串，并返回匹配子串的第一个字符的位置，如果没有找到则返回-1.search()不执行全局匹配，它会忽略/g标志。它也会忽略regexp的lastIndex属性，总是从string的开始位置开始搜索，这意味着它总是返回string中第一个匹配子串的位置。
    var s = "hello javaScript!"         //定义一个字符串
    s.search(/script/i);                // ==>10/i表示不区分大小写。
    s.search(/script/);                 // ==>-1
    s.search(/l/);                      // ==>2

###slice()返回字符串的一个切片或子串 
    string.slice(start,end)
    参数：start 切片开始的字符串索引。如果为负，则将该字符串的尾部开始计算。也就是说，-1，表示最后一个字符，-2表示倒数第二个字符，以此类推
          end 紧跟着切片结尾的字符串索引。如果不指定，则切片将包括从start到当前字符串结尾的所有字符。如果这个参数为负的，则将从该字符串的尾部开始计算。
    返回：一个新的字符串，内容为string中自start位置开始并且包含start位置，知道但不包含end位置的所有字符。
####slice()返回一个字符串，内容为string的一个切片或子串。它不修改string。
    var s = "hello javascript!";        //定义一个字符串
    s.slice(1,5);                       // ==>ello，返回索引为1开始到索引为5(不包含)之间的字符串
    s.slice(1);                         // ==>ello javascript!
    s.lice(-5);                         // ==>ript!
    s.lice(2,-5);                       // ==>llo javas
    s.lice(-5,-1);                      // ==>ript
###substring()提取字符串的一个子串
    string.substring(from,to)
    参数：from 一个非负整数，指定要提取的子串的第一个字符在string中的位置。
          to一个非负整数，必要提取的子串最后一个字符的位置大1，如果省略这个参数，则返回的子串将持续到string的结尾
    返回：一个新的字符串，长度to-from，内容为string的子串。新字符串的内容为string中从位置from到to-1的字符的副本。
####string.substring()返回string中位置from与to之间的字符组成的子串。包含位置from处的字符，但不包含位置to处的字符。如果from等于to，则这个方法将返回一个空（长度为0的）字符串。如果from比to大，这个方法将先交换两个参数的值，然后返回他们之间的子串。substring（）返回的子串的长度总是等于to-from，不能接受负参数。
    var s = "hello javascript!";
    s.substring(2,5);                   //ll
    s.substring(2);                     //llo javascript
    s.substring(-1);                    //hello javascript!
###substr()提取字符串的一个子串，substring()的一个变体
    string.substr(start,length)
    参数：start,子串的开始位置。如果这个参数为负数，则将从string的尾部开始计算：-1表示最后一个字符，-2表示倒数第二个字符，以此类推
          length,该子串中的字符数，如果省略这个参数，则返回的子串将包含从开始位置到字符串结束的所有字符。
    返回：string的一部分的一个副本，包含string中自start位置开始的length个字符，如果未指定length则包含自start到结尾的所有字符。
####substr()从stirng中提取并返回一个子串，它并不修改string本身。substr()通过一个开始字符的位置已经长度来指定期望取得的子串。
    var s = "hello javascript!"         //定义一个字符串
    s.substr(2,2);                      // ==>ll
    s.substr(3);                        // ==>lo javascript!
    s.substr(-3,3);                     // ==> pt!
    **bug在IE中传入负的start不会正常工作，它们不是从string的尾部开始计算字符位置，而是从位置0开始。
###split()在指定的分隔符字符串或正则表达式处断开，将一个字符串分割为由字符串组成的数组
    string.split(delimiter,limit)
    参数：delimiter string切分处的字符串或正则表达式
          limit这个可选的整数指定已返回数组的最大长度。如果指定，则最多返回数量为这个数字的子串。如果没有指定，则切分整个字符串，无论结果数组有多长。
    返回：一个字符串组成的数组，通过在有delimiter界定的边界处切分string为子串创建。返回数组中的子串不包含delimiter本身。

    var s = "www.white.com";
    s.split(".");                       //==>["www", "white", "com"]
    s.split(".",2);                     //==>["www", "white"]
    s.split("");                        //==>["w", "w", "w", ".", "w", "h", "i", "t", "e", ".", "c", "o", "m"]
    
###toLowerCase()返回指定字符串的一份副本，其中所有的字符都已转换为小写
    string.toLowerCase()
    返回：string的一个副本，如果其中有大写字母，则大写字母都已经转换为对应的小写形式。
    var s = "Hello JavaScript!";
    s.toLowerCase();                    //==>hello javascript!
###toUpperCase()返回指定字符串的一份副本，其中所有的字符都已转换为大写
    string.toUpperCase()
    返回：string的一个副本，如果其中有小写字母，则小写字母都已转换为对应的大写形式
    var s = "hello javascript!";
    s.toUpperCase();                    //==>HELLO JAVASCRIPT!
###trim()返回指定字符串的一份副本，其中前后的空白字符都已删除
    string.trim()
    返回：string的一个副本，其中开头和结尾处的空白字符都已移除
    var s = "   hello javascript!";
    s.trim();                           //==>hello javascript
##静态方法
    String.fromCharCode()使用作为参数传入的字符编码创建一个新的字符串



