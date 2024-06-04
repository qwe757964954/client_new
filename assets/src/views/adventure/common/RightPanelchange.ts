import { _decorator, Component, instantiate, isValid, Label, Node, Prefab, Sprite, tween, UITransform, Vec3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { DataMgr } from '../../../manager/DataMgr';
import { MapLevelData } from '../../../models/AdventureModel';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import { MonsterModel } from './MonsterModel';
import List from '../../../util/list/List';
import { BaseItem } from '../../common/BaseItem';
import { ViewsMgr } from '../../../manager/ViewsManager';
const { ccclass, property } = _decorator;

export interface LevelConfig {
    small_id: number;
    big_id: number;
}
/**右边选择关卡界面 何存发 2024年4月12日14:21:29 */
@ccclass('rightPanel')
export class rightPanelchange extends Component {
    @property({ type: Node, tooltip: "关闭按钮" })
    public btn_close: Node = null;
    @property({ type: Node, tooltip: "怪物容器" })
    public monsterNode: Node = null;
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
    @property({ type: [Node], tooltip: "星星条件" })
    public starConditions: Node[] = [];
    @property(Label)
    public levelTxt: Label = null;
    @property(Label)
    monsterNameTxt: Label = null;
    @property(Node)
    btn_start: Node = null;
    @property(Node)
    btn_test: Node = null;
    @property({ type: Prefab, tooltip: "怪物预制" })
    public monsterPrefab: Prefab = null;
    @property({ type: List, tooltip: "奖励列表" })
    public rewardList: List = null;

    private _data: MapLevelData = null;
    private _eveId: string;
    private _monsterAni: Node = null;
    private _rewardData: any[] = []; //奖励数据

    /** 更新 */
    update(deltaTime: number) {

    }

    onLoad() {
        //测试数据
        this._rewardData = [{
            id: 1,
            num: 1000,
            star: 1
        }, {
            id: 2,
            num: 500,
            star: 0
        }, {
            id: 3,
            num: 10,
            star: 2
        }, {
            id: 4,
            num: 10,
            star: 3
        }, {
            id: 5,
            num: 10,
            star: 0
        }, {
            id: 6,
            num: 10,
            star: 0
        }, {
            id: 7,
            num: 10,
            star: 0
        }, {
            id: 8,
            num: 10,
            star: 0
        }]
        this.initEvent();
        this.initUI()
    }

    private initUI() {
    }

    //点击跳转到闯关界面 TODO
    private levelClick() {
        EventManager.emit(EventType.Enter_Island_Level, this._data);
    }

    private startTest() {
        if (!isValid(this._data.flag_info)) {
            ViewsMgr.showTip("通过本关后解锁");
            return;
        }
        EventManager.emit(EventType.Enter_Level_Test, this._data);
    }

    initEvent() {
        CCUtil.onTouch(this.btn_close, this.hideView, this);
        CCUtil.onTouch(this.btn_start, this.levelClick, this);
        CCUtil.onTouch(this.btn_test, this.startTest, this);
        this._eveId = EventManager.on(EventType.Expand_the_level_page, this.openView.bind(this));

    }
    /** 打开界面 */
    openView(param: MapLevelData = null) {
        console.log('接收到的参数=', param);
        this._data = param;

        this.updateView();
        this.node.active = true;
        let node_size = this.node.getComponent(UITransform);
        tween(this.node).by(0.3, { position: new Vec3(-node_size.width, 0, 0) }).call(() => {
            // this.node.active = false
        }).start();
        // tween(this.node).to(0.3, { position: v3(178, 100, 0) }).call(() => {
        // }).start()

    }

    updateView() {
        if (!this._monsterAni) {
            this._monsterAni = instantiate(this.monsterPrefab);
            this.monsterNode.addChild(this._monsterAni);
        }
        let monsterModel = this._monsterAni.getComponent(MonsterModel);
        if (this._data.game_modes && this._data.game_modes === "word") {
            this.levelTxt.string = this._data.big_id + '-' + this._data.small_id;
            monsterModel.init("spine/TextbookVocabulary/" + "10018");
            this.monsterNameTxt.string = "缝合怪";
        } else {
            let levelData = DataMgr.instance.getAdvLevelConfig(+this._data.big_id, +this._data.small_id);
            this.levelTxt.string = this._data.small_id + '-' + this._data.micro_id;
            monsterModel.init("spine/monster/adventure/" + levelData.monsterAni);
            this.monsterNameTxt.string = levelData.monsterName;
        }
        let data = this._data;
        //有星星
        if (isValid(data.flag_info)) {
            let isGet = isValid(data.flag_info.star_one);
            this.stars[0].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[0].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[0].getChildByName("star").getComponent(Sprite).grayscale = !isGet;

            isGet = isValid(data.flag_info.star_two);
            this.stars[1].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[1].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[1].getChildByName("star").getComponent(Sprite).grayscale = !isGet;

            isGet = isValid(data.flag_info.star_three);
            this.stars[2].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[2].getComponent(Sprite).grayscale = !isGet;
            this.starConditions[2].getChildByName("star").getComponent(Sprite).grayscale = !isGet;

            this.btn_test.getComponent(Sprite).grayscale = false;

        } else {
            for (let i = 0; i < 3; i++) {
                this.stars[i].getComponent(Sprite).grayscale = true;
                this.starConditions[i].getComponent(Sprite).grayscale = true;
                this.starConditions[i].getChildByName("star").getComponent(Sprite).grayscale = true;
            }
            this.btn_test.getComponent(Sprite).grayscale = true;
        }
        this.rewardList.numItems = this._rewardData.length;
        // LoadManager.loadSprite("adventure/monster/" + this._data.bigId + "-" + this._data.smallId + "/spriteFrame", this.monster.getComponent(Sprite));
    }

    onRewardItemRender(item: Node, idx: number) {
        item.getComponent(BaseItem).setData(this._rewardData[idx]);
    }

    hideView() {
        let node_size = this.node.getComponent(UITransform);
        tween(this.node).by(0.3, { position: new Vec3(node_size.width, 0, 0) }).call(() => {
            this.node.active = false
        }).start();
    }

    removeEvent() {
        CCUtil.offTouch(this.btn_close, this.hideView, this);
        CCUtil.offTouch(this.btn_start, this.levelClick, this);
        CCUtil.offTouch(this.btn_test, this.startTest, this);
        EventManager.off(EventType.Expand_the_level_page, this._eveId);

    }

    onDestroy() {

    }
}


