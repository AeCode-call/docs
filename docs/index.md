# 会议分享：构建一个 cli 工具集

## 会议议题：

- 提出场景思考我们为什么需要一个 cli 工具

- 介绍如何通过nodejs添加一个全局命令

- 介绍微信小程序提供工具包 miniprogram-ci

- 介绍 commander 和 shelljs 工具包

- 介绍我的cli工具雏形，以及邀请大家共建工具

## 会议纪要：

### 议题 1：提出场景思考我们为什么需要一个 cli 工具

#### 场景1：简化小程序开发、发布流程

如果你的工作场景需要频繁切换、发布第三方框架构建的小程序，那么现在的小程序开发流程对于你来说肯定是痛苦的，你需要克隆好多个小程序仓库，并且给他们装包然后运行 dev 命令开发，开发完成后还需要运行 build 命令上传正式版本。

**以上问题**，可以开发一个 cli 工具来统一第三方框架的构建命令、运行这个构建命令时跳过小程序开发工具上传版本到小程序后台，也就是说同一套代码，不同的框架你可以同时运行多个相同命令传入不同参数把项目发布到多个不同的小程序后台去

#### 场景2：初始化一个标板项目

目前我们上线一个新项目的做法是手动的：下载标板代码 → 新建对应名称的 git 仓库 → 修改 ID (每个 id 对应每个项目的所有资源) → 推送项目到新建的 git 仓库中 → 初始化静态资源 → 发布小程序版本。步骤很简单，但就是这个步骤也是有问题的，每个 ID 对应了每个项目的所有资源，而我发现在一些项目静态资源链接的 ID 并没有修改，这就导致了当标板项目删掉这个静态资源时，没有修改 ID 的项目的静态资源也会一起失效。问题1：有些医院的静态资源没有初始化；问题2：对项目不熟的小伙伴在初始化一个新项目的时候有可能会忘记修改项目 ID。

**以上问题**，我们也可以开发一个 cli 工具来初始化项目，整个流程将会自动完成：下载标板代码 → 替换项目 ID（或其他的一些配置） → 删除 .git 文件 → push 到提前建立的远程仓库 → 构建静态资源 → 发布小程序版本（以上省略开发过程）

但其实标板项目的初始化有很多细节是小萌新照顾不到的（不仅项目 ID），不同标板的复杂度不同需要关心的东西也越多，也不会只有一个标板项目，大多数 B 端公司都会有很多个产品，如果每一个项目都需要开发去关注所有初始化的东西终究会有遗漏，最好的方式就是通过 cli 工具去自动完成初始化

当然还有其他更多的场景这里大家可以发散一下自己的思考……

::: tip 每个 ID 对应了每个项目的所有资源：
如果这个项目的 id 是 99991 则对应的测试环境资源为

API：https://uapi.xxxx.xx/99991/xxx

静态资源：https://ustatic.xxxx.xx/99991/xxx

其他同理……
:::

### 议题 2：介绍如何通过 nodejs 添加一个全局命令

```TypeScript
// 首先使用 pnpm init -y 初始化一个项目
// 在 package.json 中添加
{
    ...
    "bin": {
        "hc":"./main.js"
    }
}
/**
* 在当前目录下新建 main.js 文件在首行添加 #!/usr/bin/env node
* 
**/

// ./main.js
#!/usr/bin/env node
console.log('hello word!')

// 此时在命令行中运行 hc 便可以在命令行中输出 hello word!
```

- bin 是什么？

  npm 会在环境变量路径 /usr/local/bin 目录下（MAC）创建一个 symbolic，指向 bin 字段中声明的文件，这样在当前用户任意目录下，都可以方便的使用 bin 属性中定义的命令。

- #!/usr/bin/env node 是什么？

  #!表示该文件是个可执行文件，/usr/bin/env node 表示这个文件需要使用 node 来执行

以上两个知识点就构成了一个 nodejs 全局命令所需要的所有元素，使用 bin 来创建一个全局环境变量的映射，当检测到bin 中的命令时去执行 bin 字段中的文件，找到这个文件时发现这个文件是以 #! 开头，后面跟着 /usr/bin/env node 表示这个文件是个可执行文件且需要使用 node 执行。意思就是当你在命令行中输入 hc 时系统就会用 nodejs 去执行 ./main.js 这个文件。

### 议题3：介绍微信小程序提供的工具包 miniprogram-ci

miniprogram-ci 目前提供以下能力：

1. 上传代码，对应小程序开发者工具的上传

2. 预览代码，对应小程序开发者工具的预览

3. 构建 npm，对应小程序开发者工具的: 菜单 - 工具 - 构建npm

4. 上传云开发云函数代码，对应小程序开发者工具的上传云函数能力

5. 上传云托管代码，对应小程序开发者工具的上传云托管能力

6. 上传云存储/静态托管文件，对应小程序开发者工具 - 云开发 - 云存储和静态托管文件管理

7. 代理，配置 miniprogram-ci 的网络请求代理方式

8. 支持获取最近上传版本的 sourceMap

9. 支持 node 脚本调用方式和 命令行 调用方式

#### 官方文档

[概述 | 微信开放文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)



#### 简易演示

```TypeScript
// 上传一个版本到小程序后台
const ci = require('miniprogram-ci');
(async () => {
  const project = new ci.Project({
    appid: 'wxsomeappid',
    type: 'miniProgram',
    projectPath: 'the/project/path',
    privateKeyPath: 'the/path/to/privatekey',
    ignores: ['node_modules/**/*'],
  })
  const uploadResult = await ci.upload({
    project,
    version: '1.1.1',
    desc: 'hello',
    setting: {
      es6: true,
    },
    onProgressUpdate: console.log,
  })
  console.log(uploadResult)
})()
```

### 议题4：介绍工具包 shelljs 和 commander

#### 掘金教程

[使用ShellJS提升你的开发效率（一） - 掘金](https://juejin.cn/post/6844903847064764429?share_token=0acabaf9-2e62-4c64-83c1-ceb801323f0d)

#### 简易演示

```TypeScript
#! /usr/bin/env node
const program = require('commander')

program
.version('0.1.0')
.command('create <name>')
.description('create a new project')
.action(name => { 
    // 打印命令行输入的值
    console.log("project name is " + name)
})

program.parse()
```

以上代码运行 hc create wangduan 将会在命令行中输出 project name is wangduan

```TypeScript
//引入shelljs
var shell = require('shelljs')

//检查控制台是否以运行`npm`开头的命令
if (!shell.which('npm')) {
  //在控制台输出内容
  shell.echo('Sorry, this script requires npm');
  shell.exit(1);
}

// 以下代码不报错将在命令行输出 npm 版本
if(shell.exce('npm -v').code !== 0) {
  shell.echo('error: run npm -v');
  shell.exit(1);
}
```

以上代码会检测当前设备能不能运行 npm 这个命令如果不能运行则退出命令行，如果能运行就执行 npm -v 如果此命令运行不报错则输出 npm 版本，如果改名运行报错则在命令行输出 error: run npm -v 

### 议题5：介绍我的 cli 工具

以下是项目地址，但目前还没有添加上面我们提到的场景，目前只做了小程序的 ci 集成，我希望的是把这个 cli 做成个公司通用的 cli 工具集。

[王端/hcli](https://gitee.com/wang_duan/hc.git)

#### 安装教程

##### 开发安装

10. 获取本项目 `git clone xxx`

11. 推荐使用 `pnpm i` 当然也可以使用 `yarn` 或者 `npm i`

12. 进入项目执行 `npm link`

13. 然后你就可以全局使用我们的工具试试 `hcgo -h`

##### 使用安装

如果你只想简单的使用，你只需要 `npm i git+https://gitee.com/wang_duan/hc.git -g` 即可全局使用 `hcgo -h`

公司项目放入 npm 里面没有什么意义，大家直接使用 git 仓库即可。同时你又get到了一个知识点，原来 npm 还可以直接安装git仓库的包！

#### 使用说明

```TypeScript
Usage: index [options] [command]

本项目适用于海鹚区域项目,可通过一个cli运行所有海鹚区域的项目。

Options:  
-v,--version    查看当前cli版本  
-h,--help       显示帮助信息  

Commands:  
build [options] 打包运行项目，通过 -env 指定环境
watch [options] 监听运行项目，通过 -env 指定环境
publish [options]  publish 发布项目禁止指定环境
help [command]  你可以尝试一下 hcgo help build
```

每个命令都可以查看帮助信息，你可以在终端输入 `hcgo help build` 查看示例

##### 参数解释

|子命令|说明|备注|
|-|-|-|
|watch|监听运行测试环境微信小程序|一般用于开发时使用|
|build|执行正正式境微信小程序打包|一般用于提测时使用（[需要配置 key](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)）|
|publish|发布到微信小程序体验版|一般用于发布时使用（开发中）|

开发（watch）

|说明|命令|备注|
|-|-|-|
|运行测试环境|`hcgo watch --dir=p099`|默认测试环境首页|
|运行正式环境|`hcgo watch --dir=p099 --env=prod`|--env指定环境 --dir指定项目|

提测（build）

|说明|命令|备注|
|-|-|-|
|发布体验版|`hcgo build --dir=p099`|默认测试环境首页|
|生成二维码|`hcgo build --env=prod --path=pages\home\idnex --dir=p099`|--env指定环境 --path指定路径 --dir指定项目|

发布（publish）

|说明|命令|备注|
|-|-|-|
|发布|`hcgo publish --dir=p099`|默认发布到正式环境|

## 会议结论：

- 在我们的开发过程中有很多打断我们工作的事情，如果可以的话能自动化完成的流程我们应该尽可能让其自动完成

- 下载代码、装包、构建、发版完全可以通过一条自动化命令来实现的

- shelljs 可以运行下载代码、运行项目构建命令等

- commander 可以获取我们的参数，比如运行平台（例：weapp）、运行项目dir、运行环境env等

- miniprogram-ci 可以帮我们构建小程序，同时生成二维码

- 通过自动化的 cli 工具帮我们处理一些碎片化的工作可以让我们把精力更集中在项目中去

## 参考文档：

[shelljs 中文参考文档](https://juejin.cn/post/6844903847064764429)

[commander 中文参考文档](https://juejin.cn/post/6844903857324064782)

[miniprogram-ci 官方文档](https://developers.weixin.qq.com/miniprogram/dev/devtools/ci.html)

[如何构建自己的 cli 工具](https://juejin.cn/post/6966119324478079007#heading-21)



