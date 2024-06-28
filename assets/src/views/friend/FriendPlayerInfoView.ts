import { _decorator, Button, instantiate, Label, Layers, Node, Prefab, Sprite, UITransform, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { FriendListItemModel, SystemMailItem } from '../../models/FriendModel';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { BaseView } from '../../script/BaseView';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { NodeUtil } from '../../util/NodeUtil';
import { ObjectUtil } from '../../util/ObjectUtil';
import { RewardItem } from '../common/RewardItem';

const { ccclass, property } = _decorator;

@ccclass('FriendPlayerInfoView')
export class FriendPlayerInfoView extends BaseView {
    @property(Node)
    public btnTalk: Node = null; // 对话按钮

    @property(Node)
    public btnHouse: Node = null; // 返回家园按钮

    @property(Node)
    public btnDelete: Node = null; // 删除好友按钮

    @property(Node)
    public roleInfoBox: Node = null; // 角色信息容器

    @property(Node)
    public msgInfoBox: Node = null; // 消息信息容器

    @property(Label)
    public labelName: Label = null; // 名字标签

    @property(Label)
    public labeStatus: Label = null; // 状态标签

    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property({ type: Prefab, tooltip: "角色动画预制体" })
    public roleModel: Prefab = null; // 角色动画预制体

    @property(List)
    public awardList: List = null; // 奖励列表

    @property(Node)
    public reciveBtn: Node = null; // 接收按钮

    private _data: FriendListItemModel = null;
    private _msgData: SystemMailItem = null;
    private _propsData: ItemData[] = [];

    updateData(data: FriendListItemModel) {
        this._data = data;
        this.showRoleInfo();
    }

    updateMessageData(data: SystemMailItem) {
        this._msgData = data;
        this.showMessageInfo();
    }

    private showRoleInfo() {
        this.setActiveView(true);
        this.labelName.string = this._data.user_name;
        this.loadRoleModel();
    }

    private showMessageInfo() {
        this.setActiveView(false);
        const fromLabel = this.getChildLabelByName(this.msgInfoBox, "fromTxt");
        fromLabel.string = this._msgData.title;
        const msgLabel = this.getChildLabelByName(this.msgInfoBox, "msgTxt");
        msgLabel.string = this._msgData.content;

        this._propsData = ObjectUtil.convertAwardsToItemData(this._msgData.awards);
        this.awardList.numItems = this._propsData.length;

        const isReceived = this._msgData.status === 1;
        this.setButtonState(this.reciveBtn, !isReceived);
    }

    private setActiveView(showRoleInfo: boolean) {
        this.roleInfoBox.active = showRoleInfo;
        this.msgInfoBox.active = !showRoleInfo;
    }

    private getChildLabelByName(parentNode: Node, name: string): Label {
        return parentNode.getChildByName(name).getComponent(Label);
    }

    private setButtonState(buttonNode: Node, isActive: boolean) {
        buttonNode.getComponent(Sprite).grayscale = !isActive;
        buttonNode.getComponent(Button).interactable = isActive;
    }

    private loadRoleModel() {
        this.roleContainer.removeAllChildren();
        const roleNode = instantiate(this.roleModel);
        roleNode.setScale(v3(1.5, 1.5, 1));
        this.roleContainer.addChild(roleNode);
        NodeUtil.setLayerRecursively(roleNode, Layers.Enum.UI_2D);

        const roleModel = roleNode.getComponent(RoleBaseModel);
        const modelId = parseInt(this._data.avatar);
        const dressConfig = [9500, 9700, 9701, 9702, 9703]; // 示例的dressConfig
        roleModel.init(modelId, 1, dressConfig);
        roleModel.show(true);
    }

    protected initEvent(): void {
        this.registerButtonEvent(this.btnTalk, this.onTalkClick);
        this.registerButtonEvent(this.btnHouse, this.onHouseClick);
        this.registerButtonEvent(this.btnDelete, this.onDeleteClick);
        this.registerButtonEvent(this.reciveBtn, this.onReceiveClick);
    }

    private registerButtonEvent(buttonNode: Node, callback: () => void) {
        CCUtil.onBtnClick(buttonNode, callback.bind(this));
    }

    private onTalkClick() {
        EventMgr.dispatch(EventType.Friend_Talk_Event);
    }

    private onHouseClick() {
        ViewsManager.showTip(TextConfig.Function_Tip);
    }

    private onDeleteClick() {
        FdServer.reqUserDelFriendMessage(this._data.friend_id);
    }

    private onReceiveClick() {
        FdServer.reqUserSystemAwardGet(this._msgData.sm_id);
    }

    onLoadRewardVertical(item: Node, idx: number) {
        const rewardItem = item.getComponent(RewardItem);
        const uiTransform = item.getComponent(UITransform);
        const scale = 92.4 / uiTransform.height;
        item.setScale(scale, scale, scale);
        rewardItem.init(this._propsData[idx]);
    }
}
