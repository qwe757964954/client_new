import { _decorator, error, instantiate, isValid, JsonAsset, Label, Node, Prefab, Sprite, SpriteFrame, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import { BossChallengeView } from './BossChallengeView';
import WordBossArray, { BossGameInfo, BossInfo, WordBossInfoData, WorldBossResponse } from './BossInfo';
import { CenterBossView } from './CenterBossView';
import { RightRankView } from './RightRankView';
import { WorldLeftNavView } from './WorldLeftNavView';
const { ccclass, property } = _decorator;

@ccclass('WorldBossView')
export class WorldBossView extends BaseView {
    @property(Node)
    public top_layout:Node = null;
    @property(Node)
    public content_layout:Node = null;

    @property(Node)
    public bg_img:Node = null;
    @property(Label)
    public remaining_challenge_text:Label = null;
    @property(Node)
    public challenge_btn:Node = null;
    private _centerView:CenterBossView = null;
    private _leftView:WorldLeftNavView = null;
    private _rightRankView:RightRankView = null;
    private _worldRankData:WorldBossResponse = null;
    initEvent(){
        CCUtil.onTouch(this.challenge_btn, this.onChallengeWorldBoss, this);
    }
    removeEvent(){
        CCUtil.offTouch(this.challenge_btn, this.onChallengeWorldBoss, this);
    }
    async initUI(){
        this.initNavTitle();
        this.initAmout();
        this.initLeftBossNav();
        await this.loadRankData();
        this.initCenterView();
        this.initRightRankView();
        console.log(WordBossInfoData);
    }
    onInitModuleEvent(){
        // this.addModelListener(EventType.Challenge_WorldBoss,this.onChallengeWorldBoss);
    }
    async loadRankData(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            ResLoader.instance.load(`worldBoss/RankData`, JsonAsset, async (err: Error | null, jsonData: JsonAsset) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    this._worldRankData = jsonData.json as WorldBossResponse;
                    resolve();
                }
            });
        });
    }
    

    /**初始化导航栏 */
    initNavTitle(){
        ViewsManager.addNavigation(this.top_layout,0,0).then((navScript: NavTitleView) => {
            navScript.updateNavigationProps(`挑战BOSS`,()=>{
                ViewsManager.instance.closeView(PrefabType.WorldBossView);
            });
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmout(this.top_layout,11.314,160.722).then((amoutScript: TopAmoutView) => {
            let dataArr:AmoutItemData[] = [{type:AmoutType.Diamond,num:User.diamond},
                {type:AmoutType.Coin,num:User.coin},
                {type:AmoutType.Energy,num:User.stamina}];
            amoutScript.loadAmoutData(dataArr);
        });
    }

    /**初始化右侧闯关 */
    initLeftBossNav(){
        ResLoader.instance.load(`prefab/${PrefabType.WorldLeftNavView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this._leftView = node.getComponent(WorldLeftNavView);
            this._leftView.setSelectClick((idx:number) => {
                this.selectBossUpdateStatus(idx);
            });
            this.content_layout.addChild(node);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignLeft = true;
                widgetCom.isAlignTop = true;
            }
            widgetCom.left = 43.599;
            widgetCom.top = 124.253;
        });
    }
    initCenterView(){
        ResLoader.instance.load(`prefab/${PrefabType.CenterBossView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            this._centerView = node.getComponent(CenterBossView);
            this._leftView.letNavScroll.selectedId = 0;
            let widgetCom = node.getComponent(Widget);
            
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignHorizontalCenter = true;
                widgetCom.isAlignVerticalCenter = true;
            }
            widgetCom.verticalCenter = -20.238;
            widgetCom.horizontalCenter = 51.949;
        });
    }

    initRightRankView(){
        ResLoader.instance.load(`prefab/${PrefabType.RightRankView.path}`, Prefab, (err: Error | null, prefab: Prefab) => {
            if (err) {
                error && console.error(err);
                return;
            }
            let node = instantiate(prefab);
            this.content_layout.addChild(node);
            this._rightRankView = node.getComponent(RightRankView);
            this._rightRankView.loadRankData(this._worldRankData);
            let widgetCom = node.getComponent(Widget);
            if (!isValid(widgetCom)) {
                widgetCom = node.addComponent(Widget);
                widgetCom.isAlignRight = true;
                widgetCom.isAlignVerticalCenter = true;
            }
            widgetCom.verticalCenter = -51.391;
            widgetCom.right = 0;
        });
    }

    selectBossUpdateStatus(select_id: number){
        let info:BossInfo = WordBossArray[select_id];
        let gameInfo:BossGameInfo = this._worldRankData.Data.Game;
        ResLoader.instance.load(info.bgImage, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.bg_img.getComponent(Sprite).spriteFrame = spriteFrame;
        });
        this._centerView.updateCenterProps(gameInfo,info);
        let remaining_num = 50 - gameInfo.SubmitNum;
        this.remaining_challenge_text.string = `剩余挑战次数：${remaining_num}`;
    }

    onChallengeWorldBoss(){
        console.log("onChallengeWorldBoss");
        ViewsManager.instance.showView(PrefabType.BossChallengeView, (node: Node) => {
            ViewsManager.instance.closeView(PrefabType.WorldBossView);
            let nodeScript:BossChallengeView = node.getComponent(BossChallengeView);
            nodeScript.initData(this._worldRankData.Data.Game)
        });
    }
}


