import { Node, Prefab, Widget, _decorator, error, instantiate, isValid } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { UnitWordModel } from '../../models/TextbookModel';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { ChallengeFrameView } from './ChallengeFrameView';
const { ccclass, property } = _decorator;

@ccclass('BossChallengeView')
export class BossChallengeView extends BaseView {
    @property(Node)
    public content_layout:Node = null;

    @property(Node)
    public img_bg:Node = null;

    @property(Node)
    public btn_close:Node = null;

    private _challengeFrame:ChallengeFrameView = null;

    onLoad(): void {
        this.initUI();
        this.initEvent();
    }
    async initData(wordsdata: UnitWordModel[]) {
        this.initWords(wordsdata);
        this.initMonster(); //初始化怪物
    }
    start() {
        
    }
    onInitModuleEvent(){
        // this.addModelListener(EventType.Challenge_WorldBoss,this.onChallengeWorldBoss);
    }
    initEvent(){
        CCUtil.onTouch(this.btn_close, this.onCloseView, this);
    }
    removeEvent(){
        CCUtil.offTouch(this.btn_close, this.onCloseView, this);
    }
    initUI(){
        this.initChallengeFrame();
    }
    initChallengeFrame(){
        ResLoader.instance.load(`prefab/${PrefabType.ChallengeFrameView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            this._challengeFrame = node.getComponent(ChallengeFrameView);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignBottom = true;
            }
            widgetCom.bottom = -280;
        });
    }
    onCloseView(){
        ViewsManager.instance.closeView(PrefabType.BossChallengeView);
    }

    onDestroy() {
        super.onDestroy();
		this.removeEvent();
	};
}


