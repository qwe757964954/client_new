import { _decorator, error, JsonAsset, Label, Node, Sprite, SpriteFrame } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { BaseView } from '../../script/BaseView';
import CCUtil from '../../util/CCUtil';
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
        this.createNavigation("挑战BOSS",this.top_layout, () => {
            ViewsManager.instance.closeView(PrefabType.WorldBossView);
        });
    }
    /**初始化游戏数值 */
    initAmout(){
        ViewsManager.addAmount(this.top_layout,11.314,160.722);
    }

    /**初始化右侧闯关 */
    async initLeftBossNav(){
        let node = await this.loadAndInitPrefab(PrefabType.WorldLeftNavView, this.content_layout, {
            isAlignLeft: true,
            isAlignTop: true,
            left: 43.599,
            top: 124.253,
        })
        this._leftView = node.getComponent(WorldLeftNavView);
        this._leftView.setSelectClick((idx:number) => {
            this.selectBossUpdateStatus(idx);
        });
    }
    async initCenterView(){
        let node = await this.loadAndInitPrefab(PrefabType.CenterBossView, this.content_layout, {
            isAlignHorizontalCenter: true,
            isAlignVerticalCenter: true,
            verticalCenter: -20.238,
            horizontalCenter: 51.949,
        })
        this._centerView = node.getComponent(CenterBossView);
        this._leftView.letNavScroll.selectedId = 0;
    }

    async initRightRankView(){
        let node = await this.loadAndInitPrefab(PrefabType.RightRankView, this.content_layout, {
            isAlignRight: true,
            isAlignVerticalCenter: true,
            verticalCenter: -51.391,
            right: 0,
        })
        this._rightRankView = node.getComponent(RightRankView);
        this._rightRankView.loadRankData(this._worldRankData);
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


