import { Node, _decorator } from 'cc';
import { PrefabType } from '../config/PrefabType';
import { LoadManager } from '../manager/LoadManager';
import { ServiceMgr } from '../net/ServiceManager';
import CCUtil from '../util/CCUtil';
import { PetMoodView } from '../views/map/PetMoodView';
import { RoleBaseModel, RoleType } from './RoleBaseModel';
import { User } from './User';
const { ccclass, property } = _decorator;
/**精灵 */
@ccclass('PetModel')
export class PetModel extends RoleBaseModel {
    @property(Node)
    public giftNode: Node = null;//礼物提示
    @property(Node)
    public moodNode: Node = null;//心情提示

    private _giftTipViewLoad: boolean = false;//礼物提示是否加载
    private _moodViewLoad: boolean = false;//心情提示是否加载
    private _moodView: PetMoodView = null;//心情提示view

    // 初始化
    public async init(roleID: number, level: number) {
        super.init(roleID, level, RoleType.sprite);
    }
    public initSelf() {
        super.initSelf();
        this.init(User.petID, User.petLevel);
    }

    public hit() {
        return new Promise((resolve) => {
            this.role.setCompleteListener(() => {
                this.role.setCompleteListener(null);
                this.role.setAnimation(0, this._roleInfo.actNames[0], true);
                resolve(true);
            })
            console.log("this.role........", this.role);
            this.role.setAnimation(0, this._roleInfo.actNames[4], false);
        });
    }

    public inHit() {
        return new Promise((resolve) => {
            this.role.setCompleteListener(() => {
                this.role.setCompleteListener(null);
                this.role.setAnimation(0, this._roleInfo.actNames[0], true);
                resolve(true);
            })
            this.role.setAnimation(0, this._roleInfo.actNames[3], false);
        });
    }
    /**显示礼物提示 */
    public showGift() {
        this.giftNode.active = true;
        if (this._giftTipViewLoad) return;
        this._giftTipViewLoad = true;
        LoadManager.loadPrefab(PrefabType.PetGiftTipView.path, this.giftNode).then((node: Node) => {
            CCUtil.onTouch(node, () => {
                ServiceMgr.buildingService.reqPetGetReward();
            });
        });
    }
    /**隐藏礼物提示 */
    public hideGift() {
        this.giftNode.active = false;
    }
    /**显示心情提示 */
    public showMood() {
        this.moodNode.active = true;
        if (this._moodView) {
            this._moodView.init(User.moodScore);
            return;
        }
        if (this._moodViewLoad) return;
        this._moodViewLoad = true;
        LoadManager.loadPrefab(PrefabType.PetMoodView.path, this.moodNode).then((node: Node) => {
            this._moodView = node.getComponent(PetMoodView);
            this._moodView.init(User.moodScore);
        });
    }
    /**隐藏心情提示 */
    public hideMood() {
        this.moodNode.active = false;
    }
}


