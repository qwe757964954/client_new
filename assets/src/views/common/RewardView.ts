import { _decorator, Component, easing, instantiate, Node, Prefab, sp, tween, Vec3 } from 'cc';
import { ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { EffectUtil } from '../../util/EffectUtil';
import { RewardItem } from './RewardItem';
const { ccclass, property } = _decorator;

const spConfig = {
    path: "spine/reward/qingzhurenwu",
    anim: ["people01", "people02", "people03"],
}
const spConfig2 = {
    path: "spine/reward/yanhua",
    anim: ["animation"],
}

@ccclass('RewardView')
export class RewardView extends Component {
    @property(Node)
    public bg: Node = null;//背景
    @property(Node)
    public frame: Node = null;//奖励层
    @property(Node)
    public layout: Node = null;//奖励列表
    @property(Prefab)
    public rewardItem: Prefab = null;//奖励模版
    @property(sp.Skeleton)
    public spYanHua: sp.Skeleton = null;//烟花
    @property(sp.Skeleton)
    public spPeople1: sp.Skeleton = null;//人物
    @property(sp.Skeleton)
    public spPeople2: sp.Skeleton = null;//人物

    private _canClose: boolean = false;//是否可以关闭
    private _callBack: Function = null;//回调

    protected start(): void {
        this.initEvent();
    }

    protected onDestroy(): void {
        this.removeEvent();
    }
    /** 初始化事件 */
    initEvent() {
        CCUtil.onTouch(this.bg, this.onClose, this);
    }
    /**移除事件 */
    removeEvent() {
        CCUtil.offTouch(this.bg, this.onClose, this);
    }
    /**关闭 */
    onClose() {
        if (!this._canClose) return;
        this._canClose = false;
        EffectUtil.centerClose(this.frame, () => {
            if (this._callBack) this._callBack();
            this.node.destroy();
        });
    }
    /**初始化 */
    init(data: ItemData[], callBack?: Function) {
        this._callBack = callBack;
        if (data.length <= 0) {
            if (this._callBack) this._callBack();
            this.node.destroy();
            return;
        }

        let length = Math.min(data.length, 12);
        for (let i = 0; i < length; i++) {
            let item = instantiate(this.rewardItem);
            this.layout.addChild(item);
            item.getComponent(RewardItem).init(data[i]);

            let index = i;
            item.scale = new Vec3(0.2, 0.2, 1.0);
            item.pauseSystemEvents(true);
            tween(item).hide().delay(i * 0.1).show().to(0.4, { scale: new Vec3(1.0, 1.0, 1.0) }, { easing: easing.backOut }).call(() => {
                item.resumeSystemEvents(true);
                if (index == length - 1) {
                    this._canClose = true;
                }
            }).start();
        }

        LoadManager.loadSpine(spConfig2.path, this.spYanHua).then(() => {
            this.spYanHua.setAnimation(0, spConfig2.anim[0], true);
        });
        LoadManager.loadSpine(spConfig.path, this.spPeople1).then(() => {
            this.spPeople1.setAnimation(0, spConfig.anim[1], true);
        });
        LoadManager.loadSpine(spConfig.path, this.spPeople2).then(() => {
            this.spPeople2.setAnimation(0, spConfig.anim[1], true);
        });
    }
}


