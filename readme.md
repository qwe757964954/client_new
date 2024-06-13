## 修改引擎
<font color=FF0000> 修改引擎代码后记得编译才能生效 </font>

### 编辑器editbox报错
##### error: [Scene] Cannot read property 'node' of null，TypeError: Cannot read property 'node' of null
[Fix removing listener when editbox is closed](https://github.com/cocos/cocos-engine/pull/16648/files)
[Modify editbox to update dom coordinates after update](https://github.com/cocos/cocos-engine/pull/16768/files)

## 打包脚本
1. 打包资源和脚本
2. 打渠道包
windows下双击automation.bat选择执行

### 介绍
#### 1. assets/
脚本、图片、音效等
##### 1.1. res/
静态资源
##### 1.2. resources/
代码中动态加载的资源
##### 1.3. src/
脚本
#### 2. config/
工程配置信息
#### 3. extensions/
工程插件
#### 4. native/ 
ios、android非引擎代码
#### 5. updateDatas/ 
热更新数据
#### 6. ./automation.py
打热更新包、打渠道包，自动化脚本


<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [脚本文档](#脚本文档)
    - [1. config](#1-config)
        - [1.1. EventType](#11-eventtype)
        - [1.2. KeyConfig](#12-keyconfig)
        - [1.3. MapConfig](#13-mapconfig)
        - [1.4. NetConfig](#14-netconfig)
        - [1.5. PetConfig](#15-petconfig)
        - [1.6. PrefabType](#16-prefabtype)
        - [1.7. PropConfig](#17-propconfig)
        - [1.8. TextConfig](#18-textconfig)
    - [2. manager](#2-manager)
        - [2.1. DataMgr](#21-datamgr)
    - [3. models](#3-models)
        - [3.1. AdventureModel](#31-adventuremodel)
    - [4. net](#4-net)
        - [4.1. HttpManager](#41-httpmanager)
        - [4.2. InterfacePath](#42-interfacepath)
        - [4.3. NetManager](#43-netmanager)
        - [4.4. ServiceManager](#44-servicemanager)
        - [4.5. Socket](#45-socket)
    - [5. script](#5-script)
        - [5.1. BgWidthScript](#51-bgwidthscript)
    - [6. service](#6-service)
        - [6.1. AccountService](#61-accountservice)
    - [7. util](#7-util)
        - [7.1. AudioUtil](#71-audioutil)
    - [8. views](#8-views)
    - [9. AppConfig.ts](#9-appconfigts)
    - [10. ChannelInfo.ts](#10-channelinfots)
    - [11. DebugConfig.ts](#11-debugconfigts)
    - [12. GlobalConfig.ts](#12-globalconfigts)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# 脚本文档
### 1. config
##### 1.1. EventType
事件通知类型
##### 1.2. KeyConfig
持久化数据key
##### 1.3. MapConfig
地图相关配置、定义
##### 1.4. NetConfig
网络地址相关配置
##### 1.5. PetConfig
精灵相关配置、定义
##### 1.6. PrefabType
预制体相关配置
##### 1.7. PropConfig
道具相关定义
##### 1.8. TextConfig
文本配置
### 2. manager
##### 2.1. DataMgr
数据管理类，管理所有加载的json数据
### 3. models
##### 3.1. AdventureModel
单词大冒险、教材单词相关定义
### 4. net
##### 4.1. HttpManager
所有http请求管理类 
##### 4.2. InterfacePath
所有socket消息命令定义
##### 4.3. NetManager
网络管理类，连接、重连
##### 4.4. ServiceManager
消息管理类，各个模块的消息对象管理
##### 4.5. Socket
基础socket类
### 5. script
##### 5.1. BgWidthScript
自动适配背景图片
### 6. service
##### 6.1. AccountService
账号相关消息服务
### 7. util
##### 7.1. AudioUtil
音乐、音效工具
### 8. views
所有预制体挂载脚本
### 9. AppConfig.ts
资源版本号，热更新时会修改
### 10. ChannelInfo.ts
渠道信息，所有渠道相关配置，特殊逻辑定义可以定义在这个文件里面
### 11. DebugConfig.ts
测试相关定义，例如打印、FPS、测试服等(不允许修改上传)
### 12. GlobalConfig.ts
全局的一些配置，例如版本、渠道、分辨率等