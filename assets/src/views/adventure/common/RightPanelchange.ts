import { _decorator, Component, instantiate, Label, Node, Prefab, tween, v3 } from 'cc';
import { EventType } from '../../../config/EventType';
import { DataMgr } from '../../../manager/DataMgr';
import CCUtil from '../../../util/CCUtil';
import EventManager from '../../../util/EventManager';
import { MonsterModel } from './MonsterModel';
const { ccclass, property } = _decorator;

/**右边选择关卡界面 何存发 2024年4月12日14:21:29 */
@ccclass('rightPanel')
export class rightPanelchange extends Component {
    @property({ type: Node, tooltip: "关闭按钮" })
    public btn_close: Node = null;
    @property({ type: Node, tooltip: "怪物容器" })
    public monsterNode: Node = null;
    @property({ type: [Node], tooltip: "星星" })
    public stars: Node[] = [];
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

    private _data: any = null;
    private _eveId: string;
    private _monsterAni: Node = null;

    start() {

    }

    /** 更新 */
    update(deltaTime: number) {

    }

    onLoad() {
        this.initEvent();
        this.initUI()
    }

    private initUI() {
    }

    //点击跳转到闯关界面 TODO
    private levelClick() {
        EventManager.emit(EventType.Enter_Island_Level, this._data);
    }
    private touchNodeArr: Node[] = [];

    initEvent() {
        CCUtil.onTouch(this.btn_close, this.hideView, this);
        CCUtil.onTouch(this.btn_start, this.levelClick, this);
        this._eveId = EventManager.on(EventType.Expand_the_level_page, this.openView.bind(this));

    }
    /** 打开界面 */
    openView(param: any = null) {
        console.log('接收到的参数=', param);
        this._data = param;
        this.updateView();
        this.node.active = true
        tween(this.node).to(0.3, { position: v3(178, 100, 0) }).call(() => {
        }).start()

    }

    updateView() {
        let levelData = DataMgr.instance.getAdvLevelConfig(+this._data.bigId, +this._data.smallId);
        this.levelTxt.string = this._data.bigId + '-' + this._data.smallId;
        this.monsterNameTxt.string = levelData.monsterName;
        if (!this._monsterAni) {
            this._monsterAni = instantiate(this.monsterPrefab);
            this.monsterNode.addChild(this._monsterAni);
        }
        let monsterModel = this._monsterAni.getComponent(MonsterModel);
        monsterModel.init("spine/monster/adventure/" + levelData.monsterAni);
        // LoadManager.loadSprite("adventure/monster/" + this._data.bigId + "-" + this._data.smallId + "/spriteFrame", this.monster.getComponent(Sprite));
    }

    hideView() {
        tween(this.node).to(0.3, { position: v3(900, 100, 0) }).call(() => {
            this.node.active = false
        }).start()


    }

    removeEvent() {
        CCUtil.offTouch(this.btn_close, this.hideView, this);
        CCUtil.offTouch(this.btn_start, this.levelClick, this);
        EventManager.off(EventType.Expand_the_level_page, this._eveId);

    }

    onDestroy() {

    }
}


