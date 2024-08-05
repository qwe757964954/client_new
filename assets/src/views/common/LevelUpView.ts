import { _decorator, instantiate, Label, Node, Prefab, sp } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ViewsMgr } from '../../manager/ViewsManager';
import { RoleBaseModel } from '../../models/RoleBaseModel';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import List from '../../util/list/List';
import { ReportItem } from '../adventure/sixModes/ReportItem';
import { UnlockItem } from './UnlockItem';
const { ccclass, property } = _decorator;

@ccclass('LevelUpView')
export class LevelUpView extends BaseView {
    @property(Label)
    public levelUpLabel: Label = null;
    @property(Label)
    public smallLevelLabel: Label = null;
    @property(Label)
    public expLabel: Label = null;
    @property(sp.Skeleton)
    public skeleton: sp.Skeleton = null;
    @property(Node)
    public expBar: Node = null;
    @property(List)
    public reward_scroll: List = null;
    @property(Node)
    public closeBtn: Node = null;
    @property(Prefab)
    public roleModel: Prefab = null;
    @property(Node)
    public roleNode: Node = null;
    @property(List)
    public unlockList: List = null;

    private _award: any;
    private _data: any;
    private _unlocks: any[];

    initData(data: any) {
        console.log("levelUp", data);
        this._data = data;
        this._award = { "coin": 200, "diamond": 100 };
        this.reward_scroll.numItems = Object.keys(this._award).length;
        this._unlocks = [{ "title": "解锁城堡", "content": "2级" }, { "title": "解锁功能", "content": "教材单词" }]
        this.unlockList.numItems = this._unlocks.length;
    }

    protected initEvent(): void {
        CCUtil.onTouch(this.closeBtn, this.onClose, this);
    }

    protected removeEvent(): void {
        CCUtil.offTouch(this.closeBtn, this.onClose, this);
    }

    onClose() {
        ViewsMgr.closeView(PrefabType.LevelUpView);
    }

    protected initUI(): void {
        this.skeleton.setAnimation(0, "up", false);
        this.skeleton.addAnimation(0, "up_idle", true);

        this.initRolePlayer();
    }

    onLoadRewardHorizontal(item: Node, idx: number) {
        let keys = Object.keys(this._award);
        let key: string = keys[idx];
        let item_script = item.getComponent(ReportItem);
        item_script.updateItemProps({ id: Number(key), num: this._award[key] });
    }

    unlockListRender(item: Node, idx: number) {
        let item_script = item.getComponent(UnlockItem);
        item_script.initData(this._unlocks[idx]);
    }

    async initRolePlayer() {
        let role = instantiate(this.roleModel);
        this.roleNode.addChild(role);
        let roleModel = role.getComponent(RoleBaseModel);
        await roleModel.initSelf();
        roleModel.show(true);
        roleModel.standby();
    }

}


