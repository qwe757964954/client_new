import { Prefab, Widget, _decorator, error, instantiate, isValid } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { BaseView } from '../../script/BaseView';
const { ccclass, property } = _decorator;

@ccclass('TaskAchievementView')
export class TaskAchievementView extends BaseView {
    protected initUI(){
        this.initRewardView();
        this.initRightView();
    }
    initRewardView(){
        ResLoader.instance.load(`prefab/${PrefabType.AchievementRewardView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
            // this._challengeFrame = node.getComponent(ChallengeFrameView);
            // this._challengeFrame.onLoadWordData(this._bossGame.Words);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignTop = true;
                widgetCom.isAlignLeft = true;
            }
            widgetCom.top = 221.75;
            widgetCom.left = 5.868;
        });
    }
    initRightView(){
        ResLoader.instance.load(`prefab/${PrefabType.RightAchievementView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.node.addChild(node);
            // this._challengeFrame = node.getComponent(ChallengeFrameView);
            // this._challengeFrame.onLoadWordData(this._bossGame.Words);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignBottom = true;
            }
            widgetCom.bottom = 15.226;
            widgetCom.right = 13.4085;
        });
    }
}


