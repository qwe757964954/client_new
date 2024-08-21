import { _decorator, Component, Label, Node, Sprite } from 'cc';
import { LoadManager } from '../../manager/LoadManager';
import { FriendListItemModel } from '../../models/FriendModel';
import { FdServer } from '../../service/FriendService';
import CCUtil from '../../util/CCUtil';
import { HeadIdMap } from './FriendInfo';
const { ccclass, property } = _decorator;

@ccclass('FriendSearchItem')
export class FriendSearchItem extends Component {
    @property({ type: Sprite, tooltip: "头像图片精灵" })
    imgHead: Sprite = null;

    @property({ type: Label, tooltip: "朋友名字标签" })
    lblRealName: Label = null;

    @property({ type: Label, tooltip: "ID标签" })
    lblID: Label = null;

    @property({ type: Node, tooltip: "状态标签" })
    state_icon: Node = null;

    @property({ type: Node, tooltip: "添加朋友按钮" })
    btnAddFriend: Node = null;

    @property(Label)
    public level_txt:Label = null;

    private _data: FriendListItemModel = null;

    protected onLoad(): void {
        this.registerEvents();
    }

    private registerEvents(): void {
        CCUtil.onBtnClick(this.btnAddFriend, this.onAddClick.bind(this));
    }

    private async loadAvatar(avatarId: number): Promise<void> {
        try {
            const avatarPath = `friend/head_${avatarId}/spriteFrame`;
            await LoadManager.loadSprite(avatarPath, this.imgHead.getComponent(Sprite));
        } catch (error) {
            console.error(`Failed to load avatar sprite: ${error.message}`);
        }
    }

    public async initData(data: FriendListItemModel): Promise<void> {
        this._data = data;
        const avatarId = HeadIdMap[data.avatar];
        await this.loadAvatar(avatarId);

        this.lblRealName.string = data.nick_name;
        this.lblID.string = `（ID:${data.user_id}）`;
        this.level_txt.string = `${data.level}`;
        this.state_icon.active = data.online === 1;
    }

    private onAddClick(): void {
        // 添加朋友的逻辑
        console.log(`Add friend clicked for: ${this._data.user_id}`);
        FdServer.reqUserFriendAdd(this._data.user_id);
    }
}
