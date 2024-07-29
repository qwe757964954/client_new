import { _decorator, color, Label, Node, Prefab, ScrollView, Sprite, SpriteFrame } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, EditType } from '../../manager/DataMgr';
import { BuildingIDType, BuildingState } from '../../models/BuildingModel';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { EditItem, EditItemInfo } from '../map/EditItem';
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
    @property(Node)
    public btnSave: Node = null;//保存按钮
    @property(Node)
    public btnLast: Node = null;//上一步按钮
    @property(Node)
    public btnNext: Node = null;//下一步按钮
    @property(Label)
    public labelStep: Label = null;//步骤
    @property(Node)
    public plBaseColor: Node = null;//底格颜色开关
    @property(Sprite)
    public imgBaseColor: Sprite = null;//底格颜色图片
    @property(Sprite)
    public imgBaseColor2: Sprite = null;//底格颜色图片2
    @property([SpriteFrame])
    public spriteFramesBaseColor: SpriteFrame[] = [];//底格颜色图片资源

    private _mainScene: MainScene = null;//主场景
    private _editType: EditType = null;//编辑类型
    private _lastSelect: Sprite = null;//上次选中
    private _itemsData: EditItemInfo[] = null;//编辑数据
    private _isBaseColor: boolean = false;//底格颜色开关
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
        CCUtil.onTouch(this.btnLast, this.onBtnLastClick, this);
        CCUtil.onTouch(this.btnNext, this.onBtnNextClick, this);
        CCUtil.onTouch(this.btnSave, this.onBtnSaveClick, this);
        CCUtil.onTouch(this.plBaseColor, this.onBaseColorClick, this);

        this.addEvent(EventType.EditUIView_Refresh, this.onRefresh.bind(this));
        this.addEvent(EventType.Building_Step_Update, this.updateStep.bind(this));
    }

    // 移除监听
    removeEvent() {
        CCUtil.offTouch(this.btnAll, this.onBtnAllClick, this);
        CCUtil.offTouch(this.btnSpecial, this.onBtnSpecialClick, this);
        CCUtil.offTouch(this.btnBuiding, this.onBtnBuidingClick, this);
        CCUtil.offTouch(this.btnDecoration, this.onBtnDecorationClick, this);
        CCUtil.offTouch(this.btnLand, this.onBtnLandClick, this);
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.offTouch(this.btnLast, this.onBtnLastClick, this);
        CCUtil.offTouch(this.btnNext, this.onBtnNextClick, this);
        CCUtil.offTouch(this.btnSave, this.onBtnSaveClick, this);
        CCUtil.offTouch(this.plBaseColor, this.onBaseColorClick, this);

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
        this._mainScene.cancelEvent();
    }
    /**保存按钮点击 */
    onBtnSaveClick() {
        this._mainScene.confirmEvent();
    }
    /**上一步按钮点击 */
    onBtnLastClick() {
        this._mainScene.prevStepEvent();
        this.updateStep();
    }
    /**下一步按钮点击 */
    onBtnNextClick() {
        this._mainScene.nextStepEvent();
        this.updateStep();
    }
    protected onEnable(): void {
        this.initData();
        this.initEvent();
        this.updateStep();
        this.showBtnBaseColor();
    }
    protected onDisable(): void {
        if (this._isBaseColor) {
            this._mainScene.changeBaseColor(false);
        }
        this.removeEvent();
    }
    // 初始化数据
    initData() {
        this._isBaseColor = false;
        this._editType = null;
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
        if (!this._mainScene || editType == this._editType) return;
        this._editType = editType;

        let editConfig = DataMgr.instance.editInfo;
        this._itemsData = [];
        editConfig.forEach(info => {
            if (editType != EditType.Null && editType != info.type) return;
            if (BuildingIDType.mine == info.id) return;//矿山，需特殊处理
            if (EditType.Land == info.type) {
                this._itemsData.push(new EditItemInfo(info));
            } else {
                let recycleData = this._mainScene.findRecycleDataByBid(info.id)
                if (recycleData) {
                    let itemInfo = new EditItemInfo(info);
                    itemInfo.needBuilt = BuildingState.unBuilding == recycleData.data.state;
                    this._itemsData.push(itemInfo);
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
    /**更新步骤 */
    updateStep() {
        let str;
        if (this._mainScene) {
            str = ToolUtil.replace(TextConfig.Queue_Text, this._mainScene.getStep(), this._mainScene.getTotalStep());
        } else {
            str = "0/0";
        }
        this.labelStep.string = str;
    }
    public get isBaseColor() {
        return this._isBaseColor;
    }
    /**底格颜色开关点击 */
    onBaseColorClick() {
        this._isBaseColor = !this._isBaseColor;
        this.showBtnBaseColor();
        this._mainScene?.changeBaseColor(this._isBaseColor);
    }
    /**底格颜色开关显示 */
    showBtnBaseColor() {
        if (this._isBaseColor) {
            this.imgBaseColor.spriteFrame = this.spriteFramesBaseColor[0];
            this.imgBaseColor2.spriteFrame = this.spriteFramesBaseColor[1];
        } else {
            this.imgBaseColor.spriteFrame = this.spriteFramesBaseColor[2];
            this.imgBaseColor2.spriteFrame = this.spriteFramesBaseColor[3];
        }
    }
}


