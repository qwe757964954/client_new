import { _decorator, Label, Node, UITransform } from 'cc';
import { EventType } from '../../config/EventType';
import { TextConfig } from '../../config/TextConfig';
import { ItemData } from '../../manager/DataMgr';
import { ViewsManager } from '../../manager/ViewsManager';
import { FriendListItemModel, FriendOperationType, SystemMailItem } from '../../models/FriendModel';
import { BasePopFriend } from '../../script/BasePopFriend';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import { EventMgr } from '../../util/EventManager';
import List from '../../util/list/List';
import { RewardItem } from '../common/RewardItem';
import { PlayerInfoResources } from './FriendInfo';
import { ScoreItem } from './ListViews/ScoreItem';

const { ccclass, property } = _decorator;

@ccclass('FriendPlayerInfoView')
export class FriendPlayerInfoView extends BasePopFriend {

    @property(Node)
    public roleInfoBox: Node = null; // 角色信息容器

    @property(Label)
    public labelName: Label = null; // 名字标签

    @property(Label)
    public labelID: Label = null; // id

    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property({ type: Node, tooltip: "精灵容器" })
    public petContainer: Node = null;

    @property(List)
    public badgeList: List = null; // 奖励列表

    @property(List)
    public infoList: List = null; // 人物信息

    @property(Node)
    public btnHide: Node = null;

    @property(Node)
    public deleteBtn: Node = null; // 删除

    @property(Node)
    public backListBtn: Node = null; // 黑名单

    private _data: FriendListItemModel = null;
    private _msgData: SystemMailItem = null;
    private _propsData: ItemData[] = [];

    protected initUI(): void {
        this.enableClickBlankToClose([this.node.getChildByName("content")]);
        this.infoList.numItems = PlayerInfoResources.length;
    }

    updateData(data: FriendListItemModel) {
        console.log("updateData.....",data);
        this._data = data;
        this.showRoleInfo();
    }

    private showRoleInfo(): void {
        const { user_name, user_id } = this._data;
    
        this.labelName.string = `${user_name}的信息页`;
        this.labelID.string = `id:${user_id}`;
    
        this.loadRoleModel();
        this.loadPetModel();
    }
    private async loadRoleModel() {
        this.roleContainer.removeAllChildren();
        const role = await ViewsManager.addRoleToNode(this.roleContainer);
        role.setScale(1.5,1.5,1);
    }

    private async loadPetModel(){
        this.petContainer.removeAllChildren();
        const pet = await ViewsManager.addPetToNode(this.petContainer);
        pet.setScale(1.5,1.5,1);
    }

    protected initEvent(): void {
        this.registerButtonEvent(this.btnHide, this.onHidenClick);
        this.registerButtonEvent(this.deleteBtn, this.onDeleteClick);
        this.registerButtonEvent(this.backListBtn, this.onBacklistClick);
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
        FdServer.reqUserDelFriendMessage(this._data.friend_id,FriendOperationType.Delete);
        this.closePop();
    }

    private onBacklistClick() {
        FdServer.reqUserDelFriendMessage(this._data.friend_id,FriendOperationType.Blacklist);
        this.closePop();
    }

    onLoadRewardVertical(item: Node, idx: number) {
        const rewardItem = item.getComponent(RewardItem);
        const uiTransform = item.getComponent(UITransform);
        const scale = 92.4 / uiTransform.height;
        item.setScale(scale, scale, scale);
        rewardItem.init(this._propsData[idx]);
    }

    onLoadInfoHorizontal(item: Node, idx: number) {
        let script = item.getComponent(ScoreItem);
        script.updatePropsInfo(idx);
    }

    onHidenClick(){
        this.closePop();
    }
}
