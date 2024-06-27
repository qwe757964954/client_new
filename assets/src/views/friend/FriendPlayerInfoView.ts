import { _decorator, instantiate, Label, Layers, Node, Prefab, UITransform, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { ItemData } from '../../manager/DataMgr';
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
    public btnTalk: Node = null;// 返回按钮

    @property(Node)
    public btnHouse: Node = null;// 返回按钮

    @property(Node)
    public btnDelete: Node = null;// 返回按钮

    @property(Node)
    public roleInfoBox: Node = null;// 返回按钮

    @property(Node)
    public msgInfoBox: Node = null;// 返回按钮

    @property(Label)
    public labelName: Label = null;// 返回按钮

    @property(Label)
    public labeStatus: Label = null;// 返回按钮

    @property({ type: Node, tooltip: "角色容器" })
    public roleContainer: Node = null;

    @property({ type: Prefab, tooltip: "角色动画预制体" })
    public roleModel: Prefab = null;//角色动画

    @property(List)
    public awardList:List = null;

    private _data: FriendListItemModel = null;

    private _msgData: SystemMailItem = null;
    private _propsDta:ItemData[] = [];
    updateData(data:FriendListItemModel){
        this._data = data;
        this.roleInfoBox.active = true;
        this.msgInfoBox.active = false;
        this.labelName.string = data.user_name;
        this.showRoleDress();
    }

    updateMessageData(data:SystemMailItem){
        this._msgData = data;
        this.roleInfoBox.active = false;
        this.msgInfoBox.active = true;
        let fromTxt = this.msgInfoBox.getChildByName("fromTxt").getComponent(Label);
        fromTxt.string = data.title;
        let msgTxt = this.msgInfoBox.getChildByName("msgTxt").getComponent(Label);
        msgTxt.string = data.content;
        this._propsDta = ObjectUtil.convertAwardsToItemData(data.awards);
        this.awardList.numItems = this._propsDta.length;
    }

    /**显示角色的骨骼动画 */
    private showRoleDress() {
        this.roleContainer.removeAllChildren();
        let role = instantiate(this.roleModel);
        role.setScale(v3(1.5, 1.5, 1));
        this.roleContainer.addChild(role);
        NodeUtil.setLayerRecursively(role, Layers.Enum.UI_2D);
        let roleModel = role.getComponent(RoleBaseModel);
        let modelId: number = Number(parseInt(this._data.avatar));
        roleModel.init(modelId, 1, [9500, 9700, 9701, 9702, 9703]);
        roleModel.show(true);
    }

    protected initEvent(): void {
        CCUtil.onBtnClick(this.btnTalk, this.onTalkClick.bind(this));
        CCUtil.onBtnClick(this.btnHouse, this.onHouseClick.bind(this));
        CCUtil.onBtnClick(this.btnDelete, this.onDeleteClick.bind(this));
    }
    async onTalkClick() {
        console.log("onTalkClick");
        EventMgr.dispatch(EventType.Friend_Talk_Event);
    }
    onHouseClick() {
        console.log("onHouseClick");
    }

    onDeleteClick() {
        console.log("onDeleteClick");
        FdServer.reqUserDelFriendMessage(this._data.friend_id);
    }
    onLoadRewardVertical(item:Node, idx:number){
        let item_script = item.getComponent(RewardItem);
        let node_trans = item.getComponent(UITransform);
        let scale = 92.4 / node_trans.height;
        item.setScale(scale, scale, scale)
        item_script.init(this._propsDta[idx]);
        // let friendData: FriendListItemModel = this._friendDataList[idx];
        // item_script.initData(friendData);
    }
}


