# lifeshow-minip
毕设代码备份。短视频小程序客户端（微信小程序）



### 简短介绍：

基于微信小程序的短视频社交软件设计与实现

随着微信的普及和短视频的流行，设计一个微信小程序端的短视频社交软件，提供短视频的观看、点赞、评论、分享以及短视频的上传发布等功能给用户使用；用户观看视频时界面上会有其他用户留言以弹幕的形式滚动，让用户有和其他用户同时观看视频的感觉，并且用户可以对其他用户的留言进行点赞和回复；提供多个内容板块供用户选择，可以定期举办内容创作比赛，由用户和短视频上传用户共同参与。后端使用基于Java的短视频后台管理系统，包括用户管理、短视频的管理、背景音乐的管理、用户留言的管理、登录注册、权限验证等等功能。



### 小程序部分功能预览：

<img src="https://raw.githubusercontent.com/chaooWoo/lifeshow-minip/master/document/images/index.jpg" alt="首页" style="zoom:50%;" /><img src="https://raw.githubusercontent.com/chaooWoo/lifeshow-minip/master/document/images/my.jpg" alt="个人信息" style="zoom:50%;" />



### 需求量化：

#尽可能地实现了大部分功能

#相较于【[需求量化.xlsx](https://github.com/chaooWoo/lifeshow-minip/blob/master/document/需求量化.xlsx)】新增功能包括：

1. 用户可选择手机中已有的短视频进行上传（非小程序中录制的视频）

#未实现功能包括：

1. 小程序和后台的websoket连接
2. 用户对短视频的操作：查看喜欢的短视频 / 查看历史浏览短视频 （已删除功能）
3. 用户可查看消息仅有【短视频被封禁】一项



### 如何使用？

1. 引入组件（如果你是新手，可能遇到这个问题[没有找到可以构建的npm包](https://www.cnblogs.com/alchemist-z/p/12274557.html)，也可参照 **FAQ** 中我的归纳的步骤）

可参照[Vant Weapp](https://youzan.github.io/vant-weapp/#/quickstart)的快速开始方法通过npm安装其小组件；同样的，微信的扩展组件也如法炮制地安装（[以video-swiper为例](https://developers.weixin.qq.com/miniprogram/dev/extended/component-plus/)）。

**注意**：1.项目本地设置一定要勾选【使用npm模块】；2.再点击工具-【构建npm】才有效；3.在需要使用组件的页面的json文件中，引入【@vant/weapp】所在目录即可，路径正确才可正确引入。

一般情况下，组件引入后会如图所示，具体哪一个我不是太清楚，其中一个包含了组件源码。但是路径的引入如下即可

```json
"usingComponents": { //json不支持注释，这里仅作解释
    "navBar": "/components/navBar/navBar", //拷贝代码的自定义组件
    "navigatorItem": "/components/navigatorItem/index", //自定义组件
    "van-search": "/@vant/weapp/search/index", //vant weapp的组件（好像不写最开始的 / 也可引入）
    "mp-video-swiper":"/@miniprogram-component-plus/video-swiper/index" //小程序扩展组件
}
```

![组件文件结构](https://raw.githubusercontent.com/chaooWoo/lifeshow-minip/master/document/images/components-path.png)

2. 更改后端服务器链接网址

将【utils/util.js】文件中定义的localServerUrl更改为自己的服务器地址，若是本地调试时，使用本地地址和指定端口即可，但是需要在项目的【本地设置】中勾选【不校验合法域名、web-view（业务域名），TLS版本以及HTTPS证书】

3. 项目-【本地设置】-【调试基础库】建议在 **2.10.0** 以上

4. 使用

配合我的另一个后端项目【[lifeshow-server](https://github.com/chaooWoo/lifeshow-server)】即可运行



### 功能设计：

1. 用户微信一键登录 / 缓存自动登录

2. 用户对短视频的操作包括：浏览 / 录制 / 发布 / 搜索 / 点赞 / 转发 /  留言 / 发送弹幕

3. 用户试听可使用的背景音乐（非拍摄短视频目前不支持和背景音乐合成）

4. 用户之间可互相关注 / 拉黑

   #近乎仿抖音（额外加入弹幕功能，单独的弹幕系统，非小程序视频组件的弹幕功能）



### 使用的小程序组件：

主要使用了【[有赞小程序组件Vant Weapp](https://youzan.github.io/vant-weapp/#/intro)】和【[微信小程序扩展组件](https://developers.weixin.qq.com/miniprogram/dev/extended/component-plus/)】

| 组件名                                                       | 使用原因                                                     |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| Vant Weapp                                                   | 轻量、风格统一、使用方便                                     |
| 小程序扩展组件库@miniprogram-component-plus                  | 仅使用了 video-swiper，该组件只要传入视频url列表即可实现【腾讯微视】的无限上下滑动观看的效果，免去了自己编写组件视频滑动卡顿的性能问题 |
| 自定义组件中的【audio】组件                                  | 网络上复制代码，并做了自己一些样式和方法修改的组件，用于播放音乐（原有代码实现了背景音乐播放） |
| 自定义组件中的【[navBar](https://github.com/lingxiaoyi/navigation-bar)】组件 | github上 [@lingxiaoyi](https://github.com/lingxiaoyi) 的作品，适配了近乎所有安卓和ios系统，解决了导航栏和胶囊按钮间距不同导致导航标题文字居中的问题 |
| 其他组件                                                     | 【components】包中其他组件均为自定义组件，用于短视频 / 用户的卡片式展示和跳转 |



### FAQ：（我在项目中遇到的问题）

**#微信小程序 npm 找不到npm包 没有找到可以构建的npm包 如何使用第三方npm组件**

1. 勾选【使用npm模块】
2. 若是初次使用，需要 **初始化npm**，在项目根目录（pages文件夹的父目录），使用 **npm init -f** 初始化
3. 继续使用 **npm install -production docxtemplater** 构建npm项目的配置文件
4. 根据需要的第三方组件要求，执行对应的npm命令，例如：**npm i @miniprogram-component-plus/video-swiper --save**
5. 在微信开发者工具中，【工具】-【构建npm】，等待一点时间后即可完成引入
6. 第二次之后的第三方组件引入，只需要 **4. 5.** 两步即可

**注：** 若是觉得描述不清楚，可以参照[该篇文章](https://www.cnblogs.com/alchemist-z/p/12274557.html)和官方文档，以及其他第三方组件文档



**#项目中大量使用了Promise简化了回调，若是不能理解，可以参照以下文章了解Promise（或者去搜索其他文章）**

1. 项目中【util】包中对网络get、post请求作promise封装，使用更加简单，可以用于理解promise
2. [ 微信小程序中使用Promise进行异步流程处理](https://www.jianshu.com/p/e92c7495da76 )



**#使用async-await使js的异步变为同步**

1. 理解async-await是什么 => [理解 JavaScript 的 async/await](https://segmentfault.com/a/1190000007535316) / [微信小程序中使用Async-await方法异步请求变为同步请求](https://www.cnblogs.com/cckui/p/10231801.html )
2. 还有promise和async-await的一些小例子 => [微信小程序：回调，Promise，async，await 的使用例子](https://ninghao.net/blog/5508)
3. 微信小程序目前并不支持async-await语法，若需要使用的话，需要引入regenerator（上面的文章有说到如何做），但是根据他的做法，下载的文件即使在页面引入，依然无法使用。本项目中的 **runtime** 文件经过修改（别人修改好之后我复制过来的），可以直接使用

**runtime.js** 位于/libs/runtime.js，使用时在需要的页面js文件中引入即可，无需更多其他操作

```javascript
const regeneratorRuntime = require("../../libs/runtime");
```



**#引入第三方组件后，项目变得很大怎么办**

1. 不用担心这个问题，原来的小程序最大包可支持2m，现在最大可支持12m（但是每个分包还是不能大于2m）
2. 引入第三方组件时，同时是把组件源码也引入了，可以在微信开发者工具【详情】-【基本信息】查看实际本地代码大小，因为最后打包上传时会将编译后的代码进行打包，组件源码是不会被打包的，所以最后打包的包大小是会比开发时看到的要小，**目前本项目的总代码量（代码+图标）** 大小为 **710.9KB**。
3. 项目过大时，应注意一些占用资源过大的内容，比如图片、图标等，请更多使用网络图片。并且图标尽量小一些较好



### 其他：

1. 我的代码风格和分包习惯不是很好，代码可能看起来有点混乱，后续可能会计划添加相应注释（原来有了部分注释）
2. 小程序审核上线需要各种资质，个人主体使用【视频服务】也很难通过小程序审核，故止步于体验版

 

#**2020/05/07更新**

1. 更改原有的登录代码，修复以下几个问题：
   * 小程序session_key在有效期内（有登录缓存）却无法自动登录，每次打开小程序都只能停留在login页
   * 小程序session_key在有效期内，因某些原因登录缓存被清除时无法登录系统
   * 解决方法：理解【微信开发者工具创建新项目时自动创建的代码】后，修复登录逻辑中app.js和login.js的回调部分，用于解决第 **1.** 个问题，并且这两个js脚本中 **Promise** 化的 **wx.getStorage()** 接口去除，使用原本的 **wx.getStorage()** 微信小程序接口。为了解决第 **2.** 个问题，在session_key有效期内且无本地缓存情况下，重新调用【login()】接口重新登录，刷新服务器端的登录缓存，**如果你想问其他人不用缓存，那不也可以直接登录我的小程序了吗？**，对于这个问题，您都可以使用 【微信一键登录】了，要是别人可以没有缓存情况下可以登录你的小程序，说明你的微信被盗号了。
2. 修改音乐试听页的一些图标样式、指引弹出框增加图标使得更容易找到【录制按钮☕】
3. 修改自定义组件【commentItem】的mini类型样式，短视频留言框内，点击每一条留言用户的头像可进入该用户的用户信息页（增加查看其他用户信息的入口）



--> readme后续将会逐步完善...