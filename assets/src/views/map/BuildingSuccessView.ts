import { _decorator, Component, Label, Node, sp } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ItemData } from '../../manager/DataMgr';
import { LoadManager } from '../../manager/LoadManager';
import CCUtil from '../../util/CCUtil';
import { TimerMgr } from '../../util/TimerMgr';
import { RewardItem } from '../common/RewardItem';
const { ccclass, property } = _decorator;

export enum BuildingSuccessType {
    /**建筑建造 */
    built = 1,
    /**建筑升级 */
    upgrade = 2,
}

const spConfig = {
    path: "spine/reward/qingzhurenwu",
    anim: ["people01", "people02", "people03"],
}
const spConfig2 = {
    path: "spine/reward/yanhua",
    anim: ["animation"],
}

/**建筑建造、升级成功 */
@ccclass('BuildingSuccessView')
export class BuildingSuccessView extends Component {
    @property(Node)
    public bg: Node = null;//背景
    @property(Node)
    public center: Node = null;//中间
    @property(Node)
    public frame: Node = null;//框
    @property(Node)
    public layout: Node = null;//布局
    @property([Node])
    public conditions: Node[] = [];//条件
    @property(Label)
    public title: Label = null;//标题
    @property(sp.Skeleton)
    public spYanHua: sp.Skeleton = null;//烟花
    @property(sp.Skeleton)
    public spPeople1: sp.Skeleton = null;//人物
    @property(sp.Skeleton)
    public spPeople2: sp.Skeleton = null;//人物

    private _canClose: boolean = false;//是否可以关闭

    start() {
        this.initEvent();
    }
    protected onDestroy(): void {
        this.removeEvent();
    }
    /**初始化事件 */
    private initEvent() {
        CCUtil.onTouch(this.bg, this.onClickBg, this);
    }
    /**移除事件 */
    private removeEvent() {
        CCUtil.offTouch(this.bg, this.onClickBg, this);
    }
    /**初始化数据 */
    public initData(rewards: ItemData[], type: BuildingSuccessType) {
        TimerMgr.once(() => {
            this._canClose = true;
        }, 2000);

        if (BuildingSuccessType.built == type) {
            this.title.string = TextConfig.Building_Success_Type1;
        } else {
            this.title.string = TextConfig.Building_Success_Type2;
        }
        //条件
        for (let i = 0; i < this.conditions.length; i++) {
            let item = this.conditions[i];
            item.active = false;
            // item.getChildByName("Label1");
            // item.getChildByName("Label3");
        }
        // 奖励列表
        rewards.forEach(item => {
            LoadManager.loadPrefab(PrefabType.RewardItem.path, this.layout).then((node: Node) => {
                node.getComponent(RewardItem).init(item);
            });
        });

        LoadManager.loadSpine(spConfig2.path, this.spYanHua).then(() => {
            this.spYanHua.setAnimation(0, spConfig2.anim[0], true);
        });
        LoadManager.loadSpine(spConfig.path, this.spPeople1).then(() => {
            this.spPeople1.setAnimation(0, spConfig.anim[0], true);
        });
        LoadManager.loadSpine(spConfig.path, this.spPeople2).then(() => {
            this.spPeople2.setAnimation(0, spConfig.anim[0], true);
        });

    }
    /**背景点击 */
    public onClickBg() {
        if (!this._canClose) return;
        this._canClose = false;
        this.node.destroy();
    }
}


