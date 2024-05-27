## 修改引擎
<font color=FF0000> 修改引擎代码后记得编译才能生效 </font>

### 编辑器editbox报错
#### cocos/ui/editbox/edit-box-impl.ts
EditBoxImpl方法init最后 增加
```
screenAdapter.on('window-resize', this._resize, this);
```
EditBoxImpl方法clear最前面 增加
```
View.instance.off('canvas-resize', this._resize, this);
screenAdapter.off('window-resize', this._resize, this);
```

## 打包脚本
1. 打包资源和脚本
2. 打渠道包
windows下双击automation.bat选择执行