import { _decorator, Button, Component, instantiate, Node, Prefab, v3 } from 'cc';
import { EventType } from '../../config/EventType';
import { PrefabType } from '../../config/PrefabType';
import GlobalConfig from '../../GlobalConfig';
import { ViewsManager } from '../../manager/ViewsManager';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import { StudyModeView } from './sixModes/StudyModeView';
import { ServiceMgr } from '../../net/ServiceManager';
import { DataMgr } from '../../manager/DataMgr';
import { WordMeaningView } from './sixModes/WordMeaningView';
import { WordPracticeView } from './sixModes/WordPracticeView';
const { ccclass, property } = _decorator;
/**大冒险 世界地图 何存发 2024年4月8日14:45:44 */
@ccclass('WorldMapView')
export class WorldMapView extends Component {


    @property({ type: [Node], tooltip: "地图" })
    public mapView: Node[] = [];
    @property({ type: [Prefab], tooltip: "页面" })
    public levelArr: Prefab[] = [];
    @property({ type: Button, tooltip: "返回按钮" })
    public btn_back: Button = null!;
    @property({ type: Node, tooltip: "岛屿地图容器" })
    public islandContainer: Node = null
    private _openlevels: number = 0;//开放到第几关

    private _currentIsland: Node = null;//当前岛屿

    private selectID: number = 0;//选中的关卡

    private _eveId: string; //切换岛屿
    private _exitIslandEveId: string; //退出岛屿
    private _enterLevelEveId: string; //进入关卡
    private _getWordsEveId: string; //获取单词

    private _currentIslandID: number = 0;//当前岛屿id
    private _currentLevelID: number = 0;//当前关卡id
    start() {
        let winssize = GlobalConfig.WIN_SIZE;
        this.islandContainer.position = v3(-winssize.width / 2, 0, 0);
    }

    onLoad(): void {
        this.initData()
    }
    /**初始化数据 */
    private async initData() {
        await DataMgr.instance.getAdventureLevelConfig();
        this.initEvent();
    }
    /**切换关卡 */
    private switchLevels(i: number) {
        console.log('切换关卡', i)
        // EventManager.emit(EventType.Study_Page_Switching, [i])
        if (!this.levelArr[i]) {
            console.error("没有这个页面", i);
            return
        }
        this.showIsland(i);
    }

    showIsland(id: number) {
        if (this._currentIsland) {
            this._currentIsland.removeFromParent();
        }
        let copynode = instantiate(this.levelArr[id])
        this._currentIsland = copynode;
        this.islandContainer.addChild(copynode);
    }

    /**隐藏视图 */
    hideIsland() {
        if (this._currentIsland) {
            this._currentIsland.removeFromParent();
        }
    }

    //进入关卡
    private enterLevel(data: { smallId: number, bigId: number }) {
        console.log('进入关卡', data);
        this._currentIslandID = data.bigId;
        this._currentLevelID = data.smallId;
        ServiceMgr.studyService.getWordGameWords(data.bigId, data.smallId, 1, 0);
    }

    //获取关卡单词回包
    onWordGameWords(data: any) {
        console.log('获取单词', data);
        ViewsManager.instance.showView(PrefabType.StudyModeView, (node: Node) => {
            let levelData = DataMgr.instance.getAdvLevelConfig(this._currentIslandID, this._currentLevelID);
            node.getComponent(StudyModeView).initData(data.Data, levelData);
        });

        // ViewsManager.instance.showView(PrefabType.WordPracticeView, (node: Node) => {
        //     let levelData = DataMgr.instance.getAdvLevelConfig(this._currentIslandID, this._currentLevelID);
        //     node.getComponent(WordPracticeView).initData(data.Data, levelData);
        // });
    }

    /**初始化监听事件 */
    initEvent() {
        for (let i in this.mapView) {
            CCUtil.onTouch(this.mapView[i], this.switchLevels.bind(this, i), this)
        }
        this._exitIslandEveId = EventManager.on(EventType.Exit_World_Island, this.hideIsland.bind(this));
        this._enterLevelEveId = EventManager.on(EventType.Enter_Island_Level, this.enterLevel.bind(this));
        this._getWordsEveId = EventManager.on(EventType.WordGame_Words, this.onWordGameWords.bind(this));
        CCUtil.onTouch(this.btn_back.node, this.onBtnBackClick, this)

    }
    /**移除监听 */
    removeEvent() {
        for (let i in this.mapView) {
            CCUtil.offTouch(this.mapView[i], this.switchLevels.bind(this, i), this)
        }
        EventManager.off(EventType.Exit_World_Island, this._exitIslandEveId);
        EventManager.off(EventType.Enter_Island_Level, this._enterLevelEveId);
        CCUtil.offTouch(this.btn_back.node, this.onBtnBackClick, this)

    }
    /**点击返回按钮 */
    onBtnBackClick() {
        // EventManager.emit(EventType.Study_Page_Switching, [0])
        this.node.destroy();
    }

    /**打开帮助页面 */
    private openHelp() {
        console.log('帮助页面!')
    }

    update(deltaTime: number) {
    }
    onDestroy() {
        this.removeEvent()
    }




}


