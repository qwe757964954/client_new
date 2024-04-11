import { _decorator, Asset, Component, Node, Sprite, SpriteFrame, UITransform, Vec3 } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { EditInfo } from '../../config/MapConfig';
const { ccclass, property } = _decorator;

@ccclass('EditItem')
export class EditItem extends Component {
    @property(Sprite)
    public img:Sprite = null;//图片
    
    private _data:EditInfo = null;//数据
    private _clickCall:Function = null;//点击回调
    private _loadAssetAry:Asset[] = [];//加载资源数组

    start(): void {
        this.initEvent();
    }
    get data():EditInfo{
        return this._data;
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this.node, this.onItemClick, this);
    }
    // 移除监听
    removeEvent() {
        CCUtil.offTouch(this.node, this.onItemClick, this);
    }
    // 销毁
    protected onDestroy(): void {
        this.removeEvent();
        LoadManager.releaseAssets(this._loadAssetAry);
        this._loadAssetAry = [];
    }

    // 初始化
    public initData(info:EditInfo, clickCall:Function):void {
        this._data = info;
        this._clickCall = clickCall;
        LoadManager.load(info.path, SpriteFrame).then((spriteFrame:SpriteFrame) => {
            this.img.spriteFrame = spriteFrame;
            this._loadAssetAry.push(spriteFrame);
            this.fixImg();
        });
    }
    // 点击
    public onItemClick():void {
        if(this._clickCall){
            this._clickCall(this);
        }
    }
    // 修复图片大小
    public fixImg():void {
        let scale = new Vec3(1.0, 1.0, 1.0);
        let selfTransform = this.getComponent(UITransform);
        let transform = this.img.getComponent(UITransform);
        let scaleX = selfTransform.width / transform.width;
        let scaleY = selfTransform.height / transform.height;
        if(scaleX >= 1.0 && scaleY >= 1.0) return;
        let minScale = Math.min(scaleX, scaleY);
        scale.x *= minScale;
        scale.y *= minScale;
        this.img.node.scale = scale;
    }
}


