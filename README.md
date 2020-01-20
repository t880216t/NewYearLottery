
<img src="./resource/lottery.gif" width = "600" height = "400" alt="" align=center></img>

NewYearLottery 是一个基于react + dva + antd开发的WEB版抽奖系统。

# 安装
```bash
$ git clone https://github.com/t880216t/NewYearLottery.git
$ cd NewYearLottery
$ cnpm install
```
# 启动开发服务器
```bash
$ npm start
```
打开网址：http://localhost:8000

# 使用步骤
主页左下角有个隐藏的设置按钮

<img src="./resource/settingbutton.png" width = "200" height = "300" alt="" align=center></img>
<img src="./resource/settinglist.png" width = "300" height = "200" alt="" align=center></img>

## 1.导入抽奖用户
用户名单的模板在项目文件中“NewYearLottery/resource/员工名单.xlsx”，根据自己的实际情况后修改后，进入用户管理页面“上传表单”

<img src="./resource/userdata.png" width = "600" height = "400" alt="" align=center></img>

上传后可以自行编辑用户表单。


## 2.添加奖品设置
点击“奖品设置”设置奖品信息，这里的会根据权重来安排抽奖顺序（**<big>按数字从小到大</big>**），会根据数量设置来安排每次的抽奖人数（请保证最终获奖的人数小于等于总抽奖人数）。

<img src="./resource/rewardsetting.png" width = "600" height = "400" alt="" align=center></img>

## 3.开始抽奖

回到首页，确认有奖品及用户数据后即可开始抽奖。

> 注意：开始抽奖后请勿刷新页面，否则将<font color=red>重头开始抽奖活动</font>


# 设计思想

本应用是完全独立的前端应用，不涉及后端交互。所以部署后，每个人看到界面的虽是一样，但每个人的数据是不同的，奖品及人员信息都在管理的session storage中，这样也避免了接口安全问题。

# 核心代码
应用使用dva管理数据流，核心的数据方法都在“NewYearLottery/src/models/lottery.js”中。

每轮滚动的人员列表都会随机洗牌，滚动数据每50ms刷新一次。
```javascript

/**
 * 随机洗牌
 *
 */
export function shuffle(arr) {
  let randomIndex = 0;
  for (var i = 0; i < arr.length; i++) {
    randomIndex = Math.floor(Math.random() * (arr.length - i));
    let temp = arr[i];
    arr[i] = arr[randomIndex];
    arr[randomIndex] = temp;
  }
  return arr
}

```

# 开源地址

https://github.com/t880216t/NewYearLottery

# 参考资料

* DvaJS https://dvajs.com/
* 抽奖程序（React）https://blog.csdn.net/Jason847/article/details/86560894
* Ant Design https://ant.design/index-cn
