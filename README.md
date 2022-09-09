#  《汕头大学校园导航》用户使用手册



### 1. 引言

##### 1.1 编写目的

​		本项目是应汕头大学工学院计算机专业二级项目《软件算法综合设计》要求，通过对最短路径的求解进行校园各个位置之间的路线规划，且需要有良好的功能操作界面。

##### 1.2 开发工具

​		本项目是用前端三大件 (html,css,javascript) 编写的。使用 bootstrap、iconfont 等css库，使UI界面得到一定程度的美化。引用百度地图API，简化了开发过程。



### 2 软件概述

##### 2.1 目标

1. 图像显示，用户操作界面友好。
2. 路线清晰明了，正确、无歧义。
3. 考虑突发情况和不确定性。

##### 2.2 功能概述

​		从当前位置开始规划路线；用户选择起终点规划路线。对获取位置是否成功有处理机制。



### 3. 运行环境

##### 1.1 安装Node.js 

Node.js 是一个开源和跨平台的 JavaScript 运行时环境。

入门教程：http://nodejs.cn/learn

安装路径：http://nodejs.cn/download/

##### 1.2 安装依赖

npm：npm 是 Node.js 标准的软件包管理器，可以管理项目依赖的下载。

1. 打开PowerShell，输入以下命令：

~~~
npm install -g http-server
~~~

<img src="C:\Users\zhangjiahao\AppData\Roaming\Typora\typora-user-images\image-20220909143051475.png" alt="image-20220909143051475" style="zoom:67%;" />

2. 导航到 map.html 的根目录下，或将该目录在终端打开。

   输入以下命令：

~~~
http-server
~~~

<img src="C:\Users\zhangjiahao\AppData\Roaming\Typora\typora-user-images\image-20220909142908793.png" alt="image-20220909142908793" style="zoom:67%;" />

3. Ctrl + 鼠标左键单击 http://127.0.0.1:8080，访问本地服务器。

   <img src="C:\Users\zhangjiahao\AppData\Roaming\Typora\typora-user-images\image-20220909143238182.png" alt="image-20220909143238182" style="zoom:67%;" />

4. 进入以下界面，点击 map.html ，使其运行在本地服务器8080端口。

<img src="C:\Users\zhangjiahao\AppData\Roaming\Typora\typora-user-images\image-20220909143336658.png" alt="image-20220909143336658" style="zoom: 67%;" />





### 4. 使用说明

1. 网页在启动之初询问用户是否允许获取当前位置。若不允许，则不能从当前位置为起点规划路线。

<img src="C:\Users\zhangjiahao\AppData\Roaming\Typora\typora-user-images\image-20220909172531127.png" alt="image-20220909172531127" style="zoom: 50%;" />

2. 若获取位置失败，则弹出提示框，询问用户是否再次获取

   <img src="C:\Users\zhangjiahao\AppData\Roaming\Typora\typora-user-images\image-20220909173215134.png" alt="image-20220909173215134" style="zoom: 50%;" />

3. 选择起终点

<img src="C:\Users\zhangjiahao\AppData\Roaming\Typora\typora-user-images\image-20220909172748072.png" alt="image-20220909172748072" style="zoom: 67%;" />

3. 选择好起终点后，点击确定，系统规划一条最优路径。

<img src="C:\Users\zhangjiahao\AppData\Roaming\Typora\typora-user-images\image-20220909172939896.png" alt="image-20220909172939896" style="zoom: 50%;" />

4. 点击 ”确定“ 按钮后面的 ”?" 图标，展示《用户使用手册》。

