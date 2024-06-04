import { _decorator, Button, Component, Node, UITransform } from 'cc';
import { EventType } from '../../config/EventType';
import { IslandProgressModel, MapLevelData, MicroListItem } from '../../models/AdventureModel';
import CCUtil from '../../util/CCUtil';
import EventManager from '../../util/EventManager';
import List from '../../util/list/List';
import { rightPanelchange } from './common/RightPanelchange';
import { IslandMap } from './levelmap/IslandMap';
const { ccclass, property } = _decorator;

/**魔法森林 何存发 2024年4月9日17:51:36 */
@ccclass('WorldIsland')
export class WorldIsland extends Component {

    @property({ type: Node, tooltip: "返回按钮" })
    public back: Node = null;
    @property({ type: Button, tooltip: "世界地图" })
    public btn_details: Button = null;
    @property({ type: Button, tooltip: "我的位置" })
    public btn_pos: Button = null;
    @property({ type: rightPanelchange, tooltip: "关卡选择页面" })
    public levelPanel: rightPanelchange = null;

    @property({ type: List, tooltip: "地图List" })
    public mapPointList: List = null;

    @property({ type: Node, tooltip: "地图容器" })
    public mapContent: Node = null;

    private _bigId: number = 1; //岛屿id
    private _mapBaseCount: number = 12; //地图点数量
    private _mapLevelsData: MicroListItem[][] = [];
    private static mapPoints: Map<number, number[][]> = null; //各岛屿地图点坐标

    private _mapPointClickEvId: string;
    private _mapPointUpdateEvId: string;

    private _passNum: number;
    private _progressData: IslandProgressModel = null;
    start() {
        this.initUI();
        this.initEvent();
    }

    setPointsData(bigId: number, progresssData: IslandProgressModel) {
        this._progressData = progresssData;
        this._bigId = bigId;
        this._passNum = progresssData.micro_pass_num;
        let pointsData = progresssData.micro_list;
        //分割数组
        this._mapLevelsData = [];
        for (let i = 0; i < pointsData.length; i += this._mapBaseCount) {
            this._mapLevelsData.push(pointsData.slice(i, i + this._mapBaseCount));
        }
        this.mapPointList.numItems = this._mapLevelsData.length;
        let transform = this.mapContent.getComponent(UITransform);
        transform.width = 0;
        for (let i = 0; i < this._mapLevelsData.length; i++) {
            if (this._mapLevelsData[i].length < this._mapBaseCount) {
                let pos = WorldIsland.getMapPointsByBigId(this._bigId)[this._mapLevelsData[i].length - 1];
                transform.width += pos[0] + 100;
            } else {
                transform.width += 2190;
            }
        }
        console.log('地图宽度', transform.width);
    }

    mapPointClick(data: MapLevelData) {
        this.levelPanel.node.active = true;
        let nodesize = this.levelPanel.node.getComponent(UITransform).contentSize;
        this.levelPanel.node.setPosition(nodesize.width, 100);
        console.log('点击了地图点', data);
        this.levelPanel.openView(data);
    }

    onMapPointRender(item: Node, idx: number) {
        item.getComponent(IslandMap).setData(this._bigId, this._mapLevelsData[idx], this._passNum);
    }

    updatePointData(big_id: number, small_id: number, micro_id: number, star: number) {
        let mapoint = null;
        let microList = this._progressData.micro_list;
        let currentIdx = -1;
        for (let i = 0; i < microList.length; i++) {
            if (microList[i].big_id == big_id && microList[i].small_id == small_id && microList[i].micro_id == micro_id) {
                currentIdx = i;
                mapoint = microList[i];
                break;
            }
        }
        if (mapoint) {
            if (!mapoint.flag_info) {
                mapoint.flag_info = {}
            }
            if (star == 1) {
                mapoint.flag_info.star_one = 1;
            } else if (star == 2) {
                mapoint.flag_info.star_one = 1;
                mapoint.flag_info.star_two = 1;
            } else if (star == 3) {
                mapoint.flag_info.star_one = 1;
                mapoint.flag_info.star_two = 1;
                mapoint.flag_info.star_three = 1;
            }
            mapoint.flag = 1;
            if (currentIdx == this._passNum) { //是否是当前进度关卡
                this._passNum++;
                if (this._passNum < microList.length) {
                    microList[this._passNum].can_play = 1;
                }
            }
            this.mapPointList.numItems = this._mapLevelsData.length;
        }
    }

    onUpdatePoint(data: { big_id: number, small_id: number, micro_id: number, star: number }) {
        this.updatePointData(data.big_id, data.small_id, data.micro_id, data.star);
    }

    static initMapPoints() {
        if (this.mapPoints) return;
        this.mapPoints = new Map<number, number[][]>();
        this.mapPoints.set(1, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
        this.mapPoints.set(2, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
        this.mapPoints.set(3, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
        this.mapPoints.set(4, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
        this.mapPoints.set(5, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
        this.mapPoints.set(6, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
        this.mapPoints.set(7, [[221, 244], [389, 96], [302, -89], [443, -289], [715, -242], [960, -100], [1265, -61], [1572, -257], [1735, -8], [1593, 151], [1821, 287], [2121, 266]]);
    }

    static getMapPointsByBigId(bigId: number) {
        return this.mapPoints.get(bigId);
    }

    /**初始化UI */
    private initUI() {
        let nodesize = this.levelPanel.node.getComponent(UITransform).contentSize;
        this.levelPanel.node.setPosition(-nodesize.width, 100);
        this.levelPanel.hideView();
    }

    /**初始化监听事件 */
    private initEvent() {
        CCUtil.onTouch(this.back, this.onBtnBackClick, this)
        CCUtil.onTouch(this.btn_details, this.onBtnDetailsClick, this)
        CCUtil.onTouch(this.btn_pos, this.openLevelView, this)

        this._mapPointClickEvId = EventManager.on(EventType.MapPoint_Click, this.mapPointClick.bind(this));
        this._mapPointUpdateEvId = EventManager.on(EventType.Update_MapPoint, this.onUpdatePoint.bind(this));
    }
    /**移除监听 */
    private removeEvent() {
        CCUtil.offTouch(this.back, this.onBtnBackClick, this)
        CCUtil.offTouch(this.btn_details, this.onBtnDetailsClick, this)
        CCUtil.offTouch(this.btn_pos, this.openLevelView, this)
        EventManager.off(EventType.MapPoint_Click, this._mapPointClickEvId);
        EventManager.off(EventType.Update_MapPoint, this._mapPointUpdateEvId);
    }

    onBtnDetailsClick() {

    }

    /**打开闯关界面 */
    openLevelView() {

    }
    /**返回关卡模式 */
    private onBtnBackClick() {
        EventManager.emit(EventType.Exit_World_Island);
    }


    protected onDestroy(): void {
        this.removeEvent()
        console.log('销毁')
    }

}


