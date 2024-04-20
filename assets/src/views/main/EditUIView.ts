import { _decorator, Component, instantiate, Node, Prefab, Sprite } from 'cc';
import CCUtil from '../../util/CCUtil';
import { MapConfig, MapStatus } from '../../config/MapConfig';
import { MainScene } from './MainScene';
import { EditItem } from '../map/EditItem';
import { DataMgr } from '../../manager/DataMgr';
const { ccclass, property } = _decorator;

@ccclass('EditUIView')
export class EditUIView extends Component {
    @property(Sprite)
    public btnAll: Sprite = null;//标题所有按钮
    @property(Sprite)
    public btnSpecial: Sprite = null;//标题特殊按钮
    @property(Sprite)
    public btnBuiding: Sprite = null;//标题建筑按钮
    @property(Sprite)
    public btnDecoration: Sprite = null;//标题装饰按钮
    @property(Sprite)
    public btnLand: Sprite = null;//标题地块按钮
    @property(Sprite)
    public btnClose: Sprite = null;//关闭按钮
    @property(Prefab)
    public editItem: Prefab = null;//编辑元素预制体
    @property(Node)
    public scrollView: Node = null;//滚动视图


    private _mainScene: MainScene = null;//主场景
    start() {
        this.initEvent();
    }
    //设置主场景
    public set mainScene(mainScene: MainScene) {
        this._mainScene = mainScene;
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this.btnAll, this.onBtnAllClick, this);
        CCUtil.onTouch(this.btnSpecial, this.onBtnSpecialClick, this);
        CCUtil.onTouch(this.btnBuiding, this.onBtnBuidingClick, this);
        CCUtil.onTouch(this.btnDecoration, this.onBtnDecorationClick, this);
        CCUtil.onTouch(this.btnLand, this.onBtnLandClick, this);
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
    }

    // 移除监听
    removeEvent() {
        CCUtil.offTouch(this.btnAll, this.onBtnAllClick, this);
        CCUtil.offTouch(this.btnSpecial, this.onBtnSpecialClick, this);
        CCUtil.offTouch(this.btnBuiding, this.onBtnBuidingClick, this);
        CCUtil.offTouch(this.btnDecoration, this.onBtnDecorationClick, this);
        CCUtil.offTouch(this.btnLand, this.onBtnLandClick, this);
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
    }
    //销毁
    onDestroy() {
        this.removeEvent();
    }
    // 标题所有按钮点击 
    onBtnAllClick() {

    }
    // 标题特殊按钮点击 
    onBtnSpecialClick() {

    }
    // 标题建筑按钮点击 
    onBtnBuidingClick() {

    }
    // 标题装饰按钮点击 
    onBtnDecorationClick() {

    }
    // 标题地块按钮点击 
    onBtnLandClick() {
    }
    // 关闭按钮点击 
    onBtnCloseClick() {
        this._mainScene.changeMapStatus(MapStatus.DEFAULT);
    }
    protected onEnable(): void {
        this.initData();
    }
    protected onDisable(): void {
    }
    // 初始化数据
    initData() {
        this.scrollView.removeAllChildren();
        let editConfig = DataMgr.instance.editInfo;
        for (let key in editConfig) {
            if (Object.prototype.hasOwnProperty.call(editConfig, key)) {
                let info = editConfig[key];
                let node = instantiate(this.editItem);
                this.scrollView.addChild(node);
                node.getComponent(EditItem).initData(info, this.onEditItemClick.bind(this));
            }
        }
    }
    // 编辑元素点击
    onEditItemClick(editItem: EditItem) {
        this._mainScene.onBuidLandClick(editItem.data);
    }
}


