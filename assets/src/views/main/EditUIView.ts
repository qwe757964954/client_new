import { _decorator, color, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame } from 'cc';
import { EventType } from '../../config/EventType';
import { MapStatus } from '../../config/MapConfig';
import { DataMgr, EditInfo, EditType } from '../../manager/DataMgr';
import { BuildingIDType } from '../../models/BuildingModel';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { EditItem } from '../map/EditItem';
import { MainScene } from './MainScene';
const { ccclass, property } = _decorator;

@ccclass('EditUIView')
export class EditUIView extends BaseComponent {
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
    public scrollContent: Node = null;//滚动视图容器
    @property(ScrollView)
    public scrollView: ScrollView = null;//滚动视图
    @property([SpriteFrame])
    public spriteFrames: SpriteFrame[] = [];//图片资源
    @property(List)
    public listView: List = null;//列表


    private _mainScene: MainScene = null;//主场景
    private _isFirst: boolean = true;//是否是第一次
    private _editType: EditType = null;//编辑类型
    private _lastSelect: Sprite = null;//上次选中
    private _itemsData: EditInfo[] = null;//编辑数据
    //设置主场景
    public set mainScene(mainScene: MainScene) {
        this._mainScene = mainScene;
        this.showEditType(EditType.Null);
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this.btnAll, this.onBtnAllClick, this);
        CCUtil.onTouch(this.btnSpecial, this.onBtnSpecialClick, this);
        CCUtil.onTouch(this.btnBuiding, this.onBtnBuidingClick, this);
        CCUtil.onTouch(this.btnDecoration, this.onBtnDecorationClick, this);
        CCUtil.onTouch(this.btnLand, this.onBtnLandClick, this);
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);

        this.addEvent(EventType.EditUIView_Refresh, this.onRefresh.bind(this));
    }

    // 移除监听
    removeEvent() {
        CCUtil.offTouch(this.btnAll, this.onBtnAllClick, this);
        CCUtil.offTouch(this.btnSpecial, this.onBtnSpecialClick, this);
        CCUtil.offTouch(this.btnBuiding, this.onBtnBuidingClick, this);
        CCUtil.offTouch(this.btnDecoration, this.onBtnDecorationClick, this);
        CCUtil.offTouch(this.btnLand, this.onBtnLandClick, this);
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);

        this.clearEvent();
    }
    //销毁
    onDestroy() {
    }
    // 标题所有按钮点击 
    onBtnAllClick() {
        this.selectBtn(this.btnAll);
        this.showEditType(EditType.Null);
    }
    // 标题特殊按钮点击 
    onBtnSpecialClick() {
        this.selectBtn(this.btnSpecial);
        this.showEditType(EditType.Buiding);
    }
    // 标题建筑按钮点击 
    onBtnBuidingClick() {
        this.selectBtn(this.btnBuiding);
        this.showEditType(EditType.LandmarkBuiding);
    }
    // 标题装饰按钮点击 
    onBtnDecorationClick() {
        this.selectBtn(this.btnDecoration);
        this.showEditType(EditType.Decoration);
    }
    // 标题地块按钮点击 
    onBtnLandClick() {
        this.selectBtn(this.btnLand);
        this.showEditType(EditType.Land);
    }
    // 关闭按钮点击 
    onBtnCloseClick() {
        this._mainScene.changeMapStatus(MapStatus.DEFAULT);
    }
    protected onEnable(): void {
        this.initData();
        this.initEvent();
    }
    protected onDisable(): void {
        this.removeEvent();
    }
    // 初始化数据
    initData() {
        this.selectBtn(this.btnAll);
        this.showEditType(EditType.Null);
    }
    // 编辑元素点击
    onEditItemClick(editItem: EditItem) {
        this._mainScene.onBuildLandClick(editItem.data);
        this.onRefresh();
    }
    /**显示对应编辑类型 */
    showEditType(editType: EditType) {
        if (!this._mainScene) return;
        if (editType == this._editType) return;
        this._editType = editType;

        let editConfig = DataMgr.instance.editInfo;
        this._itemsData = [];
        editConfig.forEach(info => {
            if (editType != EditType.Null && editType != info.type) return;
            if (BuildingIDType.mine == info.id) return;//矿山，需特殊处理
            if (EditType.Decoration == info.type || EditType.Land == info.type) {
                this._itemsData.push(info);
            } else {
                let ary = this._mainScene.findAllBuilding(info.id);
                if (!ary || ary.length <= 0) {
                    this._itemsData.push(info);
                }
            }
        });
        this.listView.numItems = this._itemsData.length;
        // this.listView.scrollTo(0, 0);
    }
    /**选中按钮 */
    selectBtn(btn: Sprite) {
        if (btn == this._lastSelect) return;
        if (this._lastSelect) {
            this._lastSelect.getComponentInChildren(Label).color = color("#FFFFFF");
            this._lastSelect.spriteFrame = this.spriteFrames[1];
        }
        btn.getComponentInChildren(Label).color = color("#72320F");
        btn.spriteFrame = this.spriteFrames[0];
        this._lastSelect = btn;
    }
    /**加载显示 */
    onLoadItem(item: Node, idx: number) {
        let info = this._itemsData[idx];
        item.getComponent(EditItem).initData(info, this.onEditItemClick.bind(this));
    }
    /**刷新 */
    onRefresh() {
        console.log("onRefresh", this._editType);
        let editType = this._editType;
        this._editType = null;
        this.showEditType(editType);
    }
}


