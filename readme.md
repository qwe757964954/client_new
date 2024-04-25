cocos/ui/editbox/edit-box-impl.ts

EditBoxImpl方法init最后 增加
    screenAdapter.on('window-resize', this._resize, this);
EditBoxImpl方法clear最前面 增加
    View.instance.off('canvas-resize', this._resize, this);
    screenAdapter.off('window-resize', this._resize, this);

注意：修改引擎代码后记得编译才能生效