import { _decorator, director, isValid, Node, ScrollView } from 'cc';
import { PrefabType, SceneType } from '../../config/PrefabType';
import { TextConfig } from '../../config/TextConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import { CurrentBookStatus } from '../../models/TextbookModel';
import { NetNotify } from '../../net/NetNotify';
import { BaseView } from '../../script/BaseView';
import { TBServer } from '../../service/TextbookService';
import CCUtil from '../../util/CCUtil';
const { ccclass, property } = _decorator;

/**大冒险 学习页面 何存发 2024年4月8日19:21:23 */

@ccclass('studyView')
export class studyView extends BaseView {


    @property({ type: [Node], tooltip: "关卡选择" })
    public levelArr: Node[] = [];

    @property({ type: Node, tooltip: "关闭按钮" })
    public closeBtn: Node = null;

    @property({ type: ScrollView, tooltip: "滚动容器" })
    public scrollView: ScrollView = null;

    update(deltaTime: number) {

    }

    onLoad(): void {
    }
    /**初始化ui */
    initUI() {

    }

    onInitModuleEvent() {
        this.addModelListener(NetNotify.Classification_CurrentBook, this.onCurrentBookStatus);
    }
    onCurrentBookStatus(curBook: CurrentBookStatus): void {
        /**当前词书状态 */
        if (isValid(curBook.book_id) && isValid(curBook.book_name) && isValid(curBook.grade)) {
            ViewsManager.instance.showView(PrefabType.TextbookChallengeView, (node: Node) => {
            });
        } else {
            ViewsManager.instance.showView(PrefabType.SelectWordView, (node: Node) => {

            });
        }
    }
    /**关闭页面 TODO*/
    private closeView() {
        director.loadScene(SceneType.MainScene);
    }
    /**初始化监听事件 */
    initEvent() {
        for (let i = 0; i < this.levelArr.length; i++) {
            CCUtil.onTouch(this.levelArr[i], this.levelClick.bind(this, this.levelArr[i].name), this);
        }
        CCUtil.onTouch(this.closeBtn, this.closeView, this)
    }
    private levelClick(name: string) {
        console.log(name);
        switch (name) {
            case "wordAdventure": //单词大冒险
                // director.loadScene(SceneType.WorldMapScene);
                ViewsManager.instance.showView(PrefabType.WorldMapView);
                break;
            case "bookWord": //教材单词
                TBServer.reqCurrentBook();
                break;
            // case "grammar": //语法训练
            //     ViewsManager.instance.showView(PrefabType.GrammarTrainingView);
            //     break;
            default:
                ViewsManager.showTip(TextConfig.Function_Tip);
                break;
        }
        // EventManager.emit(EventType.Study_Page_Switching, [i]);

    }
    /**移除监听 */
    removeEvent() {
        for (let i = 0; i < this.levelArr.length; i++) {
            CCUtil.offTouch(this.levelArr[i], this.levelClick, this);
        }
        CCUtil.offTouch(this.closeBtn, this.closeView, this)

    }
}


