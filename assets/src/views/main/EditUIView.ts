import { _decorator, color, EventTouch, Label, Node, Sprite, SpriteFrame, tween } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import { DataMgr, EditType, EditTypeInfo, ThemeInfo } from '../../manager/DataMgr';
import { BuildingIDType, BuildingState } from '../../models/BuildingModel';
import { BaseComponent } from '../../script/BaseComponent';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ToolUtil } from '../../util/ToolUtil';
import { EditItem, EditItemInfo } from '../map/EditItem';
import { MainScene } from './MainScene';
const { ccclass, property } = _decorator;

const ThemeType_ALL = 0;

@ccclass('EditUIView')
export class EditUIView extends BaseComponent {
    @property(Sprite)
    public btnClose: Sprite = null;//关闭按钮
    @property([SpriteFrame])
    public spriteFrames: SpriteFrame[] = [];//图片资源
    @property(List)
    public typeList: List = null;//类型列表
    @property(List)
    public listView: List = null;//编辑列表
    @property(List)
    public themeList: List = null;//主题列表
    @property(Node)
    public plTouch: Node = null;//触摸层
    @property(Node)
    public btnTheme: Node = null;//主题按钮
    @property(Label)
    public labelTheme: Label = null;//主题名称
    @property(Node)
    public imgArrow: Node = null;//箭头
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
    private _themeType: number = ThemeType_ALL;//主题类型
    private _lastSelect: Node = null;//上次选中
    private _lastTheme: Node = null;//上次主题
    private _itemsData: EditItemInfo[] = null;//编辑数据
    private _isBaseColor: boolean = false;//底格颜色开关
    private _typesData: EditTypeInfo[] = null;//类型数据
    private _themesData: ThemeInfo[] = null;//主题数据

    //设置主场景
    public set mainScene(mainScene: MainScene) {
        this._mainScene = mainScene;
        this.initEditType();
        this.showEditType(EditType.Null);
        this.initTheme();
    }
    // 初始化事件
    initEvent() {
        CCUtil.onTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.onTouch(this.btnLast, this.onBtnLastClick, this);
        CCUtil.onTouch(this.btnNext, this.onBtnNextClick, this);
        CCUtil.onTouch(this.btnSave, this.onBtnSaveClick, this);
        CCUtil.onTouch(this.plBaseColor, this.onBaseColorClick, this);
        CCUtil.onTouch(this.btnTheme, this.onBtnThemeClick, this);
        CCUtil.onTouch(this.plTouch, this.onTouchLayerClick, this);

        this.addEvent(EventType.EditUIView_Refresh, this.onRefresh.bind(this));
        this.addEvent(EventType.Building_Step_Update, this.updateStep.bind(this));
    }

    // 移除监听
    removeEvent() {
        CCUtil.offTouch(this.btnClose, this.onBtnCloseClick, this);
        CCUtil.offTouch(this.btnLast, this.onBtnLastClick, this);
        CCUtil.offTouch(this.btnNext, this.onBtnNextClick, this);
        CCUtil.offTouch(this.btnSave, this.onBtnSaveClick, this);
        CCUtil.offTouch(this.plBaseColor, this.onBaseColorClick, this);
        CCUtil.offTouch(this.btnTheme, this.onBtnThemeClick, this);
        CCUtil.offTouch(this.plTouch, this.onTouchLayerClick, this);

        this.clearEvent();
    }
    //销毁
    onDestroy() {
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
        this.onBtnTypeClickEx(this.typeList.getItemByListId(0));
    }
    /**初始化类型 */
    initEditType() {
        let tempTypeInfo = new EditTypeInfo();
        tempTypeInfo.id = EditType.Null;
        tempTypeInfo.name = "全部";
        this._typesData = [tempTypeInfo];
        DataMgr.editTypeConfig.forEach(info => {
            this._typesData.push(info);
        });
        this.typeList.numItems = this._typesData.length;
    }
    /**初始化主题 */
    initTheme() {
        let tempThemeInfo = new ThemeInfo();
        tempThemeInfo.id = 0;
        tempThemeInfo.name = "所有主题";
        this._themesData = [tempThemeInfo];
        DataMgr.themeConfig.forEach(info => {
            this._themesData.push(info);
        });
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

        this.showEditBuild();
    }
    /**显示编辑建筑 */
    showEditBuild() {
        let editConfig = DataMgr.instance.editInfo;
        this._itemsData = [];
        editConfig.forEach(info => {
            if (this._editType != EditType.Null && this._editType != info.type) return;
            if (this._themeType != ThemeType_ALL && this._themeType != info.theme) return;
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
    /**类型加载 */
    onLoadTypeList(node: Node, idx: number) {
        node["idx"] = idx;
        node.getComponentInChildren(Label).string = this._typesData[idx].name;
        CCUtil.offTouch(node, this.onBtnTypeClick, this);
        CCUtil.onTouch(node, this.onBtnTypeClick, this);
    }
    /**主题加载 */
    onLoadThemeList(node: Node, idx: number) {
        console.log("onLoadThemeList", idx);
        node["idx"] = idx;
        node.getComponentInChildren(Label).string = this._themesData[idx].name;
        CCUtil.offTouch(node, this.onThemeClick, this);
        CCUtil.onTouch(node, this.onThemeClick, this);
    }
    /**主题按钮点击 */
    onBtnThemeClick() {
        if (this.plTouch.active) {
            this.onTouchLayerClick();
        } else {
            this.plTouch.active = true;
            this.themeList.node.active = true;
            this.themeList.numItems = this._themesData.length;
            // this.themeList.scrollTo(0, 0);
            tween(this.imgArrow).to(0.1, { angle: 180 }).start();
        }
    }
    /**类型按钮点击 */
    onBtnTypeClick(event: EventTouch) {
        let node = event.currentTarget;
        this.onBtnTypeClickEx(node);
    }
    onBtnTypeClickEx(node: Node) {
        if (!node || node == this._lastSelect) return;
        if (this._lastSelect) {
            this._lastSelect.getComponentInChildren(Label).color = color("#FFFFFF");
            this._lastSelect.getComponent(Sprite).spriteFrame = this.spriteFrames[1];
        }
        node.getComponentInChildren(Label).color = color("#72320F");
        node.getComponent(Sprite).spriteFrame = this.spriteFrames[0];
        this._lastSelect = node;

        let idx = node["idx"];
        this.showEditType(this._typesData[idx].id);
    }
    /**主题点击 */
    onThemeClick(event: EventTouch) {
        let node = event.currentTarget;
        this.onThemeClickEx(node);
    }
    onThemeClickEx(node: Node) {
        if (!node || node == this._lastTheme) return;
        this._lastTheme = node;

        let idx = node["idx"];
        this.showTheme(this._themesData[idx].id);
    }
    /**点击层点击 */
    onTouchLayerClick() {
        this.plTouch.active = false;
        this.themeList.node.active = false;
        tween(this.imgArrow).to(0.1, { angle: 0 }).start();
    }
    /**显示主题 */
    showTheme(themeType: number) {
        if (!this._mainScene || themeType == this._themeType) return;
        this._themeType = themeType;
        this.labelTheme.string = this._themesData[themeType].name;
        this.showEditBuild();
    }
}


