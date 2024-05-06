import { _decorator, Button, Component, instantiate, Node, Prefab, ScrollView, tween, UITransform, v3 } from 'cc';
import CCUtil from '../../util/CCUtil';
import { EventType } from '../../config/EventType';
import EventManager from '../../util/EventManager';
import { MapPointItem } from './levelmap/MapPointItem';
import { rightPanelchange } from './common/RightPanelchange';
import GlobalConfig from '../../GlobalConfig';
const { ccclass, property } = _decorator;

/**魔法森林 何存发 2024年4月9日17:51:36 */
@ccclass('WorldIsland')
export class WorldIsland extends Component {

    @property({ type: Node, tooltip: "列表" })
    public mapList: Node = null;
    @property({ type: Node, tooltip: "返回按钮" })
    public back: Node = null;
    @property({ type: Button, tooltip: "世界地图" })
    public btn_details: Button = null;
    @property({ type: Button, tooltip: "我的位置" })
    public btn_pos: Button = null;
    @property({ type: rightPanelchange, tooltip: "关卡选择页面" })
    public levelPanel: rightPanelchange = null;

    @property(ScrollView)
    public scrollView: ScrollView = null;

    @property({ type: Node, tooltip: "地图容器" })
    public pointContainer: Node = null;

    private _pointList: MapPointItem[] = [];
    private _bigId: number = 1; //岛屿id
    start() {
        this.initUI();
        this.initEvent();
    }

    mapPointClick(target: MapPointItem) {
        console.log('点击了地图点', target.data);
        this.levelPanel.openView(target.data);
    }

    update(deltaTime: number) {

    }

    /**初始化UI */
    private initUI() {
        let winssize = GlobalConfig.WIN_SIZE;
        console.log('屏幕尺寸', winssize);
        // this.node.getComponent(UITransform).width = this.scrollView.getComponent(UITransform).width = this.scrollView.node.getChildByName("view").getComponent(UITransform).width = winssize.width;
        this.initlist();
        this.levelPanel.hideView();
    }

    /**初始化监听事件 */
    private initEvent() {
        CCUtil.onTouch(this.back, this.onBtnBackClick, this)
        CCUtil.onTouch(this.btn_details, this.onBtnDetailsClick, this)
        CCUtil.onTouch(this.btn_pos, this.openLevelView, this)


    }
    /**移除监听 */
    private removeEvent() {
        CCUtil.offTouch(this.back, this.onBtnBackClick, this)
        CCUtil.offTouch(this.btn_details, this.onBtnDetailsClick, this)

        CCUtil.offTouch(this.btn_pos, this.openLevelView, this)

        for (let i in this._pointList) {
            CCUtil.offTouch(this._pointList[i].node, this.mapPointClick.bind(this, this._pointList[i]), this);
        }
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

    /**初始化列表 */
    private initlist() {
        for (let i = 0; i < 25; i++) {
            let point = this.pointContainer.getChildByName("point" + (i + 1));
            if (point) {
                let poingItem = point.getComponent(MapPointItem);
                poingItem.setData({ smallId: i + 1, bigId: this._bigId });
                CCUtil.onTouch(point, this.mapPointClick.bind(this, poingItem), this);
                this._pointList.push(poingItem);
            }
        }
    }


    protected onDestroy(): void {
        this.removeEvent()
        console.log('销毁')
    }

}


