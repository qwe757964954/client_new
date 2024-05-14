import { _decorator, Component, error, instantiate, isValid, Node, Prefab, Sprite, SpriteFrame, Widget } from 'cc';
import { PrefabType } from '../../config/PrefabType';
import { ResLoader } from '../../manager/ResLoader';
import { ViewsManager } from '../../manager/ViewsManager';
import { User } from '../../models/User';
import { NavTitleView } from '../common/NavTitleView';
import { AmoutItemData, AmoutType, TopAmoutView } from '../common/TopAmoutView';
import WordBossArray, { BossInfo } from './BossInfo';
import { CenterBossView } from './CenterBossView';
import { RightRankView } from './RightRankView';
import { WorldLeftNavView } from './WorldLeftNavView';
const { ccclass, property } = _decorator;

@ccclass('WorldBossView')
export class WorldBossView extends Component {
    @property(Node)
    public top_layout:Node = null;
    @property(Node)
    public content_layout:Node = null;

    @property(Node)
    public bg_img:Node = null;

    private _centerView:CenterBossView = null;
    private _leftView:WorldLeftNavView = null;
    private _rightRankView:RightRankView = null;
    start() {
        this.initUI();
    }

    initUI(){
        this.initNavTitle();
        this.initAmout();
        this.initLeftBossNav();
        this.initCenterView();
        this.initRightRankView();
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
        ResLoader.instance.load(info.bgImage, SpriteFrame, (err: Error | null, spriteFrame: SpriteFrame) => {
            if (err) {
                error && console.error(err);
                return;
            }
            this.bg_img.getComponent(Sprite).spriteFrame = spriteFrame;
        });
        this._centerView.updateCenterProps(info);
    }

    update(deltaTime: number) {
        
    }
}

