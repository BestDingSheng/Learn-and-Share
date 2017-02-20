# git & github

## 安装git

### osx
* brew install git
* 下载安装，地址：[https://git-scm.com/download/mac](https://git-scm.com/download/mac)

### linux
* apt-get install git
* yum install git

### windows
* 下载安装，地址：[https://git-scm.com/download/win](https://git-scm.com/download/win)

### 安装GUI（推荐）
* 下载地址：[https://git-scm.com/downloads/guis](https://git-scm.com/downloads/guis)

## 使用git的几种场景

### 仅在本地
1. mkdir gittest && cd $_
2. git init
3. touch README.md
4. git add .
5. git commit -m 'first commit'

### 在github或自建的git服务
1. git clone git@github.com:[acount]/[project].git
2. vim README.md
3. git add .
4. git commit -m 'modify'
5. git push
 
## git时光穿梭
**git log** 查看最近3次提交的信息  
**git reset --hard HEAD^** 回到上一个版本  
**git reset --hard 3628164** 回到指定的版本，由commit id指定  
**git reflog** 查看历史命令

## 使用github的几种场景

### 报告一个issue
当你在使用开源项目的过程中遇到bug，但是你不知道如何去修复它，可以给项目提一条issue，写明issue的标题和描述，描述支持markdown

#### 对issue的建议
* 搜索开放和已经关闭的issue来检查你现在提出的issue是否已经被提及，发布重复的issue会让双方都降低效率
* 请明确你的问题：期望的输出是什么？实际发生了什么？以及其他人如何复现你的问题
* 对示例的链接：复现问题的方式，比如提供在jsfiddle和codepen上的示例链接
* 汇报系统环境的详细信息，比如使用什么浏览器，使用的库或者操作系统的版本
* 在你的issue或者gist中粘贴错误输出或者日志

### 提交一个pull request
如果你想为开源项目贡献代码，那么你应该了解一下pull request工作流：

1. fork开源项目，这样该项目就会出现在你自己的账户中
2. 克隆你的fork到本地
3. 为你本地的项目添加指向原始开源项目的上游仓库
4. 在本地进行开发
5. 将master分支推送回你的fork
6. 创建一个pull request

#### 对pull request的建议
* 时常从上游Pull变更，保证在提交你的pull request时是最新版本，从而减少合并冲突的可能性
* 为你的编辑创建一个分支
* 清楚问题是如何发生的，同时其他人如何去复现问题，或者你提交的特性是有帮助的。同样的，清楚了解你的变更执行步骤
* 最好进行测试。如果有，对已有的测试项目测试你的变更，需要时创建一个新的测试。不管测试是否存在，请保证你的变更不会扰乱现有项目
* 提供你变更前后的截图，包括在html/css上的不同，拖拽图片到你的pull请求中
* 尽量参照项目风格来参与项目。这包括使用缩进，符号和注释，使用和项目一致的风格会让项目维护人员更容易合并，其他人也更容易理解和在将来进行维护

***

*参考资料：*  
[git官网](https://git-scm.com/)  
[github官网](https://github.com/)  
[如何在GitHub上协作开发开源项目？](http://os.51cto.com/art/201308/408674.htm)  
[如何在Github上为开源贡献力量？](http://blog.jobbole.com/65147/)  
[版本控制入门 – 搬进 Github](http://www.imooc.com/learn/390)

