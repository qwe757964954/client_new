import { _decorator, Button, Component, instantiate, Node, Size, Sprite, UITransform } from 'cc';
import { PbConst } from '../../config/PbConst';
import { PrefabType } from '../../config/PrefabType';
import { ChangeHeadTypeEnum, SettingConfig } from '../../config/SettingConfig';
import { LoadManager } from '../../manager/LoadManager';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import ImgUtil from '../../util/ImgUtil';
const { ccclass, property } = _decorator;

@ccclass('ChangeHeadView')
export class ChangeHeadView extends Component {

    @property(Button)
    public headBtn: Button = null;       // 头像按钮
    @property(Button)
    public headBoxBtn: Button = null;    // 头像框按钮

    @property(Node)
    public headList: Node = null;        // 头像节点
    @property(Node)
    public headBoxList: Node = null;     // 头像框节点
    @property(Node)
    public headContent: Node = null;     // 头像容器节点
    @property(Node)
    public headBoxContent: Node = null;  // 头像框容器节点

    @property(Node)
    public item: Node = null;            // item

    @property(Sprite)
    public preHeadBox: Sprite = null;    // 预览的头像框
    @property(Sprite)
    public preHead: Sprite = null;       // 预览的头像

    private _myList: any = null;  // 我的道具信息
    private _curSwitchTab: number = ChangeHeadTypeEnum.Type_HeadBox; // 默认头像框

    start() {
        this._myList = [
            { ModuleId: 4, PropID: 800 }, { ModuleId: 4, PropID: 801 },
        ]
        this.init();
    }

    //销毁
    protected onDestroy(): void {
        this.releaseAsset();
    }
    // 释放资源
    public releaseAsset() {
    }
    //初始化
    public init(): void {
        this.initUI();
    }
    // 初始化UI
    initUI() {
        // 默认头像框
        this.switchUI(this._curSwitchTab);
        // 头像/框预览
        this.refreshPreHead(User.curHeadPropId);
        this.refreshPreHeadBox(User.curHeadBoxPropId);
    }
    //初始化事件
    public initEvent() {

    }
    //销毁事件
    public destoryEvent() {

    }

    // 关闭
    btnCloseFunc() {
        console.log("btnCloseFunc");
        ViewsManager.instance.closeView(PrefabType.ChangeHeadView);
    }
    // 头像框tab
    btnHeadBoxTabFunc() {
        console.log("btnHeadBoxTabFunc");
        // 切换头像UI
        this.switchUI(ChangeHeadTypeEnum.Type_HeadBox);
    }
    // 头像tab
    btnHeadTabFunc() {
        console.log("btnHeadTabFunc");
        // 切换头像框UI
        this.switchUI(ChangeHeadTypeEnum.Type_Head);
    }
    // 保存按钮
    btnSaveFunc() {
        console.log("btnSaveFunc");
    }
    // item按钮
    btnItemFunc(event: Event) {
        let btn = event.target as unknown as Button;
        console.log("btnHeadTabFunc btn.name = ", btn.name);
        if (this._curSwitchTab == ChangeHeadTypeEnum.Type_Head) {
            this.refreshPreHead(parseInt(btn.name));
        }
        else {
            this.refreshPreHeadBox(parseInt(btn.name));
        }
    }

    // 预览头像/框
    refreshPreHead(propId: number) {
        this.loadSpriteFrame(this.preHead, propId, ChangeHeadTypeEnum.Type_Head);
    }
    refreshPreHeadBox(propId: number) {
        this.loadSpriteFrame(this.preHeadBox, propId, ChangeHeadTypeEnum.Type_HeadBox);
    }

    switchUI(type: number) {
        this._curSwitchTab = type;
        switch (type) {
            case ChangeHeadTypeEnum.Type_HeadBox:
                this.headBoxBtn.interactable = false;
                this.headBtn.interactable = true;
                this.headList.active = false;
                this.headBoxList.active = true;
                const datas1 = [
                    { PropId: 800 }, { PropId: 801 }, { PropId: 802 }, { PropId: 803 }, { PropId: 804 }, { PropId: 805 }, { PropId: 806 },
                    // {PropId: 800}, {PropId: 801}, {PropId: 802}, {PropId: 803}, {PropId: 804}, {PropId: 805}, {PropId: 806}, 
                    // {PropId: 800}, {PropId: 801}, {PropId: 802}, {PropId: 803}, {PropId: 804}, {PropId: 805}, {PropId: 806}, 
                    // {PropId: 800}, {PropId: 801}, {PropId: 802}, {PropId: 803}, {PropId: 804}, {PropId: 805}, {PropId: 806}, 
                ]
                this.refreshListUI(this.headBoxContent, datas1, type);
                break;
            case ChangeHeadTypeEnum.Type_Head:
                this.headBoxBtn.interactable = true;
                this.headBtn.interactable = false;
                this.headList.active = true;
                this.headBoxList.active = false;
                const datas2 = [
                    { PropId: 101 }, { PropId: 102 }
                ]
                this.refreshListUI(this.headContent, datas2, type);
                break;
            default:
                break;
        }
    }

    refreshListUI(content: Node, datas: any, type: number) {
        content.removeAllChildren();
        this.item.active = true;
        for (let index = 0; index < datas.length; index++) {
            let data = datas[index];
            let copy = instantiate(this.item);
            content.addChild(copy);
            this.refreshItem(copy, data, type);
        }
        let height = Math.ceil(datas.length / 5) * 170 - 10;
        content.getComponent(UITransform).setContentSize(new Size(700, height));
        this.item.active = false;
    }

    refreshItem(item: Node, data, type: number) {
        item.name = data.PropId.toString();
        let icon = item.getChildByName("icon") as Node;
        let lock = item.getChildByName("lock") as Node;
        let using = item.getChildByName("using") as Node;
        // 使用中判断
        let curPropId = type == ChangeHeadTypeEnum.Type_Head ? User.curHeadPropId : User.curHeadBoxPropId;
        if (type == ChangeHeadTypeEnum.Type_Head) {
            using.active = !curPropId ? (data.PropId == SettingConfig.DefaultHeadBoxId) : (data.PropId == curPropId);
            lock.active = false;
        }
        else {
            using.active = !curPropId ? (data.PropId == SettingConfig.DefaultHeadId) : (data.PropId == curPropId);
            lock.active = !this.checkHave(data.PropId, SettingConfig.DefaultHeadId, PbConst.PropTypeEnum.Headbox);
        }
        // using.active = false;
        data.isLock = lock.active;
        this.loadSpriteFrame(icon.getComponent(Sprite), data.PropId, type);
    }

    loadSpriteFrame(icon: Sprite, propId: number, type: number) {
        let url = ImgUtil.getPropImgUrl(propId);
        if (type == ChangeHeadTypeEnum.Type_Head) {
            url = ImgUtil.getAvatarUrl(propId);
        }
        LoadManager.loadSprite(url, icon);
    }

    checkHave(propId: number, id: number, propTypeEnum) {
        if (propId == id) return true;
        if (!this._myList) return false;
        for (let i = 0; i < this._myList.length; i++) {
            if (this._myList[i].ModuleId == propTypeEnum && this._myList[i].PropID == propId) {
                return true;
            }
        }
        return false;
    }
}


